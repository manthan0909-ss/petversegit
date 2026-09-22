import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

/* ============================================================
   PetVerse demo data layer.
   Structured to mirror the future Firestore collections
   (users, pets, healthRecords, vaccinations, reminders,
   appointments, products, orders, qrTags, lostPets, …) so real
   APIs can be connected later without redesigning the UI.
   ============================================================ */

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  gender: string;
  dob: string;
  age: string;
  weight: number;
  personality: string;
  notes: string;
  allergies: string[];
  emoji: string;
  color: string; // pastel token name
  qrStatus: "active" | "pending" | "none";
  petCode: string;
}

export interface Reminder {
  id: string;
  petId: string;
  type: string;
  title: string;
  date: string;
  time: string;
  repeat: string;
  done?: boolean;
}

export interface NotificationItem {
  id: string;
  icon: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  mrp: number;
  rating: number;
  emoji: string;
  tag?: string;
}

export interface Provider {
  id: string;
  name: string;
  service: string;
  rating: number;
  price: number;
  distance: string;
  available: string;
  emoji: string;
}

export interface Appointment {
  id: string;
  petId: string;
  provider: string;
  service: string;
  date: string;
  time: string;
  status: "upcoming" | "completed";
}

export interface Expense {
  id: string;
  petId: string;
  category: string;
  label: string;
  amount: number;
  date: string;
}

export interface LostFoundPet {
  id: string;
  kind: "lost" | "found";
  name: string;
  breed: string;
  location: string;
  date: string;
  description: string;
  emoji: string;
  reward?: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  tag: string;
  text: string;
  likes: number;
  comments: number;
  time: string;
}

/* ---------------- static demo datasets ---------------- */

export const PETS: Pet[] = [
  {
    id: "bruno",
    name: "Bruno",
    species: "Dog",
    breed: "Golden Retriever",
    gender: "Male",
    dob: "12 Mar 2022",
    age: "4 yrs 5 mo",
    weight: 12.4,
    personality: "Friendly, playful, loves water",
    notes: "Scared of fireworks. Loves carrots.",
    allergies: ["Chicken", "Dust mites"],
    emoji: "🐶",
    color: "pastel-green",
    qrStatus: "active",
    petCode: "PV-10245",
  },
  {
    id: "monty",
    name: "Monty",
    species: "Dog",
    breed: "Labrador",
    gender: "Male",
    dob: "5 Jun 2021",
    age: "5 yrs 2 mo",
    weight: 14.1,
    personality: "Calm, food-motivated, gentle",
    notes: "Needs daily 40-min walks.",
    allergies: [],
    emoji: "🐕",
    color: "pastel-blue",
    qrStatus: "active",
    petCode: "PV-10246",
  },
  {
    id: "pintu",
    name: "Pintu",
    species: "Dog",
    breed: "Beagle",
    gender: "Female",
    dob: "21 Oct 2023",
    age: "2 yrs 10 mo",
    weight: 9.2,
    personality: "Curious, vocal, energetic",
    notes: "Escape artist — double-check gates.",
    allergies: ["Wheat"],
    emoji: "🐾",
    color: "pastel-purple",
    qrStatus: "pending",
    petCode: "PV-10247",
  },
  {
    id: "raju",
    name: "Raju",
    species: "Dog",
    breed: "German Shepherd",
    gender: "Male",
    dob: "2 Jan 2020",
    age: "6 yrs 7 mo",
    weight: 18.6,
    personality: "Loyal, protective, highly trained",
    notes: "Hip dysplasia watch — joint supplements.",
    allergies: [],
    emoji: "🦮",
    color: "pastel-peach",
    qrStatus: "none",
    petCode: "PV-10248",
  },
];

const INITIAL_REMINDERS: Reminder[] = [
  { id: "r1", petId: "bruno", type: "💉 Vaccination", title: "Rabies booster due", date: "Tomorrow", time: "10:00 AM", repeat: "Yearly" },
  { id: "r2", petId: "bruno", type: "💊 Medicine", title: "Joint supplement", date: "Today", time: "8:00 PM", repeat: "Daily" },
  { id: "r3", petId: "bruno", type: "🩺 Vet Appointment", title: "Annual check-up — Dr. Mehra", date: "21 Aug", time: "5:30 PM", repeat: "Once" },
  { id: "r4", petId: "bruno", type: "🛁 Grooming", title: "Full groom at PawSpa", date: "24 Aug", time: "11:00 AM", repeat: "Monthly" },
  { id: "r5", petId: "monty", type: "🍖 Food", title: "Switch to senior kibble", date: "1 Sep", time: "9:00 AM", repeat: "Once" },
  { id: "r6", petId: "pintu", type: "💉 Vaccination", title: "DHPPiL booster", date: "3 Sep", time: "4:00 PM", repeat: "Yearly" },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: "n1", icon: "🏷", title: "QR scan alert", body: "Bruno's QR Pet ID was scanned near Lake Road.", time: "2 h ago", read: false },
  { id: "n2", icon: "📍", title: "Location shared", body: "A finder shared their location for Bruno.", time: "2 h ago", read: false },
  { id: "n3", icon: "💉", title: "Vaccination reminder", body: "Bruno's rabies booster is due tomorrow.", time: "5 h ago", read: false },
  { id: "n4", icon: "📦", title: "Order update", body: "Your order #PV-8841 (Grain-free kibble) is out for delivery.", time: "Yesterday", read: true },
  { id: "n5", icon: "🩺", title: "Appointment confirmed", body: "Video consult with Dr. Kavya on 21 Aug, 5:30 PM.", time: "Yesterday", read: true },
  { id: "n6", icon: "🐾", title: "Lost pet update", body: "A beagle matching Pintu's description was reported 3 km away.", time: "2 d ago", read: true },
];

export const PRODUCTS: Product[] = [
  { id: "p1", name: "Grain-Free Adult Kibble 3kg", brand: "Farmina N&D", category: "Food & Treats", price: 2450, mrp: 2899, rating: 4.7, emoji: "🍖", tag: "Bestseller" },
  { id: "p2", name: "Chicken & Pumpkin Treats", brand: "Drools", category: "Food & Treats", price: 349, mrp: 425, rating: 4.5, emoji: "🦴" },
  { id: "p3", name: "Squeaky Rope Tug Toy", brand: "PetVerse Basics", category: "Toys", price: 299, mrp: 499, rating: 4.3, emoji: "🧸", tag: "Deal" },
  { id: "p4", name: "Interactive Puzzle Feeder", brand: "Outward Hound", category: "Toys", price: 899, mrp: 1199, rating: 4.6, emoji: "🎾" },
  { id: "p5", name: "Padded Harness — Teal", brand: "PetVerse Basics", category: "Accessories", price: 749, mrp: 999, rating: 4.4, emoji: "🦺" },
  { id: "p6", name: "Anti-Tick Shampoo 500ml", brand: "Himalaya", category: "Grooming", price: 385, mrp: 450, rating: 4.5, emoji: "🧴" },
  { id: "p7", name: "Joint Care Supplement", brand: "Vetoquinol", category: "Healthcare", price: 1150, mrp: 1350, rating: 4.8, emoji: "💊", tag: "Vet Pick" },
  { id: "p8", name: "Smart QR Pet Tag", brand: "PetVerse", category: "QR Tags", price: 499, mrp: 799, rating: 4.9, emoji: "🏷", tag: "PetVerse" },
  { id: "p9", name: "Reflective Leash 5ft", brand: "PetVerse Basics", category: "Accessories", price: 449, mrp: 649, rating: 4.2, emoji: "🪢" },
  { id: "p10", name: "Paw Balm & Coat Serum", brand: "Captain Zack", category: "Grooming", price: 525, mrp: 650, rating: 4.6, emoji: "🐾" },
  { id: "p11", name: "Probiotic Digestive Chews", brand: "Zesty Paws", category: "Healthcare", price: 980, mrp: 1250, rating: 4.7, emoji: "🌿" },
  { id: "p12", name: "Kitten Starter Kit", brand: "PetVerse", category: "Food & Treats", price: 1299, mrp: 1799, rating: 4.4, emoji: "🐱", tag: "New" },
];

export const PROVIDERS: Provider[] = [
  { id: "s1", name: "Dr. Ananya Mehra — PetCare Clinic", service: "Vet Appointment", rating: 4.9, price: 600, distance: "1.2 km", available: "Today, 4–8 PM", emoji: "🩺" },
  { id: "s2", name: "Dr. Kavya Rao — Video Vet", service: "Video Consultation", rating: 4.8, price: 399, distance: "Online", available: "Slots in 30 min", emoji: "📹" },
  { id: "s3", name: "PawSpa Grooming Studio", service: "Grooming", rating: 4.7, price: 899, distance: "2.4 km", available: "Tomorrow", emoji: "🛁" },
  { id: "s4", name: "Happy Tails Boarding", service: "Pet Boarding", rating: 4.6, price: 700, distance: "3.8 km", available: "This weekend", emoji: "🏠" },
  { id: "s5", name: "WalkWithRahul", service: "Dog Walking / Sitting", rating: 4.9, price: 250, distance: "0.8 km", available: "Daily 6 AM / 6 PM", emoji: "🐕" },
  { id: "s6", name: "Canine Compass Training", service: "Training / Behaviourist", rating: 4.8, price: 1500, distance: "4.1 km", available: "Mon–Sat", emoji: "🎓" },
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  { id: "a1", petId: "bruno", provider: "Dr. Kavya Rao — Video Vet", service: "Video Consultation", date: "21 Aug", time: "5:30 PM", status: "upcoming" },
  { id: "a2", petId: "bruno", provider: "PawSpa Grooming Studio", service: "Grooming", date: "24 Aug", time: "11:00 AM", status: "upcoming" },
  { id: "a3", petId: "bruno", provider: "Dr. Ananya Mehra — PetCare Clinic", service: "Vet Appointment", date: "10 Aug", time: "6:00 PM", status: "completed" },
];

const INITIAL_EXPENSES: Expense[] = [
  { id: "e1", petId: "bruno", category: "Food", label: "Grain-free kibble 3kg", amount: 1800, date: "3 Aug" },
  { id: "e2", petId: "bruno", category: "Vet", label: "Annual check-up", amount: 1200, date: "10 Aug" },
  { id: "e3", petId: "bruno", category: "Grooming", label: "Full groom — PawSpa", amount: 700, date: "14 Aug" },
  { id: "e4", petId: "bruno", category: "Other", label: "New leash & toys", amount: 500, date: "18 Aug" },
  { id: "e5", petId: "monty", category: "Medicine", label: "Joint supplement", amount: 1150, date: "12 Aug" },
  { id: "e6", petId: "raju", category: "Training", label: "Obedience refresher", amount: 1500, date: "8 Aug" },
];

export const LOST_FOUND: LostFoundPet[] = [
  { id: "l1", kind: "lost", name: "Sheru", breed: "Indie", location: "Sector 21 Park", date: "24 Aug", description: "Brown indie, red collar, very friendly. Answers to Sheru.", emoji: "🐕", reward: "₹2,000 reward" },
  { id: "l2", kind: "lost", name: "Milo", breed: "Persian Cat", location: "Green Avenue", date: "23 Aug", description: "White Persian, blue eyes, no collar.", emoji: "🐱" },
  { id: "l3", kind: "found", name: "Unknown", breed: "Beagle", location: "Lake Road", date: "25 Aug", description: "Found near the lake gate. Wearing a PetVerse QR tag.", emoji: "🐾" },
  { id: "l4", kind: "found", name: "Unknown", breed: "Labrador mix", location: "MG Metro Stn", date: "22 Aug", description: "Young lab mix, limping slightly. Safe at shelter.", emoji: "🐶" },
];

export const COMMUNITY_POSTS: CommunityPost[] = [
  { id: "c1", author: "Priya & Whiskers", avatar: "🐱", tag: "Adoption", text: "3 rescued indie kittens need forever homes in Pune. Vaccinated and dewormed. DM to meet them! 🏡", likes: 128, comments: 34, time: "2 h" },
  { id: "c2", author: "Arjun K.", avatar: "🦮", tag: "Tips", text: "Monsoon paw-care tip: dry between the toes after every walk. Zero fungal issues since we started.", likes: 86, comments: 19, time: "5 h" },
  { id: "c3", author: "PetVerse Events", avatar: "🎉", tag: "Events", text: "Sunday Puppy Social at Cubbon Bark Park, 7 AM. 40+ pet parents already in. Free bandanas!", likes: 212, comments: 58, time: "1 d" },
  { id: "c4", author: "Sana R.", avatar: "🐾", tag: "Review", text: "PawSpa did an amazing deshed on my husky. Booking through PetVerse took 30 seconds. ⭐⭐⭐⭐⭐", likes: 45, comments: 8, time: "1 d" },
];

export const PLACES = [
  { id: "pl1", type: "🩺 Vet", name: "PetCare 24x7 Clinic", rating: 4.9, distance: "1.2 km", info: "Open now · Emergency", color: "pastel-rose" },
  { id: "pl2", type: "🛁 Groomer", name: "PawSpa Studio", rating: 4.7, distance: "2.4 km", info: "Open now", color: "pastel-purple" },
  { id: "pl3", type: "🌳 Park", name: "Cubbon Bark Park", rating: 4.8, distance: "3.1 km", info: "Off-leash zone", color: "pastel-green" },
  { id: "pl4", type: "☕ Café", name: "The Puppy Café", rating: 4.6, distance: "1.8 km", info: "Pet menu", color: "pastel-peach" },
  { id: "pl5", type: "🏨 Hotel", name: "WagStays Resort", rating: 4.5, distance: "6.5 km", info: "Pet-friendly rooms", color: "pastel-blue" },
  { id: "pl6", type: "🚨 Emergency", name: "City Animal ER", rating: 4.8, distance: "2.9 km", info: "24×7 open", color: "pastel-rose" },
  { id: "pl7", type: "🏪 Store", name: "AllPaws Pet Store", rating: 4.4, distance: "0.9 km", info: "Open till 10 PM", color: "pastel-yellow" },
];

export const INSURANCE = [
  { id: "i1", partner: "PawProtect", cover: "₹1,00,000/yr", price: "₹299/mo", benefits: ["Accidents & illness", "OPD cover", "Third-party liability"], best: true },
  { id: "i2", partner: "FurSure", cover: "₹50,000/yr", price: "₹179/mo", benefits: ["Accidents", "Surgery cover"], best: false },
  { id: "i3", partner: "VetAssure", cover: "₹2,00,000/yr", price: "₹499/mo", benefits: ["All illness", "Hereditary conditions", "Theft & lost-pet reward"], best: false },
];

export const SURVEY_STATS = [
  { value: "76.1%", label: "of pet owners don't use any pet-care app today" },
  { value: "60.9%", label: "want a single all-in-one pet-care application" },
  { value: "73.9%", label: "would definitely use a Smart QR Pet ID" },
  { value: "52.2%", label: "find an AI Pet Assistant very valuable" },
  { value: "65.2%", label: "are very likely to use PetVerse" },
  { value: "58.7%", label: "picked GPS Smart Collar as the most exciting future feature" },
];

export const FUTURE_FEATURES = [
  { icon: "📡", name: "GPS Smart Collar", desc: "Live location, safe zones & activity — ESP32 + GPS demo inside." },
  { icon: "🤖", name: "AI Health Prediction", desc: "Spot risk patterns from history, weight & behaviour." },
  { icon: "🍽", name: "Smart Feeding Device", desc: "Scheduled, portioned feeding from your phone." },
  { icon: "📹", name: "Pet CCTV", desc: "Motion alerts and activity tracking while you're away." },
  { icon: "🚑", name: "Emergency Pet Ambulance", desc: "Request a partnered ambulance with live ETA." },
  { icon: "🩸", name: "Blood Donor Network", desc: "One donor. A second chance." },
  { icon: "🪪", name: "Digital Pet Passport", desc: "Identity, vaccines & travel documents in one passport." },
  { icon: "🏃", name: "Fitness Tracker", desc: "Steps, calories & exercise goals." },
  { icon: "📊", name: "Growth Analytics", desc: "Weight & growth vs. healthy breed ranges." },
  { icon: "🏆", name: "Gamification & Rewards", desc: "Streaks, badges, points & discounts." },
  { icon: "❤️", name: "Lost Pet Reward System", desc: "Community-powered rewards for safe returns." },
  { icon: "📦", name: "Pet Subscription Box", desc: "Personalized food, treats & toys monthly." },
  { icon: "🩺", name: "AI Vet Assistant for Clinics", desc: "Triaging and records for partner clinics." },
  { icon: "✈️", name: "Pet Travel Assistant", desc: "Airline rules, documents & pet-friendly stays." },
  { icon: "🏠", name: "Foster & Rescue Network", desc: "Connect rescues, fosters and adopters." },
  { icon: "👨‍👩‍👧", name: "Family Sharing", desc: "Share reminders & updates with family safely." },
  { icon: "💧", name: "Smart Water Bowl", desc: "Hydration tracking for every pet." },
  { icon: "⌚", name: "Pet Smartwatch", desc: "Health vitals on their collar." },
  { icon: "🌍", name: "International Expansion", desc: "PetVerse for pet parents everywhere." },
];

/* ---------------- context ---------------- */

interface PetVerseState {
  pets: Pet[];
  selectedPet: Pet;
  selectPet: (id: string) => void;
  reminders: Reminder[];
  addReminder: (r: Omit<Reminder, "id">) => void;
  notifications: NotificationItem[];
  markAllRead: () => void;
  unreadCount: number;
  cart: string[];
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  appointments: Appointment[];
  bookAppointment: (a: Omit<Appointment, "id" | "status">) => void;
  expenses: Expense[];
  addExpense: (e: Omit<Expense, "id">) => void;
  posts: CommunityPost[];
  likePost: (id: string) => void;
}

const Ctx = createContext<PetVerseState | null>(null);

export function PetVerseProvider({ children }: { children: ReactNode }) {
  const [selectedId, setSelectedId] = useState("bruno");
  const [reminders, setReminders] = useState<Reminder[]>(INITIAL_REMINDERS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [cart, setCart] = useState<string[]>(["p1"]);
  const [wishlist, setWishlist] = useState<string[]>(["p8"]);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [posts, setPosts] = useState(COMMUNITY_POSTS);

  const value = useMemo<PetVerseState>(() => {
    const selectedPet = PETS.find((p) => p.id === selectedId) ?? PETS[0]!;
    return {
      pets: PETS,
      selectedPet,
      selectPet: setSelectedId,
      reminders,
      addReminder: (r) => setReminders((prev) => [{ ...r, id: `r${Date.now()}` }, ...prev]),
      notifications,
      markAllRead: () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))),
      unreadCount: notifications.filter((n) => !n.read).length,
      cart,
      addToCart: (id) => setCart((prev) => (prev.includes(id) ? prev : [...prev, id])),
      removeFromCart: (id) => setCart((prev) => prev.filter((c) => c !== id)),
      wishlist,
      toggleWishlist: (id) =>
        setWishlist((prev) => (prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id])),
      appointments,
      bookAppointment: (a) =>
        setAppointments((prev) => [{ ...a, id: `a${Date.now()}`, status: "upcoming" }, ...prev]),
      expenses,
      addExpense: (e) => setExpenses((prev) => [{ ...e, id: `e${Date.now()}` }, ...prev]),
      posts,
      likePost: (id) =>
        setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))),
    };
  }, [selectedId, reminders, notifications, cart, wishlist, appointments, expenses, posts]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePetVerse() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePetVerse must be used inside PetVerseProvider");
  return ctx;
}

export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
