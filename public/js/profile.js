auth.checkAuth();
const user = auth.getUser();
if (user) {
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userRole').textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    document.getElementById('userAvatar').textContent = user.name.charAt(0).toUpperCase();
}

// Load user profile
async function loadProfile() {
    const data = await apiRequest('/profile');
    if (data && data.success) {
        const profile = data.data;
        document.getElementById('profileName').value = profile.name;
        document.getElementById('profileEmail').value = profile.email;
        document.getElementById('profileContact').value = profile.contactNumber || '';
        document.getElementById('profileRole').value = profile.role.charAt(0).toUpperCase() + profile.role.slice(1);
    }
}

// Update profile form
document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const profileData = {
        name: document.getElementById('profileName').value,
        email: document.getElementById('profileEmail').value,
        contactNumber: document.getElementById('profileContact').value
    };

    const data = await apiRequest('/profile', 'PUT', profileData);
    if (data && data.success) {
        // Update local storage
        const updatedUser = {
            ...auth.getUser(),
            name: data.data.name,
            email: data.data.email
        };
        auth.setUser(updatedUser);
        
        // Update UI
        document.getElementById('userName').textContent = data.data.name;
        document.getElementById('userAvatar').textContent = data.data.name.charAt(0).toUpperCase();
        
        showAlert('Profile updated successfully!');
    } else {
        showAlert(data?.message || 'Failed to update profile', 'danger');
    }
});

// Change password form
document.getElementById('passwordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        showAlert('New passwords do not match', 'danger');
        return;
    }

    const passwordData = {
        currentPassword: document.getElementById('currentPassword').value,
        newPassword: newPassword
    };

    const data = await apiRequest('/profile/password', 'PUT', passwordData);
    if (data && data.success) {
        showAlert('Password changed successfully!');
        document.getElementById('passwordForm').reset();
    } else {
        showAlert(data?.message || 'Failed to change password', 'danger');
    }
});

loadProfile();
