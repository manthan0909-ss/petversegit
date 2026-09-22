import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Real nearby pet places, powered by Google Maps Places API (New)
 * through the Lovable connector gateway. Bounded on purpose:
 * one request per search, max 12 results, no polling or fan-out.
 */

const GATEWAY = "https://connector-gateway.lovable.dev/google_maps";

export type PetPlaceKind = "vet" | "grooming" | "store" | "boarding" | "park";

export interface PetPlace {
  id: string;
  name: string;
  address: string;
  rating?: number | undefined;
  reviews?: number | undefined;
  openNow?: boolean | undefined;
  phone?: string | undefined;
  website?: string | undefined;
  mapsUrl?: string | undefined;
  lat: number;
  lng: number;
  distanceKm?: number | undefined;
}

const QUERIES: Record<PetPlaceKind, string> = {
  vet: "veterinary clinic for pets",
  grooming: "pet grooming salon",
  store: "pet shop and pet supplies store",
  boarding: "pet boarding and daycare",
  park: "dog park pet friendly park",
};

const inputSchema = z.object({
  kind: z.enum(["vet", "grooming", "store", "boarding", "park"]),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  city: z.string().trim().min(2).max(80).optional(),
});

function haversineKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.min(1, Math.sqrt(h)));
}

export const findPetPlaces = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<{ places: PetPlace[]; source: string }> => {
    const lovableKey = process.env["LOVABLE_API_KEY"];
    const mapsKey = process.env["GOOGLE_MAPS_API_KEY"];
    if (!lovableKey || !mapsKey) {
      throw new Error("Maps search is not configured yet.");
    }
    if (data.lat === undefined && !data.city) {
      throw new Error("Share your location or type a city to search.");
    }

    const textQuery = data.city
      ? `${QUERIES[data.kind]} in ${data.city}`
      : QUERIES[data.kind];

    const body: Record<string, unknown> = {
      textQuery,
      maxResultCount: 12,
      languageCode: "en",
    };
    if (data.lat !== undefined && data.lng !== undefined) {
      body["locationBias"] = {
        circle: {
          center: { latitude: data.lat, longitude: data.lng },
          radius: 15000,
        },
      };
    }

    const response = await fetch(`${GATEWAY}/places/v1/places:searchText`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": mapsKey,
        "Content-Type": "application/json",
        "X-Goog-FieldMask": [
          "places.id",
          "places.displayName",
          "places.formattedAddress",
          "places.location",
          "places.rating",
          "places.userRatingCount",
          "places.currentOpeningHours.openNow",
          "places.nationalPhoneNumber",
          "places.websiteUri",
          "places.googleMapsUri",
        ].join(","),
      },
      body: JSON.stringify(body),
    });

    if (response.status === 403) {
      const details: Array<{ reason?: string }> =
        (await response.json().catch(() => ({})))?.error?.details ?? [];
      const reason = details.find((d) => d.reason)?.reason;
      if (reason === "API_KEY_HTTP_REFERRER_BLOCKED") {
        throw new Error(
          'Google Maps server key is referrer-restricted. In Google Cloud Console, set the server key\'s application restrictions to "None" or "IP addresses".',
        );
      }
      if (reason === "API_KEY_SERVICE_BLOCKED") {
        throw new Error(
          "Google Maps server key does not allow the Places API. Add it to the server key's allowed-APIs list in Google Cloud Console.",
        );
      }
      throw new Error("Google Maps request was denied (403). Check the server key restrictions.");
    }
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Places search failed [${response.status}]: ${errorBody}`);
      throw new Error(`Places search failed [${response.status}]: ${errorBody}`);
    }

    const json = (await response.json()) as {
      places?: Array<{
        id?: string;
        displayName?: { text?: string };
        formattedAddress?: string;
        location?: { latitude?: number; longitude?: number };
        rating?: number;
        userRatingCount?: number;
        currentOpeningHours?: { openNow?: boolean };
        nationalPhoneNumber?: string;
        websiteUri?: string;
        googleMapsUri?: string;
      }>;
    };

    const places: PetPlace[] = (json.places ?? [])
      .filter((p) => p.id && p.location?.latitude != null && p.location?.longitude != null)
      .map((p) => {
        const lat = p.location!.latitude!;
        const lng = p.location!.longitude!;
        return {
          id: p.id!,
          name: p.displayName?.text ?? "Unnamed place",
          address: p.formattedAddress ?? "",
          rating: p.rating,
          reviews: p.userRatingCount,
          openNow: p.currentOpeningHours?.openNow,
          phone: p.nationalPhoneNumber,
          website: p.websiteUri,
          mapsUrl: p.googleMapsUri,
          lat,
          lng,
          distanceKm:
            data.lat !== undefined && data.lng !== undefined
              ? haversineKm(data.lat, data.lng, lat, lng)
              : undefined,
        };
      })
      .sort((a, b) => (a.distanceKm ?? 99) - (b.distanceKm ?? 99));

    return { places, source: "Google Maps" };
  });
