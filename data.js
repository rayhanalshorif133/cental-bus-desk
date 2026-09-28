// Default Initial Data for Bus Counter Management System
const DEFAULT_COUNTERS = [
  { id: 1, name: "Gabtoli Counter", code: "GAB-01", city: "Dhaka", location: "Gabtoli Bus Terminal, Mirpur", phone: "01711-200101", manager: "Rafiqul Islam", status: "Active" },
  { id: 2, name: "Sayedabad Counter", code: "SAY-02", city: "Dhaka", location: "Sayedabad Inter-District Terminal", phone: "01711-200102", manager: "Kamal Hossain", status: "Active" },
  { id: 3, name: "Mohakhali Counter", code: "MOH-03", city: "Dhaka", location: "Mohakhali Bus Stand, Dhaka", phone: "01711-200103", manager: "Zahid Hasan", status: "Active" },
  { id: 4, name: "Uttara Counter", code: "UTT-04", city: "Dhaka", location: "House Building, Sector 7, Uttara", phone: "01711-200104", manager: "Tanvir Ahmed", status: "Active" },
  { id: 5, name: "Chittagong GEC Counter", code: "CTG-05", city: "Chittagong", location: "GEC Circle, Central Hub", phone: "01711-200105", manager: "Nazmul Huda", status: "Active" },
  { id: 6, name: "Cox's Bazar Counter", code: "CXB-06", city: "Cox's Bazar", location: "Kolatoli Beach Road, Hotel Zone", phone: "01711-200106", manager: "Mahbub Alam", status: "Active" },
  { id: 7, name: "Sylhet Kadamtoli Counter", code: "SYL-07", city: "Sylhet", location: "Kadamtoli Central Bus Stand", phone: "01711-200107", manager: "Faruk Hossain", status: "Active" },
  { id: 8, name: "Rajshahi Railgate Counter", code: "RAJ-08", city: "Rajshahi", location: "Railway Gate, Station Road", phone: "01711-200108", manager: "Sohail Rana", status: "Active" },
  { id: 9, name: "Bogura Satmatha Counter", code: "BOG-09", city: "Bogura", location: "Satmatha City Circle, Bogura", phone: "01711-200109", manager: "Anwar Parvez", status: "Active" },
  { id: 10, name: "Khulna Sonadanga Counter", code: "KHU-10", city: "Khulna", location: "Sonadanga Central Bus Terminal", phone: "01711-200110", manager: "Tariqul Islam", status: "Active" }
];

const DEFAULT_TRIPS = [
  {
    id: "TRIP-101",
    busNo: "DM-BA-11-2045",
    busName: "GreenLine Scania Multi-Axle",
    type: "AC Business Class",
    fromCounterId: 1, // Gabtoli
    destination: "Chittagong (GEC)",
    departureTime: "07:30 AM",
    totalSeats: 36,
    bookedSeats: 32,
    fare: 1400,
    status: "Departed",
    driverName: "Abul Kashem",
    contact: "01819-334411"
  },
  {
    id: "TRIP-102",
    busNo: "DM-BA-12-8821",
    busName: "Royal Coach Hyundai Universe",
    type: "AC Sleeper Suite",
    fromCounterId: 2, // Sayedabad
    destination: "Cox's Bazar (Kolatoli)",
    departureTime: "08:15 AM",
    totalSeats: 30,
    bookedSeats: 28,
    fare: 1800,
    status: "Departed",
    driverName: "Motaleb Mia",
    contact: "01819-334422"
  },
  {
    id: "TRIP-103",
    busNo: "DM-BA-14-3319",
    busName: "Hanif Enterprise Hino 1J",
    type: "Non-AC Deluxe",
    fromCounterId: 1, // Gabtoli
    destination: "Rajshahi (Railgate)",
    departureTime: "09:30 AM",
    totalSeats: 40,
    bookedSeats: 26,
    fare: 750,
    status: "Departed",
    driverName: "Suruj Ali",
    contact: "01819-334433"
  },
  {
    id: "TRIP-104",
    busNo: "DM-BA-15-9920",
    busName: "Ena Transport Hyundai VIP",
    type: "AC Executive",
    fromCounterId: 3, // Mohakhali
    destination: "Sylhet (Kadamtoli)",
    departureTime: "10:45 AM",
    totalSeats: 32,
    bookedSeats: 29,
    fare: 1100,
    status: "Boarding",
    driverName: "Dulal Sheikh",
    contact: "01819-334444"
  },
  {
    id: "TRIP-105",
    busNo: "DM-BA-16-4432",
    busName: "Shohagh Elite Volvo B11R",
    type: "AC Business Class",
    fromCounterId: 4, // Uttara
    destination: "Chittagong (GEC)",
    departureTime: "11:30 AM",
    totalSeats: 36,
    bookedSeats: 18,
    fare: 1500,
    status: "Boarding",
    driverName: "Jamal Uddin",
    contact: "01819-334455"
  },
  {
    id: "TRIP-106",
    busNo: "DM-BA-17-7751",
    busName: "Saintmartin Travels Double Decker",
    type: "AC Double Decker",
    fromCounterId: 5, // Chittagong
    destination: "Dhaka (Sayedabad)",
    departureTime: "01:15 PM",
    totalSeats: 44,
    bookedSeats: 41,
    fare: 1600,
    status: "Scheduled",
    driverName: "Akbar Hossain",
    contact: "01819-334466"
  },
  {
    id: "TRIP-107",
    busNo: "DM-BA-18-1209",
    busName: "Shyamoli NR Travels MAN",
    type: "AC Multi-Axle",
    fromCounterId: 6, // Cox's Bazar
    destination: "Dhaka (Gabtoli)",
    departureTime: "02:45 PM",
    totalSeats: 36,
    bookedSeats: 15,
    fare: 1650,
    status: "Scheduled",
    driverName: "Shafiqul Alam",
    contact: "01819-334477"
  },
  {
    id: "TRIP-108",
    busNo: "DM-BA-19-6634",
    busName: "London Express Higer VIP",
    type: "AC Sleeper Suite",
    fromCounterId: 7, // Sylhet
    destination: "Dhaka (Mohakhali)",
    departureTime: "04:30 PM",
    totalSeats: 30,
    bookedSeats: 12,
    fare: 1200,
    status: "Scheduled",
    driverName: "Shahidul Islam",
    contact: "01819-334488"
  },
  {
    id: "TRIP-109",
    busNo: "DM-BA-20-4412",
    busName: "National Travels Hino RM2",
    type: "Non-AC Chair Coach",
    fromCounterId: 8, // Rajshahi
    destination: "Dhaka (Gabtoli)",
    departureTime: "06:00 PM",
    totalSeats: 40,
    bookedSeats: 8,
    fare: 800,
    status: "Scheduled",
    driverName: "Nurul Amin",
    contact: "01819-334499"
  },
  {
    id: "TRIP-110",
    busNo: "DM-BA-21-9988",
    busName: "Ekota Transport Hino 1J",
    type: "Non-AC Deluxe",
    fromCounterId: 9, // Bogura
    destination: "Dhaka (Gabtoli)",
    departureTime: "07:30 PM",
    totalSeats: 40,
    bookedSeats: 14,
    fare: 750,
    status: "Scheduled",
    driverName: "Moniruzzaman",
    contact: "01819-334400"
  },
  {
    id: "TRIP-111",
    busNo: "DM-BA-22-3377",
    busName: "Desh Travels Scania 410",
    type: "AC Business Class",
    fromCounterId: 2, // Sayedabad
    destination: "Cox's Bazar",
    departureTime: "09:00 PM",
    totalSeats: 36,
    bookedSeats: 34,
    fare: 1800,
    status: "Scheduled",
    driverName: "Khorshed Alam",
    contact: "01819-556611"
  },
  {
    id: "TRIP-112",
    busNo: "DM-BA-23-6622",
    busName: "Royal Star Volvo 9400",
    type: "AC Multi-Axle",
    fromCounterId: 4, // Uttara
    destination: "Bogura (Satmatha)",
    departureTime: "10:30 PM",
    totalSeats: 36,
    bookedSeats: 6,
    fare: 1100,
    status: "Scheduled",
    driverName: "Babul Mia",
    contact: "01819-556622"
  },
  {
    id: "TRIP-113",
    busNo: "DM-BA-24-7711",
    busName: "GreenLine Business Class",
    type: "AC Business Class",
    fromCounterId: 3, // Mohakhali
    destination: "Sylhet (Kadamtoli)",
    departureTime: "11:15 PM",
    totalSeats: 32,
    bookedSeats: 4,
    fare: 1200,
    status: "Scheduled",
    driverName: "Sultan Mahmud",
    contact: "01819-556633"
  },
  {
    id: "TRIP-114",
    busNo: "DM-BA-25-3399",
    busName: "Tungipara Express Scania",
    type: "AC Multi-Axle",
    fromCounterId: 10, // Khulna
    destination: "Dhaka (Sayedabad)",
    departureTime: "09:45 PM",
    totalSeats: 36,
    bookedSeats: 24,
    fare: 1300,
    status: "Scheduled",
    driverName: "Tariqul Islam",
    contact: "01819-771122"
  }
];

// 10 Counter Accounts + Super Admin Account
const COUNTER_ACCOUNTS = [
  {
    id: "admin",
    role: "admin",
    counterId: null,
    name: "Central Control HQ",
    counterName: "All 10 Terminals",
    email: "admin@buscentral.com",
    password: "admin123",
    designation: "Fleet Operation Director"
  },
  {
    id: "sales-1",
    role: "sales",
    counterId: 1,
    name: "Rafiqul Islam",
    counterName: "Gabtoli Counter",
    city: "Dhaka",
    email: "gabtoli@buscentral.com",
    password: "gabtoli123",
    designation: "Terminal Sales Manager"
  },
  {
    id: "sales-2",
    role: "sales",
    counterId: 2,
    name: "Kamal Hossain",
    counterName: "Sayedabad Counter",
    city: "Dhaka",
    email: "sayedabad@buscentral.com",
    password: "sayedabad123",
    designation: "Terminal Sales Manager"
  },
  {
    id: "sales-3",
    role: "sales",
    counterId: 3,
    name: "Zahid Hasan",
    counterName: "Mohakhali Counter",
    city: "Dhaka",
    email: "mohakhali@buscentral.com",
    password: "mohakhali123",
    designation: "Terminal Sales Manager"
  },
  {
    id: "sales-4",
    role: "sales",
    counterId: 4,
    name: "Tanvir Ahmed",
    counterName: "Uttara Counter",
    city: "Dhaka",
    email: "uttara@buscentral.com",
    password: "uttara123",
    designation: "Terminal Sales Manager"
  },
  {
    id: "sales-5",
    role: "sales",
    counterId: 5,
    name: "Nazmul Huda",
    counterName: "Chittagong GEC Counter",
    city: "Chittagong",
    email: "chittagong@buscentral.com",
    password: "chittagong123",
    designation: "Terminal Sales Manager"
  },
  {
    id: "sales-6",
    role: "sales",
    counterId: 6,
    name: "Mahbub Alam",
    counterName: "Cox's Bazar Counter",
    city: "Cox's Bazar",
    email: "coxsbazar@buscentral.com",
    password: "coxsbazar123",
    designation: "Terminal Sales Manager"
  },
  {
    id: "sales-7",
    role: "sales",
    counterId: 7,
    name: "Faruk Hossain",
    counterName: "Sylhet Kadamtoli Counter",
    city: "Sylhet",
    email: "sylhet@buscentral.com",
    password: "sylhet123",
    designation: "Terminal Sales Manager"
  },
  {
    id: "sales-8",
    role: "sales",
    counterId: 8,
    name: "Sohail Rana",
    counterName: "Rajshahi Railgate Counter",
    city: "Rajshahi",
    email: "rajshahi@buscentral.com",
    password: "rajshahi123",
    designation: "Terminal Sales Manager"
  },
  {
    id: "sales-9",
    role: "sales",
    counterId: 9,
    name: "Anwar Parvez",
    counterName: "Bogura Satmatha Counter",
    city: "Bogura",
    email: "bogura@buscentral.com",
    password: "bogura123",
    designation: "Terminal Sales Manager"
  },
  {
    id: "sales-10",
    role: "sales",
    counterId: 10,
    name: "Tariqul Islam",
    counterName: "Khulna Sonadanga Counter",
    city: "Khulna",
    email: "khulna@buscentral.com",
    password: "khulna123",
    designation: "Terminal Sales Manager"
  }
];

// Helper to seed or get from localStorage
function getStoredData(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setStoredData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Storage error:", e);
  }
}

// Auth Helper
function authenticateUser(email, password) {
  return COUNTER_ACCOUNTS.find(
    acc => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password
  ) || null;
}

// Get Counter By ID
function getCounterById(id) {
  return DEFAULT_COUNTERS.find(c => c.id === parseInt(id)) || null;
}

// -------------------------------------------------------------
// COMPANY INCOME & EXPENSE (Accounting & Daily Cashbook Engine)
// -------------------------------------------------------------

const INCOME_CATEGORIES = [
  "টিকেট বিক্রয় (Ticket Sales)",
  "পার্সেল ও কুরিয়ার বুকিং (Cargo & Parcel)",
  "বাস চার্টার / স্পেশাল রিজার্ভ (Bus Charter)",
  "টিকেট বাতিল ফি ও চার্জ (Cancellation / Service)",
  "অন্যান্য অপারেটিং আয় (Other Income)"
];

const EXPENSE_CATEGORIES = [
  "ডিজেল ও ফুয়েল খরচ (Fuel & Diesel)",
  "হাইওয়ে ও সেতু টোল (Highway & Bridge Tolls)",
  "চালক ও স্টাফ খোরাকি (Crew Road Allowance)",
  "বাস সার্ভিসিং ও মবিল/টায়ার (Maintenance & Tyres)",
  "টার্মিনাল ও কাউন্টার ভাড়া (Terminal Rent & Utilities)",
  "ট্রাফিক ও রুট পারমিট খরচ (Route & Station Fees)",
  "অফিস ও যাত্রী আপ্যায়ন (Office & Entertainment)",
  "অন্যান্য পরিচালন ব্যয় (Other Expenses)"
];

const DEFAULT_TRANSACTIONS = [
  {
    id: "TXN-1001",
    date: "2026-09-28",
    time: "07:30 AM",
    type: "Income",
    category: "টিকেট বিক্রয় (Ticket Sales)",
    counterId: 2,
    counterName: "সায়েদাবাদ কাউন্টার (Sayedabad)",
    busNo: "DM-BA-12-8821",
    voucherNo: "VR-201",
    amount: 52000,
    paymentMethod: "Cash",
    description: "ঢাকা-কক্সবাজার সকালের বিজনেস ক্লাস ট্রিপের ৩০টি সিট কালেকশন",
    recordedBy: "Kamal Hossain"
  },
  {
    id: "TXN-1002",
    date: "2026-09-28",
    time: "08:15 AM",
    type: "Expense",
    category: "ডিজেল ও ফুয়েল খরচ (Fuel & Diesel)",
    counterId: 2,
    counterName: "সায়েদাবাদ কাউন্টার (Sayedabad)",
    busNo: "DM-BA-12-8821",
    voucherNo: "VR-202",
    amount: 16500,
    paymentMethod: "Cash Slip",
    description: "মেঘনা সিএনজি ও ফিলিং স্টেশন থেকে ১২৫ লিটার ডিজেল ভাউচার",
    recordedBy: "Kamal Hossain"
  },
  {
    id: "TXN-1003",
    date: "2026-09-28",
    time: "08:45 AM",
    type: "Expense",
    category: "হাইওয়ে ও সেতু টোল (Highway & Bridge Tolls)",
    counterId: 2,
    counterName: "সায়েদাবাদ কাউন্টার (Sayedabad)",
    busNo: "DM-BA-12-8821",
    voucherNo: "VR-203",
    amount: 3200,
    paymentMethod: "Cash",
    description: "মেঘনা-গোমতী সেতু ও চট্টগ্রাম এক্সপ্রেসওয়ে টোল অগ্রিম প্রদান",
    recordedBy: "Kamal Hossain"
  },
  {
    id: "TXN-1004",
    date: "2026-09-28",
    time: "09:10 AM",
    type: "Income",
    category: "পার্সেল ও কুরিয়ার বুকিং (Cargo & Parcel)",
    counterId: 2,
    counterName: "সায়েদাবাদ কাউন্টার (Sayedabad)",
    busNo: "DM-BA-12-8821",
    voucherNo: "VR-204",
    amount: 5800,
    paymentMethod: "Cash",
    description: "কক্সবাজারগামী ৮টি গার্মেন্টস স্যাম্পল ও মেডিসিন কার্টুন চার্জ",
    recordedBy: "Kamal Hossain"
  },
  {
    id: "TXN-1005",
    date: "2026-09-28",
    time: "09:30 AM",
    type: "Income",
    category: "টিকেট বিক্রয় (Ticket Sales)",
    counterId: 1,
    counterName: "গাবতলী কাউন্টার (Gabtoli)",
    busNo: "DM-BA-11-2041",
    voucherNo: "VR-205",
    amount: 38500,
    paymentMethod: "Cash",
    description: "ঢাকা-রাজশাহী ও কুষ্টিয়া সকালের ট্রিপ টিকেট সেলস সংগ্রহ",
    recordedBy: "Rafiqul Islam"
  },
  {
    id: "TXN-1006",
    date: "2026-09-28",
    time: "10:00 AM",
    type: "Expense",
    category: "ডিজেল ও ফুয়েল খরচ (Fuel & Diesel)",
    counterId: 1,
    counterName: "গাবতলী কাউন্টার (Gabtoli)",
    busNo: "DM-BA-11-2041",
    voucherNo: "VR-206",
    amount: 14000,
    paymentMethod: "Fuel Voucher",
    description: "যমুনা ব্রিজ রুটের জন্য ১১০ লিটার ডিজেল ক্রয়",
    recordedBy: "Rafiqul Islam"
  },
  {
    id: "TXN-1007",
    date: "2026-09-28",
    time: "10:20 AM",
    type: "Expense",
    category: "হাইওয়ে ও সেতু টোল (Highway & Bridge Tolls)",
    counterId: 1,
    counterName: "গাবতলী কাউন্টার (Gabtoli)",
    busNo: "DM-BA-11-2041",
    voucherNo: "VR-207",
    amount: 2600,
    paymentMethod: "Cash",
    description: "বঙ্গবন্ধু যমুনা বহুমুখী সেতু টোল চার্জ",
    recordedBy: "Rafiqul Islam"
  },
  {
    id: "TXN-1008",
    date: "2026-09-28",
    time: "10:45 AM",
    type: "Income",
    category: "টিকেট বিক্রয় (Ticket Sales)",
    counterId: 3,
    counterName: "মহাখালী কাউন্টার (Mohakhali)",
    busNo: "DM-BA-13-5590",
    voucherNo: "VR-208",
    amount: 41000,
    paymentMethod: "Cash",
    description: "ঢাকা-সিলেট সকালের স্লিপার কোচের মোট ২০টি সিট বুকিং",
    recordedBy: "Faruk Ahmed"
  },
  {
    id: "TXN-1009",
    date: "2026-09-28",
    time: "11:00 AM",
    type: "Expense",
    category: "চালক ও স্টাফ খোরাকি (Crew Road Allowance)",
    counterId: 3,
    counterName: "মহাখালী কাউন্টার (Mohakhali)",
    busNo: "DM-BA-13-5590",
    voucherNo: "VR-209",
    amount: 2200,
    paymentMethod: "Cash",
    description: "ঢাকা-সিলেট রুটের ২ চালক ও হেলপারের খাবার ও খোরাকি ভাতা",
    recordedBy: "Faruk Ahmed"
  },
  {
    id: "TXN-1010",
    date: "2026-09-28",
    time: "11:30 AM",
    type: "Income",
    category: "বাস চার্টার / স্পেশাল রিজার্ভ (Bus Charter)",
    counterId: 5,
    counterName: "চট্টগ্রাম জিইসি কাউন্টার (CTG GEC)",
    busNo: "CTG-11-9011",
    voucherNo: "VR-210",
    amount: 55000,
    paymentMethod: "Bank Transfer",
    description: "কর্পোরেট স্টাডি ট্যুর: চট্টগ্রাম টু বান্দরবান ২ দিনের স্পেশাল রিজার্ভ অগ্রিম",
    recordedBy: "Nasir Uddin"
  },
  {
    id: "TXN-1011",
    date: "2026-09-28",
    time: "11:50 AM",
    type: "Expense",
    category: "ডিজেল ও ফুয়েল খরচ (Fuel & Diesel)",
    counterId: 5,
    counterName: "চট্টগ্রাম জিইসি কাউন্টার (CTG GEC)",
    busNo: "CTG-11-9011",
    voucherNo: "VR-211",
    amount: 15800,
    paymentMethod: "Fuel Card",
    description: "সিটি পেট্রোলিয়াম জিইসি থেকে ১২০ লিটার ডিজেল প্রদান",
    recordedBy: "Nasir Uddin"
  },
  {
    id: "TXN-1012",
    date: "2026-09-28",
    time: "12:15 PM",
    type: "Income",
    category: "টিকেট বিক্রয় (Ticket Sales)",
    counterId: 10,
    counterName: "খুলনা সোনাডাঙ্গা কাউন্টার (Khulna)",
    busNo: "KHU-08-3312",
    voucherNo: "VR-212",
    amount: 46200,
    paymentMethod: "Cash",
    description: "খুলনা টু ঢাকা ভায়া পদ্মা সেতু এক্সপ্রেস সকালে ছেড়ে যাওয়া ট্রিপ",
    recordedBy: "Tariqul Islam"
  },
  {
    id: "TXN-1013",
    date: "2026-09-28",
    time: "12:30 PM",
    type: "Expense",
    category: "হাইওয়ে ও সেতু টোল (Highway & Bridge Tolls)",
    counterId: 10,
    counterName: "খুলনা সোনাডাঙ্গা কাউন্টার (Khulna)",
    busNo: "KHU-08-3312",
    voucherNo: "VR-213",
    amount: 4400,
    paymentMethod: "Cash",
    description: "পদ্মা বহুমুখী সেতু ও ভাঙ্গা এক্সপ্রেসওয়ে টোল রসিদ",
    recordedBy: "Tariqul Islam"
  },
  {
    id: "TXN-1014",
    date: "2026-09-28",
    time: "01:00 PM",
    type: "Income",
    category: "পার্সেল ও কুরিয়ার বুকিং (Cargo & Parcel)",
    counterId: 7,
    counterName: "সিলেট কদমতলী কাউন্টার (Sylhet)",
    busNo: "SYL-05-6677",
    voucherNo: "VR-214",
    amount: 6200,
    paymentMethod: "Cash",
    description: "শ্রীমঙ্গল অর্গানিক চা পাতার ১২ কার্টুন ঢাকা ডেলিভারি বুকিং",
    recordedBy: "Delwar Hossain"
  },
  {
    id: "TXN-1015",
    date: "2026-09-28",
    time: "01:30 PM",
    type: "Expense",
    category: "বাস সার্ভিসিং ও মবিল/টায়ার (Maintenance & Tyres)",
    counterId: 0,
    counterName: "সেন্ট্রাল হেডকোয়ার্টার (Central HQ)",
    busNo: "DM-BA-15-4080",
    voucherNo: "VR-215",
    amount: 32000,
    paymentMethod: "Bank Cheque",
    description: "সেন্ট্রাল ওয়ার্কশপ: ২টি স্ক্যানিয়া বাসের এয়ার সাসপেনশন মেরামত ও ইঞ্জিন অয়েল পরিবর্তন",
    recordedBy: "Super Admin HQ"
  },
  {
    id: "TXN-1016",
    date: "2026-09-28",
    time: "02:00 PM",
    type: "Expense",
    category: "টার্মিনাল ও কাউন্টার ভাড়া (Terminal Rent & Utilities)",
    counterId: 0,
    counterName: "সেন্ট্রাল হেডকোয়ার্টার (Central HQ)",
    busNo: "N/A",
    voucherNo: "VR-216",
    amount: 35000,
    paymentMethod: "Bank Transfer",
    description: "সায়েদাবাদ ও মহাখালী টার্মিনাল সেন্ট্রাল কাউন্টার স্পেস সেপ্টেম্বর ভাড়া",
    recordedBy: "Super Admin HQ"
  },
  {
    id: "TXN-1017",
    date: "2026-09-28",
    time: "02:20 PM",
    type: "Expense",
    category: "অফিস ও যাত্রী আপ্যায়ন (Office & Entertainment)",
    counterId: 2,
    counterName: "সায়েদাবাদ কাউন্টার (Sayedabad)",
    busNo: "N/A",
    voucherNo: "VR-217",
    amount: 1450,
    paymentMethod: "Cash",
    description: "কাউন্টার ওয়াটার ফিল্টার জার রিফিল ও যাত্রী ওয়েটিং রুম নাস্তা/চা",
    recordedBy: "Kamal Hossain"
  },
  {
    id: "TXN-1018",
    date: "2026-09-28",
    time: "02:45 PM",
    type: "Income",
    category: "টিকেট বিক্রয় (Ticket Sales)",
    counterId: 6,
    counterName: "কক্সবাজার ঝাউতলা কাউন্টার (Cox's Bazar)",
    busNo: "CXB-04-1109",
    voucherNo: "VR-218",
    amount: 51000,
    paymentMethod: "bKash / Cash",
    description: "কক্সবাজার টু ঢাকা নাইট কোচের এডভান্স রিটার্ন টিকেট সেলস",
    recordedBy: "Jahangir Alam"
  },
  {
    id: "TXN-1019",
    date: "2026-09-28",
    time: "03:10 PM",
    type: "Expense",
    category: "ডিজেল ও ফুয়েল খরচ (Fuel & Diesel)",
    counterId: 6,
    counterName: "কক্সবাজার ঝাউতলা কাউন্টার (Cox's Bazar)",
    busNo: "CXB-04-1109",
    voucherNo: "VR-219",
    amount: 17200,
    paymentMethod: "Fuel Voucher",
    description: "কক্সবাজার ফিলিং স্টেশন থেকে ১৩০ লিটার ডিজেল গ্রহণ স্লিপ",
    recordedBy: "Jahangir Alam"
  },
  {
    id: "TXN-1020",
    date: "2026-09-28",
    time: "03:30 PM",
    type: "Income",
    category: "টিকেট বিক্রয় (Ticket Sales)",
    counterId: 8,
    counterName: "রাজশাহী রেলগেট কাউন্টার (Rajshahi)",
    busNo: "RAJ-07-2289",
    voucherNo: "VR-220",
    amount: 34800,
    paymentMethod: "Cash",
    description: "রাজশাহী টু ঢাকা সিল্কসিটি সার্ভিস টিকেট কালেকশন",
    recordedBy: "Sohail Rana"
  }
];

// Helper to get all transactions
function getStoredTransactions() {
  return getStoredData('bus_transactions_v1', DEFAULT_TRANSACTIONS);
}

// Helper to save transaction
function saveStoredTransaction(txn) {
  const list = getStoredTransactions();
  const existingIdx = list.findIndex(t => t.id === txn.id);
  if (existingIdx >= 0) {
    list[existingIdx] = txn;
  } else {
    list.unshift(txn);
  }
  setStoredData('bus_transactions_v1', list);
  return list;
}

// Helper to delete transaction
function deleteStoredTransaction(id) {
  const list = getStoredTransactions();
  const filtered = list.filter(t => t.id !== id);
  setStoredData('bus_transactions_v1', filtered);
  return filtered;
}

// Helper to calculate totals
function calculateFinancialSummary(counterId = null) {
  const list = getStoredTransactions();
  const filtered = (counterId !== null && counterId !== 'all')
    ? list.filter(t => t.counterId === parseInt(counterId))
    : list;

  const totalIncome = filtered
    .filter(t => t.type === 'Income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalExpense = filtered
    .filter(t => t.type === 'Expense')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const netProfit = totalIncome - totalExpense;
  const margin = totalIncome > 0 ? Math.round((netProfit / totalIncome) * 100) : 0;

  return {
    totalIncome,
    totalExpense,
    netProfit,
    margin,
    count: filtered.length,
    incomeCount: filtered.filter(t => t.type === 'Income').length,
    expenseCount: filtered.filter(t => t.type === 'Expense').length
  };
}


