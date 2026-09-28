/**
 * Dedicated Admin Supervision Dashboard Logic
 * Pure Super Admin Control Room for all 9 Terminals
 */

let adminState = {
  user: null,
  counters: [],
  trips: [],
  selectedCounterFilter: "all",
  searchQuery: "",
  activeTab: "overview",
  financeFilter: {
    counter: "all",
    type: "all",
    category: "all",
    search: ""
  }
};

function initAdminDashboard() {
  // Auth Check
  const token = localStorage.getItem('bus_auth_token');
  const savedUserStr = localStorage.getItem('bus_user_v1');

  if (!token || !savedUserStr) {
    window.location.href = "login.html";
    return;
  }

  try {
    adminState.user = JSON.parse(savedUserStr);
  } catch (e) {
    window.location.href = "login.html";
    return;
  }

  // If user is sales, redirect to sales dashboard
  if (adminState.user.role === 'sales') {
    window.location.href = "sales-dashboard.html";
    return;
  }

  // Load Data
  adminState.counters = getStoredData('bus_counters_v1', DEFAULT_COUNTERS);
  adminState.trips = getStoredData('bus_trips_v1', DEFAULT_TRIPS);

  // Render
  renderAdminHeader();
  renderAdminMetrics();
  renderAdminContent();
}

function adminLogout() {
  localStorage.removeItem('bus_auth_token');
  localStorage.removeItem('bus_user_v1');
  window.location.href = "login.html";
}

function switchAdminTab(tab) {
  adminState.activeTab = tab;
  updateAdminSidebarLinks();
  renderAdminContent();
}

function updateAdminSidebarLinks() {
  const tabs = document.querySelectorAll('[data-admin-tab]');
  tabs.forEach(btn => {
    const tabName = btn.getAttribute('data-admin-tab');
    if (tabName === adminState.activeTab) {
      btn.className = "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 text-white shadow-md shadow-indigo-200 transition";
    } else {
      btn.className = "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition";
    }
  });
}

function renderAdminHeader() {
  const userElem = document.getElementById('adminUserName');
  if (userElem) {
    userElem.textContent = adminState.user.name || "Super Admin";
  }
}

function computeOverallMetrics() {
  const trips = adminState.trips;
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

function renderAdminMetrics() {
  const metrics = computeOverallMetrics();
  const container = document.getElementById('adminMetricsRow');
  if (!container) return;

  container.innerHTML = `
    <!-- Metric 1: Total Fleet Today -->
    <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
      <div class="flex items-center justify-between">
        <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">সারাদেশের আজকের বাস</span>
        <span class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
          <i class="fas fa-bus-simple"></i>
        </span>
      </div>
      <div class="mt-2">
        <h3 class="text-2xl font-black text-slate-900">${metrics.totalBuses} টি বাস</h3>
        <div class="flex items-center gap-2 mt-1 text-xs">
          <span class="text-slate-600"><strong class="text-slate-900">${metrics.departedBuses}</strong> ছাড়া হয়েছে</span>
          <span class="text-slate-300">•</span>
          <span class="text-amber-600 font-semibold">${metrics.boardingBuses} বোর্ডিং</span>
          <span class="text-slate-300">•</span>
          <span class="text-indigo-600 font-semibold">${metrics.scheduledBuses} পরবর্তী</span>
        </div>
      </div>
    </div>

    <!-- Metric 2: 9 Terminals Online -->
    <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
      <div class="flex items-center justify-between">
        <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">টার্মিনাল নেটওয়ার্ক</span>
        <span class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
          <i class="fas fa-building-circle-check"></i>
        </span>
      </div>
      <div class="mt-2">
        <h3 class="text-2xl font-black text-slate-900">${adminState.counters.length} / 10 কাউন্টার</h3>
        <p class="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          সকল কাউন্টার ১০০% সক্রিয় রয়েছে
        </p>
      </div>
    </div>

    <!-- Metric 3: Vacant / Empty Seats -->
    <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
      <div class="flex items-center justify-between">
        <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">মোট খালি সিট (Available)</span>
        <span class="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg">
          <i class="fas fa-couch"></i>
        </span>
      </div>
      <div class="mt-2">
        <div class="flex items-baseline gap-2">
          <h3 class="text-2xl font-black text-purple-700">${metrics.emptySeats} সিট খালি</h3>
          <span class="text-xs font-semibold text-slate-400">/ ${metrics.totalSeats} মোট</span>
        </div>
        <div class="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden flex">
          <div class="bg-indigo-600 h-2" style="width: ${metrics.occupancyRate}%"></div>
          <div class="bg-emerald-400 h-2" style="width: ${100 - metrics.occupancyRate}%"></div>
        </div>
        <div class="flex justify-between text-xs text-slate-500 mt-1">
          <span>বুকড: <strong>${metrics.bookedSeats}</strong> (${metrics.occupancyRate}%)</span>
          <span class="text-emerald-700 font-bold">${metrics.emptySeats} বাকি</span>
        </div>
      </div>
    </div>

    <!-- Metric 4: Total Revenue -->
    <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
      <div class="flex items-center justify-between">
        <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">আজকের মোট কালেকশন</span>
        <span class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg">
          <i class="fas fa-bangladeshi-taka-sign"></i>
        </span>
      </div>
      <div class="mt-2">
        <h3 class="text-2xl font-black text-slate-900">৳ ${metrics.totalRevenue.toLocaleString()}</h3>
        <p class="text-xs text-slate-500 mt-1">
          ১০টি কাউন্টার থেকে সংগৃহীত মোট টিকেট আয়
        </p>
      </div>
    </div>
  `;
}

function renderAdminContent() {
  const container = document.getElementById('adminMainArea');
  if (!container) return;

  if (adminState.activeTab === 'overview') {
    container.innerHTML = `
      <div class="space-y-6">
        <!-- Live 10 Counters Grid -->
        <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 class="text-lg font-black text-slate-900 flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                ১০টি কাউন্টারের আজকের লাইভ বাস মনিটরিং (All 10 Terminals Live Audit)
              </h2>
              <p class="text-xs text-slate-500 mt-0.5">কোন কাউন্টার থেকে কখন কোন বাস যাচ্ছে এবং কতটি সিট খালি আছে তার লাইভ তালিকা</p>
            </div>
            <button onclick="switchAdminTab('trips')" class="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5">
              সব ট্রিপ টেবিল দেখুন <i class="fas fa-arrow-right"></i>
            </button>
          </div>

          <div id="adminCounterGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Populated below -->
          </div>
        </div>

        <!-- Today's Schedule Overview -->
        <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-black text-slate-900 flex items-center gap-2">
              <i class="fas fa-clock text-indigo-600"></i>
              সারাদেশের সাম্প্রতিক বাস শিডিউল ও সিট স্থিতি
            </h3>
            <span class="text-xs text-slate-400">রিয়েল-টাইম সিঙ্ক</span>
          </div>

          <div id="adminRecentTripsTable" class="overflow-x-auto">
            <!-- Populated below -->
          </div>
        </div>
      </div>
    `;

    renderAdminCounterCards();
    renderAdminTripsTable(adminState.trips.slice(0, 8), 'adminRecentTripsTable');

  } else if (adminState.activeTab === 'trips') {
    container.innerHTML = `
      <div class="space-y-6">
        <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 class="text-xl font-black text-slate-900 flex items-center gap-2">
                <i class="fas fa-bus-simple text-indigo-600"></i>
                সারাদেশের সকল বাস ট্রিপ ও খালি সিট অডিট (All Inter-District Trips)
              </h2>
              <p class="text-xs text-slate-500 mt-1">কাউন্টার অনুযায়ী ফিল্টার বা বাস নম্বর সার্চ করে সিট অবস্থা পর্যবেক্ষণ করুন।</p>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <select id="adminCounterFilterSelect" onchange="filterAdminTripsByCounter(this.value)" class="text-xs font-bold bg-slate-50 border border-slate-300 text-slate-700 rounded-xl px-3 py-2 outline-none focus:border-indigo-500">
                <option value="all" ${adminState.selectedCounterFilter === 'all' ? 'selected' : ''}>সব ১০টি কাউন্টার (All Counters)</option>
                ${adminState.counters.map(c => `
                  <option value="${c.id}" ${adminState.selectedCounterFilter == c.id ? 'selected' : ''}>${c.id}. ${c.name} (${c.city})</option>
                `).join('')}
              </select>

              <div class="relative w-64">
                <input 
                  type="text" 
                  id="adminSearchInput" 
                  oninput="handleAdminSearch(this.value)" 
                  value="${adminState.searchQuery}" 
                  placeholder="বাস নং বা গন্তব্য সার্চ..." 
                  class="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 text-slate-800"
                />
                <i class="fas fa-search absolute left-2.5 top-2.5 text-slate-400 text-xs"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div id="adminFullTripsTable" class="overflow-x-auto">
            <!-- Populated below -->
          </div>
        </div>
      </div>
    `;

    applyAdminTripFilters();

  } else if (adminState.activeTab === 'performance') {
    renderAdminPerformanceReport();
  } else if (adminState.activeTab === 'finance') {
    renderAdminFinanceModule();
  }
}

function renderAdminCounterCards() {
  const container = document.getElementById('adminCounterGrid');
  if (!container) return;

  const html = adminState.counters.map(counter => {
    const trips = adminState.trips.filter(t => t.fromCounterId === counter.id);
    const departed = trips.filter(t => t.status === 'Departed').length;
    const totalSeats = trips.reduce((sum, t) => sum + Number(t.totalSeats), 0);
    const bookedSeats = trips.reduce((sum, t) => sum + Number(t.bookedSeats), 0);
    const emptySeats = totalSeats - bookedSeats;
    const nextBus = trips.find(t => t.status !== 'Departed') || trips[trips.length - 1];

    return `
      <div class="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition bg-gradient-to-br from-white to-slate-50/60">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
              #${counter.id}
            </div>
            <div>
              <h4 class="text-sm font-bold text-slate-900 leading-tight">${counter.name}</h4>
              <span class="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <i class="fas fa-location-dot text-[10px]"></i> ${counter.city} • ${counter.code}
              </span>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
            ${trips.length} টি বাস
          </span>
        </div>

        <div class="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
          <div class="bg-white p-2 rounded-xl border border-slate-100">
            <span class="text-slate-400 text-[10px] uppercase font-bold block">Departed (ছেড়ে গেছে)</span>
            <span class="font-extrabold text-slate-800 text-sm">${departed} Buses</span>
          </div>
          <div class="bg-white p-2 rounded-xl border border-slate-100">
            <span class="text-slate-400 text-[10px] uppercase font-bold block">খালি সিট (Empty)</span>
            <span class="font-extrabold text-purple-700 text-sm">${emptySeats} Seats</span>
          </div>
        </div>

        ${nextBus ? `
          <div class="mt-2.5 bg-indigo-50/80 p-2 rounded-xl flex items-center justify-between text-[11px]">
            <span class="text-indigo-950 font-semibold truncate mr-2">
              <i class="fas fa-route text-indigo-500"></i> ${nextBus.destination}
            </span>
            <span class="bg-white text-indigo-700 font-bold px-2 py-0.5 rounded shadow-2xs whitespace-nowrap">
              ${nextBus.departureTime}
            </span>
          </div>
        ` : `
          <div class="mt-2.5 bg-slate-100 p-2 rounded-xl text-[11px] text-slate-400 text-center">
            কোনো বাস শিডিউল নেই
          </div>
        `}

        <div class="mt-3 flex items-center justify-between text-[11px]">
          <span class="text-slate-500">
            <i class="fas fa-user-tie text-slate-400"></i> ${counter.manager}
          </span>
          <button onclick="adminState.selectedCounterFilter = ${counter.id}; switchAdminTab('trips');" class="font-bold text-indigo-600 hover:text-indigo-800 hover:underline">
            বাস তালিকা →
          </button>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = html;
}

function renderAdminTripsTable(trips, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (trips.length === 0) {
    container.innerHTML = `<div class="p-8 text-center text-slate-400 text-xs">কোনো বাস তথ্য পাওয়া যায়নি।</div>`;
    return;
  }

  container.innerHTML = `
    <table class="w-full text-left text-sm text-slate-600 border-collapse">
      <thead>
        <tr class="text-[11px] uppercase font-extrabold text-slate-400 bg-slate-50 border-b border-slate-200">
          <th class="py-3 px-3">Bus No & Coach</th>
          <th class="py-3 px-3">Starting Counter</th>
          <th class="py-3 px-3">Destination (গন্তব্য)</th>
          <th class="py-3 px-3">Departure Time</th>
          <th class="py-3 px-3 text-center">Total Seats</th>
          <th class="py-3 px-3 text-center">Booked</th>
          <th class="py-3 px-3 text-center">Empty (খালি)</th>
          <th class="py-3 px-3">Status</th>
          <th class="py-3 px-3 text-right">Seat Plan</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
        ${trips.map(trip => {
          const counter = adminState.counters.find(c => c.id === trip.fromCounterId) || { name: 'Unknown' };
          const empty = Number(trip.totalSeats) - Number(trip.bookedSeats);

          let statusBadge = `bg-indigo-50 text-indigo-700 border-indigo-200`;
          if (trip.status === 'Departed') statusBadge = `bg-slate-100 text-slate-600 border-slate-200`;
          if (trip.status === 'Boarding') statusBadge = `bg-amber-100 text-amber-800 border-amber-300 animate-pulse`;

          return `
            <tr class="hover:bg-slate-50 transition">
              <td class="py-3 px-3">
                <div class="font-bold text-slate-900">${trip.busNo}</div>
                <div class="text-[11px] text-slate-400">${trip.busName} • ${trip.type}</div>
              </td>
              <td class="py-3 px-3">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                  <i class="fas fa-building text-[10px] text-slate-400"></i> ${counter.name}
                </span>
              </td>
              <td class="py-3 px-3 font-bold text-slate-800">
                ${trip.destination}
              </td>
              <td class="py-3 px-3 font-bold text-indigo-600">
                ${trip.departureTime}
              </td>
              <td class="py-3 px-3 text-center font-bold text-slate-700">
                ${trip.totalSeats}
              </td>
              <td class="py-3 px-3 text-center font-bold text-slate-500">
                ${trip.bookedSeats}
              </td>
              <td class="py-3 px-3 text-center">
                <span class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-black ${empty > 5 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
                  ${empty} খালি সিট
                </span>
              </td>
              <td class="py-3 px-3">
                <span class="px-2 py-0.5 rounded-full text-[11px] font-bold border ${statusBadge}">
                  ${trip.status}
                </span>
              </td>
              <td class="py-3 px-3 text-right">
                <button onclick="openAdminSeatMap('${trip.id}')" class="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-bold text-indigo-700 transition">
                  <i class="fas fa-couch mr-1"></i> সিট দেখুন
                </button>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
}

function filterAdminTripsByCounter(counterId) {
  adminState.selectedCounterFilter = counterId;
  applyAdminTripFilters();
}

function handleAdminSearch(val) {
  adminState.searchQuery = val.toLowerCase();
  applyAdminTripFilters();
}

function applyAdminTripFilters() {
  let list = [...adminState.trips];

  if (adminState.selectedCounterFilter !== 'all') {
    list = list.filter(t => t.fromCounterId === parseInt(adminState.selectedCounterFilter));
  }

  if (adminState.searchQuery.trim() !== '') {
    const q = adminState.searchQuery;
    list = list.filter(t => {
      const counter = adminState.counters.find(c => c.id === t.fromCounterId) || { name: '' };
      return t.busNo.toLowerCase().includes(q) ||
             t.busName.toLowerCase().includes(q) ||
             t.destination.toLowerCase().includes(q) ||
             counter.name.toLowerCase().includes(q);
    });
  }

  renderAdminTripsTable(list, 'adminFullTripsTable');
}

function openAdminSeatMap(tripId) {
  const trip = adminState.trips.find(t => t.id === tripId);
  if (!trip) return;

  const modal = document.getElementById('adminSeatModal');
  const content = document.getElementById('adminSeatModalContent');
  if (!modal || !content) return;

  const counter = adminState.counters.find(c => c.id === trip.fromCounterId) || { name: 'Unknown' };
  const total = Number(trip.totalSeats);
  const booked = Number(trip.bookedSeats);
  const empty = total - booked;

  const rows = Math.ceil(total / 4);
  const letters = ['A','B','C','D','E','F','G','H','I','J','K','L'];

  let grid = '';
  let seatNum = 0;

  for (let r = 0; r < rows; r++) {
    const letter = letters[r] || `R${r+1}`;
    grid += `
      <div class="flex items-center justify-between gap-4 py-1.5 border-b border-slate-100">
        <div class="flex items-center gap-2">
          ${renderAdminSeatPill(letter + '1', ++seatNum <= booked)}
          ${renderAdminSeatPill(letter + '2', ++seatNum <= booked)}
        </div>
        <div class="text-[9px] text-slate-300 font-bold uppercase tracking-widest px-1">AISLE</div>
        <div class="flex items-center gap-2">
          ${renderAdminSeatPill(letter + '3', ++seatNum <= booked)}
          ${renderAdminSeatPill(letter + '4', ++seatNum <= booked)}
        </div>
      </div>
    `;
  }

  content.innerHTML = `
    <div class="space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h4 class="text-base font-black text-slate-900">${trip.busNo} • ${trip.busName}</h4>
          <p class="text-xs text-slate-500">${counter.name} ➔ ${trip.destination} (${trip.departureTime})</p>
        </div>
        <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
          ${empty} খালি সিট
        </span>
      </div>

      <div class="flex items-center justify-center gap-6 text-xs font-bold text-slate-600">
        <span class="flex items-center gap-1.5"><span class="w-3.5 h-3.5 rounded bg-emerald-500 inline-block"></span> Available (${empty})</span>
        <span class="flex items-center gap-1.5"><span class="w-3.5 h-3.5 rounded bg-rose-500 inline-block"></span> Booked (${booked})</span>
      </div>

      <div class="max-w-xs mx-auto bg-slate-50 border-2 border-slate-300 rounded-3xl p-4">
        <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 text-xs font-bold text-slate-500">
          <span>Door</span>
          <span class="flex items-center gap-1"><svg class="w-4 h-4 text-indigo-600 inline" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v6m0 6v6m9-9h-6m-6 0H3"/></svg> Driver</span>
        </div>
        <div class="space-y-1">${grid}</div>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
}

function renderAdminSeatPill(seatName, isBooked) {
  const bg = isBooked ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white';
  return `
    <div class="w-9 h-9 rounded-lg text-xs font-bold flex items-center justify-center shadow-2xs ${bg}">
      ${seatName}
    </div>
  `;
}

function closeAdminSeatModal() {
  const modal = document.getElementById('adminSeatModal');
  if (modal) modal.classList.add('hidden');
}

function renderAdminPerformanceReport() {
  const container = document.getElementById('adminMainArea');
  if (!container) return;

  const rows = adminState.counters.map(counter => {
    const trips = adminState.trips.filter(t => t.fromCounterId === counter.id);
    const totalSeats = trips.reduce((sum, t) => sum + Number(t.totalSeats), 0);
    const bookedSeats = trips.reduce((sum, t) => sum + Number(t.bookedSeats), 0);
    const revenue = trips.reduce((sum, t) => sum + (Number(t.bookedSeats) * Number(t.fare)), 0);
    const occupancy = totalSeats > 0 ? Math.round((bookedSeats / totalSeats) * 100) : 0;

    return `
      <tr class="hover:bg-slate-50 transition">
        <td class="py-3 px-4 font-bold text-slate-900">#${counter.id}. ${counter.name}</td>
        <td class="py-3 px-4 text-xs text-slate-500">${counter.city}</td>
        <td class="py-3 px-4 text-xs font-semibold">${counter.manager} (${counter.phone})</td>
        <td class="py-3 px-4 text-center font-bold text-slate-800">${trips.length}</td>
        <td class="py-3 px-4 text-center font-bold text-indigo-700">${bookedSeats} / ${totalSeats} (${occupancy}%)</td>
        <td class="py-3 px-4 text-right font-black text-slate-900">৳ ${revenue.toLocaleString()}</td>
      </tr>
    `;
  }).join('');

  container.innerHTML = `
    <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 class="text-lg font-black text-slate-900">১০টি টার্মিনাল কালেকশন ও অকুপেন্সি রিপোর্ট</h3>
          <p class="text-xs text-slate-500">টার্মিনাল ভিত্তিক টিকেট বিক্রয় ও যাত্রীর হার</p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600">
          <thead>
            <tr class="text-[11px] uppercase font-extrabold text-slate-400 bg-slate-50 border-b border-slate-200">
              <th class="py-3 px-4">কাউন্টার নাম</th>
              <th class="py-3 px-4">শহর</th>
              <th class="py-3 px-4">ম্যানেজার</th>
              <th class="py-3 px-4 text-center">মোট বাস</th>
              <th class="py-3 px-4 text-center">সিট অকুপেন্সি</th>
              <th class="py-3 px-4 text-right">আয় (BDT)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${rows}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// MODULE 4: COMPANY INCOME & EXPENSE AUDIT
// -------------------------------------------------------------
function renderAdminFinanceModule() {
  const container = document.getElementById('adminMainArea');
  if (!container) return;

  const summary = calculateFinancialSummary();
  const allTxns = getStoredTransactions();

  // Apply filters
  const f = adminState.financeFilter;
  const filteredTxns = allTxns.filter(t => {
    if (f.counter !== 'all') {
      if (t.counterId !== parseInt(f.counter)) return false;
    }
    if (f.type !== 'all') {
      if (t.type !== f.type) return false;
    }
    if (f.category !== 'all') {
      if (t.category !== f.category) return false;
    }
    if (f.search) {
      const q = f.search.toLowerCase();
      const match = (t.voucherNo && t.voucherNo.toLowerCase().includes(q)) ||
                    (t.description && t.description.toLowerCase().includes(q)) ||
                    (t.busNo && t.busNo.toLowerCase().includes(q)) ||
                    (t.counterName && t.counterName.toLowerCase().includes(q)) ||
                    (t.recordedBy && t.recordedBy.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  // Calculate filtered totals
  const fIncome = filteredTxns.filter(t => t.type === 'Income').reduce((s, t) => s + Number(t.amount || 0), 0);
  const fExpense = filteredTxns.filter(t => t.type === 'Expense').reduce((s, t) => s + Number(t.amount || 0), 0);
  const fNet = fIncome - fExpense;

  // Counter comparison data
  const counterRows = [
    { id: 0, name: "সেন্ট্রাল হেডকোয়ার্টার (Central HQ)", city: "ঢাকা প্রধান কার্যালয়" },
    ...adminState.counters
  ].map(c => {
    const cTxns = allTxns.filter(t => t.counterId === c.id);
    const inc = cTxns.filter(t => t.type === 'Income').reduce((s, t) => s + Number(t.amount || 0), 0);
    const exp = cTxns.filter(t => t.type === 'Expense').reduce((s, t) => s + Number(t.amount || 0), 0);
    const net = inc - exp;
    const isProfit = net >= 0;

    return `
      <tr class="hover:bg-slate-50 transition">
        <td class="py-3 px-4">
          <div class="font-bold text-slate-900">${c.name}</div>
          <div class="text-[11px] text-slate-400">${c.city || ''}</div>
        </td>
        <td class="py-3 px-4 text-center">
          <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            ${cTxns.length} টি ভাউচার
          </span>
        </td>
        <td class="py-3 px-4 text-right font-bold text-emerald-600">
          ৳ ${inc.toLocaleString()}
        </td>
        <td class="py-3 px-4 text-right font-bold text-rose-600">
          ৳ ${exp.toLocaleString()}
        </td>
        <td class="py-3 px-4 text-right">
          <span class="inline-flex items-center gap-1 font-black ${isProfit ? 'text-indigo-600' : 'text-amber-600'}">
            ${isProfit ? '+' : ''}৳ ${net.toLocaleString()}
          </span>
        </td>
        <td class="py-3 px-4 text-center">
          <button 
            onclick="adminState.financeFilter.counter = '${c.id}'; renderAdminFinanceModule();"
            class="text-[11px] font-bold text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition"
          >
            অডিট দেখুন
          </button>
        </td>
      </tr>
    `;
  }).join('');

  // Transactions rows
  const txnRows = filteredTxns.length === 0 ? `
    <tr>
      <td colspan="8" class="text-center py-10 text-slate-400 text-xs">
        <i class="fas fa-receipt text-3xl mb-2 text-slate-300 block"></i>
        কোনো লেনদেন রেকর্ড পাওয়া যায়নি।
      </td>
    </tr>
  ` : filteredTxns.map(t => {
    const isIncome = t.type === 'Income';
    return `
      <tr class="hover:bg-slate-50/80 transition text-xs">
        <td class="py-3 px-4 font-mono font-bold text-slate-800">
          <div>${t.voucherNo || t.id}</div>
          <div class="text-[10px] text-slate-400 font-sans">${t.date} ${t.time || ''}</div>
        </td>
        <td class="py-3 px-4 font-medium text-slate-700">
          <span class="px-2 py-0.5 rounded-md font-bold text-[10px] ${t.counterId === 0 ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}">
            ${t.counterName || 'কাউন্টার'}
          </span>
        </td>
        <td class="py-3 px-4">
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${isIncome ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-rose-100 text-rose-800 border border-rose-200'}">
            <i class="fas ${isIncome ? 'fa-arrow-down' : 'fa-arrow-up'}"></i>
            ${isIncome ? 'আয় (Credit)' : 'ব্যয় (Debit)'}
          </span>
        </td>
        <td class="py-3 px-4 font-semibold text-slate-800">
          ${t.category}
          ${t.busNo && t.busNo !== 'N/A' ? `<span class="block text-[10px] text-slate-400 font-mono mt-0.5"><i class="fas fa-bus mr-1"></i>${t.busNo}</span>` : ''}
        </td>
        <td class="py-3 px-4 text-slate-600 max-w-xs">
          <p class="truncate" title="${t.description}">${t.description}</p>
          <span class="text-[10px] text-slate-400 font-medium">পদ্ধতি: ${t.paymentMethod || 'Cash'}</span>
        </td>
        <td class="py-3 px-4 text-right font-black text-sm ${isIncome ? 'text-emerald-700' : 'text-rose-700'}">
          ${isIncome ? '+' : '-'} ৳ ${Number(t.amount).toLocaleString()}
        </td>
        <td class="py-3 px-4 text-slate-500 text-[11px]">
          <i class="fas fa-user-pen mr-1 text-slate-400"></i> ${t.recordedBy || 'Admin'}
        </td>
        <td class="py-3 px-4 text-center">
          <button 
            onclick="deleteAdminTxn('${t.id}')"
            title="ভাউচার মুছুন"
            class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition inline-flex items-center justify-center text-xs"
          >
            <i class="fas fa-trash-can"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  container.innerHTML = `
    <div class="space-y-6">
      
      <!-- Top Header Card -->
      <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-black text-slate-900 flex items-center gap-2">
            <i class="fas fa-coins text-amber-500"></i>
            কোম্পানি সার্বিক আয় ও ব্যয় অডিট (Company Financial & Cashflow Audit)
          </h2>
          <p class="text-xs text-slate-500 mt-1">
            ১০টি কাউন্টার ও সেন্ট্রাল হেডকোয়ার্টারের টিকেট সেলস, ফুয়েল স্লিপ, টোল ও অপারেটিং খরচের পূর্ণ হিসাব
          </p>
        </div>

        <div class="flex items-center gap-2 self-start sm:self-auto">
          <button 
            onclick="printAdminFinanceReport()" 
            class="px-3.5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50 hover:bg-slate-100 text-xs font-bold transition flex items-center gap-1.5"
          >
            <i class="fas fa-print"></i> অডিট প্রিন্ট
          </button>
          <button 
            onclick="openAdminTxnModal()" 
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition flex items-center gap-2"
          >
            <i class="fas fa-plus"></i> নতুন আয়/ব্যয় ভাউচার
          </button>
        </div>
      </div>

      <!-- Financial Metrics Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div class="flex items-center justify-between text-slate-400">
            <span class="text-[11px] font-bold uppercase tracking-wider">মোট রাজস্ব আয় (Revenue)</span>
            <span class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm"><i class="fas fa-arrow-trend-up"></i></span>
          </div>
          <div class="mt-2">
            <h3 class="text-2xl font-black text-emerald-700">৳ ${summary.totalIncome.toLocaleString()}</h3>
            <p class="text-[11px] text-slate-500 mt-0.5">${summary.incomeCount} টি কালেকশন রসিদ</p>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div class="flex items-center justify-between text-slate-400">
            <span class="text-[11px] font-bold uppercase tracking-wider">মোট পরিচালন ব্যয় (Expense)</span>
            <span class="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-sm"><i class="fas fa-arrow-trend-down"></i></span>
          </div>
          <div class="mt-2">
            <h3 class="text-2xl font-black text-rose-700">৳ ${summary.totalExpense.toLocaleString()}</h3>
            <p class="text-[11px] text-slate-500 mt-0.5">ফুয়েল, টোল, খোরাকি ও অফিস ব্যয়</p>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div class="flex items-center justify-between text-slate-400">
            <span class="text-[11px] font-bold uppercase tracking-wider">সার্বিক নীট মুনাফা (Net Profit)</span>
            <span class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm"><i class="fas fa-wallet"></i></span>
          </div>
          <div class="mt-2">
            <h3 class="text-2xl font-black text-indigo-700">৳ ${summary.netProfit.toLocaleString()}</h3>
            <p class="text-[11px] text-emerald-600 font-bold mt-0.5 flex items-center gap-1">
              <i class="fas fa-circle-check"></i> প্রফিট মার্জিন: ${summary.margin}%
            </p>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div class="flex items-center justify-between text-slate-400">
            <span class="text-[11px] font-bold uppercase tracking-wider">বর্তমান ফিল্টার স্থিতি</span>
            <span class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-sm"><i class="fas fa-filter"></i></span>
          </div>
          <div class="mt-2">
            <h3 class="text-2xl font-black text-slate-900">${filteredTxns.length} টি ভাউচার</h3>
            <p class="text-[11px] text-slate-500 mt-0.5">
              ফিল্টার্ড ব্যালেন্স: <strong class="${fNet >= 0 ? 'text-indigo-600' : 'text-amber-600'}">৳ ${fNet.toLocaleString()}</strong>
            </p>
          </div>
        </div>

      </div>

      <!-- Counter-wise Profitability Table -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <h3 class="text-sm font-black text-slate-900 flex items-center gap-2">
              <i class="fas fa-building-columns text-indigo-600"></i>
              ১০টি কাউন্টার ও হেডকোয়ার্টার ভিত্তিক প্রফিট্যাবিলিটি সামারি
            </h3>
            <p class="text-xs text-slate-500">কোন কাউন্টার কত টাকা রাজস্ব সংগ্রহ করেছে এবং কত খরচ হয়েছে</p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="text-[11px] uppercase font-bold text-slate-400 bg-slate-50 border-b border-slate-200">
                <th class="py-2.5 px-4">শাখা / কাউন্টার</th>
                <th class="py-2.5 px-4 text-center">ভাউচার সংখ্যা</th>
                <th class="py-2.5 px-4 text-right">মোট আয় (Inflow)</th>
                <th class="py-2.5 px-4 text-right">মোট ব্যয় (Outflow)</th>
                <th class="py-2.5 px-4 text-right">নীট স্থিতি (Net Cash)</th>
                <th class="py-2.5 px-4 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${counterRows}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Filter Controls Bar -->
      <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-2 flex-1">
          
          <!-- Search -->
          <div class="relative min-w-[200px] flex-1 sm:flex-none">
            <i class="fas fa-search absolute left-3 top-2.5 text-slate-400 text-xs"></i>
            <input 
              type="text" 
              placeholder="ভাউচার, বিবরণ বা বাস নং..." 
              value="${f.search}"
              oninput="adminState.financeFilter.search = this.value; renderAdminFinanceModule();"
              class="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600"
            />
          </div>

          <!-- Type Filter -->
          <select 
            onchange="adminState.financeFilter.type = this.value; renderAdminFinanceModule();"
            class="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold outline-none text-slate-700"
          >
            <option value="all" ${f.type === 'all' ? 'selected' : ''}>সকল ধরণ (All Types)</option>
            <option value="Income" ${f.type === 'Income' ? 'selected' : ''}>শুধু আয় (Income)</option>
            <option value="Expense" ${f.type === 'Expense' ? 'selected' : ''}>শুধু ব্যয় (Expense)</option>
          </select>

          <!-- Counter Filter -->
          <select 
            onchange="adminState.financeFilter.counter = this.value; renderAdminFinanceModule();"
            class="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-semibold outline-none text-slate-700"
          >
            <option value="all" ${f.counter === 'all' ? 'selected' : ''}>সকল শাখা / কাউন্টার (১০টি)</option>
            <option value="0" ${f.counter === '0' ? 'selected' : ''}>সেন্ট্রাল হেডকোয়ার্টার (HQ)</option>
            ${adminState.counters.map(c => `
              <option value="${c.id}" ${f.counter === String(c.id) ? 'selected' : ''}>${c.id}. ${c.name}</option>
            `).join('')}
          </select>

          <!-- Category Filter -->
          <select 
            onchange="adminState.financeFilter.category = this.value; renderAdminFinanceModule();"
            class="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-semibold outline-none text-slate-700 max-w-[180px]"
          >
            <option value="all" ${f.category === 'all' ? 'selected' : ''}>সকল খাত (Categories)</option>
            <optgroup label="আয়ের খাত সমূহ">
              ${INCOME_CATEGORIES.map(cat => `<option value="${cat}" ${f.category === cat ? 'selected' : ''}>${cat}</option>`).join('')}
            </optgroup>
            <optgroup label="ব্যয়ের খাত সমূহ">
              ${EXPENSE_CATEGORIES.map(cat => `<option value="${cat}" ${f.category === cat ? 'selected' : ''}>${cat}</option>`).join('')}
            </optgroup>
          </select>

          <!-- Reset Filter -->
          ${(f.counter !== 'all' || f.type !== 'all' || f.category !== 'all' || f.search) ? `
            <button 
              onclick="adminState.financeFilter = { counter: 'all', type: 'all', category: 'all', search: '' }; renderAdminFinanceModule();"
              class="px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-bold transition flex items-center gap-1"
            >
              <i class="fas fa-rotate-left"></i> রিসেট
            </button>
          ` : ''}

        </div>

        <div class="text-xs font-bold text-slate-500 whitespace-nowrap">
          মোট রেকর্ড: <span class="text-indigo-600">${filteredTxns.length}</span> টি
        </div>
      </div>

      <!-- Transaction Audit Ledger Table -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 class="text-sm font-black text-slate-900 flex items-center gap-2">
            <i class="fas fa-file-invoice-dollar text-indigo-600"></i>
            সারাদেশের আয়-ব্যয় লেনদেন অডিট লেজার (Audit General Ledger)
          </h3>
          <span class="text-xs text-slate-400">সর্বশেষ আপডেট: আজকের লাইভ ট্রানজেকশন</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="text-[11px] uppercase font-extrabold text-slate-400 bg-slate-50 border-b border-slate-200">
                <th class="py-3 px-4">ভাউচার ও সময়</th>
                <th class="py-3 px-4">কাউন্টার / শাখা</th>
                <th class="py-3 px-4">ধরণ</th>
                <th class="py-3 px-4">খাত ও বাস নং</th>
                <th class="py-3 px-4">বিবরণ ও মাধ্যম</th>
                <th class="py-3 px-4 text-right">টাকা (BDT)</th>
                <th class="py-3 px-4">এন্ট্রি প্রদানকারী</th>
                <th class="py-3 px-4 text-center">মুছুন</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${txnRows}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

function openAdminTxnModal() {
  const modal = document.getElementById('adminTxnModal');
  if (!modal) return;

  const voucherInput = document.getElementById('adminTxnVoucher');
  if (voucherInput) {
    voucherInput.value = `VR-${Math.floor(100 + Math.random() * 900)}`;
  }

  onAdminTxnTypeChange();
  modal.classList.remove('hidden');
}

function closeAdminTxnModal() {
  const modal = document.getElementById('adminTxnModal');
  if (modal) modal.classList.add('hidden');
}

function onAdminTxnTypeChange() {
  const typeSelect = document.getElementById('adminTxnType');
  const catSelect = document.getElementById('adminTxnCategory');
  if (!typeSelect || !catSelect) return;

  const isIncome = typeSelect.value === 'Income';
  const categories = isIncome ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  catSelect.innerHTML = categories.map(c => `
    <option value="${c}">${c}</option>
  `).join('');
}

function handleAdminTxnSubmit(e) {
  e.preventDefault();

  const type = document.getElementById('adminTxnType').value;
  const voucherNo = document.getElementById('adminTxnVoucher').value.trim();
  const counterId = parseInt(document.getElementById('adminTxnCounter').value);
  const category = document.getElementById('adminTxnCategory').value;
  const amount = parseFloat(document.getElementById('adminTxnAmount').value) || 0;
  const paymentMethod = document.getElementById('adminTxnPaymentMethod').value;
  const busNo = document.getElementById('adminTxnBusNo').value.trim() || 'N/A';
  const description = document.getElementById('adminTxnDescription').value.trim();

  let counterName = "সেন্ট্রাল হেডকোয়ার্টার (Central HQ)";
  if (counterId > 0) {
    const counterObj = adminState.counters.find(c => c.id === counterId);
    if (counterObj) counterName = counterObj.name;
  }

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newTxn = {
    id: `TXN-${Date.now().toString().slice(-6)}`,
    date: "2026-09-28",
    time: timeStr,
    type,
    category,
    counterId,
    counterName,
    busNo,
    voucherNo,
    amount,
    paymentMethod,
    description,
    recordedBy: adminState.user.name || "Super Admin HQ"
  };

  saveStoredTransaction(newTxn);
  closeAdminTxnModal();
  renderAdminMetrics();
  renderAdminFinanceModule();
  alert(`ভাউচার ${voucherNo} সফলভাবে সংরক্ষিত হয়েছে!`);
}

function deleteAdminTxn(id) {
  if (confirm("আপনি কি নিশ্চিতভাবে এই লেনদেন ভাউচারটি মুছে ফেলতে চান?")) {
    deleteStoredTransaction(id);
    renderAdminMetrics();
    renderAdminFinanceModule();
  }
}

function printAdminFinanceReport() {
  window.print();
}

// Start
document.addEventListener('DOMContentLoaded', () => {
  initAdminDashboard();
});
