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
  activeTab: "overview"
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

// Start
document.addEventListener('DOMContentLoaded', () => {
  initAdminDashboard();
});
