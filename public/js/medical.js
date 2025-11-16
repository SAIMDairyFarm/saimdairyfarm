auth.checkAuth();
const user = auth.getUser();
if (user) {
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userRole').textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    document.getElementById('userAvatar').textContent = user.name.charAt(0).toUpperCase();
}

let allRecords = [];

async function loadRecords() {
    const data = await apiRequest('/medical');
    if (data && data.success) {
        allRecords = data.data;
        displayRecords(allRecords);
    }
}

function displayRecords(records) {
    const tbody = document.getElementById('medicalTable');
    tbody.innerHTML = '';
    if (records.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No records found</td></tr>';
        return;
    }
    records.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${record.animalId}</strong></td>
            <td><span class="badge badge-info">${record.recordType}</span></td>
            <td>${formatDate(record.date)}</td>
            <td>${record.doctorName || 'N/A'}</td>
            <td>${record.diagnosis || 'N/A'}</td>
            <td>${record.treatment || record.vaccineName || 'N/A'}</td>
            <td class="actions">
                <button class="btn btn-sm btn-secondary" onclick='editRecord(${JSON.stringify(record).replace(/'/g, "&#39;")})'>Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteRecord('${record._id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function openAddModal() {
    document.getElementById('modalTitle').textContent = 'Add Medical Record';
    document.getElementById('recordForm').reset();
    document.getElementById('recordId').value = '';
    document.getElementById('date').value = new Date().toISOString().split('T')[0];
    document.getElementById('recordModal').classList.add('active');
}

function editRecord(record) {
    document.getElementById('modalTitle').textContent = 'Edit Medical Record';
    document.getElementById('recordId').value = record._id;
    document.getElementById('animalId').value = record.animalId;
    document.getElementById('recordType').value = record.recordType;
    document.getElementById('date').value = formatDateForInput(record.date);
    document.getElementById('doctorName').value = record.doctorName || '';
    document.getElementById('symptoms').value = record.symptoms || '';
    document.getElementById('diagnosis').value = record.diagnosis || '';
    document.getElementById('treatment').value = record.treatment || '';
    document.getElementById('medication').value = record.medication || '';
    document.getElementById('vaccineName').value = record.vaccineName || '';
    document.getElementById('nextVaccinationDate').value = formatDateForInput(record.nextVaccinationDate);
    document.getElementById('cost').value = record.cost || '';
    document.getElementById('notes').value = record.notes || '';
    document.getElementById('recordModal').classList.add('active');
}

function closeModal() {
    document.getElementById('recordModal').classList.remove('active');
}

document.getElementById('recordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const recordData = {
        animalId: document.getElementById('animalId').value,
        recordType: document.getElementById('recordType').value,
        date: document.getElementById('date').value,
        doctorName: document.getElementById('doctorName').value || undefined,
        symptoms: document.getElementById('symptoms').value || undefined,
        diagnosis: document.getElementById('diagnosis').value || undefined,
        treatment: document.getElementById('treatment').value || undefined,
        medication: document.getElementById('medication').value || undefined,
        vaccineName: document.getElementById('vaccineName').value || undefined,
        nextVaccinationDate: document.getElementById('nextVaccinationDate').value || undefined,
        cost: document.getElementById('cost').value || undefined,
        notes: document.getElementById('notes').value || undefined
    };
    const recordId = document.getElementById('recordId').value;
    const method = recordId ? 'PUT' : 'POST';
    const endpoint = recordId ? `/medical/${recordId}` : '/medical';
    const data = await apiRequest(endpoint, method, recordData);
    if (data && data.success) {
        showAlert(`Record ${recordId ? 'updated' : 'added'} successfully!`);
        closeModal();
        loadRecords();
    } else {
        showAlert(data?.message || 'Operation failed', 'danger');
    }
});

async function deleteRecord(id) {
    if (!confirm('Are you sure you want to delete this record?')) return;
    const data = await apiRequest(`/medical/${id}`, 'DELETE');
    if (data && data.success) {
        showAlert('Record deleted successfully!');
        loadRecords();
    }
}

document.getElementById('searchInput').addEventListener('input', filterRecords);
document.getElementById('typeFilter').addEventListener('change', filterRecords);

function filterRecords() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const type = document.getElementById('typeFilter').value;
    const filtered = allRecords.filter(record => {
        const matchSearch = record.animalId.toLowerCase().includes(search);
        const matchType = !type || record.recordType === type;
        return matchSearch && matchType;
    });
    displayRecords(filtered);
}

// Download PDF
function downloadPDF() {
    const token = auth.getToken();
    window.open(`${API_URL}/pdf/medical?token=${token}`, '_blank');
}

loadRecords();
