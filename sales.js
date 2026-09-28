/**
 * Dedicated Counter Sales Dashboard Logic
 * Focused purely on Counter Ticketing, Bus CRUD, and Passenger Booking
 */

let salesState = {
  user: null,
  activeCounter: null,
  activeTab: "trips", // 'overview', 'trips', 'booking', 'tickets', 'cashbook'
  counters: [],
  trips: [],
  selectedBusForBooking: null,
  bookedTickets: [],
  searchQuery: "",
  cashbookFilter: {
    type: "all",
    search: ""
  }
};

function initSalesDashboard() {
  const token = localStorage.getItem('bus_auth_token');
  const savedUserStr = localStorage.getItem('bus_user_v1');

  if (!token || !savedUserStr) {
    window.location.href = "login.html";
    return;
  }

  try {
    salesState.user = JSON.parse(savedUserStr);
  } catch (e) {
    window.location.href = "login.html";
    return;
  }

  // Load Data
  salesState.counters = getStoredData('bus_counters_v1', DEFAULT_COUNTERS);
  salesState.trips = getStoredData('bus_trips_v1', DEFAULT_TRIPS);
  salesState.bookedTickets = getStoredData('bus_tickets_v1', [
    { id: 'TKT-9912', busId: 'TRIP-102', busNo: 'DM-BA-12-8821', counterId: 2, seatNo: 'A1', passengerName: 'Tanvir Rahman', phone: '01712-334455', fare: 1800, bookingTime: '08:00 AM' },
    { id: 'TKT-9913', busId: 'TRIP-102', busNo: 'DM-BA-12-8821', counterId: 2, seatNo: 'A2', passengerName: 'Nusrat Jahan', phone: '01819-778899', fare: 1800, bookingTime: '08:10 AM' }
  ]);

  // Set active counter (default to user's assigned counterId, fallback to 2 Sayedabad)
  const defaultCounterId = salesState.user.counterId || 2;
  salesState.activeCounter = salesState.counters.find(c => c.id === defaultCounterId) || salesState.counters[0];

  renderSalesHeader();
  renderSalesSidebarCounterInfo();
  renderSalesContent();
}

function salesLogout() {
  localStorage.removeItem('bus_auth_token');
  localStorage.removeItem('bus_user_v1');
  window.location.href = "login.html";
}

function switchSalesTab(tab) {
  salesState.activeTab = tab;
  updateSalesSidebarLinks();
  renderSalesContent();
}

function updateSalesSidebarLinks() {
  const tabs = document.querySelectorAll('[data-sales-tab]');
  tabs.forEach(btn => {
    const tabName = btn.getAttribute('data-sales-tab');
    if (tabName === salesState.activeTab) {
      btn.className = "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs bg-amber-600 text-white shadow-md shadow-amber-200 transition";
    } else {
      btn.className = "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition";
    }
  });
}

function switchActiveCounter(counterId) {
  const counter = salesState.counters.find(c => c.id === parseInt(counterId));
  if (counter) {
    salesState.activeCounter = counter;
    salesState.selectedBusForBooking = null;
    showToast(`কাউন্টার পরিবর্তন করা হয়েছে: ${counter.name}`, 'info');
    renderSalesHeader();
    renderSalesSidebarCounterInfo();
    renderSalesContent();
  }
}

function renderSalesHeader() {
  const counterTitle = document.getElementById('salesCounterTitle');
  const counterCode = document.getElementById('salesCounterCode');
  const officerName = document.getElementById('salesOfficerName');
  const switcher = document.getElementById('salesCounterSwitcher');

  if (counterTitle && salesState.activeCounter) {
    counterTitle.textContent = salesState.activeCounter.name;
  }
  if (counterCode && salesState.activeCounter) {
    counterCode.textContent = salesState.activeCounter.code;
  }
  if (officerName) {
    officerName.textContent = salesState.user.name || salesState.activeCounter.manager;
  }
  if (switcher && salesState.activeCounter) {
    switcher.value = salesState.activeCounter.id;
  }
}

function renderSalesSidebarCounterInfo() {
  const container = document.getElementById('sidebarCounterCard');
  if (!container || !salesState.activeCounter) return;

  const counter = salesState.activeCounter;
  container.innerHTML = `
    <div class="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/10 border border-amber-200 rounded-2xl p-3.5 text-xs">
      <div class="flex items-center gap-2 mb-2">
        <div class="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
          #${counter.id}
        </div>
        <div>
          <h4 class="font-black text-amber-950 text-xs">${counter.name}</h4>
          <span class="text-[10px] text-amber-800">${counter.city} • ${counter.code}</span>
        </div>
      </div>
      <p class="text-[11px] text-slate-600 mb-1">
        <i class="fas fa-location-dot text-amber-600 mr-1"></i> ${counter.location}
      </p>
      <p class="text-[11px] text-slate-600">
        <i class="fas fa-phone text-amber-600 mr-1"></i> <strong>${counter.phone}</strong>
      </p>
    </div>
  `;
}

function computeCounterMetrics() {
  const counterId = salesState.activeCounter.id;
  const myTrips = salesState.trips.filter(t => t.fromCounterId === counterId);
  const myTickets = salesState.bookedTickets.filter(t => t.counterId === counterId);

  const totalBuses = myTrips.length;
  const totalCapacity = myTrips.reduce((sum, t) => sum + Number(t.totalSeats), 0);
  const totalBooked = myTrips.reduce((sum, t) => sum + Number(t.bookedSeats), 0);
  const emptySeats = totalCapacity - totalBooked;

  const revenue = myTrips.reduce((sum, t) => sum + (Number(t.bookedSeats) * Number(t.fare)), 0);

  return {
    totalBuses,
    totalBooked,
    emptySeats,
    totalCapacity,
    revenue,
    ticketCount: myTickets.length
  };
}

function renderSalesContent() {
  const container = document.getElementById('salesMainArea');
  if (!container) return;

  const metrics = computeCounterMetrics();

  // Top Metrics Header
  let metricsHTML = `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">এই কাউন্টারের বাস</span>
        <div class="flex items-baseline justify-between mt-1">
          <h3 class="text-2xl font-black text-slate-900">${metrics.totalBuses} টি বাস</h3>
          <span class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm"><i class="fas fa-bus"></i></span>
        </div>
        <p class="text-[11px] text-slate-500 mt-1">আজকের নির্ধারিত ট্রিপ</p>
      </div>

      <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">বিক্রিত মোট টিকেট</span>
        <div class="flex items-baseline justify-between mt-1">
          <h3 class="text-2xl font-black text-slate-900">${metrics.totalBooked} সিট</h3>
          <span class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm"><i class="fas fa-ticket"></i></span>
        </div>
        <p class="text-[11px] text-emerald-600 font-semibold mt-1">কনফার্মড যাত্রী সংখ্যা</p>
      </div>

      <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">খালি সিট বাকি (Available)</span>
        <div class="flex items-baseline justify-between mt-1">
          <h3 class="text-2xl font-black text-purple-700">${metrics.emptySeats} সিট খালি</h3>
          <span class="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-sm"><i class="fas fa-couch"></i></span>
        </div>
        <p class="text-[11px] text-purple-600 font-semibold mt-1">এখনও টিকেট দেওয়া যাবে</p>
      </div>

      <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">কাউন্টার কালেকশন (আজকের)</span>
        <div class="flex items-baseline justify-between mt-1">
          <h3 class="text-2xl font-black text-slate-900">৳ ${metrics.revenue.toLocaleString()}</h3>
          <span class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-sm"><i class="fas fa-bangladeshi-taka-sign"></i></span>
        </div>
        <p class="text-[11px] text-slate-500 mt-1">মোট ক্যাশ সংগ্রহ</p>
      </div>
    </div>
  `;

  if (salesState.activeTab === 'trips') {
    container.innerHTML = metricsHTML + getSalesTripsCRUDHTML();
    renderSalesTripsTable();
  } else if (salesState.activeTab === 'booking') {
    container.innerHTML = metricsHTML + getSalesBookingHTML();
    renderBookingBusSelector();
  } else if (salesState.activeTab === 'manifest') {
    container.innerHTML = metricsHTML + getSalesManifestHTML();
  } else if (salesState.activeTab === 'cashbook') {
    container.innerHTML = metricsHTML + getSalesCashbookHTML();
  }
}

// -------------------------------------------------------------
// MODULE 1: BUS TRIPS CRUD (Add / Edit / Delete)
// -------------------------------------------------------------
function getSalesTripsCRUDHTML() {
  return `
    <div class="space-y-6">
      <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-lg font-black text-slate-900 flex items-center gap-2">
              <i class="fas fa-bus-simple text-amber-600"></i>
              ${salesState.activeCounter.name}-এর বাস ট্রিপ ও শিডিউল ম্যানেজমেন্ট
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">
              এই কাউন্টারের জন্য নতুন বাস শিডিউল যোগ করুন, তথ্য পরিবর্তন বা বাতিল করুন।
            </p>
          </div>

          <button 
            onclick="openSalesTripModal()" 
            class="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-200 transition flex items-center gap-2 self-start sm:self-auto"
          >
            <i class="fas fa-plus"></i> নতুন বাস ট্রিপ যোগ করুন (Add Bus)
          </button>
        </div>
      </div>

      <!-- Table Card -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div id="salesTripsTableWrapper" class="overflow-x-auto">
          <!-- Injected below -->
        </div>
      </div>
    </div>
  `;
}

function renderSalesTripsTable() {
  const container = document.getElementById('salesTripsTableWrapper');
  if (!container) return;

  const counterId = salesState.activeCounter.id;
  const trips = salesState.trips.filter(t => t.fromCounterId === counterId);

  if (trips.length === 0) {
    container.innerHTML = `
      <div class="p-10 text-center text-slate-400">
        <i class="fas fa-bus text-4xl mb-2 text-slate-300"></i>
        <p class="font-bold text-slate-600 text-sm">এই কাউন্টারে বর্তমানে কোনো বাস নির্ধারিত নেই।</p>
        <button onclick="openSalesTripModal()" class="mt-3 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-bold">
          + এখনই বাস ট্রিপ যোগ করুন
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <table class="w-full text-left text-sm text-slate-600 border-collapse">
      <thead>
        <tr class="text-[11px] uppercase font-extrabold text-slate-400 bg-slate-50 border-b border-slate-200">
          <th class="py-3 px-4">বাস নাম্বার ও মডেল</th>
          <th class="py-3 px-4">গন্তব্য (Destination)</th>
          <th class="py-3 px-4">ছাড়ার সময়</th>
          <th class="py-3 px-4">ড্রাইভার ও ফোন</th>
          <th class="py-3 px-4 text-center">সিট বুকড</th>
          <th class="py-3 px-4 text-center">খালি সিট</th>
          <th class="py-3 px-4">ভাড়া (BDT)</th>
          <th class="py-3 px-4">স্ট্যাটাস</th>
          <th class="py-3 px-4 text-right">অ্যাকশন (Actions)</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
        ${trips.map(trip => {
          const empty = Number(trip.totalSeats) - Number(trip.bookedSeats);
          let badge = 'bg-indigo-50 text-indigo-700 border-indigo-200';
          if (trip.status === 'Departed') badge = 'bg-slate-100 text-slate-600 border-slate-200';
          if (trip.status === 'Boarding') badge = 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse';

          return `
            <tr class="hover:bg-slate-50 transition">
              <td class="py-3 px-4">
                <span class="font-bold text-slate-900 block">${trip.busNo}</span>
                <span class="text-[11px] text-slate-400">${trip.busName} • <strong class="text-indigo-600">${trip.type}</strong></span>
              </td>
              <td class="py-3 px-4 font-bold text-slate-800">
                <i class="fas fa-location-arrow text-xs text-amber-500 mr-1"></i> ${trip.destination}
              </td>
              <td class="py-3 px-4 font-black text-amber-700">
                ${trip.departureTime}
              </td>
              <td class="py-3 px-4 text-xs">
                <div class="font-semibold text-slate-800">${trip.driverName || 'ড্রাইভার নির্ধারিত'}</div>
                <div class="text-[11px] text-slate-400">${trip.contact || 'N/A'}</div>
              </td>
              <td class="py-3 px-4 text-center font-bold text-slate-600">
                ${trip.bookedSeats} / ${trip.totalSeats}
              </td>
              <td class="py-3 px-4 text-center">
                <span class="px-2.5 py-0.5 rounded-full text-xs font-black ${empty > 5 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
                  ${empty} খালি সিট
                </span>
              </td>
              <td class="py-3 px-4 font-bold text-slate-900">
                ৳ ${trip.fare}
              </td>
              <td class="py-3 px-4">
                <span class="px-2 py-0.5 rounded-full text-[11px] font-bold border ${badge}">
                  ${trip.status}
                </span>
              </td>
              <td class="py-3 px-4 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <button onclick="startBookingForBus('${trip.id}')" title="টিকেট বুক করুন" class="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-700 transition">
                    <i class="fas fa-ticket mr-1"></i> বুকিং
                  </button>
                  <button onclick="openSalesTripModal('${trip.id}')" title="এডিট করুন" class="p-1.5 text-xs rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700">
                    <i class="fas fa-pen-to-square"></i>
                  </button>
                  <button onclick="deleteSalesTrip('${trip.id}')" title="মুছে ফেলুন" class="p-1.5 text-xs rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700">
                    <i class="fas fa-trash-can"></i>
                  </button>
                </div>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
}

// -------------------------------------------------------------
// MODULE 2: LIVE SEAT BOOKING & TICKETING
// -------------------------------------------------------------
function getSalesBookingHTML() {
  return `
    <div class="space-y-6">
      <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 class="text-lg font-black text-slate-900 flex items-center gap-2">
              <i class="fas fa-couch text-amber-600"></i>
              লাইভ সিট প্ল্যান ও টিকেট বুকিং কাউন্টার
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">বাস সিলেক্ট করে সরাসরি সিটে ক্লিক করে টিকেট ইস্যু করুন।</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Bus Chooser -->
        <div class="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">এই কাউন্টারের বাস নির্বাচন করুন:</h3>
          <div id="bookingBusList" class="space-y-2 max-h-[500px] overflow-y-auto pr-1"></div>
        </div>

        <!-- Seating & Booking Plan -->
        <div class="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div id="bookingSeatPlanContainer"></div>
        </div>
      </div>
    </div>
  `;
}

function startBookingForBus(tripId) {
  salesState.selectedBusForBooking = tripId;
  switchSalesTab('booking');
}

function renderBookingBusSelector() {
  const container = document.getElementById('bookingBusList');
  if (!container) return;

  const counterId = salesState.activeCounter.id;
  const myTrips = salesState.trips.filter(t => t.fromCounterId === counterId);

  if (myTrips.length === 0) {
    container.innerHTML = `<div class="p-4 text-xs text-slate-400">কোনো বাস নেই।</div>`;
    return;
  }

  if (!salesState.selectedBusForBooking && myTrips.length > 0) {
    salesState.selectedBusForBooking = myTrips[0].id;
  }

  container.innerHTML = myTrips.map(trip => {
    const isSelected = trip.id === salesState.selectedBusForBooking;
    const empty = Number(trip.totalSeats) - Number(trip.bookedSeats);

    return `
      <div 
        onclick="selectBusForBooking('${trip.id}')"
        class="p-3 rounded-xl border cursor-pointer transition ${isSelected ? 'border-amber-600 bg-amber-50/70 ring-2 ring-amber-500/20' : 'border-slate-200 hover:border-amber-300 hover:bg-slate-50'}"
      >
        <div class="flex items-center justify-between">
          <span class="font-bold text-xs text-slate-900">${trip.busNo}</span>
          <span class="text-xs font-black text-amber-700">${trip.departureTime}</span>
        </div>
        <p class="text-[11px] text-slate-500 font-medium mt-1 truncate">${trip.busName}</p>
        <div class="flex items-center justify-between text-[11px] mt-2">
          <span class="text-slate-600"><i class="fas fa-route text-amber-600"></i> ${trip.destination}</span>
          <span class="font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">${empty} খালি সিট</span>
        </div>
      </div>
    `;
  }).join('');

  renderActiveBusBookingSeats();
}

function selectBusForBooking(tripId) {
  salesState.selectedBusForBooking = tripId;
  renderBookingBusSelector();
}

function renderActiveBusBookingSeats() {
  const container = document.getElementById('bookingSeatPlanContainer');
  if (!container) return;

  const trip = salesState.trips.find(t => t.id === salesState.selectedBusForBooking);
  if (!trip) {
    container.innerHTML = `<div class="p-8 text-center text-slate-400 text-xs">দয়া করে বাম পাশ থেকে একটি বাস সিলেক্ট করুন।</div>`;
    return;
  }

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
          ${renderInteractiveSeatBtn(letter + '1', ++seatNum <= booked, trip.id)}
          ${renderInteractiveSeatBtn(letter + '2', ++seatNum <= booked, trip.id)}
        </div>
        <div class="text-[10px] text-slate-300 font-bold uppercase tracking-widest px-2">AISLE</div>
        <div class="flex items-center gap-2">
          ${renderInteractiveSeatBtn(letter + '3', ++seatNum <= booked, trip.id)}
          ${renderInteractiveSeatBtn(letter + '4', ++seatNum <= booked, trip.id)}
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div>
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 class="text-base font-black text-slate-900">${trip.busNo} • ${trip.busName}</h3>
          <p class="text-xs text-slate-500">${salesState.activeCounter.name} ➔ ${trip.destination} | সময়: ${trip.departureTime}</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="text-right">
            <span class="text-[10px] uppercase font-bold text-slate-400 block">টিকেট ভাড়া</span>
            <span class="text-base font-black text-slate-900">৳ ${trip.fare}</span>
          </div>
          <span class="px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800">
            ${empty} টি খালি সিট
          </span>
        </div>
      </div>

      <div class="my-3 p-3 bg-amber-50 rounded-xl flex items-center justify-between text-xs text-amber-900">
        <span class="font-bold flex items-center gap-2">
          <i class="fas fa-hand-pointer text-amber-600"></i> যেকোনো খালি সিটে ক্লিক করে টিকেট ইস্যু করুন
        </span>
        <div class="flex items-center gap-3">
          <span class="flex items-center gap-1 font-semibold"><span class="w-3 h-3 rounded bg-emerald-500 inline-block"></span> খালি (${empty})</span>
          <span class="flex items-center gap-1 font-semibold"><span class="w-3 h-3 rounded bg-rose-500 inline-block"></span> বুকড (${booked})</span>
        </div>
      </div>

      <div class="max-w-xs mx-auto bg-slate-50 border-2 border-slate-300 rounded-3xl p-4 shadow-inner">
        <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 text-xs font-bold text-slate-500">
          <span>Door</span>
          <span class="flex items-center gap-1"><svg class="w-4 h-4 text-indigo-600 inline" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v6m0 6v6m9-9h-6m-6 0H3"/></svg> Driver</span>
        </div>
        <div class="space-y-1">${grid}</div>
      </div>
    </div>
  `;
}

function renderInteractiveSeatBtn(seatNo, isBooked, tripId) {
  if (isBooked) {
    return `
      <button 
        onclick="releaseSeatPrompt('${tripId}', '${seatNo}')"
        class="w-10 h-10 rounded-xl text-xs font-bold flex flex-col items-center justify-center bg-rose-500 hover:bg-rose-600 text-white shadow-xs transition"
        title="বুকড সিট (${seatNo}) - ক্লিক করে বুকিং বাতিল করুন"
      >
        <i class="fas fa-user text-[9px] opacity-70"></i>
        <span>${seatNo}</span>
      </button>
    `;
  } else {
    return `
      <button 
        onclick="openPassengerBookingModal('${tripId}', '${seatNo}')"
        class="w-10 h-10 rounded-xl text-xs font-bold flex flex-col items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs transition transform hover:scale-105"
        title="খালি সিট (${seatNo}) - ক্লিক করে বুক করুন"
      >
        <i class="fas fa-chair text-[9px] opacity-70"></i>
        <span>${seatNo}</span>
      </button>
    `;
  }
}

// -------------------------------------------------------------
// PASSENGER BOOKING & TICKET ISSUANCE MODAL
// -------------------------------------------------------------
let pendingBooking = null;

function openPassengerBookingModal(tripId, seatNo) {
  const trip = salesState.trips.find(t => t.id === tripId);
  if (!trip) return;

  pendingBooking = { tripId, seatNo, trip };

  const modal = document.getElementById('bookingPassengerModal');
  if (!modal) return;

  document.getElementById('modalSeatNo').textContent = seatNo;
  document.getElementById('modalBusInfo').textContent = `${trip.busNo} (${trip.destination} - ${trip.departureTime})`;
  document.getElementById('modalFare').value = trip.fare;
  document.getElementById('passName').value = '';
  document.getElementById('passPhone').value = '';

  modal.classList.remove('hidden');
}

function closePassengerBookingModal() {
  const modal = document.getElementById('bookingPassengerModal');
  if (modal) modal.classList.add('hidden');
  pendingBooking = null;
}

function confirmPassengerBooking(e) {
  e.preventDefault();
  if (!pendingBooking) return;

  const name = document.getElementById('passName').value.trim() || 'General Passenger';
  const phone = document.getElementById('passPhone').value.trim() || 'N/A';
  const fare = Number(document.getElementById('modalFare').value) || pendingBooking.trip.fare;

  const trip = salesState.trips.find(t => t.id === pendingBooking.tripId);
  if (trip) {
    trip.bookedSeats = Number(trip.bookedSeats) + 1;
    setStoredData('bus_trips_v1', salesState.trips);
  }

  // Create Ticket Record
  const newTicket = {
    id: 'TKT-' + Math.floor(1000 + Math.random() * 9000),
    busId: pendingBooking.tripId,
    busNo: trip.busNo,
    busName: trip.busName,
    counterId: salesState.activeCounter.id,
    counterName: salesState.activeCounter.name,
    destination: trip.destination,
    departureTime: trip.departureTime,
    seatNo: pendingBooking.seatNo,
    passengerName: name,
    phone: phone,
    fare: fare,
    bookingTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  salesState.bookedTickets.unshift(newTicket);
  setStoredData('bus_tickets_v1', salesState.bookedTickets);

  closePassengerBookingModal();
  showToast(`সিট ${pendingBooking.seatNo} সফলভাবে বুক করা হয়েছে!`, 'success');

  // Show printable ticket receipt
  showTicketReceipt(newTicket);

  renderSalesContent();
}

function releaseSeatPrompt(tripId, seatNo) {
  if (confirm(`সিট ${seatNo} এর বুকিং বাতিল করে খালি করতে চান?`)) {
    const trip = salesState.trips.find(t => t.id === tripId);
    if (trip && trip.bookedSeats > 0) {
      trip.bookedSeats = Number(trip.bookedSeats) - 1;
      setStoredData('bus_trips_v1', salesState.trips);
    }
    // Remove ticket from manifest
    salesState.bookedTickets = salesState.bookedTickets.filter(
      t => !(t.busId === tripId && t.seatNo === seatNo)
    );
    setStoredData('bus_tickets_v1', salesState.bookedTickets);

    showToast(`সিট ${seatNo} খালি করা হয়েছে!`, 'info');
    renderSalesContent();
  }
}

// Printable Ticket Receipt Popup
function showTicketReceipt(ticket) {
  const modal = document.getElementById('ticketPrintModal');
  const content = document.getElementById('ticketPrintContent');
  if (!modal || !content) return;

  content.innerHTML = `
    <div class="border-2 border-dashed border-amber-400 bg-amber-50/50 rounded-2xl p-5 text-slate-800 space-y-3">
      <div class="flex items-center justify-between pb-3 border-b border-amber-200">
        <div>
          <h4 class="font-black text-amber-950 text-base">CENTRAL BUS TICKET</h4>
          <span class="text-[10px] text-amber-800 font-bold">${ticket.counterName}</span>
        </div>
        <span class="text-xs font-mono font-bold bg-white px-2 py-1 rounded border border-amber-300 text-amber-900">${ticket.id}</span>
      </div>

      <div class="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span class="text-[10px] text-slate-400 block font-bold uppercase">যাত্রীর নাম:</span>
          <strong class="text-slate-900">${ticket.passengerName}</strong>
        </div>
        <div>
          <span class="text-[10px] text-slate-400 block font-bold uppercase">মোবাইল নম্বর:</span>
          <strong class="text-slate-900">${ticket.phone}</strong>
        </div>
        <div>
          <span class="text-[10px] text-slate-400 block font-bold uppercase">বাস ও গন্তব্য:</span>
          <strong class="text-indigo-700">${ticket.busNo} ➔ ${ticket.destination}</strong>
        </div>
        <div>
          <span class="text-[10px] text-slate-400 block font-bold uppercase">ছাড়ার সময়:</span>
          <strong class="text-slate-900">${ticket.departureTime}</strong>
        </div>
      </div>

      <div class="p-2.5 bg-white rounded-xl border border-amber-200 flex items-center justify-between">
        <div>
          <span class="text-[10px] text-slate-400 font-bold block uppercase">বরাদ্দকৃত সিট:</span>
          <span class="text-xl font-black text-emerald-600">${ticket.seatNo}</span>
        </div>
        <div class="text-right">
          <span class="text-[10px] text-slate-400 font-bold block uppercase">পরিশোধিত ভাড়া:</span>
          <span class="text-xl font-black text-slate-900">৳ ${ticket.fare}</span>
        </div>
      </div>

      <div class="text-center text-[10px] text-slate-400 pt-1">
        ইস্যু সময়: ${ticket.bookingTime} • যাত্রা শুরুর ৩০ মিনিট আগে টার্মিনালে উপস্থিত থাকুন।
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
}

function closeTicketPrintModal() {
  const modal = document.getElementById('ticketPrintModal');
  if (modal) modal.classList.add('hidden');
}

// -------------------------------------------------------------
// MODULE 3: PASSENGER MANIFEST & BOOKED TICKETS LOG
// -------------------------------------------------------------
function getSalesManifestHTML() {
  const counterId = salesState.activeCounter.id;
  const tickets = salesState.bookedTickets.filter(t => t.counterId === counterId);

  return `
    <div class="space-y-6">
      <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h2 class="text-lg font-black text-slate-900 flex items-center gap-2">
          <i class="fas fa-file-invoice text-amber-600"></i>
          ${salesState.activeCounter.name}-এর আজকের বুকিং ও প্যাসেঞ্জার ম্যানিফেস্ট
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">বিক্রিত টিকেট ও যাত্রীদের বিস্তারিত তালিকা</p>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        ${tickets.length === 0 ? `
          <div class="p-10 text-center text-slate-400 text-xs">
            আজকে এই কাউন্টার থেকে এখনও কোনো টিকেট বুক করা হয়নি।
          </div>
        ` : `
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-slate-600">
              <thead>
                <tr class="text-[11px] uppercase font-extrabold text-slate-400 bg-slate-50 border-b border-slate-200">
                  <th class="py-3 px-4">টিকেট আইডি</th>
                  <th class="py-3 px-4">যাত্রীর নাম ও ফোন</th>
                  <th class="py-3 px-4">বাস ও গন্তব্য</th>
                  <th class="py-3 px-4 text-center">সিট নং</th>
                  <th class="py-3 px-4">ভাড়া</th>
                  <th class="py-3 px-4">ইস্যু সময়</th>
                  <th class="py-3 px-4 text-right">রিসিপ্ট</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${tickets.map(tkt => `
                  <tr class="hover:bg-slate-50 transition text-xs">
                    <td class="py-3 px-4 font-mono font-bold text-amber-700">${tkt.id}</td>
                    <td class="py-3 px-4">
                      <strong class="text-slate-900 block">${tkt.passengerName}</strong>
                      <span class="text-slate-400 text-[11px]">${tkt.phone}</span>
                    </td>
                    <td class="py-3 px-4">
                      <span class="font-bold text-slate-800">${tkt.busNo}</span>
                      <span class="text-[11px] text-slate-400 block">${tkt.destination} (${tkt.departureTime})</span>
                    </td>
                    <td class="py-3 px-4 text-center">
                      <span class="px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-100 text-emerald-800">
                        ${tkt.seatNo}
                      </span>
                    </td>
                    <td class="py-3 px-4 font-black text-slate-900">৳ ${tkt.fare}</td>
                    <td class="py-3 px-4 text-slate-500">${tkt.bookingTime}</td>
                    <td class="py-3 px-4 text-right">
                      <button onclick='showTicketReceipt(${JSON.stringify(tkt)})' class="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold rounded-lg text-xs">
                        <i class="fas fa-print mr-1"></i> প্রিন্ট
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// SALES BUS CRUD MODAL (ADD / EDIT / DELETE)
// -------------------------------------------------------------
let editingSalesTripId = null;

function openSalesTripModal(tripId = null) {
  editingSalesTripId = tripId;
  const modal = document.getElementById('salesTripModal');
  const title = document.getElementById('salesTripModalTitle');
  const form = document.getElementById('salesTripForm');
  if (!modal || !form) return;

  form.reset();

  if (tripId) {
    title.innerHTML = `<i class="fas fa-pen-to-square text-amber-600 mr-2"></i> বাসের তথ্য এডিট করুন (Edit Bus Trip)`;
    const trip = salesState.trips.find(t => t.id === tripId);
    if (trip) {
      document.getElementById('inputBusNo').value = trip.busNo;
      document.getElementById('inputBusName').value = trip.busName;
      document.getElementById('inputType').value = trip.type;
      document.getElementById('inputDestination').value = trip.destination;
      document.getElementById('inputTime').value = trip.departureTime;
      document.getElementById('inputTotalSeats').value = trip.totalSeats;
      document.getElementById('inputBookedSeats').value = trip.bookedSeats;
      document.getElementById('inputFare').value = trip.fare;
      document.getElementById('inputStatus').value = trip.status;
      document.getElementById('inputDriver').value = trip.driverName || '';
      document.getElementById('inputPhone').value = trip.contact || '';
    }
  } else {
    title.innerHTML = `<i class="fas fa-plus-circle text-amber-600 mr-2"></i> ${salesState.activeCounter.name}-এ নতুন বাস যোগ করুন`;
    document.getElementById('inputTotalSeats').value = 36;
    document.getElementById('inputBookedSeats').value = 0;
    document.getElementById('inputFare').value = 1400;
  }

  modal.classList.remove('hidden');
}

function closeSalesTripModal() {
  const modal = document.getElementById('salesTripModal');
  if (modal) modal.classList.add('hidden');
  editingSalesTripId = null;
}

function handleSalesTripSubmit(e) {
  e.preventDefault();

  const busNo = document.getElementById('inputBusNo').value.trim();
  const busName = document.getElementById('inputBusName').value.trim();
  const type = document.getElementById('inputType').value;
  const destination = document.getElementById('inputDestination').value.trim();
  const departureTime = document.getElementById('inputTime').value.trim();
  const totalSeats = parseInt(document.getElementById('inputTotalSeats').value) || 36;
  const bookedSeats = parseInt(document.getElementById('inputBookedSeats').value) || 0;
  const fare = parseInt(document.getElementById('inputFare').value) || 1200;
  const status = document.getElementById('inputStatus').value;
  const driverName = document.getElementById('inputDriver').value.trim();
  const contact = document.getElementById('inputPhone').value.trim();

  if (bookedSeats > totalSeats) {
    showToast("বুকড সিট মোট সিটের চেয়ে বেশি হতে পারে না!", "error");
    return;
  }

  if (editingSalesTripId) {
    const idx = salesState.trips.findIndex(t => t.id === editingSalesTripId);
    if (idx !== -1) {
      salesState.trips[idx] = {
        ...salesState.trips[idx],
        busNo,
        busName,
        type,
        destination,
        departureTime,
        totalSeats,
        bookedSeats,
        fare,
        status,
        driverName,
        contact
      };
      showToast("বাসের তথ্য সফলভাবে আপডেট হয়েছে!", "success");
    }
  } else {
    const newTrip = {
      id: "TRIP-" + Math.floor(100 + Math.random() * 900),
      busNo,
      busName,
      type,
      fromCounterId: salesState.activeCounter.id,
      destination,
      departureTime,
      totalSeats,
      bookedSeats,
      fare,
      status,
      driverName,
      contact
    };
    salesState.trips.unshift(newTrip);
    showToast("নতুন বাস ট্রিপ যোগ করা হয়েছে!", "success");
  }

  setStoredData('bus_trips_v1', salesState.trips);
  closeSalesTripModal();
  renderSalesContent();
}

function deleteSalesTrip(tripId) {
  const trip = salesState.trips.find(t => t.id === tripId);
  if (!trip) return;

  if (confirm(`আপনি কি নিশ্চিত বাস ${trip.busNo} (${trip.destination}) মুছে ফেলতে চান?`)) {
    salesState.trips = salesState.trips.filter(t => t.id !== tripId);
    setStoredData('bus_trips_v1', salesState.trips);
    showToast("বাস ট্রিপ মুছে ফেলা হয়েছে!", "info");
    renderSalesContent();
  }
}

// Toast Notification
function showToast(msg, type = 'success') {
  const container = document.getElementById('salesToastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  const bg = type === 'error' ? 'bg-rose-600' : type === 'info' ? 'bg-indigo-600' : 'bg-emerald-600';

  toast.className = `px-4 py-3 rounded-xl text-white text-xs font-bold shadow-xl transition-all duration-300 transform translate-y-2 opacity-0 flex items-center gap-2 ${bg}`;
  toast.innerHTML = `<i class="fas fa-check-circle"></i> <span>${msg}</span>`;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// -------------------------------------------------------------
// MODULE 4: COUNTER DAILY CASHBOOK (Income & Expense)
// -------------------------------------------------------------
function getSalesCashbookHTML() {
  const counterId = salesState.activeCounter.id;
  const allTxns = getStoredTransactions();
  const counterTxns = allTxns.filter(t => t.counterId === counterId);

  // Compute counter metrics
  const counterMetrics = computeCounterMetrics();
  const directInflow = counterTxns.filter(t => t.type === 'Income').reduce((s, t) => s + Number(t.amount || 0), 0);
  const totalOutflow = counterTxns.filter(t => t.type === 'Expense').reduce((s, t) => s + Number(t.amount || 0), 0);
  const totalInflow = counterMetrics.revenue + directInflow;
  const cashInHand = totalInflow - totalOutflow;

  // Filter
  const f = salesState.cashbookFilter;
  const filtered = counterTxns.filter(t => {
    if (f.type !== 'all' && t.type !== f.type) return false;
    if (f.search) {
      const q = f.search.toLowerCase();
      const match = (t.voucherNo && t.voucherNo.toLowerCase().includes(q)) ||
                    (t.description && t.description.toLowerCase().includes(q)) ||
                    (t.busNo && t.busNo.toLowerCase().includes(q)) ||
                    (t.category && t.category.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const rows = filtered.length === 0 ? `
    <tr>
      <td colspan="7" class="text-center py-8 text-slate-400 text-xs">
        <i class="fas fa-receipt text-3xl mb-2 text-slate-300 block"></i>
        এই কাউন্টারে কোনো খরচ বা পার্সেল ভাউচার এন্ট্রি নেই।
      </td>
    </tr>
  ` : filtered.map(t => {
    const isIncome = t.type === 'Income';
    return `
      <tr class="hover:bg-slate-50 transition text-xs">
        <td class="py-3 px-4 font-mono font-bold text-slate-800">
          <div>${t.voucherNo || t.id}</div>
          <div class="text-[10px] text-slate-400 font-sans">${t.date} ${t.time || ''}</div>
        </td>
        <td class="py-3 px-4">
          <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isIncome ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
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
          <i class="fas fa-user-pen mr-1 text-slate-400"></i> ${t.recordedBy || 'Manager'}
        </td>
        <td class="py-3 px-4 text-center">
          <button 
            onclick="deleteSalesCashbookTxn('${t.id}')"
            title="মুছুন"
            class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition inline-flex items-center justify-center text-xs"
          >
            <i class="fas fa-trash-can"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div class="space-y-6">
      
      <!-- Header -->
      <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-black text-slate-900 flex items-center gap-2">
            <i class="fas fa-coins text-amber-500"></i>
            ${salesState.activeCounter.name} - দৈনিক আয়-ব্যয় ক্যাশবুক (Counter Daily Cashbook)
          </h2>
          <p class="text-xs text-slate-500 mt-1">
            এই কাউন্টারের ফুয়েল স্লিপ, সেতু টোল, স্টাফ খোরাকি ও পার্সেল জমার হিসাব এবং দিনশেষে জমাযোগ্য ক্যাশ ব্যালেন্স
          </p>
        </div>

        <div class="flex items-center gap-2 self-start sm:self-auto">
          <button 
            onclick="window.print()" 
            class="px-3.5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50 hover:bg-slate-100 text-xs font-bold transition flex items-center gap-1.5"
          >
            <i class="fas fa-print"></i> ক্যাশবুক প্রিন্ট
          </button>
          <button 
            onclick="openSalesCashbookModal()" 
            class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-200 transition flex items-center gap-2"
          >
            <i class="fas fa-plus"></i> খরচ / পার্সেল এন্ট্রি
          </button>
        </div>
      </div>

      <!-- Cashbook Balance Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div class="flex items-center justify-between text-slate-400">
            <span class="text-[11px] font-bold uppercase tracking-wider">কাউন্টার মোট ইনকাম</span>
            <span class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm"><i class="fas fa-arrow-down"></i></span>
          </div>
          <div class="mt-2">
            <h3 class="text-2xl font-black text-emerald-700">৳ ${totalInflow.toLocaleString()}</h3>
            <p class="text-[11px] text-slate-500 mt-0.5">টিকেট: ৳${counterMetrics.revenue.toLocaleString()} + পার্সেল: ৳${directInflow.toLocaleString()}</p>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div class="flex items-center justify-between text-slate-400">
            <span class="text-[11px] font-bold uppercase tracking-wider">কাউন্টার দৈনিক খরচ</span>
            <span class="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-sm"><i class="fas fa-arrow-up"></i></span>
          </div>
          <div class="mt-2">
            <h3 class="text-2xl font-black text-rose-700">৳ ${totalOutflow.toLocaleString()}</h3>
            <p class="text-[11px] text-slate-500 mt-0.5">ফুয়েল, টোল স্লিপ ও আনুষঙ্গিক</p>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div class="flex items-center justify-between text-slate-400">
            <span class="text-[11px] font-bold uppercase tracking-wider">কাউন্টার ক্যাশ ইন হ্যান্ড</span>
            <span class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-sm"><i class="fas fa-vault"></i></span>
          </div>
          <div class="mt-2">
            <h3 class="text-2xl font-black text-amber-700">৳ ${cashInHand.toLocaleString()}</h3>
            <p class="text-[11px] text-emerald-600 font-bold mt-0.5 flex items-center gap-1">
              <i class="fas fa-circle-check"></i> দিনশেষে হেডকোয়ার্টারে হস্তান্তরযোগ্য
            </p>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div class="flex items-center justify-between text-slate-400">
            <span class="text-[11px] font-bold uppercase tracking-wider">লোকাল ভাউচার সংখ্যা</span>
            <span class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm"><i class="fas fa-receipt"></i></span>
          </div>
          <div class="mt-2">
            <h3 class="text-2xl font-black text-slate-900">${counterTxns.length} টি স্লিপ</h3>
            <p class="text-[11px] text-slate-500 mt-0.5">${salesState.activeCounter.code} টার্মিনাল ডেস্কে সংরক্ষিত</p>
          </div>
        </div>

      </div>

      <!-- Filter Controls Bar -->
      <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-2 flex-1">
          <div class="relative min-w-[200px] flex-1 sm:flex-none">
            <i class="fas fa-search absolute left-3 top-2.5 text-slate-400 text-xs"></i>
            <input 
              type="text" 
              placeholder="ভাউচার, বিবরণ বা বাস নং..." 
              value="${f.search}"
              oninput="salesState.cashbookFilter.search = this.value; renderSalesContent();"
              class="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-amber-600"
            />
          </div>

          <select 
            onchange="salesState.cashbookFilter.type = this.value; renderSalesContent();"
            class="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold outline-none text-slate-700"
          >
            <option value="all" ${f.type === 'all' ? 'selected' : ''}>সকল ভাউচার (All)</option>
            <option value="Expense" ${f.type === 'Expense' ? 'selected' : ''}>শুধু খরচ (Expense Outflow)</option>
            <option value="Income" ${f.type === 'Income' ? 'selected' : ''}>শুধু জমা (Parcel Inflow)</option>
          </select>

          ${(f.type !== 'all' || f.search) ? `
            <button 
              onclick="salesState.cashbookFilter = { type: 'all', search: '' }; renderSalesContent();"
              class="px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-bold transition flex items-center gap-1"
            >
              <i class="fas fa-rotate-left"></i> রিসেট
            </button>
          ` : ''}
        </div>

        <div class="text-xs font-bold text-slate-500">
          ফিল্টার্ড রেকর্ড: <span class="text-amber-600">${filtered.length}</span> টি
        </div>
      </div>

      <!-- Cashbook Ledger Table -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 class="text-sm font-black text-slate-900 flex items-center gap-2">
            <i class="fas fa-book text-amber-600"></i>
            কাউন্টার দৈনিক ক্যাশবুক ও ভাউচার লেজার
          </h3>
          <span class="text-xs text-slate-400">কাউন্টার: ${salesState.activeCounter.name}</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="text-[11px] uppercase font-extrabold text-slate-400 bg-slate-50 border-b border-slate-200">
                <th class="py-3 px-4">ভাউচার নং ও সময়</th>
                <th class="py-3 px-4">ধরণ</th>
                <th class="py-3 px-4">খাত ও বাস নং</th>
                <th class="py-3 px-4">বিবরণ ও পেমেন্ট মাধ্যম</th>
                <th class="py-3 px-4 text-right">টাকার পরিমাণ (BDT)</th>
                <th class="py-3 px-4">অফিসার</th>
                <th class="py-3 px-4 text-center">মুছুন</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${rows}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

function openSalesCashbookModal() {
  const modal = document.getElementById('salesCashbookModal');
  if (!modal) return;

  const voucherInput = document.getElementById('salesTxnVoucher');
  if (voucherInput) {
    voucherInput.value = `VR-${salesState.activeCounter.code}-${Math.floor(100 + Math.random() * 900)}`;
  }

  // Populate counter buses
  const busSelect = document.getElementById('salesTxnBus');
  if (busSelect) {
    const counterBuses = salesState.trips.filter(t => t.fromCounterId === salesState.activeCounter.id);
    busSelect.innerHTML = `
      <option value="N/A">নির্দিষ্ট বাস প্রযোজ্য নয় (General Counter)</option>
      ${counterBuses.map(b => `<option value="${b.busNo}">${b.busNo} (${b.destination})</option>`).join('')}
    `;
  }

  onSalesTxnTypeChange();
  modal.classList.remove('hidden');
}

function closeSalesCashbookModal() {
  const modal = document.getElementById('salesCashbookModal');
  if (modal) modal.classList.add('hidden');
}

function onSalesTxnTypeChange() {
  const typeSelect = document.getElementById('salesTxnType');
  const catSelect = document.getElementById('salesTxnCategory');
  if (!typeSelect || !catSelect) return;

  const isIncome = typeSelect.value === 'Income';
  const categories = isIncome ? [
    "পার্সেল ও কুরিয়ার বুকিং (Cargo & Parcel)",
    "অতিরিক্ত লাগেজ চার্জ (Extra Luggage Fee)",
    "অন্যান্য অপারেটিং আয় (Other Income)"
  ] : [
    "ডিজেল ও ফুয়েল খরচ (Fuel & Diesel)",
    "হাইওয়ে ও সেতু টোল (Highway & Bridge Tolls)",
    "চালক ও স্টাফ খোরাকি (Crew Road Allowance)",
    "অফিস ও যাত্রী আপ্যায়ন (Office & Entertainment)",
    "অন্যান্য পরিচালন ব্যয় (Other Expenses)"
  ];

  catSelect.innerHTML = categories.map(c => `
    <option value="${c}">${c}</option>
  `).join('');
}

function handleSalesCashbookSubmit(e) {
  e.preventDefault();

  const type = document.getElementById('salesTxnType').value;
  const voucherNo = document.getElementById('salesTxnVoucher').value.trim();
  const category = document.getElementById('salesTxnCategory').value;
  const busNo = document.getElementById('salesTxnBus').value;
  const amount = parseFloat(document.getElementById('salesTxnAmount').value) || 0;
  const paymentMethod = document.getElementById('salesTxnMethod').value;
  const description = document.getElementById('salesTxnDescription').value.trim();

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newTxn = {
    id: `TXN-${Date.now().toString().slice(-6)}`,
    date: "2026-09-28",
    time: timeStr,
    type,
    category,
    counterId: salesState.activeCounter.id,
    counterName: salesState.activeCounter.name,
    busNo,
    voucherNo,
    amount,
    paymentMethod,
    description,
    recordedBy: salesState.user.name || salesState.activeCounter.manager
  };

  saveStoredTransaction(newTxn);
  closeSalesCashbookModal();
  showToast(`ক্যাশবুক ভাউচার ${voucherNo} সংরক্ষিত হয়েছে!`, 'success');
  renderSalesContent();
}

function deleteSalesCashbookTxn(id) {
  if (confirm("আপনি কি নিশ্চিতভাবে এই ক্যাশবুক ভাউচারটি মুছে ফেলতে চান?")) {
    deleteStoredTransaction(id);
    showToast("ভাউচার মুছে ফেলা হয়েছে!", "info");
    renderSalesContent();
  }
}

// Start
document.addEventListener('DOMContentLoaded', () => {
  initSalesDashboard();
});
