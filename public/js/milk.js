auth.checkAuth();
const user = auth.getUser();
if (user) {
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userRole').textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    document.getElementById('userAvatar').textContent = user.name.charAt(0).toUpperCase();
}

let allRecords = [];

async function loadRecords() {
    const data = await apiRequest('/milk');
    if (data && data.success) {
        allRecords = data.data;
        displayRecords(allRecords);
        calculateStats(allRecords);
    }
}

function calculateStats(records) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const todayRecords = records.filter(r => new Date(r.date) >= today);
    const weekRecords = records.filter(r => new Date(r.date) >= weekAgo);
    
    const todayTotal = todayRecords.reduce((sum, r) => sum + r.quantity, 0);
    const weekTotal = weekRecords.reduce((sum, r) => sum + r.quantity, 0);
    
    document.getElementById('todayTotal').textContent = todayTotal.toFixed(1) + 'L';
    document.getElementById('weekTotal').textContent = weekTotal.toFixed(1) + 'L';
}

function displayRecords(records) {
    const tbody = document.getElementById('milkTable');
    tbody.innerHTML = '';
    if (records.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No records found</td></tr>';
        return;
    }
    records.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${record.animalId}</strong></td>
            <td>${formatDate(record.date)}</td>
            <td><span class="badge badge-${record.session === 'AM' ? 'info' : 'primary'}">${record.session}</span></td>
            <td>${record.quantity.toFixed(1)}</td>
            <td>${record.fatContent ? record.fatContent.toFixed(1) : 'N/A'}</td>
            <td><span class="badge badge-${getQualityBadge(record.quality)}">${record.quality}</span></td>
            <td class="actions">
                <button class="btn btn-sm btn-secondary" onclick='editRecord(${JSON.stringify(record).replace(/'/g, "&#39;")})'>Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteRecord('${record._id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function getQualityBadge(quality) {
    const badges = { 'Excellent': 'success', 'Good': 'info', 'Average': 'warning', 'Poor': 'danger' };
    return badges[quality] || 'secondary';
}

function openAddModal() {
    document.getElementById('modalTitle').textContent = 'Add Milk Record';
    document.getElementById('milkForm').reset();
    document.getElementById('recordId').value = '';
    document.getElementById('date').value = new Date().toISOString().split('T')[0];
    document.getElementById('milkModal').classList.add('active');
}

function editRecord(record) {
    document.getElementById('modalTitle').textContent = 'Edit Milk Record';
    document.getElementById('recordId').value = record._id;
    document.getElementById('animalId').value = record.animalId;
    document.getElementById('date').value = formatDateForInput(record.date);
    document.getElementById('session').value = record.session;
    document.getElementById('quantity').value = record.quantity;
    document.getElementById('fatContent').value = record.fatContent || '';
    document.getElementById('snf').value = record.snf || '';
    document.getElementById('quality').value = record.quality;
    document.getElementById('notes').value = record.notes || '';
    document.getElementById('milkModal').classList.add('active');
}

function closeModal() {
    document.getElementById('milkModal').classList.remove('active');
}

document.getElementById('milkForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const recordData = {
        animalId: document.getElementById('animalId').value,
        date: document.getElementById('date').value,
        session: document.getElementById('session').value,
        quantity: parseFloat(document.getElementById('quantity').value),
        fatContent: document.getElementById('fatContent').value || undefined,
        snf: document.getElementById('snf').value || undefined,
        quality: document.getElementById('quality').value,
        notes: document.getElementById('notes').value || undefined
    };
    const recordId = document.getElementById('recordId').value;
    const method = recordId ? 'PUT' : 'POST';
    const endpoint = recordId ? `/milk/${recordId}` : '/milk';
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
    const data = await apiRequest(`/milk/${id}`, 'DELETE');
    if (data && data.success) {
        showAlert('Record deleted successfully!');
        loadRecords();
    }
}

document.getElementById('searchInput').addEventListener('input', filterRecords);
document.getElementById('sessionFilter').addEventListener('change', filterRecords);

function filterRecords() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const session = document.getElementById('sessionFilter').value;
    const filtered = allRecords.filter(record => {
        const matchSearch = record.animalId.toLowerCase().includes(search);
        const matchSession = !session || record.session === session;
        return matchSearch && matchSession;
    });
    displayRecords(filtered);
}

// Download PDF
function downloadPDF() {
    const token = auth.getToken();
    window.open(`${API_URL}/pdf/milk?token=${token}`, '_blank');
}

loadRecords();
