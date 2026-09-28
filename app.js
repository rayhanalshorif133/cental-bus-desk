/**
 * Main Application Logic for Bus Counter Dashboard
 * Supports Roles: 'admin' and 'sales'
 */

// Application State
let appState = {
  currentUser: {
    name: "Admin Officer",
    role: "admin", // 'admin' or 'sales'
    email: "admin@greenline.com"
  },
  activeTab: "overview", // 'overview', 'counters', 'trips', 'seats', 'fleet'
  selectedCounterFilter: "all",
  searchQuery: "",
  counters: [],
  trips: [],
  selectedTripForSeats: null
};

// Initialize State
function initApp() {
  // Check Authentication Token
  const token = localStorage.getItem('bus_auth_token');
  const savedUser = localStorage.getItem('bus_user_v1');

  if (!token || !savedUser) {
    // Redirect to login page
    window.location.href = "login.html";
    return;
  }

  try {
    appState.currentUser = JSON.parse(savedUser);
  } catch (e) {
    window.location.href = "login.html";
    return;
  }

  appState.counters = getStoredData('bus_counters_v1', DEFAULT_COUNTERS);
  appState.trips = getStoredData('bus_trips_v1', DEFAULT_TRIPS);

  setupEventListeners();
  renderApp();
}

// Logout function
function logout() {
  localStorage.removeItem('bus_auth_token');
  localStorage.removeItem('bus_user_v1');
  window.location.href = "login.html";
}

// Switch Role
function switchRole(newRole) {
  if (newRole === 'admin') {
    appState.currentUser = {
      name: "Super Admin",
      role: "admin",
      email: "admin@buscentral.com"
    };
  } else {
    appState.currentUser = {
      name: "Sayedabad Sales Counter",
      role: "sales",
      email: "sales.sayedabad@buscentral.com"
    };
  }
  setStoredData('bus_user_v1', appState.currentUser);
  showToast(`Role switched to ${newRole.toUpperCase()}`, 'info');
  renderApp();
}

// Reset Demo Data
function resetDefaultData() {
  if (confirm("Reset all 9 counters and bus trip data back to factory defaults?")) {
    localStorage.removeItem('bus_counters_v1');
    localStorage.removeItem('bus_trips_v1');
    appState.counters = [...DEFAULT_COUNTERS];
    appState.trips = [...DEFAULT_TRIPS];
    showToast("Data reset to default demo state!", "success");
    renderApp();
  }
}

// Navigation Tab Switcher
function switchTab(tabName) {
  appState.activeTab = tabName;
  renderApp();

  // Close mobile sidebar if open
  const mobileSidebar = document.getElementById('mobileSidebar');
  if (mobileSidebar && !mobileSidebar.classList.contains('hidden')) {
    mobileSidebar.classList.add('hidden');
  }
}

// Global Filter by Counter
function setCounterFilter(counterId) {
  appState.selectedCounterFilter = counterId;
  renderApp();
}

// Global Search
function handleSearch(query) {
  appState.searchQuery = query.toLowerCase();
  renderTripsTable();
}

// Get Counter by ID
function getCounter(id) {
  return appState.counters.find(c => c.id === parseInt(id)) || { name: 'Unknown Counter', city: '' };
}

// Toast Notifications
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  const bgColors = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-rose-600 text-white',
    info: 'bg-indigo-600 text-white',
    warning: 'bg-amber-600 text-white'
  };

  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-triangle',
    info: 'fa-info-circle',
    warning: 'fa-bell'
  };

  toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium transition-all transform duration-300 translate-y-2 opacity-0 ${bgColors[type] || bgColors.info}`;
  toast.innerHTML = `
    <i class="fas ${icons[type] || 'fa-info-circle'} text-lg"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// Main Render Function
function renderApp() {
  updateUserHeader();
  updateSidebarMenu();
  renderMetrics();

  // Render Tab Content
  const container = document.getElementById('mainContentArea');
  if (!container) return;

  if (appState.activeTab === 'overview') {
    container.innerHTML = getOverviewHTML();
    renderCountersSummaryGrid();
    renderTodayDeparturesPreview();
  } else if (appState.activeTab === 'counters') {
    container.innerHTML = getCountersModuleHTML();
    renderAll9CountersDetail();
  } else if (appState.activeTab === 'trips') {
    container.innerHTML = getTripsModuleHTML();
    renderTripsTable();
  } else if (appState.activeTab === 'seats') {
    container.innerHTML = getSeatsModuleHTML();
    renderSeatMapChooser();
  }

  // Bind Lucide or FontAwesome elements if needed
}

// Update Topbar and User Header
function updateUserHeader() {
  const roleBadge = document.getElementById('userRoleBadge');
  const userName = document.getElementById('currentUserName');
  const roleSelect = document.getElementById('roleSwitcherSelect');
  const roleNotice = document.getElementById('roleActionBanner');
  const btnAdmin = document.getElementById('roleBtnAdmin');
  const btnSales = document.getElementById('roleBtnSales');

  const isAdmin = appState.currentUser.role === 'admin';

  if (btnAdmin && btnSales) {
    if (isAdmin) {
      btnAdmin.className = "px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 bg-white text-indigo-700 shadow-sm";
      btnSales.className = "px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 text-slate-500 hover:text-slate-800";
    } else {
      btnAdmin.className = "px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 text-slate-500 hover:text-slate-800";
      btnSales.className = "px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 bg-white text-amber-700 shadow-sm";
    }
  }

  if (roleBadge) {
    if (isAdmin) {
      roleBadge.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300";
      roleBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> SUPER ADMIN`;
    } else {
      roleBadge.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300";
      roleBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> SALES EXECUTIVE`;
    }
  }

  if (userName) {
    userName.textContent = appState.currentUser.name;
  }

  if (roleSelect) {
    roleSelect.value = appState.currentUser.role;
  }

  if (roleNotice) {
    if (!isAdmin) {
      roleNotice.classList.remove('hidden');
      roleNotice.innerHTML = `
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-200 rounded-2xl mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
              <i class="fas fa-ticket-alt"></i>
            </div>
            <div>
              <h4 class="text-sm font-bold text-amber-950">সেলস মোড সক্রিয় (Sales Mode: Full CRUD Access)</h4>
              <p class="text-xs text-amber-900 mt-0.5">আপনি বাসের শিডিউল যোগ করতে পারবেন (<strong>Add</strong>), তথ্য পরিবর্তন (<strong>Edit</strong>) এবং মুছে ফেলতে পারবেন (<strong>Delete</strong>)।</p>
            </div>
          </div>
          <div class="flex items-center gap-2 self-end sm:self-auto">
            <button onclick="openTripModal()" class="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5">
              <i class="fas fa-plus"></i> নতুন বাস যোগ করুন
            </button>
          </div>
        </div>
      `;
    } else {
      roleNotice.classList.remove('hidden');
      roleNotice.innerHTML = `
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-indigo-500/10 via-blue-500/10 to-indigo-500/5 border border-indigo-200 rounded-2xl mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
              <i class="fas fa-shield-halved"></i>
            </div>
            <div>
              <h4 class="text-sm font-bold text-indigo-950">অ্যাডমিন সুপারভিশন মোড (Admin Monitoring Mode)</h4>
              <p class="text-xs text-indigo-900 mt-0.5">এক সাথে <strong>৯টি কাউন্টারের</strong> লাইভ বাস ট্রিপ, কোন বাস কখন কোথায় যাচ্ছে এবং কোন বাসে কতটি সিট খালি আছে তা সরাসরি পর্যবেক্ষণ করছেন।</p>
            </div>
          </div>
          <button onclick="switchRole('sales')" class="px-3.5 py-2 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 self-end sm:self-auto">
            <i class="fas fa-pen-to-square text-amber-500"></i> সেলস মোডে গিয়ে বাস যোগ/মুছুন
          </button>
        </div>
      `;
    }
  }
}

// Update Active Nav Link in Sidebar
function updateSidebarMenu() {
  const navLinks = document.querySelectorAll('[data-nav-tab]');
  navLinks.forEach(link => {
    const tab = link.getAttribute('data-nav-tab');
    if (tab === appState.activeTab) {
      link.className = "flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm bg-indigo-600 text-white shadow-md shadow-indigo-200 transition";
    } else {
      link.className = "flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition";
    }
  });
}

// Compute Statistics
function calculateMetrics() {
  const trips = appState.trips;
  const totalBuses = trips.length;
  const departedBuses = trips.filter(t => t.status === 'Departed').length;
  const boardingBuses = trips.filter(t => t.status === 'Boarding').length;
  const scheduledBuses = trips.filter(t => t.status === 'Scheduled').length;

  const totalSeats = trips.reduce((sum, t) => sum + Number(t.totalSeats), 0);
  const bookedSeats = trips.reduce((sum, t) => sum + Number(t.bookedSeats), 0);
  const emptySeats = totalSeats - bookedSeats;
  const occupancyRate = totalSeats > 0 ? Math.round((bookedSeats / totalSeats) * 100) : 0;

  const totalRevenue = trips.reduce((sum, t) => sum + (Number(t.bookedSeats) * Number(t.fare)), 0);

  return {
    totalBuses,
    departedBuses,
    boardingBuses,
    scheduledBuses,
    totalSeats,
    bookedSeats,
    emptySeats,
    occupancyRate,
    totalRevenue
  };
}

// Render Top Summary Stat Cards
function renderMetrics() {
  const metrics = calculateMetrics();
  const container = document.getElementById('quickStatsRow');
  if (!container) return;

  container.innerHTML = `
    <!-- Card 1: Total Buses Today -->
    <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-slate-600 uppercase tracking-wider">Today's Fleet</span>
        <span class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
          <i class="fas fa-bus-simple"></i>
        </span>
      </div>
      <div class="mt-2">
        <h3 class="text-2xl font-black text-slate-900">${metrics.totalBuses} Buses</h3>
        <div class="flex items-center gap-2 mt-1 text-xs">
          <span class="text-slate-500"><strong class="text-slate-700 font-semibold">${metrics.departedBuses}</strong> Departed</span>
          <span class="text-slate-300">•</span>
          <span class="text-amber-600 font-medium"><strong>${metrics.boardingBuses}</strong> Boarding</span>
          <span class="text-slate-300">•</span>
          <span class="text-indigo-600 font-medium"><strong>${metrics.scheduledBuses}</strong> Next</span>
        </div>
      </div>
    </div>

    <!-- Card 2: 9 Counters Overview -->
    <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-slate-600 uppercase tracking-wider">Counters Online</span>
        <span class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
          <i class="fas fa-building-circle-check"></i>
        </span>
      </div>
      <div class="mt-2">
        <h3 class="text-2xl font-black text-slate-900">${appState.counters.length} / 9 Counters</h3>
        <p class="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
          <i class="fas fa-check-circle"></i> 100% Operational across Bangladesh
        </p>
      </div>
    </div>

    <!-- Card 3: Seat Availability (Khali Seats) -->
    <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-slate-600 uppercase tracking-wider">Empty Seats (খালি সিট)</span>
        <span class="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg">
          <i class="fas fa-couch"></i>
        </span>
      </div>
      <div class="mt-2">
        <div class="flex items-baseline gap-2">
          <h3 class="text-2xl font-black text-purple-700">${metrics.emptySeats}</h3>
          <span class="text-xs font-semibold text-slate-400">/ ${metrics.totalSeats} Total</span>
        </div>
        <div class="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden flex">
          <div class="bg-indigo-600 h-2 transition-all duration-500" style="width: ${metrics.occupancyRate}%" title="Booked: ${metrics.occupancyRate}%"></div>
          <div class="bg-emerald-400 h-2 transition-all duration-500" style="width: ${100 - metrics.occupancyRate}%" title="Empty: ${100 - metrics.occupancyRate}%"></div>
        </div>
        <p class="text-xs text-slate-500 mt-1.5 flex justify-between">
          <span>Booked: <strong class="text-slate-800">${metrics.bookedSeats}</strong> (${metrics.occupancyRate}%)</span>
          <span class="text-emerald-700 font-semibold">${metrics.emptySeats} Available</span>
        </p>
      </div>
    </div>

    <!-- Card 4: Ticket Revenue -->
    <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-slate-600 uppercase tracking-wider">Today's Revenue</span>
        <span class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg">
          <i class="fas fa-bangladeshi-taka-sign"></i>
        </span>
      </div>
      <div class="mt-2">
        <h3 class="text-2xl font-black text-slate-900">৳ ${metrics.totalRevenue.toLocaleString()}</h3>
        <p class="text-xs text-slate-500 mt-1">
          From <strong>${metrics.bookedSeats}</strong> verified passenger tickets
        </p>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// MODULE 1: OVERVIEW SCREEN
// -------------------------------------------------------------
function getOverviewHTML() {
  return `
    <div class="space-y-6">
      <!-- 9 Counter Live Status Bar -->
      <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              ৯টি কাউন্টারের আজকের লাইভ বাস মনিটরিং (Live 9 Counter Fleet Status)
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">Real-time departures, upcoming schedules & empty seat counters</p>
          </div>
          <button onclick="switchTab('counters')" class="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition">
            View Full 9 Counters Detail <i class="fas fa-arrow-right"></i>
          </button>
        </div>

        <div id="counterSummaryGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Populated by JS -->
        </div>
      </div>

      <!-- Today's Schedule Table Preview -->
      <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
              <i class="fas fa-clock text-indigo-600"></i>
              আজকের বাস শিডিউল ও খালি সিট তালিকা (Today's Trips & Seat Availability)
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">Direct overview of departure times and remaining vacant seats</p>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="switchTab('trips')" class="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition">
              Manage All Trips <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>

        <div id="todayDeparturesTable" class="overflow-x-auto">
          <!-- Populated by JS -->
        </div>
      </div>
    </div>
  `;
}

function renderCountersSummaryGrid() {
  const container = document.getElementById('counterSummaryGrid');
  if (!container) return;

  const html = appState.counters.map(counter => {
    // Calculate trips originating from this counter
    const counterTrips = appState.trips.filter(t => t.fromCounterId === counter.id);
    const departedCount = counterTrips.filter(t => t.status === 'Departed').length;
    const upcomingCount = counterTrips.filter(t => t.status !== 'Departed').length;
    const totalSeats = counterTrips.reduce((acc, t) => acc + Number(t.totalSeats), 0);
    const bookedSeats = counterTrips.reduce((acc, t) => acc + Number(t.bookedSeats), 0);
    const emptySeats = totalSeats - bookedSeats;

    // Next departing bus
    const nextBus = counterTrips.find(t => t.status !== 'Departed') || counterTrips[counterTrips.length - 1];

    return `
      <div class="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition bg-gradient-to-br from-white to-slate-50/60">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
              ${counter.id}
            </div>
            <div>
              <h4 class="text-sm font-bold text-slate-900 leading-tight">${counter.name}</h4>
              <span class="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                <i class="fas fa-location-dot text-slate-400 text-[10px]"></i> ${counter.city}
              </span>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${counterTrips.length > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}">
            ${counterTrips.length} Buses Today
          </span>
        </div>

        <div class="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
          <div class="bg-white p-2 rounded-lg border border-slate-100">
            <span class="text-slate-500 text-[10px] uppercase font-bold block">Departed (ছেড়ে গেছে)</span>
            <span class="font-extrabold text-slate-800 text-sm">${departedCount} Buses</span>
          </div>
          <div class="bg-white p-2 rounded-lg border border-slate-100">
            <span class="text-slate-500 text-[10px] uppercase font-bold block">Empty Seats (খালি)</span>
            <span class="font-extrabold text-purple-700 text-sm">${emptySeats} Seats</span>
          </div>
        </div>

        ${nextBus ? `
          <div class="mt-2.5 bg-indigo-50/70 p-2 rounded-lg flex items-center justify-between text-[11px]">
            <span class="text-indigo-900 font-semibold truncate mr-2">
              <i class="fas fa-route text-indigo-500"></i> ${nextBus.destination}
            </span>
            <span class="bg-white text-indigo-700 font-bold px-1.5 py-0.5 rounded shadow-2xs whitespace-nowrap">
              ${nextBus.departureTime}
            </span>
          </div>
        ` : `
          <div class="mt-2.5 bg-slate-100 p-2 rounded-lg text-[11px] text-slate-400 text-center">
            No departures scheduled
          </div>
        `}

        <div class="mt-3 flex items-center justify-between">
          <span class="text-[11px] text-slate-500">
            <i class="fas fa-phone-volume text-slate-400 text-[10px]"></i> ${counter.phone}
          </span>
          <button onclick="setCounterFilter(${counter.id}); switchTab('trips');" class="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline">
            View Buses →
          </button>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = html;
}

function renderTodayDeparturesPreview() {
  const container = document.getElementById('todayDeparturesTable');
  if (!container) return;

  const trips = appState.trips.slice(0, 7); // preview first 7

  if (trips.length === 0) {
    container.innerHTML = `<div class="p-8 text-center text-slate-400">No bus trips found.</div>`;
    return;
  }

  const tableHTML = `
    <table class="w-full text-left text-sm text-slate-600 border-collapse">
      <thead>
        <tr class="border-b border-slate-200 text-[11px] uppercase font-extrabold text-slate-600 bg-slate-50/80">
          <th class="py-3 px-3">Bus No & Coach</th>
          <th class="py-3 px-3">Starting Counter</th>
          <th class="py-3 px-3">Destination</th>
          <th class="py-3 px-3">Departure Time</th>
          <th class="py-3 px-3 text-center">Total Seats</th>
          <th class="py-3 px-3 text-center">Booked</th>
          <th class="py-3 px-3 text-center">Empty (খালি সিট)</th>
          <th class="py-3 px-3">Status</th>
          <th class="py-3 px-3 text-right">Seat Plan</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
        ${trips.map(trip => {
          const counter = getCounter(trip.fromCounterId);
          const empty = Number(trip.totalSeats) - Number(trip.bookedSeats);
          
          let statusBadge = `bg-indigo-50 text-indigo-700 border-indigo-200`;
          if (trip.status === 'Departed') statusBadge = `bg-slate-100 text-slate-600 border-slate-200`;
          if (trip.status === 'Boarding') statusBadge = `bg-amber-100 text-amber-800 border-amber-300 animate-pulse`;

          return `
            <tr class="hover:bg-slate-50/80 transition">
              <td class="py-3 px-3 font-semibold text-slate-900">
                <div class="flex items-center gap-2">
                  <i class="fas fa-bus text-indigo-500"></i>
                  <div>
                    <span class="block">${trip.busNo}</span>
                    <span class="text-[11px] text-slate-600 font-medium">${trip.busName} • ${trip.type}</span>
                  </div>
                </div>
              </td>
              <td class="py-3 px-3">
                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                  <i class="fas fa-building text-[10px] text-slate-600"></i> ${counter.name}
                </span>
              </td>
              <td class="py-3 px-3 font-bold text-slate-800">
                ${trip.destination}
              </td>
              <td class="py-3 px-3 font-bold text-indigo-600">
                <i class="far fa-clock text-xs text-indigo-600 mr-1"></i> ${trip.departureTime}
              </td>
              <td class="py-3 px-3 text-center font-bold text-slate-700">
                ${trip.totalSeats}
              </td>
              <td class="py-3 px-3 text-center font-bold text-slate-600">
                ${trip.bookedSeats}
              </td>
              <td class="py-3 px-3 text-center">
                <span class="inline-flex items-center justify-center min-w-[32px] px-2 py-0.5 rounded-full text-xs font-black ${empty > 5 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'}">
                  ${empty} Seats
                </span>
              </td>
              <td class="py-3 px-3">
                <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusBadge}">
                  ${trip.status}
                </span>
              </td>
              <td class="py-3 px-3 text-right">
                <button onclick="openSeatModal('${trip.id}')" class="px-2.5 py-1 bg-slate-100 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-semibold text-slate-700 transition">
                  <i class="fas fa-couch mr-1"></i> View
                </button>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;

  container.innerHTML = tableHTML;
}

// -------------------------------------------------------------
// MODULE 2: ALL 9 COUNTERS DEDICATED MONITOR
// -------------------------------------------------------------
function getCountersModuleHTML() {
  return `
    <div class="space-y-6">
      <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold text-slate-900 flex items-center gap-2">
              <i class="fas fa-city text-indigo-600"></i>
              ৯টি কাউন্টারের বিস্তারিত ড্যাশবোর্ড (9 Inter-District Counter Hubs)
            </h2>
            <p class="text-xs text-slate-500 mt-1">
              Select or inspect any counter to monitor buses leaving, destinations, empty seats, and phone contacts.
            </p>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold text-slate-500">Filter Counter:</span>
            <select id="counterModuleFilterSelect" onchange="setCounterFilter(this.value)" class="text-xs font-semibold bg-slate-50 border border-slate-300 text-slate-700 rounded-xl px-3 py-2 outline-none focus:border-indigo-500">
              <option value="all" ${appState.selectedCounterFilter === 'all' ? 'selected' : ''}>All 9 Counters (Show All)</option>
              ${appState.counters.map(c => `
                <option value="${c.id}" ${appState.selectedCounterFilter == c.id ? 'selected' : ''}>${c.id}. ${c.name} (${c.city})</option>
              `).join('')}
            </select>
          </div>
        </div>
      </div>

      <div id="allCountersList" class="space-y-6">
        <!-- Rendered by JS -->
      </div>
    </div>
  `;
}

function renderAll9CountersDetail() {
  const container = document.getElementById('allCountersList');
  if (!container) return;

  const filter = appState.selectedCounterFilter;
  const filteredCounters = filter === 'all' 
    ? appState.counters 
    : appState.counters.filter(c => c.id === parseInt(filter));

  if (filteredCounters.length === 0) {
    container.innerHTML = `<div class="p-8 text-center text-slate-400">No counters found matching filter.</div>`;
    return;
  }

  const html = filteredCounters.map(counter => {
    const counterTrips = appState.trips.filter(t => t.fromCounterId === counter.id);
    const departed = counterTrips.filter(t => t.status === 'Departed').length;
    const boarding = counterTrips.filter(t => t.status === 'Boarding').length;
    const scheduled = counterTrips.filter(t => t.status === 'Scheduled').length;
    const totalSeats = counterTrips.reduce((acc, t) => acc + Number(t.totalSeats), 0);
    const bookedSeats = counterTrips.reduce((acc, t) => acc + Number(t.bookedSeats), 0);
    const emptySeats = totalSeats - bookedSeats;

    return `
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition hover:border-indigo-300">
        <!-- Counter Header Header -->
        <div class="p-5 bg-gradient-to-r from-slate-50 to-indigo-50/30 border-b border-slate-200/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div class="flex items-start gap-3.5">
            <div class="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-indigo-100">
              #${counter.id}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-lg font-black text-slate-900">${counter.name}</h3>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">${counter.code}</span>
                <span class="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800">Operational</span>
              </div>
              <p class="text-xs text-slate-500 mt-1 flex items-center gap-3">
                <span><i class="fas fa-location-dot text-slate-400"></i> ${counter.location}</span>
                <span>•</span>
                <span><i class="fas fa-user-tie text-slate-400"></i> Manager: <strong>${counter.manager}</strong></span>
                <span>•</span>
                <span><i class="fas fa-phone text-slate-400"></i> ${counter.phone}</span>
              </p>
            </div>
          </div>

          <!-- Counter Quick Aggregates -->
          <div class="flex items-center gap-3">
            <div class="bg-white px-3.5 py-2 rounded-xl border border-slate-200 text-center min-w-[90px]">
              <span class="text-[10px] uppercase font-bold text-slate-600 block">Total Buses</span>
              <span class="text-base font-black text-slate-900">${counterTrips.length}</span>
            </div>
            <div class="bg-white px-3.5 py-2 rounded-xl border border-slate-200 text-center min-w-[90px]">
              <span class="text-[10px] uppercase font-bold text-slate-600 block">Departed</span>
              <span class="text-base font-black text-slate-700">${departed}</span>
            </div>
            <div class="bg-white px-3.5 py-2 rounded-xl border border-purple-200 bg-purple-50/40 text-center min-w-[110px]">
              <span class="text-[10px] uppercase font-bold text-purple-700 block">Empty Seats</span>
              <span class="text-base font-black text-purple-700">${emptySeats} <span class="text-[10px] text-purple-600">/ ${totalSeats}</span></span>
            </div>
            ${appState.currentUser.role === 'sales' ? `
              <button onclick="openTripModal(null, ${counter.id})" class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm">
                <i class="fas fa-plus"></i> Add Trip
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Trips Table for this Counter -->
        <div class="p-5">
          <h4 class="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
            আজকের নির্ধারিত বাস সমূহ (Buses scheduled from ${counter.name}):
          </h4>

          ${counterTrips.length === 0 ? `
            <div class="p-6 text-center text-slate-400 bg-slate-50 rounded-xl text-xs">
              আজকে এই কাউন্টার থেকে কোনো বাসের শিডিউল যোগ করা হয়নি।
            </div>
          ` : `
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm text-slate-600">
                <thead>
                  <tr class="text-[11px] uppercase font-extrabold text-slate-600 border-b border-slate-200">
                    <th class="py-2.5 px-3">Bus Info</th>
                    <th class="py-2.5 px-3">Destination (গন্তব্য)</th>
                    <th class="py-2.5 px-3">Time (সময়)</th>
                    <th class="py-2.5 px-3">Driver & Contact</th>
                    <th class="py-2.5 px-3 text-center">Booked Seats</th>
                    <th class="py-2.5 px-3 text-center">Empty Seats (খালি)</th>
                    <th class="py-2.5 px-3">Status</th>
                    <th class="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  ${counterTrips.map(trip => {
                    const empty = Number(trip.totalSeats) - Number(trip.bookedSeats);
                    let statusBadge = `bg-indigo-50 text-indigo-700 border-indigo-200`;
                    if (trip.status === 'Departed') statusBadge = `bg-slate-100 text-slate-600 border-slate-200`;
                    if (trip.status === 'Boarding') statusBadge = `bg-amber-100 text-amber-800 border-amber-300 animate-pulse`;

                    return `
                      <tr class="hover:bg-slate-50 transition">
                        <td class="py-3 px-3">
                          <div class="font-bold text-slate-900">${trip.busNo}</div>
                          <div class="text-[11px] text-slate-600 font-medium">${trip.busName} • <span class="text-indigo-600">${trip.type}</span></div>
                        </td>
                        <td class="py-3 px-3 font-bold text-slate-800">
                          <span class="inline-flex items-center gap-1.5">
                            <i class="fas fa-location-arrow text-xs text-indigo-500"></i> ${trip.destination}
                          </span>
                        </td>
                        <td class="py-3 px-3 font-black text-indigo-700">
                          ${trip.departureTime}
                        </td>
                        <td class="py-3 px-3 text-xs">
                          <div class="text-slate-800 font-semibold">${trip.driverName || 'Assigned Driver'}</div>
                          <div class="text-slate-600 font-medium text-[11px]">${trip.contact || 'N/A'}</div>
                        </td>
                        <td class="py-3 px-3 text-center font-bold text-slate-700">
                          ${trip.bookedSeats} / ${trip.totalSeats}
                        </td>
                        <td class="py-3 px-3 text-center">
                          <span class="px-2.5 py-1 rounded-full text-xs font-black ${empty > 5 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
                            ${empty} খালি সিট
                          </span>
                        </td>
                        <td class="py-3 px-3">
                          <span class="px-2 py-0.5 rounded-full text-[11px] font-bold border ${statusBadge}">
                            ${trip.status}
                          </span>
                        </td>
                        <td class="py-3 px-3 text-right">
                          <div class="flex items-center justify-end gap-1.5">
                            <button onclick="openSeatModal('${trip.id}')" title="View Seat Plan" class="p-1.5 text-xs rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700">
                              <i class="fas fa-couch"></i>
                            </button>
                            ${appState.currentUser.role === 'sales' ? `
                              <button onclick="openTripModal('${trip.id}')" title="Edit Bus Details" class="p-1.5 text-xs rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800">
                                <i class="fas fa-edit"></i>
                              </button>
                              <button onclick="confirmDeleteTrip('${trip.id}')" title="Delete Trip" class="p-1.5 text-xs rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800">
                                <i class="fas fa-trash-alt"></i>
                              </button>
                            ` : `
                              <span class="text-[11px] text-slate-400 font-medium italic">Read-only</span>
                            `}
                          </div>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = html;
}

// -------------------------------------------------------------
// MODULE 3: BUS TRIPS & SCHEDULES (WITH SALES CRUD)
// -------------------------------------------------------------
function getTripsModuleHTML() {
  return `
    <div class="space-y-6">
      <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold text-slate-900 flex items-center gap-2">
              <i class="fas fa-bus-simple text-indigo-600"></i>
              বাস ট্রিপ ও শিডিউল ম্যানেজমেন্ট (Trips & Fleet Management)
            </h2>
            <p class="text-xs text-slate-500 mt-1">
              Filter by counter, search destination, check remaining seats, or manage fleet schedules.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            ${appState.currentUser.role === 'sales' ? `
              <button onclick="openTripModal()" class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition flex items-center gap-2">
                <i class="fas fa-plus"></i> নতুন বাস / ট্রিপ যোগ করুন (Add Bus)
              </button>
            ` : `
              <div class="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold flex items-center gap-2">
                <i class="fas fa-lock text-slate-400"></i> Switch to Sales to Add / Delete
              </div>
            `}
          </div>
        </div>

        <!-- Filter and Search Bar -->
        <div class="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex flex-wrap items-center gap-2.5">
            <span class="text-xs font-bold text-slate-600">কাউন্টার সিলেক্ট করুন:</span>
            <select id="tripsCounterFilter" onchange="setCounterFilter(this.value)" class="text-xs font-semibold bg-slate-50 border border-slate-300 text-slate-700 rounded-xl px-3 py-2 outline-none focus:border-indigo-500">
              <option value="all" ${appState.selectedCounterFilter === 'all' ? 'selected' : ''}>সব ৯টি কাউন্টার (All Counters)</option>
              ${appState.counters.map(c => `
                <option value="${c.id}" ${appState.selectedCounterFilter == c.id ? 'selected' : ''}>${c.name} (${c.city})</option>
              `).join('')}
            </select>
          </div>

          <div class="relative w-full sm:w-72">
            <input 
              type="text" 
              id="tripSearchInput" 
              oninput="handleSearch(this.value)" 
              value="${appState.searchQuery}" 
              placeholder="Search by Bus No, Destination..." 
              class="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 transition text-slate-800"
            />
            <i class="fas fa-search absolute left-3 top-2.5 text-slate-400 text-xs"></i>
          </div>
        </div>
      </div>

      <!-- Main Trips Table Card -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div id="fullTripsTableContainer" class="overflow-x-auto">
          <!-- Rendered by JS -->
        </div>
      </div>
    </div>
  `;
}

function renderTripsTable() {
  const container = document.getElementById('fullTripsTableContainer');
  if (!container) return;

  let list = [...appState.trips];

  // Apply counter filter
  if (appState.selectedCounterFilter !== 'all') {
    list = list.filter(t => t.fromCounterId === parseInt(appState.selectedCounterFilter));
  }

  // Apply search query
  if (appState.searchQuery.trim() !== '') {
    const q = appState.searchQuery;
    list = list.filter(t => {
      const counter = getCounter(t.fromCounterId);
      return t.busNo.toLowerCase().includes(q) ||
             t.busName.toLowerCase().includes(q) ||
             t.destination.toLowerCase().includes(q) ||
             counter.name.toLowerCase().includes(q);
    });
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div class="p-12 text-center text-slate-400">
        <i class="fas fa-bus text-4xl mb-3 text-slate-300"></i>
        <p class="font-bold text-slate-600 text-sm">কোনো বাস তথ্য পাওয়া যায়নি।</p>
        <p class="text-xs text-slate-400 mt-1">Try changing your search keywords or counter filter.</p>
      </div>
    `;
    return;
  }

  const tableHTML = `
    <table class="w-full text-left text-sm text-slate-600 border-collapse">
      <thead>
        <tr class="text-[11px] uppercase font-extrabold text-slate-600 bg-slate-50 border-b border-slate-200">
          <th class="py-3 px-4">Bus No & Model</th>
          <th class="py-3 px-4">Starting Counter</th>
          <th class="py-3 px-4">Destination (গন্তব্য)</th>
          <th class="py-3 px-4">Time (সময়)</th>
          <th class="py-3 px-4 text-center">Total Seats</th>
          <th class="py-3 px-4 text-center">Booked Seats</th>
          <th class="py-3 px-4 text-center">Empty Seats (খালি)</th>
          <th class="py-3 px-4">Fare (ভাড়া)</th>
          <th class="py-3 px-4">Status</th>
          <th class="py-3 px-4 text-right">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
        ${list.map(trip => {
          const counter = getCounter(trip.fromCounterId);
          const empty = Number(trip.totalSeats) - Number(trip.bookedSeats);
          
          let statusBadge = `bg-indigo-50 text-indigo-700 border-indigo-200`;
          if (trip.status === 'Departed') statusBadge = `bg-slate-100 text-slate-600 border-slate-200`;
          if (trip.status === 'Boarding') statusBadge = `bg-amber-100 text-amber-800 border-amber-300 animate-pulse`;

          return `
            <tr class="hover:bg-slate-50 transition">
              <td class="py-3 px-4">
                <div class="font-bold text-slate-900">${trip.busNo}</div>
                <div class="text-[11px] text-slate-600 font-medium">${trip.busName} • <span class="text-indigo-600">${trip.type}</span></div>
              </td>
              <td class="py-3 px-4">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                  <i class="fas fa-building text-slate-600 text-xs"></i> ${counter.name}
                </span>
              </td>
              <td class="py-3 px-4 font-bold text-slate-900">
                <span class="flex items-center gap-1.5">
                  <i class="fas fa-arrow-right text-indigo-400 text-xs"></i> ${trip.destination}
                </span>
              </td>
              <td class="py-3 px-4 font-black text-indigo-600 whitespace-nowrap">
                <i class="far fa-clock text-xs text-indigo-600 mr-1"></i> ${trip.departureTime}
              </td>
              <td class="py-3 px-4 text-center font-bold text-slate-700">
                ${trip.totalSeats}
              </td>
              <td class="py-3 px-4 text-center font-bold text-slate-600">
                ${trip.bookedSeats}
              </td>
              <td class="py-3 px-4 text-center">
                <span class="inline-flex items-center justify-center px-3 py-0.5 rounded-full text-xs font-black ${empty > 5 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'}">
                  ${empty} Seats
                </span>
              </td>
              <td class="py-3 px-4 font-black text-slate-900">
                ৳ ${Number(trip.fare).toLocaleString()}
              </td>
              <td class="py-3 px-4">
                <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusBadge}">
                  ${trip.status}
                </span>
              </td>
              <td class="py-3 px-4 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <button onclick="openSeatModal('${trip.id}')" title="Seat Map" class="px-2.5 py-1 text-xs rounded-lg bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-semibold transition">
                    <i class="fas fa-couch mr-1"></i> Seats
                  </button>
                  ${appState.currentUser.role === 'sales' ? `
                    <button onclick="openTripModal('${trip.id}')" title="Edit Bus Trip" class="p-1.5 text-xs rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 transition">
                      <i class="fas fa-pen-to-square"></i>
                    </button>
                    <button onclick="confirmDeleteTrip('${trip.id}')" title="Delete Bus Trip" class="p-1.5 text-xs rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition">
                      <i class="fas fa-trash-can"></i>
                    </button>
                  ` : ''}
                </div>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;

  container.innerHTML = tableHTML;
}

// -------------------------------------------------------------
// MODULE 4: SEATS INTERACTIVE VISUALIZER
// -------------------------------------------------------------
function getSeatsModuleHTML() {
  return `
    <div class="space-y-6">
      <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold text-slate-900 flex items-center gap-2">
              <i class="fas fa-couch text-indigo-600"></i>
              বাসের খালি ও বুকড সিট পর্যবেক্ষণ (Live Bus Seat Map & Booking)
            </h2>
            <p class="text-xs text-slate-500 mt-1">
              Select any bus below to inspect its 2x2 seating layout, vacant seats, and passenger assignments.
            </p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Trip Selector Column -->
        <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm lg:col-span-1 space-y-3">
          <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">Select Bus to Inspect:</h3>
          <div id="seatModuleTripList" class="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            <!-- Rendered by JS -->
          </div>
        </div>

        <!-- Seating Layout Plan -->
        <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm lg:col-span-2">
          <div id="selectedBusSeatLayoutView">
            <div class="p-12 text-center text-slate-400">
              Please select a bus from the left to view the interactive seat map.
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderSeatMapChooser() {
  const listContainer = document.getElementById('seatModuleTripList');
  if (!listContainer) return;

  const trips = appState.trips;
  if (trips.length === 0) {
    listContainer.innerHTML = `<div class="text-xs text-slate-400">No buses available.</div>`;
    return;
  }

  // Default selection
  if (!appState.selectedTripForSeats && trips.length > 0) {
    appState.selectedTripForSeats = trips[0].id;
  }

  listContainer.innerHTML = trips.map(trip => {
    const counter = getCounter(trip.fromCounterId);
    const empty = Number(trip.totalSeats) - Number(trip.bookedSeats);
    const isSelected = trip.id === appState.selectedTripForSeats;

    return `
      <div 
        onclick="selectTripForSeatView('${trip.id}')"
        class="p-3.5 rounded-xl border cursor-pointer transition ${isSelected ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}"
      >
        <div class="flex items-center justify-between">
          <span class="font-bold text-sm text-slate-900">${trip.busNo}</span>
          <span class="text-xs font-black text-indigo-700">${trip.departureTime}</span>
        </div>
        <p class="text-xs text-slate-600 font-medium mt-1 truncate">${trip.busName}</p>
        <div class="flex items-center justify-between text-[11px] text-slate-500 mt-2">
          <span><i class="fas fa-location-arrow text-[10px]"></i> ${trip.destination}</span>
          <span class="font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">${empty} খালি সিট</span>
        </div>
      </div>
    `;
  }).join('');

  renderActiveBusSeatLayout();
}

function selectTripForSeatView(tripId) {
  appState.selectedTripForSeats = tripId;
  renderSeatMapChooser();
}

function renderActiveBusSeatLayout() {
  const container = document.getElementById('selectedBusSeatLayoutView');
  if (!container) return;

  const trip = appState.trips.find(t => t.id === appState.selectedTripForSeats);
  if (!trip) {
    container.innerHTML = `<div class="p-8 text-center text-slate-400">No bus selected.</div>`;
    return;
  }

  const counter = getCounter(trip.fromCounterId);
  const total = Number(trip.totalSeats);
  const booked = Number(trip.bookedSeats);
  const empty = total - booked;

  // Generate 2x2 seats
  const rows = Math.ceil(total / 4);
  const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

  let seatGridHTML = '';
  let seatCounter = 0;

  for (let r = 0; r < rows; r++) {
    const letter = rowLetters[r] || `R${r+1}`;
    seatGridHTML += `
      <div class="flex items-center justify-between gap-4 py-2 border-b border-slate-100">
        <!-- Left Side: Seats 1 and 2 -->
        <div class="flex items-center gap-2">
          ${renderSeatButton(letter + '1', ++seatCounter <= booked, trip.id)}
          ${renderSeatButton(letter + '2', ++seatCounter <= booked, trip.id)}
        </div>

        <!-- Aisle (আইল / চলাচলের পথ) -->
        <div class="text-[10px] text-slate-300 font-bold uppercase tracking-widest px-2">
          AISLE
        </div>

        <!-- Right Side: Seats 3 and 4 -->
        <div class="flex items-center gap-2">
          ${renderSeatButton(letter + '3', ++seatCounter <= booked, trip.id)}
          ${renderSeatButton(letter + '4', ++seatCounter <= booked, trip.id)}
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div>
      <!-- Trip Header Details -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-xl font-black text-slate-900">${trip.busNo}</h3>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">${trip.type}</span>
          </div>
          <p class="text-xs text-slate-500 mt-1">
            <strong>Starting Counter:</strong> ${counter.name} → <strong>Destination:</strong> ${trip.destination}
          </p>
        </div>

        <div class="flex items-center gap-4">
          <div class="text-right">
            <span class="text-xs text-slate-400 block uppercase font-bold">Departure</span>
            <span class="text-base font-black text-indigo-600">${trip.departureTime}</span>
          </div>
          <div class="text-right">
            <span class="text-xs text-slate-400 block uppercase font-bold">Ticket Fare</span>
            <span class="text-base font-black text-slate-900">৳ ${trip.fare}</span>
          </div>
        </div>
      </div>

      <!-- Quick Legend & Counts -->
      <div class="my-4 p-3 bg-slate-50 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-1.5">
            <span class="w-4 h-4 rounded bg-emerald-500 inline-block"></span>
            <span class="font-bold text-slate-700">খালি সিট (${empty} Available)</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-4 h-4 rounded bg-rose-500 inline-block"></span>
            <span class="font-bold text-slate-700">বুকড সিট (${booked} Booked)</span>
          </div>
        </div>

        ${appState.currentUser.role === 'sales' ? `
          <div class="text-xs text-amber-700 font-semibold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
            <i class="fas fa-hand-pointer mr-1"></i> Click any seat to Book / Free up
          </div>
        ` : `
          <span class="text-xs text-slate-400 italic">Sales personnel can modify seat status</span>
        `}
      </div>

      <!-- Bus Visual Outline -->
      <div class="max-w-md mx-auto bg-slate-50 border-2 border-slate-300 rounded-3xl p-5 shadow-inner">
        <!-- Front of Bus (Driver & Door) -->
        <div class="flex items-center justify-between pb-4 mb-4 border-b-2 border-dashed border-slate-300">
          <div class="flex items-center gap-2 text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
            <i class="fas fa-door-open text-slate-600"></i> Entrance Door
          </div>
          <div class="flex items-center gap-2 text-xs font-bold text-slate-800 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
            <svg class="w-4 h-4 text-indigo-600 inline" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v6m0 6v6m9-9h-6m-6 0H3"/></svg> Driver Seat
          </div>
        </div>

        <!-- Seating rows -->
        <div class="space-y-1">
          ${seatGridHTML}
        </div>

        <!-- Back of Bus -->
        <div class="text-center text-[10px] text-slate-400 uppercase font-bold tracking-widest pt-4 mt-2 border-t border-slate-200">
          Rear Cabin Engine Area
        </div>
      </div>
    </div>
  `;
}

function renderSeatButton(seatNo, isBooked, tripId) {
  const isSales = appState.currentUser.role === 'sales';
  const colorClass = isBooked 
    ? 'bg-rose-500 text-white hover:bg-rose-600' 
    : 'bg-emerald-500 text-white hover:bg-emerald-600';

  return `
    <button 
      onclick="${isSales ? `toggleSeatBooking('${tripId}', '${seatNo}')` : `showToast('Seat ${seatNo} is ${isBooked ? 'Booked' : 'Available'}. Switch to Sales role to book or cancel.', 'info')`}"
      class="w-10 h-10 rounded-xl text-xs font-bold flex flex-col items-center justify-center shadow-xs transition transform hover:scale-105 active:scale-95 ${colorClass}"
      title="Seat ${seatNo}: ${isBooked ? 'Booked' : 'Available'}"
    >
      <i class="fas fa-chair text-[10px] opacity-80"></i>
      <span>${seatNo}</span>
    </button>
  `;
}

// Toggle Seat Booking (Sales Feature)
function toggleSeatBooking(tripId, seatNo) {
  const trip = appState.trips.find(t => t.id === tripId);
  if (!trip) return;

  const currentBooked = Number(trip.bookedSeats);
  const total = Number(trip.totalSeats);

  // Simple simulation: increment or decrement
  if (currentBooked < total) {
    trip.bookedSeats = currentBooked + 1;
    showToast(`Seat ${seatNo} booked successfully!`, 'success');
  } else {
    trip.bookedSeats = Math.max(0, currentBooked - 1);
    showToast(`Seat ${seatNo} released!`, 'info');
  }

  setStoredData('bus_trips_v1', appState.trips);
  renderApp();
  renderSeatMapChooser();
}

// -------------------------------------------------------------
// SALES CRUD: ADD / EDIT / DELETE MODAL LOGIC
// -------------------------------------------------------------
let editingTripId = null;

function openTripModal(tripId = null, preselectedCounterId = null) {
  editingTripId = tripId;
  const modal = document.getElementById('tripFormModal');
  const title = document.getElementById('tripModalTitle');
  const form = document.getElementById('tripForm');

  if (!modal || !form) return;

  // Reset form
  form.reset();

  // Populate Counter Dropdown
  const counterSelect = document.getElementById('tripCounterSelect');
  if (counterSelect) {
    counterSelect.innerHTML = appState.counters.map(c => `
      <option value="${c.id}">${c.name} (${c.city})</option>
    `).join('');
  }

  if (tripId) {
    title.innerHTML = `<i class="fas fa-pen-to-square text-amber-500 mr-2"></i> বাসের তথ্য এডিট করুন (Edit Bus Trip)`;
    const trip = appState.trips.find(t => t.id === tripId);
    if (trip) {
      document.getElementById('tripBusNo').value = trip.busNo;
      document.getElementById('tripBusName').value = trip.busName;
      document.getElementById('tripType').value = trip.type;
      document.getElementById('tripCounterSelect').value = trip.fromCounterId;
      document.getElementById('tripDestination').value = trip.destination;
      document.getElementById('tripDepartureTime').value = trip.departureTime;
      document.getElementById('tripTotalSeats').value = trip.totalSeats;
      document.getElementById('tripBookedSeats').value = trip.bookedSeats;
      document.getElementById('tripFare').value = trip.fare;
      document.getElementById('tripStatus').value = trip.status;
      document.getElementById('tripDriverName').value = trip.driverName || '';
      document.getElementById('tripDriverPhone').value = trip.contact || '';
    }
  } else {
    title.innerHTML = `<i class="fas fa-plus-circle text-indigo-600 mr-2"></i> নতুন বাস ট্রিপ যোগ করুন (Add New Bus Trip)`;
    if (preselectedCounterId) {
      counterSelect.value = preselectedCounterId;
    }
    // Default values
    document.getElementById('tripTotalSeats').value = 36;
    document.getElementById('tripBookedSeats').value = 0;
    document.getElementById('tripFare').value = 1200;
  }

  modal.classList.remove('hidden');
}

function closeTripModal() {
  const modal = document.getElementById('tripFormModal');
  if (modal) modal.classList.add('hidden');
  editingTripId = null;
}

function handleTripFormSubmit(e) {
  e.preventDefault();

  const busNo = document.getElementById('tripBusNo').value.trim();
  const busName = document.getElementById('tripBusName').value.trim();
  const type = document.getElementById('tripType').value;
  const fromCounterId = parseInt(document.getElementById('tripCounterSelect').value);
  const destination = document.getElementById('tripDestination').value.trim();
  const departureTime = document.getElementById('tripDepartureTime').value.trim();
  const totalSeats = parseInt(document.getElementById('tripTotalSeats').value) || 36;
  const bookedSeats = parseInt(document.getElementById('tripBookedSeats').value) || 0;
  const fare = parseInt(document.getElementById('tripFare').value) || 1000;
  const status = document.getElementById('tripStatus').value;
  const driverName = document.getElementById('tripDriverName').value.trim();
  const contact = document.getElementById('tripDriverPhone').value.trim();

  if (!busNo || !destination || !departureTime) {
    showToast("Please fill all required fields", "warning");
    return;
  }

  if (bookedSeats > totalSeats) {
    showToast("Booked seats cannot exceed total seats!", "error");
    return;
  }

  if (editingTripId) {
    // Update existing
    const index = appState.trips.findIndex(t => t.id === editingTripId);
    if (index !== -1) {
      appState.trips[index] = {
        ...appState.trips[index],
        busNo,
        busName,
        type,
        fromCounterId,
        destination,
        departureTime,
        totalSeats,
        bookedSeats,
        fare,
        status,
        driverName,
        contact
      };
      showToast("Bus details updated successfully!", "success");
    }
  } else {
    // Add new
    const newTrip = {
      id: "TRIP-" + (Date.now().toString().slice(-4)),
      busNo,
      busName,
      type,
      fromCounterId,
      destination,
      departureTime,
      totalSeats,
      bookedSeats,
      fare,
      status,
      driverName,
      contact
    };
    appState.trips.unshift(newTrip);
    showToast("New Bus Trip added successfully!", "success");
  }

  // Persist
  setStoredData('bus_trips_v1', appState.trips);
  closeTripModal();
  renderApp();
}

function confirmDeleteTrip(tripId) {
  const trip = appState.trips.find(t => t.id === tripId);
  if (!trip) return;

  const confirmed = confirm(`Are you sure you want to delete bus trip: ${trip.busNo} (${trip.destination})?`);
  if (confirmed) {
    appState.trips = appState.trips.filter(t => t.id !== tripId);
    setStoredData('bus_trips_v1', appState.trips);
    showToast("Bus trip deleted successfully!", "info");
    renderApp();
  }
}

// -------------------------------------------------------------
// STANDALONE SEAT MAP MODAL (Opened from tables)
// -------------------------------------------------------------
function openSeatModal(tripId) {
  const trip = appState.trips.find(t => t.id === tripId);
  if (!trip) return;

  const modal = document.getElementById('seatQuickModal');
  const container = document.getElementById('seatQuickModalContent');
  if (!modal || !container) return;

  const counter = getCounter(trip.fromCounterId);
  const total = Number(trip.totalSeats);
  const booked = Number(trip.bookedSeats);
  const empty = total - booked;

  const rows = Math.ceil(total / 4);
  const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

  let seatGridHTML = '';
  let seatCounter = 0;

  for (let r = 0; r < rows; r++) {
    const letter = rowLetters[r] || `R${r+1}`;
    seatGridHTML += `
      <div class="flex items-center justify-between gap-4 py-2 border-b border-slate-100">
        <div class="flex items-center gap-2">
          ${renderSeatButton(letter + '1', ++seatCounter <= booked, trip.id)}
          ${renderSeatButton(letter + '2', ++seatCounter <= booked, trip.id)}
        </div>
        <div class="text-[10px] text-slate-300 font-bold uppercase tracking-widest px-2">AISLE</div>
        <div class="flex items-center gap-2">
          ${renderSeatButton(letter + '3', ++seatCounter <= booked, trip.id)}
          ${renderSeatButton(letter + '4', ++seatCounter <= booked, trip.id)}
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h3 class="text-lg font-black text-slate-900">${trip.busNo} • ${trip.busName}</h3>
          <p class="text-xs text-slate-500">${counter.name} ➔ ${trip.destination} | ${trip.departureTime}</p>
        </div>
        <div class="text-right">
          <span class="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
            ${empty} খালি সিট (Available)
          </span>
        </div>
      </div>

      <div class="max-w-xs mx-auto bg-slate-50 border-2 border-slate-300 rounded-3xl p-4 shadow-inner">
        <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 text-xs font-bold text-slate-500">
          <span>Door</span>
          <span class="flex items-center gap-1.5"><svg class="w-4 h-4 text-indigo-600 inline" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v6m0 6v6m9-9h-6m-6 0H3"/></svg> Driver</span>
        </div>
        <div class="space-y-1">
          ${seatGridHTML}
        </div>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
}

function closeSeatModal() {
  const modal = document.getElementById('seatQuickModal');
  if (modal) modal.classList.add('hidden');
}

// Setup Event Listeners
function setupEventListeners() {
  // Mobile sidebar toggle
  const toggleBtn = document.getElementById('mobileSidebarToggle');
  const closeBtn = document.getElementById('closeMobileSidebar');
  const mobileSidebar = document.getElementById('mobileSidebar');

  if (toggleBtn && mobileSidebar) {
    toggleBtn.addEventListener('click', () => {
      mobileSidebar.classList.remove('hidden');
    });
  }

  if (closeBtn && mobileSidebar) {
    closeBtn.addEventListener('click', () => {
      mobileSidebar.classList.add('hidden');
    });
  }

  // Trip form submit
  const tripForm = document.getElementById('tripForm');
  if (tripForm) {
    tripForm.addEventListener('submit', handleTripFormSubmit);
  }
}

// Start Application on Load
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});
