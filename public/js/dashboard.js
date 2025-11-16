// Check authentication
auth.checkAuth();

// Set user info
const user = auth.getUser();
if (user) {
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userRole').textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    document.getElementById('userAvatar').textContent = user.name.charAt(0).toUpperCase();
}

// Load dashboard data
async function loadDashboardData() {
    await Promise.all([
        loadStatistics(),
        loadAlerts(),
        loadHerdStatus(),
        loadRecentMedical()
    ]);
}

// Load Statistics
async function loadStatistics() {
    // Total Animals
    const animalsData = await apiRequest('/cows');
    if (animalsData && animalsData.success) {
        document.getElementById('totalAnimals').textContent = animalsData.count;
    }

    // Today's Milk Production
    const milkData = await apiRequest('/milk/stats/production');
    if (milkData && milkData.success) {
        document.getElementById('todayMilk').textContent = milkData.data.todayTotal.toFixed(1) + 'L';
    }

    // Total Employees
    const employeesData = await apiRequest('/hr/employees');
    if (employeesData && employeesData.success) {
        const activeEmployees = employeesData.data.filter(emp => emp.status === 'Active');
        document.getElementById('totalEmployees').textContent = activeEmployees.length;
    }
}

// Load Alerts
async function loadAlerts() {
    const alertsData = await apiRequest('/alerts');
    if (alertsData && alertsData.success) {
        document.getElementById('alertCount').textContent = alertsData.count;
        
        const alertsContainer = document.getElementById('alertsContainer');
        if (alertsData.count > 0) {
            alertsContainer.innerHTML = '<h3 style="margin-bottom: 15px; color: var(--primary-color);">⚠️ Active Alerts</h3>';
            
            alertsData.data.slice(0, 5).forEach(alert => {
                const alertItem = document.createElement('div');
                alertItem.className = `alert-item ${alert.severity}`;
                alertItem.innerHTML = `
                    <div>
                        <strong>${alert.type === 'vaccination' ? '💉' : '📦'} ${alert.message}</strong>
                        <div style="font-size: 12px; color: var(--text-light); margin-top: 5px;">
                            ${alert.type === 'vaccination' ? formatDate(alert.data.nextVaccinationDate) : ''}
                        </div>
                    </div>
                    <span class="badge badge-${alert.severity === 'high' ? 'danger' : 'warning'}">
                        ${alert.severity.toUpperCase()}
                    </span>
                `;
                alertsContainer.appendChild(alertItem);
            });
        }
    }
}

// Load Herd Status
async function loadHerdStatus() {
    const animalsData = await apiRequest('/cows');
    if (animalsData && animalsData.success) {
        const animals = animalsData.data;
        const total = animals.length;
        
        const statusCount = {};
        animals.forEach(animal => {
            statusCount[animal.status] = (statusCount[animal.status] || 0) + 1;
        });

        const tbody = document.getElementById('herdStatusTable');
        tbody.innerHTML = '';

        Object.entries(statusCount).forEach(([status, count]) => {
            const percentage = ((count / total) * 100).toFixed(1);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><span class="badge badge-primary">${status}</span></td>
                <td>${count}</td>
                <td>${percentage}%</td>
            `;
            tbody.appendChild(row);
        });
    }
}

// Load Recent Medical Records
async function loadRecentMedical() {
    const medicalData = await apiRequest('/medical');
    if (medicalData && medicalData.success) {
        const tbody = document.getElementById('recentMedicalTable');
        tbody.innerHTML = '';

        const records = medicalData.data.slice(0, 5);
        
        if (records.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No medical records found</td></tr>';
            return;
        }

        records.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.animalId}</td>
                <td><span class="badge badge-info">${record.recordType}</span></td>
                <td>${formatDate(record.date)}</td>
                <td>${record.doctorName || 'N/A'}</td>
                <td>${record.treatment || record.vaccineName || 'N/A'}</td>
            `;
            tbody.appendChild(row);
        });
    }
}

// Initialize dashboard
loadDashboardData();

// Refresh data every 30 seconds
setInterval(loadDashboardData, 30000);
