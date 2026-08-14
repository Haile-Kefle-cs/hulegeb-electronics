// Super Admin Panel - Enhanced
const currentUser = checkAuth('superadmin');
if (!currentUser) window.location.href = 'admin.html';

document.getElementById('current-user').textContent = currentUser.name;

let users = JSON.parse(localStorage.getItem('adminUsers')) || {};
let products = JSON.parse(localStorage.getItem('products')) || [];
let orders = JSON.parse(localStorage.getItem('orders')) || [];

// Sidebar navigation with onclick
function switchPage(page) {
    document.querySelectorAll('.sidebar-menu li').forEach(li => li.classList.remove('active'));
    const activeItem = document.querySelector(`.sidebar-menu li[data-page="${page}"]`);
    if (activeItem) activeItem.classList.add('active');
    
    document.querySelectorAll('.page').forEach(p => { p.classList.remove('active'); p.style.display = 'none'; });
    const selectedPage = document.getElementById(`${page}-page`);
    if (selectedPage) { selectedPage.classList.add('active'); selectedPage.style.display = 'block'; }
    
    const titles = { dashboard: 'Dashboard', users: 'Manage Users', admins: 'Manage Admins', products: 'View Products', settings: 'Settings' };
    document.getElementById('page-title').textContent = titles[page] || 'Dashboard';
    
    if (page === 'dashboard') loadDashboard();
    if (page === 'users') loadUsers();
    if (page === 'admins') loadAdmins();
    if (page === 'products') loadProducts();
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
    document.querySelector('.main-content').classList.toggle('expanded');
}

function loadDashboard() {
    const userList = Object.values(users);
    document.getElementById('total-users').textContent = userList.filter(u => u.role === 'user').length;
    document.getElementById('total-admins').textContent = userList.filter(u => u.role === 'admin').length;
    document.getElementById('total-products').textContent = products.length;
    document.getElementById('total-orders').textContent = orders.length;
    
    // Load recent orders
    const recentContainer = document.getElementById('recent-orders');
    if (recentContainer) {
        if (orders.length === 0) {
            recentContainer.innerHTML = '<p>No recent orders</p>';
        } else {
            const recent = orders.slice(-5).reverse();
            recentContainer.innerHTML = recent.map(order => `
                <div class="recent-order-item">
                    <div><strong>${order.orderId || 'Order'}</strong><p>${order.name} - ${new Date(order.date).toLocaleDateString()}</p></div>
                    <span>ETB ${(order.finalTotal || order.total || 0).toLocaleString()}</span>
                </div>
            `).join('');
        }
    }
}

function loadUsers() {
    const tbody = document.getElementById('users-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    const userList = Object.values(users).filter(u => u.role === 'user');
    if (userList.length === 0) { tbody.innerHTML = '<tr><td colspan="7">No users found</td></tr>'; return; }
    userList.forEach((user, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td><td>${user.name || 'N/A'}</td><td>${user.email || 'N/A'}</td>
            <td>${user.role}</td>
            <td><span class="status-badge ${user.status === 'active' ? 'status-active' : 'status-inactive'}">${user.status || 'active'}</span></td>
            <td>${new Date(user.created || Date.now()).toLocaleDateString()}</td>
            <td>
                <button class="action-btn btn-toggle" onclick="toggleUserStatus('${user.username}')"><i class="fas fa-power-off"></i></button>
                <button class="action-btn btn-delete" onclick="deleteUser('${user.username}')"><i class="fas fa-trash"></i></button>
            </td>`;
    });
}

function loadAdmins() {
    const tbody = document.getElementById('admins-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    const adminList = Object.values(users).filter(u => u.role === 'admin');
    if (adminList.length === 0) { tbody.innerHTML = '<tr><td colspan="6">No admins found</td></tr>'; return; }
    adminList.forEach((admin, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td><td>${admin.username}</td><td>${admin.name || 'N/A'}</td>
            <td><span class="status-badge ${admin.status === 'active' ? 'status-active' : 'status-inactive'}">${admin.status || 'active'}</span></td>
            <td>${new Date(admin.created || Date.now()).toLocaleDateString()}</td>
            <td>
                <button class="action-btn btn-toggle" onclick="toggleUserStatus('${admin.username}')"><i class="fas fa-power-off"></i></button>
                <button class="action-btn btn-delete" onclick="deleteUser('${admin.username}')"><i class="fas fa-trash"></i></button>
            </td>`;
    });
}

function loadProducts() {
    const tbody = document.getElementById('super-products-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    products = JSON.parse(localStorage.getItem('products')) || [];
    if (products.length === 0) { tbody.innerHTML = '<tr><td colspan="6">No products</td></tr>'; return; }
    products.forEach((product, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${product.id || index + 1}</td><td>${product.name}</td><td>${product.category}</td>
            <td>ETB ${product.price?.toLocaleString()}</td><td>${product.stock}</td>
            <td><span class="status-badge ${product.status === 'active' ? 'status-active' : 'status-inactive'}">${product.status || 'active'}</span></td>`;
    });
}

function toggleUserStatus(username) {
    if (username === 'superadmin') { showToast('Cannot deactivate super admin'); return; }
    if (users[username]) {
        users[username].status = users[username].status === 'active' ? 'inactive' : 'active';
        localStorage.setItem('adminUsers', JSON.stringify(users));
        loadUsers(); loadAdmins(); loadDashboard();
        showToast(`User ${users[username].status}`);
    }
}

function deleteUser(username) {
    if (username === 'superadmin') { showToast('Cannot delete super admin'); return; }
    if (confirm(`Delete ${username}?`)) {
        delete users[username];
        localStorage.setItem('adminUsers', JSON.stringify(users));
        loadUsers(); loadAdmins(); loadDashboard();
        showToast('User deleted');
    }
}

function showAddUserModal() { document.getElementById('add-user-modal').classList.add('active'); }
function showAddAdminModal() { document.getElementById('add-admin-modal').classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

document.getElementById('add-user-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('user-email').value;
    const username = email.split('@')[0];
    users[username] = { username, name: document.getElementById('user-name').value, email, password: document.getElementById('user-password').value, role: 'user', status: 'active', created: new Date().toISOString() };
    localStorage.setItem('adminUsers', JSON.stringify(users));
    closeModal('add-user-modal'); this.reset(); loadUsers(); loadDashboard(); showToast('User added');
});

document.getElementById('add-admin-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('admin-username').value;
    users[username] = { username, name: document.getElementById('admin-name').value, email: '', password: document.getElementById('admin-password').value, role: 'admin', status: 'active', created: new Date().toISOString() };
    localStorage.setItem('adminUsers', JSON.stringify(users));
    closeModal('add-admin-modal'); this.reset(); loadAdmins(); loadDashboard(); showToast('Admin added');
});

function saveSettings() {
    const settings = {
        storeName: document.getElementById('store-name')?.value || 'Hulegeb Electronics',
        email: document.getElementById('store-email')?.value || 'hulgebmereja2017@gmail.com',
        phone: document.getElementById('store-phone')?.value || '+251 911 234 567',
        location: document.getElementById('store-location')?.value || 'Debre Berhan, Ethiopia'
    };
    localStorage.setItem('storeSettings', JSON.stringify(settings));
    showToast('Settings saved');
}

function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'toast'; toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3000);
}

// Make functions global
window.switchPage = switchPage;
window.toggleSidebar = toggleSidebar;
window.toggleUserStatus = toggleUserStatus;
window.deleteUser = deleteUser;
window.showAddUserModal = showAddUserModal;
window.showAddAdminModal = showAddAdminModal;
window.closeModal = closeModal;
window.saveSettings = saveSettings;
window.logout = logout;

// Initialize
loadDashboard();