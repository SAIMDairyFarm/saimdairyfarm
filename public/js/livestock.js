auth.checkAuth();
const user = auth.getUser();
if (user) {
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userRole').textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    document.getElementById('userAvatar').textContent = user.name.charAt(0).toUpperCase();
}

let allAnimals = [];

async function loadAnimals() {
    const data = await apiRequest('/cows');
    if (data && data.success) {
        allAnimals = data.data;
        displayAnimals(allAnimals);
    }
}

function displayAnimals(animals) {
    const tbody = document.getElementById('livestockTable');
    tbody.innerHTML = '';

    if (animals.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">No animals found</td></tr>';
        return;
    }

    animals.forEach(animal => {
        const age = calculateAge(animal.dateOfBirth);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${animal.tagId}</strong></td>
            <td>${animal.name || 'N/A'}</td>
            <td><span class="badge badge-info">${animal.type}</span></td>
            <td>${animal.breed}</td>
            <td>${age}</td>
            <td><span class="badge badge-${getStatusBadge(animal.status)}">${animal.status}</span></td>
            <td>${animal.location || 'N/A'}</td>
            <td class="actions">
                <button class="btn btn-sm btn-secondary" onclick='editAnimal(${JSON.stringify(animal).replace(/'/g, "&#39;")})'>Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteAnimal('${animal._id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    const years = today.getFullYear() - birthDate.getFullYear();
    const months = today.getMonth() - birthDate.getMonth();
    
    if (years > 0) {
        return `${years}y ${months >= 0 ? months : 12 + months}m`;
    }
    return `${months >= 0 ? months : 12 + months}m`;
}

function getStatusBadge(status) {
    const badges = {
        'Active': 'success',
        'Pregnant': 'info',
        'Lactating': 'primary',
        'Dry': 'warning',
        'Sick': 'danger',
        'Sold': 'secondary',
        'Culled': 'secondary'
    };
    return badges[status] || 'secondary';
}

function openAddModal() {
    document.getElementById('modalTitle').textContent = 'Add Animal';
    document.getElementById('animalForm').reset();
    document.getElementById('animalId').value = '';
    document.getElementById('animalModal').classList.add('active');
}

function editAnimal(animal) {
    document.getElementById('modalTitle').textContent = 'Edit Animal';
    document.getElementById('animalId').value = animal._id;
    document.getElementById('tagId').value = animal.tagId;
    document.getElementById('name').value = animal.name || '';
    document.getElementById('type').value = animal.type;
    document.getElementById('breed').value = animal.breed;
    document.getElementById('gender').value = animal.gender;
    document.getElementById('dateOfBirth').value = formatDateForInput(animal.dateOfBirth);
    document.getElementById('status').value = animal.status;
    document.getElementById('weight').value = animal.weight || '';
    document.getElementById('motherId').value = animal.motherId || '';
    document.getElementById('fatherId').value = animal.fatherId || '';
    document.getElementById('location').value = animal.location || '';
    document.getElementById('group').value = animal.group || '';
    document.getElementById('notes').value = animal.notes || '';
    document.getElementById('animalModal').classList.add('active');
}

function closeModal() {
    document.getElementById('animalModal').classList.remove('active');
}

document.getElementById('animalForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const animalData = {
        tagId: document.getElementById('tagId').value,
        name: document.getElementById('name').value,
        type: document.getElementById('type').value,
        breed: document.getElementById('breed').value,
        gender: document.getElementById('gender').value,
        dateOfBirth: document.getElementById('dateOfBirth').value,
        status: document.getElementById('status').value,
        weight: document.getElementById('weight').value || undefined,
        motherId: document.getElementById('motherId').value || undefined,
        fatherId: document.getElementById('fatherId').value || undefined,
        location: document.getElementById('location').value || undefined,
        group: document.getElementById('group').value || undefined,
        notes: document.getElementById('notes').value || undefined
    };

    const animalId = document.getElementById('animalId').value;
    const method = animalId ? 'PUT' : 'POST';
    const endpoint = animalId ? `/cows/${animalId}` : '/cows';

    const data = await apiRequest(endpoint, method, animalData);
    
    if (data && data.success) {
        showAlert(`Animal ${animalId ? 'updated' : 'added'} successfully!`);
        closeModal();
        loadAnimals();
    } else {
        showAlert(data?.message || 'Operation failed', 'danger');
    }
});

async function deleteAnimal(id) {
    if (!confirm('Are you sure you want to delete this animal?')) return;
    
    const data = await apiRequest(`/cows/${id}`, 'DELETE');
    if (data && data.success) {
        showAlert('Animal deleted successfully!');
        loadAnimals();
    }
}

// Filtering
document.getElementById('searchInput').addEventListener('input', filterAnimals);
document.getElementById('typeFilter').addEventListener('change', filterAnimals);
document.getElementById('statusFilter').addEventListener('change', filterAnimals);

function filterAnimals() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const type = document.getElementById('typeFilter').value;
    const status = document.getElementById('statusFilter').value;

    const filtered = allAnimals.filter(animal => {
        const matchSearch = animal.tagId.toLowerCase().includes(search) || 
                          (animal.name && animal.name.toLowerCase().includes(search));
        const matchType = !type || animal.type === type;
        const matchStatus = !status || animal.status === status;
        return matchSearch && matchType && matchStatus;
    });

    displayAnimals(filtered);
}

// Download PDF
function downloadPDF() {
    const token = auth.getToken();
    window.open(`${API_URL}/pdf/livestock?token=${token}`, '_blank');
}

loadAnimals();
