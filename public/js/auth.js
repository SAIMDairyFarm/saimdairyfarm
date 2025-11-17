// API Configuration
const API_URL = '/api';

// Authentication utilities
const auth = {
    getToken() {
        return localStorage.getItem('token');
    },

    setToken(token) {
        localStorage.setItem('token', token);
    },

    getUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    },

    isAuthenticated() {
        return !!this.getToken();
    },

    checkAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = '/login.html';
        }
    }
};

// Login Form Handler
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const alertBox = document.getElementById('alertBox');

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                auth.setToken(data.token);
                auth.setUser(data.user);
                
                alertBox.className = 'alert alert-success';
                alertBox.textContent = 'Login successful! Redirecting...';
                alertBox.style.display = 'block';

                setTimeout(() => {
                    window.location.href = '/dashboard.html';
                }, 1000);
            } else {
                alertBox.className = 'alert alert-danger';
                alertBox.textContent = data.message || 'Login failed';
                alertBox.style.display = 'block';
            }
        } catch (error) {
            alertBox.className = 'alert alert-danger';
            alertBox.textContent = 'Error connecting to server. Please try again.';
            alertBox.style.display = 'block';
        }
    });
}

// API Request Helper
async function apiRequest(endpoint, method = 'GET', body = null) {
    const headers = {
        'Content-Type': 'application/json'
    };

    const token = auth.getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
        method,
        headers
    };

    if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        const data = await response.json();

        if (response.status === 401) {
            auth.logout();
            return null;
        }

        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        return null;
    }
}

// Show Alert
function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.display = 'block';
    
    const container = document.querySelector('.content-wrapper') || document.body;
    container.insertBefore(alertDiv, container.firstChild);

    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Format Date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Format Date for Input
function formatDateForInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}
