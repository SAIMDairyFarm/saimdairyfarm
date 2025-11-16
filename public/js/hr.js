auth.checkAuth();
const user = auth.getUser();
if (user) {
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userRole').textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    document.getElementById('userAvatar').textContent = user.name.charAt(0).toUpperCase();
}

let allEmployees = [];
let allDoctors = [];

async function loadData() {
    await Promise.all([loadEmployees(), loadDoctors()]);
}

async function loadEmployees() {
    const data = await apiRequest('/hr/employees');
    if (data && data.success) {
        allEmployees = data.data;
        displayEmployees(allEmployees);
    }
}

function displayEmployees(employees) {
    const tbody = document.getElementById('employeesTable');
    tbody.innerHTML = '';
    if (employees.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No employees found</td></tr>';
        return;
    }
    employees.forEach(emp => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${emp.name}</strong></td>
            <td>${emp.role}</td>
            <td>${emp.contactNumber}</td>
            <td>${formatDate(emp.startDate)}</td>
            <td><span class="badge badge-${emp.status === 'Active' ? 'success' : 'warning'}">${emp.status}</span></td>
            <td class="actions">
                <button class="btn btn-sm btn-secondary" onclick='editEmployee(${JSON.stringify(emp).replace(/'/g, "&#39;")})'>Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteEmployee('${emp._id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function loadDoctors() {
    const data = await apiRequest('/hr/doctors');
    if (data && data.success) {
        allDoctors = data.data;
        displayDoctors(allDoctors);
    }
}

function displayDoctors(doctors) {
    const tbody = document.getElementById('doctorsTable');
    tbody.innerHTML = '';
    if (doctors.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No doctors found</td></tr>';
        return;
    }
    doctors.forEach(doc => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${doc.name}</strong></td>
            <td><span class="badge badge-info">${doc.specialization}</span></td>
            <td>${doc.contactNumber}</td>
            <td>${doc.clinic || 'N/A'}</td>
            <td>${doc.consultationFee ? '$' + doc.consultationFee : 'N/A'}</td>
            <td class="actions">
                <button class="btn btn-sm btn-secondary" onclick='editDoctor(${JSON.stringify(doc).replace(/'/g, "&#39;")})'>Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteDoctor('${doc._id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function openAddEmployeeModal() {
    document.getElementById('employeeModalTitle').textContent = 'Add Employee';
    document.getElementById('employeeForm').reset();
    document.getElementById('employeeId').value = '';
    document.getElementById('startDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('employeeModal').classList.add('active');
}

function editEmployee(emp) {
    document.getElementById('employeeModalTitle').textContent = 'Edit Employee';
    document.getElementById('employeeId').value = emp._id;
    document.getElementById('employeeName').value = emp.name;
    document.getElementById('employeeRole').value = emp.role;
    document.getElementById('employeeContact').value = emp.contactNumber;
    document.getElementById('employeeEmail').value = emp.email || '';
    document.getElementById('startDate').value = formatDateForInput(emp.startDate);
    document.getElementById('salary').value = emp.salary || '';
    document.getElementById('employeeStatus').value = emp.status;
    document.getElementById('address').value = emp.address || '';
    document.getElementById('employeeModal').classList.add('active');
}

function closeEmployeeModal() {
    document.getElementById('employeeModal').classList.remove('active');
}

function openAddDoctorModal() {
    document.getElementById('doctorModalTitle').textContent = 'Add Doctor';
    document.getElementById('doctorForm').reset();
    document.getElementById('doctorId').value = '';
    document.getElementById('doctorModal').classList.add('active');
}

function editDoctor(doc) {
    document.getElementById('doctorModalTitle').textContent = 'Edit Doctor';
    document.getElementById('doctorId').value = doc._id;
    document.getElementById('doctorName').value = doc.name;
    document.getElementById('specialization').value = doc.specialization;
    document.getElementById('doctorContact').value = doc.contactNumber;
    document.getElementById('doctorEmail').value = doc.email || '';
    document.getElementById('clinic').value = doc.clinic || '';
    document.getElementById('consultationFee').value = doc.consultationFee || '';
    document.getElementById('availableDays').value = doc.availableDays || '';
    document.getElementById('doctorAddress').value = doc.address || '';
    document.getElementById('doctorModal').classList.add('active');
}

function closeDoctorModal() {
    document.getElementById('doctorModal').classList.remove('active');
}

document.getElementById('employeeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const empData = {
        name: document.getElementById('employeeName').value,
        role: document.getElementById('employeeRole').value,
        contactNumber: document.getElementById('employeeContact').value,
        email: document.getElementById('employeeEmail').value || undefined,
        startDate: document.getElementById('startDate').value,
        salary: document.getElementById('salary').value || undefined,
        status: document.getElementById('employeeStatus').value,
        address: document.getElementById('address').value || undefined
    };
    const empId = document.getElementById('employeeId').value;
    const method = empId ? 'PUT' : 'POST';
    const endpoint = empId ? `/hr/employees/${empId}` : '/hr/employees';
    const data = await apiRequest(endpoint, method, empData);
    if (data && data.success) {
        showAlert(`Employee ${empId ? 'updated' : 'added'} successfully!`);
        closeEmployeeModal();
        loadEmployees();
    } else {
        showAlert(data?.message || 'Operation failed', 'danger');
    }
});

document.getElementById('doctorForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const docData = {
        name: document.getElementById('doctorName').value,
        specialization: document.getElementById('specialization').value,
        contactNumber: document.getElementById('doctorContact').value,
        email: document.getElementById('doctorEmail').value || undefined,
        clinic: document.getElementById('clinic').value || undefined,
        consultationFee: document.getElementById('consultationFee').value || undefined,
        availableDays: document.getElementById('availableDays').value || undefined,
        address: document.getElementById('doctorAddress').value || undefined
    };
    const docId = document.getElementById('doctorId').value;
    const method = docId ? 'PUT' : 'POST';
    const endpoint = docId ? `/hr/doctors/${docId}` : '/hr/doctors';
    const data = await apiRequest(endpoint, method, docData);
    if (data && data.success) {
        showAlert(`Doctor ${docId ? 'updated' : 'added'} successfully!`);
        closeDoctorModal();
        loadDoctors();
    } else {
        showAlert(data?.message || 'Operation failed', 'danger');
    }
});

async function deleteEmployee(id) {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    const data = await apiRequest(`/hr/employees/${id}`, 'DELETE');
    if (data && data.success) {
        showAlert('Employee deleted successfully!');
        loadEmployees();
    }
}

async function deleteDoctor(id) {
    if (!confirm('Are you sure you want to delete this doctor?')) return;
    const data = await apiRequest(`/hr/doctors/${id}`, 'DELETE');
    if (data && data.success) {
        showAlert('Doctor deleted successfully!');
        loadDoctors();
    }
}

document.getElementById('employeeSearch').addEventListener('input', () => {
    const search = document.getElementById('employeeSearch').value.toLowerCase();
    const status = document.getElementById('statusFilter').value;
    const filtered = allEmployees.filter(emp => {
        const matchSearch = emp.name.toLowerCase().includes(search);
        const matchStatus = !status || emp.status === status;
        return matchSearch && matchStatus;
    });
    displayEmployees(filtered);
});

document.getElementById('statusFilter').addEventListener('change', () => {
    document.getElementById('employeeSearch').dispatchEvent(new Event('input'));
});

// Download PDF
function downloadPDF() {
    const token = auth.getToken();
    window.open(`${API_URL}/pdf/hr?token=${token}`, '_blank');
}

loadData();
