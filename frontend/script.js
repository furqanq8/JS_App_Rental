const API_BASE = 'http://localhost:5000/api';

const tabs = document.querySelectorAll('.tab-btn');
const sections = document.querySelectorAll('.tab-section');

const fleetForm = document.getElementById('fleet-form');
const fleetIdInput = document.getElementById('fleet-id');
const fleetNumberInput = document.getElementById('fleet-number');
const fleetTypeInput = document.getElementById('fleet-type');
const fleetCapacityInput = document.getElementById('fleet-capacity');
const fleetTableBody = document.getElementById('fleet-table-body');

const driverForm = document.getElementById('driver-form');
const driverIdInput = document.getElementById('driver-id');
const driverNameInput = document.getElementById('driver-name');
const driverPhoneInput = document.getElementById('driver-phone');
const driverTableBody = document.getElementById('driver-table-body');

const customerForm = document.getElementById('customer-form');
const customerIdInput = document.getElementById('customer-id');
const customerNameInput = document.getElementById('customer-name');
const companyNameInput = document.getElementById('company-name');
const customerPhoneInput = document.getElementById('customer-phone');
const customerTableBody = document.getElementById('customer-table-body');

const tripForm = document.getElementById('trip-form');
const tripIdInput = document.getElementById('trip-id');
const tripDateInput = document.getElementById('trip-date');
const locationFromInput = document.getElementById('location-from');
const locationToInput = document.getElementById('location-to');
const workTypeInput = document.getElementById('work-type');
const amountInput = document.getElementById('amount');
const tripTableBody = document.getElementById('trip-table-body');
const fleetSelect = document.getElementById('fleet-select');
const driverSelect = document.getElementById('driver-select');
const customerSelect = document.getElementById('customer-select');

const filterDriver = document.getElementById('filter-driver');
const filterCustomer = document.getElementById('filter-customer');

const totalTripsEl = document.getElementById('total-trips');
const totalAmountEl = document.getElementById('total-amount');
const tripsPerDriverBody = document.getElementById('trips-per-driver');
const tripsPerCustomerBody = document.getElementById('trips-per-customer');

// Navigation
const setActiveTab = (targetId) => {
  tabs.forEach((btn) => btn.classList.toggle('active', btn.dataset.target === targetId));
  sections.forEach((section) => section.classList.toggle('active', section.id === targetId));
};

tabs.forEach((btn) =>
  btn.addEventListener('click', () => {
    setActiveTab(btn.dataset.target);
  })
);

// Helpers
const handleResponse = async (response) => {
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Request failed');
  }
  return response.json();
};

const resetForm = (form) => {
  form.reset();
  const hiddenId = form.querySelector('input[type="hidden"]');
  if (hiddenId) hiddenId.value = '';
};

const populateSelect = (select, items, formatter) => {
  select.innerHTML = '';
  items.forEach((item) => {
    const option = document.createElement('option');
    option.value = item._id;
    option.textContent = formatter(item);
    select.appendChild(option);
  });
};

// Fleet handlers
const loadFleet = async () => {
  const response = await fetch(`${API_BASE}/fleet`);
  const fleets = await handleResponse(response);
  fleetTableBody.innerHTML = '';
  fleets.forEach((fleet) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${fleet.fleetNumber}</td>
      <td>${fleet.type}</td>
      <td>${fleet.capacity}</td>
      <td>
        <button data-id="${fleet._id}" class="edit-fleet">Edit</button>
        <button data-id="${fleet._id}" class="delete-fleet">Delete</button>
      </td>
    `;
    fleetTableBody.appendChild(row);
  });
  populateSelect(fleetSelect, fleets, (f) => `${f.fleetNumber} (${f.type})`);
};

fleetForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const payload = {
      fleetNumber: fleetNumberInput.value.trim(),
      type: fleetTypeInput.value.trim(),
      capacity: Number(fleetCapacityInput.value),
    };
    if (!payload.fleetNumber || !payload.type || Number.isNaN(payload.capacity)) {
      alert('Please fill all fleet fields');
      return;
    }

    const id = fleetIdInput.value;
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_BASE}/fleet/${id}` : `${API_BASE}/fleet`;
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    await handleResponse(response);
    resetForm(fleetForm);
    loadFleet();
    alert('Fleet saved');
  } catch (error) {
    alert(error.message);
  }
});

fleetTableBody.addEventListener('click', async (e) => {
  const id = e.target.dataset.id;
  if (e.target.classList.contains('edit-fleet')) {
    const response = await fetch(`${API_BASE}/fleet/${id}`);
    const fleet = await handleResponse(response);
    fleetIdInput.value = fleet._id;
    fleetNumberInput.value = fleet.fleetNumber;
    fleetTypeInput.value = fleet.type;
    fleetCapacityInput.value = fleet.capacity;
    setActiveTab('fleet');
  }
  if (e.target.classList.contains('delete-fleet')) {
    if (confirm('Delete this fleet?')) {
      const response = await fetch(`${API_BASE}/fleet/${id}`, { method: 'DELETE' });
      await handleResponse(response);
      loadFleet();
    }
  }
});

// Driver handlers
const loadDrivers = async () => {
  const response = await fetch(`${API_BASE}/drivers`);
  const drivers = await handleResponse(response);
  driverTableBody.innerHTML = '';
  drivers.forEach((driver) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${driver.name}</td>
      <td>${driver.phone}</td>
      <td>
        <button data-id="${driver._id}" class="edit-driver">Edit</button>
        <button data-id="${driver._id}" class="delete-driver">Delete</button>
      </td>
    `;
    driverTableBody.appendChild(row);
  });
  populateSelect(driverSelect, drivers, (d) => d.name);
  filterDriver.innerHTML = '<option value="">All</option>';
  drivers.forEach((driver) => {
    const option = document.createElement('option');
    option.value = driver._id;
    option.textContent = driver.name;
    filterDriver.appendChild(option);
  });
};

driverForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const payload = { name: driverNameInput.value.trim(), phone: driverPhoneInput.value.trim() };
    if (!payload.name || !payload.phone) {
      alert('Please fill all driver fields');
      return;
    }

    const id = driverIdInput.value;
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_BASE}/drivers/${id}` : `${API_BASE}/drivers`;
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    await handleResponse(response);
    resetForm(driverForm);
    loadDrivers();
    alert('Driver saved');
  } catch (error) {
    alert(error.message);
  }
});

driverTableBody.addEventListener('click', async (e) => {
  const id = e.target.dataset.id;
  if (e.target.classList.contains('edit-driver')) {
    const response = await fetch(`${API_BASE}/drivers/${id}`);
    const driver = await handleResponse(response);
    driverIdInput.value = driver._id;
    driverNameInput.value = driver.name;
    driverPhoneInput.value = driver.phone;
    setActiveTab('drivers');
  }
  if (e.target.classList.contains('delete-driver')) {
    if (confirm('Delete this driver?')) {
      const response = await fetch(`${API_BASE}/drivers/${id}`, { method: 'DELETE' });
      await handleResponse(response);
      loadDrivers();
    }
  }
});

// Customer handlers
const loadCustomers = async () => {
  const response = await fetch(`${API_BASE}/customers`);
  const customers = await handleResponse(response);
  customerTableBody.innerHTML = '';
  customers.forEach((customer) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${customer.customerName}</td>
      <td>${customer.companyName}</td>
      <td>${customer.phone}</td>
      <td>
        <button data-id="${customer._id}" class="edit-customer">Edit</button>
        <button data-id="${customer._id}" class="delete-customer">Delete</button>
      </td>
    `;
    customerTableBody.appendChild(row);
  });
  populateSelect(customerSelect, customers, (c) => `${c.customerName} (${c.companyName})`);
  filterCustomer.innerHTML = '<option value="">All</option>';
  customers.forEach((customer) => {
    const option = document.createElement('option');
    option.value = customer._id;
    option.textContent = `${customer.customerName} (${customer.companyName})`;
    filterCustomer.appendChild(option);
  });
};

customerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const payload = {
      customerName: customerNameInput.value.trim(),
      companyName: companyNameInput.value.trim(),
      phone: customerPhoneInput.value.trim(),
    };

    if (!payload.customerName || !payload.companyName || !payload.phone) {
      alert('Please fill all customer fields');
      return;
    }

    const id = customerIdInput.value;
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_BASE}/customers/${id}` : `${API_BASE}/customers`;
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    await handleResponse(response);
    resetForm(customerForm);
    loadCustomers();
    alert('Customer saved');
  } catch (error) {
    alert(error.message);
  }
});

customerTableBody.addEventListener('click', async (e) => {
  const id = e.target.dataset.id;
  if (e.target.classList.contains('edit-customer')) {
    const response = await fetch(`${API_BASE}/customers/${id}`);
    const customer = await handleResponse(response);
    customerIdInput.value = customer._id;
    customerNameInput.value = customer.customerName;
    companyNameInput.value = customer.companyName;
    customerPhoneInput.value = customer.phone;
    setActiveTab('customers');
  }
  if (e.target.classList.contains('delete-customer')) {
    if (confirm('Delete this customer?')) {
      const response = await fetch(`${API_BASE}/customers/${id}`, { method: 'DELETE' });
      await handleResponse(response);
      loadCustomers();
    }
  }
});

// Trip handlers
const loadTrips = async () => {
  const response = await fetch(`${API_BASE}/trips`);
  const trips = await handleResponse(response);
  tripTableBody.innerHTML = '';
  trips.forEach((trip) => {
    const row = document.createElement('tr');
    const date = new Date(trip.tripDate).toLocaleDateString();
    const fleetLabel = trip.fleet ? `${trip.fleet.fleetNumber} (${trip.fleet.type})` : 'N/A';
    const driverLabel = trip.driver ? trip.driver.name : 'N/A';
    const customerLabel = trip.customer ? `${trip.customer.customerName} (${trip.customer.companyName})` : 'N/A';
    row.innerHTML = `
      <td>${date}</td>
      <td>${trip.locationFrom}</td>
      <td>${trip.locationTo}</td>
      <td>${fleetLabel}</td>
      <td>${driverLabel}</td>
      <td>${customerLabel}</td>
      <td>${trip.workType}</td>
      <td>${trip.amount}</td>
      <td>
        <button data-id="${trip._id}" class="edit-trip">Edit</button>
        <button data-id="${trip._id}" class="delete-trip">Delete</button>
      </td>
    `;
    tripTableBody.appendChild(row);
  });
};

tripForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const payload = {
      tripDate: tripDateInput.value,
      locationFrom: locationFromInput.value.trim(),
      locationTo: locationToInput.value.trim(),
      fleet: fleetSelect.value,
      driver: driverSelect.value,
      customer: customerSelect.value,
      workType: workTypeInput.value.trim(),
      amount: Number(amountInput.value),
    };

    if (!payload.tripDate || !payload.locationFrom || !payload.locationTo || !payload.workType || Number.isNaN(payload.amount)) {
      alert('Please fill all trip fields');
      return;
    }

    const id = tripIdInput.value;
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_BASE}/trips/${id}` : `${API_BASE}/trips`;
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    await handleResponse(response);
    resetForm(tripForm);
    loadTrips();
    loadDashboard();
    alert('Trip saved');
  } catch (error) {
    alert(error.message);
  }
});

tripTableBody.addEventListener('click', async (e) => {
  const id = e.target.dataset.id;
  if (e.target.classList.contains('edit-trip')) {
    const response = await fetch(`${API_BASE}/trips/${id}`);
    const trip = await handleResponse(response);
    tripIdInput.value = trip._id;
    tripDateInput.value = trip.tripDate.slice(0, 10);
    locationFromInput.value = trip.locationFrom;
    locationToInput.value = trip.locationTo;
    fleetSelect.value = trip.fleet?._id || trip.fleet;
    driverSelect.value = trip.driver?._id || trip.driver;
    customerSelect.value = trip.customer?._id || trip.customer;
    workTypeInput.value = trip.workType;
    amountInput.value = trip.amount;
    setActiveTab('trips');
  }
  if (e.target.classList.contains('delete-trip')) {
    if (confirm('Delete this trip?')) {
      const response = await fetch(`${API_BASE}/trips/${id}`, { method: 'DELETE' });
      await handleResponse(response);
      loadTrips();
      loadDashboard();
    }
  }
});

// Dashboard
const loadDashboard = async () => {
  const params = new URLSearchParams();
  const from = document.getElementById('filter-from').value;
  const to = document.getElementById('filter-to').value;
  if (from) params.append('fromDate', from);
  if (to) params.append('toDate', to);
  if (filterDriver.value) params.append('driverId', filterDriver.value);
  if (filterCustomer.value) params.append('customerId', filterCustomer.value);

  const response = await fetch(`${API_BASE}/dashboard/summary?${params.toString()}`);
  const data = await handleResponse(response);

  totalTripsEl.textContent = data.totalTrips;
  totalAmountEl.textContent = data.totalAmount.toFixed(2);

  tripsPerDriverBody.innerHTML = '';
  data.tripsPerDriver.forEach((item) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${item.driverName || 'Unknown'}</td><td>${item.tripCount}</td>`;
    tripsPerDriverBody.appendChild(row);
  });

  tripsPerCustomerBody.innerHTML = '';
  data.tripsPerCustomer.forEach((item) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${item.customerName || 'Unknown'}</td><td>${item.companyName || ''}</td><td>${item.tripCount}</td>`;
    tripsPerCustomerBody.appendChild(row);
  });
};

document.getElementById('apply-filters').addEventListener('click', (e) => {
  e.preventDefault();
  loadDashboard();
});

// Initial data load
const init = async () => {
  try {
    await Promise.all([loadFleet(), loadDrivers(), loadCustomers()]);
    await loadTrips();
    await loadDashboard();
  } catch (error) {
    alert(`Failed to load data: ${error.message}`);
  }
};

init();
