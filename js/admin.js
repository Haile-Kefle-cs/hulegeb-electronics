// ==================== Admin Authentication System ====================

// Default users database
const defaultUsers = {
    superadmin: {
        username: 'superadmin',
        password: 'super123',
        role: 'superadmin',
        name: 'Super Admin',
        email: 'superadmin@hulegeb.com',
        status: 'active',
        created: new Date().toISOString()
    },
    admin: {
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        name: 'Shop Admin',
        email: 'admin@hulegeb.com',
        status: 'active',
        created: new Date().toISOString()
    }
};

// Initialize users in localStorage
function initializeUsers() {
    let users = JSON.parse(localStorage.getItem('adminUsers'));
    if (!users || Object.keys(users).length === 0) {
        localStorage.setItem('adminUsers', JSON.stringify(defaultUsers));
        users = defaultUsers;
    }
    return users;
}

// Login form handler
document.getElementById('login-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('login-error');
    const errorMessage = document.getElementById('error-message');
    
    // Get users
    const users = JSON.parse(localStorage.getItem('adminUsers')) || defaultUsers;
    
    // Find user
    const user = Object.values(users).find(u => 
        u.username === username && u.password === password
    );
    
    if (user) {
        if (user.status === 'inactive') {
            showError('Your account has been deactivated. Contact super admin.');
            return;
        }
        
        // Store current user
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        
        // Show success
        showSuccess('Login successful! Redirecting...');
        
        // Redirect based on role
        setTimeout(() => {
            if (user.role === 'superadmin') {
                window.location.href = 'super-admin.html';
            } else if (user.role === 'admin') {
                window.location.href = 'admin-panel.html';
            } else {
                window.location.href = 'index.html';
            }
        }, 1000);
    } else {
        showError('Invalid username or password');
    }
});

function showError(message) {
    const errorDiv = document.getElementById('login-error');
    const errorMessage = document.getElementById('error-message');
    errorDiv.style.display = 'flex';
    errorDiv.style.background = '#fee2e2';
    errorDiv.style.color = '#991b1b';
    errorMessage.textContent = message;
}

function showSuccess(message) {
    const errorDiv = document.getElementById('login-error');
    const errorMessage = document.getElementById('error-message');
    errorDiv.style.display = 'flex';
    errorDiv.style.background = '#d1fae5';
    errorDiv.style.color = '#065f46';
    errorMessage.textContent = message;
}

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eye-icon');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        eyeIcon.className = 'fas fa-eye';
    }
}

// Check auth function
function checkAuth(requiredRole) {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || 
                       JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        window.location.href = 'admin.html';
        return null;
    }
    
    if (requiredRole && currentUser.role !== requiredRole && currentUser.role !== 'superadmin') {
        alert('Access denied. You need ' + requiredRole + ' privileges.');
        window.location.href = 'admin.html';
        return null;
    }
    
    return currentUser;
}

// Logout function
function logout() {
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('currentUser');
    window.location.href = 'admin.html';
}

// Initialize
initializeUsers();
