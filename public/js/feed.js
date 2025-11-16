auth.checkAuth();
const user = auth.getUser();
if (user) {
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userRole').textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    document.getElementById('userAvatar').textContent = user.name.charAt(0).toUpperCase();
}

let allItems = [];
let allAllocations = [];

async function loadData() {
    await Promise.all([loadInventory(), loadAllocations()]);
}

async function loadInventory() {
    const data = await apiRequest('/feed/inventory');
    if (data && data.success) {
        allItems = data.data;
        displayInventory(allItems);
        populateFeedSelect();
    }
}

function displayInventory(items) {
    const tbody = document.getElementById('inventoryTable');
    tbody.innerHTML = '';
    if (items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No items found</td></tr>';
        return;
    }
    items.forEach(item => {
        const isLowStock = item.currentStock <= item.reorderLevel;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${item.itemName}</strong></td>
            <td><span class="badge badge-info">${item.category}</span></td>
            <td>${item.currentStock} ${item.unit}</td>
            <td>${item.reorderLevel} ${item.unit}</td>
            <td><span class="badge badge-${isLowStock ? 'danger' : 'success'}">${isLowStock ? 'Low Stock' : 'Good'}</span></td>
            <td>${item.supplier || 'N/A'}</td>
            <td class="actions">
                <button class="btn btn-sm btn-secondary" onclick='editItem(${JSON.stringify(item).replace(/'/g, "&#39;")})'>Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteItem('${item._id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function loadAllocations() {
    const data = await apiRequest('/feed/allocations');
    if (data && data.success) {
        allAllocations = data.data;
        displayAllocations(allAllocations);
    }
}

function displayAllocations(allocations) {
    const tbody = document.getElementById('allocationsTable');
    tbody.innerHTML = '';
    if (allocations.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">No allocations found</td></tr>';
        return;
    }
    allocations.slice(0, 10).forEach(allocation => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(allocation.date)}</td>
            <td>${allocation.feedItemName}</td>
            <td>${allocation.quantity} ${allocation.unit}</td>
            <td>${allocation.allocatedTo}</td>
        `;
        tbody.appendChild(row);
    });
}

function populateFeedSelect() {
    const select = document.getElementById('feedItemId');
    select.innerHTML = '<option value="">Select Feed Item</option>';
    allItems.forEach(item => {
        select.innerHTML += `<option value="${item._id}">${item.itemName} (${item.currentStock} ${item.unit})</option>`;
    });
}

function openAddModal() {
    document.getElementById('modalTitle').textContent = 'Add Inventory Item';
    document.getElementById('itemForm').reset();
    document.getElementById('itemId').value = '';
    document.getElementById('itemModal').classList.add('active');
}

function editItem(item) {
    document.getElementById('modalTitle').textContent = 'Edit Inventory Item';
    document.getElementById('itemId').value = item._id;
    document.getElementById('itemName').value = item.itemName;
    document.getElementById('category').value = item.category;
    document.getElementById('currentStock').value = item.currentStock;
    document.getElementById('unit').value = item.unit;
    document.getElementById('reorderLevel').value = item.reorderLevel;
    document.getElementById('supplier').value = item.supplier || '';
    document.getElementById('notes').value = item.notes || '';
    document.getElementById('itemModal').classList.add('active');
}

function closeModal() {
    document.getElementById('itemModal').classList.remove('active');
}

function openAllocationModal() {
    document.getElementById('allocationForm').reset();
    document.getElementById('allocationModal').classList.add('active');
}

function closeAllocationModal() {
    document.getElementById('allocationModal').classList.remove('active');
}

document.getElementById('itemForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const itemData = {
        itemName: document.getElementById('itemName').value,
        category: document.getElementById('category').value,
        currentStock: parseFloat(document.getElementById('currentStock').value),
        unit: document.getElementById('unit').value,
        reorderLevel: parseFloat(document.getElementById('reorderLevel').value),
        supplier: document.getElementById('supplier').value || undefined,
        notes: document.getElementById('notes').value || undefined
    };
    const itemId = document.getElementById('itemId').value;
    const method = itemId ? 'PUT' : 'POST';
    const endpoint = itemId ? `/feed/inventory/${itemId}` : '/feed/inventory';
    const data = await apiRequest(endpoint, method, itemData);
    if (data && data.success) {
        showAlert(`Item ${itemId ? 'updated' : 'added'} successfully!`);
        closeModal();
        loadInventory();
    } else {
        showAlert(data?.message || 'Operation failed', 'danger');
    }
});

document.getElementById('allocationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const selectedItem = allItems.find(i => i._id === document.getElementById('feedItemId').value);
    if (!selectedItem) return;
    
    const allocationData = {
        feedItemId: selectedItem._id,
        feedItemName: selectedItem.itemName,
        quantity: parseFloat(document.getElementById('quantity').value),
        unit: selectedItem.unit,
        allocatedTo: document.getElementById('allocatedTo').value,
        notes: document.getElementById('allocationNotes').value || undefined
    };
    const data = await apiRequest('/feed/allocations', 'POST', allocationData);
    if (data && data.success) {
        showAlert('Feed allocated successfully!');
        closeAllocationModal();
        loadData();
    } else {
        showAlert(data?.message || 'Operation failed', 'danger');
    }
});

async function deleteItem(id) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    const data = await apiRequest(`/feed/inventory/${id}`, 'DELETE');
    if (data && data.success) {
        showAlert('Item deleted successfully!');
        loadInventory();
    }
}

document.getElementById('searchInput').addEventListener('input', filterItems);
document.getElementById('categoryFilter').addEventListener('change', filterItems);

function filterItems() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const filtered = allItems.filter(item => {
        const matchSearch = item.itemName.toLowerCase().includes(search);
        const matchCategory = !category || item.category === category;
        return matchSearch && matchCategory;
    });
    displayInventory(filtered);
}

// Download PDF
function downloadPDF() {
    const token = auth.getToken();
    window.open(`${API_URL}/pdf/feed?token=${token}`, '_blank');
}

loadData();
