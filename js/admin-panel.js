// ==================== Admin Panel with SMS Notifications ====================

const currentUser = checkAuth('admin');
if (!currentUser) window.location.href = 'admin.html';

document.getElementById('current-user').textContent = currentUser.name;

let products = JSON.parse(localStorage.getItem('products')) || [];
let orders = JSON.parse(localStorage.getItem('orders')) || [];
let categories = JSON.parse(localStorage.getItem('categories')) || [];
let editingProductId = null;
let editingCategoryId = null;
let uploadedImageData = null;

// Initialize default categories
if (categories.length === 0) {
    categories = [
        { id: 1, name: 'Phones', name_am: 'ስልኮች', icon: 'fa-mobile-alt', status: 'active', order: 1, slug: 'phones' },
        { id: 2, name: 'Laptops', name_am: 'ላፕቶፖች', icon: 'fa-laptop', status: 'active', order: 2, slug: 'laptops' },
        { id: 3, name: 'Tablets', name_am: 'ታብሌቶች', icon: 'fa-tablet-alt', status: 'active', order: 3, slug: 'tablets' },
        { id: 4, name: 'Audio', name_am: 'ኦዲዮ', icon: 'fa-headphones', status: 'active', order: 4, slug: 'audio' },
        { id: 5, name: 'Watches', name_am: 'ሰዓቶች', icon: 'fa-clock', status: 'active', order: 5, slug: 'watches' },
        { id: 6, name: 'Accessories', name_am: 'ተጨማሪ እቃዎች', icon: 'fa-plug', status: 'active', order: 6, slug: 'accessories' },
        { id: 7, name: 'Cameras', name_am: 'ካሜራዎች', icon: 'fa-camera', status: 'active', order: 7, slug: 'cameras' },
        { id: 8, name: 'Gaming', name_am: 'ጨዋታ', icon: 'fa-gamepad', status: 'active', order: 8, slug: 'gaming' }
    ];
    localStorage.setItem('categories', JSON.stringify(categories));
}

// Initialize default products
if (products.length === 0) {
    products = [
        {
            id: 1,
            name: 'iPhone 15 Pro Max',
            name_am: 'አይፎን 15 ፕሮ ማክስ',
            description: 'Latest Apple flagship',
            description_am: 'የቅርብ ጊዜ የአፕል ባንዲራ',
            price: 185000,
            category: 'phones',
            image: 'https://placehold.co/400x300/2563eb/ffffff?text=iPhone',
            rating: 4.9,
            reviews: 256,
            stock: 15,
            status: 'active'
        }
    ];
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('productsUpdated', Date.now().toString());
}

// ==================== Sync ====================
function syncToWebsite() {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('categories', JSON.stringify(categories));
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('productsUpdated', Date.now().toString());
    localStorage.setItem('categoriesUpdated', Date.now().toString());
    localStorage.setItem('ordersUpdated', Date.now().toString());
}

// ==================== Image Upload ====================
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { showToast('⚠️ Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { showToast('⚠️ Image too large. Max 5MB'); return; }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        uploadedImageData = e.target.result;
        document.getElementById('product-image-data').value = uploadedImageData;
        const preview = document.getElementById('image-preview');
        preview.innerHTML = `<img src="${uploadedImageData}" style="width:100%;height:100%;object-fit:cover;">`;
        preview.classList.add('has-image');
        document.getElementById('remove-image-btn').style.display = 'inline-block';
        showToast('✅ Image selected');
    };
    reader.readAsDataURL(file);
}

function removeImage() {
    uploadedImageData = null;
    document.getElementById('product-image-data').value = '';
    document.getElementById('product-image-input').value = '';
    const preview = document.getElementById('image-preview');
    preview.innerHTML = '<i class="fas fa-image"></i><span>Click "Choose from Gallery" to upload image</span>';
    preview.classList.remove('has-image');
    document.getElementById('remove-image-btn').style.display = 'none';
    showToast('Image removed');
}

// ==================== Navigation ====================
function switchPage(page) {
    document.querySelectorAll('.sidebar-menu li').forEach(li => li.classList.remove('active'));
    const activeItem = document.querySelector(`.sidebar-menu li[data-page="${page}"]`);
    if (activeItem) activeItem.classList.add('active');
    
    document.querySelectorAll('.page').forEach(p => { p.classList.remove('active'); p.style.display = 'none'; });
    const selectedPage = document.getElementById(`${page}-page`);
    if (selectedPage) { selectedPage.classList.add('active'); selectedPage.style.display = 'block'; }
    
    const titles = { 
        dashboard: 'Dashboard', 
        products: 'Manage Products', 
        categories: 'Manage Categories',
        orders: 'Orders', 
        customers: 'Customers',
        settings: 'Settings'
    };
    document.getElementById('page-title').textContent = titles[page] || 'Dashboard';
    
    if (page === 'dashboard') loadDashboard();
    if (page === 'products') loadProducts();
    if (page === 'categories') loadCategories();
    if (page === 'orders') loadOrders();
    if (page === 'customers') loadCustomers();
    if (page === 'settings') loadSettings();
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
    document.querySelector('.main-content').classList.toggle('expanded');
}

// ==================== Load Functions ====================
function loadDashboard() {
    products = JSON.parse(localStorage.getItem('products')) || [];
    orders = JSON.parse(localStorage.getItem('orders')) || [];
    categories = JSON.parse(localStorage.getItem('categories')) || [];
    
    document.getElementById('total-products').textContent = products.length;
    document.getElementById('active-products').textContent = products.filter(p => p.status !== 'inactive').length;
    document.getElementById('inactive-products').textContent = products.filter(p => p.status === 'inactive').length;
    document.getElementById('total-orders').textContent = orders.length;
    updateCategoryFilter();
}

function loadProducts() {
    const tbody = document.getElementById('products-table-body');
    if (!tbody) return;
    products = JSON.parse(localStorage.getItem('products')) || [];
    tbody.innerHTML = '';
    if (products.length === 0) { tbody.innerHTML = '<tr><td colspan="8">No products</td></tr>'; return; }
    products.forEach((product, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${product.id || index + 1}</td>
            <td><img src="${product.image}" style="width:50px;height:50px;object-fit:cover;border-radius:5px;" onerror="this.src='https://placehold.co/50x50'"></td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>ETB ${product.price?.toLocaleString()}</td>
            <td>${product.stock}</td>
            <td><span class="status-badge ${product.status === 'active' ? 'status-active' : 'status-inactive'}">${product.status || 'active'}</span></td>
            <td>
                <button class="action-btn btn-edit" onclick="editProduct(${index})"><i class="fas fa-edit"></i></button>
                <button class="action-btn btn-toggle" onclick="toggleProductStatus(${index})"><i class="fas fa-power-off"></i></button>
                <button class="action-btn btn-delete" onclick="deleteProduct(${index})"><i class="fas fa-trash"></i></button>
            </td>`;
    });
}

function loadCategories() {
    const tbody = document.getElementById('categories-table-body');
    if (!tbody) return;
    categories = JSON.parse(localStorage.getItem('categories')) || [];
    tbody.innerHTML = '';
    if (categories.length === 0) { tbody.innerHTML = '<tr><td colspan="7">No categories</td></tr>'; return; }
    categories.sort((a, b) => (a.order || 1) - (b.order || 1));
    categories.forEach((category, index) => {
        const productCount = products.filter(p => p.category === category.slug).length;
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${category.id || index + 1}</td>
            <td><i class="fas ${category.icon || 'fa-tag'}"></i></td>
            <td>${category.name}</td>
            <td>${category.name_am || 'N/A'}</td>
            <td>${productCount} products</td>
            <td><span class="status-badge ${category.status === 'active' ? 'status-active' : 'status-inactive'}">${category.status || 'active'}</span></td>
            <td>
                <button class="action-btn btn-edit" onclick="editCategory(${index})"><i class="fas fa-edit"></i></button>
                <button class="action-btn btn-toggle" onclick="toggleCategoryStatus(${index})"><i class="fas fa-power-off"></i></button>
                <button class="action-btn btn-delete" onclick="deleteCategory(${index})"><i class="fas fa-trash"></i></button>
            </td>`;
    });
    updateCategoryFilter();
}

// ==================== ORDER STATUS MANAGEMENT ====================
function getStatusClass(status) {
    switch(status) {
        case 'pending': return 'status-pending';
        case 'processing': return 'status-processing';
        case 'delivered': return 'status-delivered';
        case 'completed': return 'status-completed';
        case 'rejected': return 'status-rejected';
        default: return 'status-pending';
    }
}

function getStatusText(status) {
    const lang = localStorage.getItem('adminLanguage') || 'en';
    if (lang === 'am') {
        switch(status) {
            case 'pending': return 'በመጠባበቅ ላይ';
            case 'processing': return 'በሂደት ላይ';
            case 'delivered': return 'ተላክቷል';
            case 'completed': return 'ተጠናቋል';
            case 'rejected': return 'ውድቅ ተደርጓል';
            default: return 'በመጠባበቅ ላይ';
        }
    } else {
        switch(status) {
            case 'pending': return 'Pending';
            case 'processing': return 'Processing';
            case 'delivered': return 'Delivered';
            case 'completed': return 'Completed';
            case 'rejected': return 'Rejected';
            default: return 'Pending';
        }
    }
}

function loadOrders() {
    const tbody = document.getElementById('orders-table-body');
    if (!tbody) return;
    orders = JSON.parse(localStorage.getItem('orders')) || [];
    tbody.innerHTML = '';
    
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">No orders found</td></tr>';
        return;
    }
    
    const sortedOrders = [...orders].reverse();
    
    sortedOrders.forEach((order, index) => {
        const actualIndex = orders.indexOf(order);
        const row = tbody.insertRow();
        const currentStatus = order.status || 'pending';
        
        row.innerHTML = `
            <td>${order.orderId || '#' + (actualIndex + 1)}</td>
            <td>${order.name}</td>
            <td>${order.phone || 'N/A'}</td>
            <td>${order.items?.length || 0} items</td>
            <td>ETB ${(order.finalTotal || order.total || 0).toLocaleString()}</td>
            <td>${new Date(order.date).toLocaleDateString()}</td>
            <td>
                <select class="status-dropdown ${getStatusClass(currentStatus)}" 
                        onchange="updateOrderStatusInstant(${actualIndex}, this.value, this)">
                    <option value="pending" ${currentStatus === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="processing" ${currentStatus === 'processing' ? 'selected' : ''}>Processing</option>
                    <option value="delivered" ${currentStatus === 'delivered' ? 'selected' : ''}>Delivered</option>
                    <option value="completed" ${currentStatus === 'completed' ? 'selected' : ''}>Completed</option>
                    <option value="rejected" ${currentStatus === 'rejected' ? 'selected' : ''}>Rejected</option>
                </select>
            </td>
            <td>
                <button class="action-btn btn-edit" onclick="viewOrder(${actualIndex})" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
            </td>`;
    });
}

// INSTANT status update
function updateOrderStatusInstant(index, newStatus, selectElement) {
    if (!orders[index]) return;
    
    const order = orders[index];
    const oldStatus = order.status;
    
    // Update immediately
    order.status = newStatus;
    order.statusUpdatedAt = new Date().toISOString();
    
    // Save immediately
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('ordersUpdated', Date.now().toString());
    
    // Update dropdown color immediately
    if (selectElement) {
        selectElement.className = `status-dropdown ${getStatusClass(newStatus)}`;
    }
    
    // Show toast immediately
    showToast(`✅ Status: ${getStatusText(newStatus)}`);
    
    // Send Email + SMS in background
    sendOrderStatusNotification(order, newStatus, '');
    
    loadDashboard();
    console.log(`✅ Order ${order.orderId}: ${oldStatus} → ${newStatus}`);
}

// Send Email + SMS notification
function sendOrderStatusNotification(order, status, note) {
    const statusMessages = {
        pending: { 
            en: 'Your order is pending. We will process it soon.', 
            am: 'ትዕዛዝዎ በመጠባበቅ ላይ ነው። በቅርቡ እናስኬደዋለን።' 
        },
        processing: { 
            en: 'Your order is now being processed.', 
            am: 'ትዕዛዝዎ በሂደት ላይ ነው።' 
        },
        delivered: { 
            en: 'Your order has been delivered! Thank you.', 
            am: 'ትዕዛዝዎ ተላክቷል! እናመሰግናለን።' 
        },
        completed: { 
            en: 'Your order has been completed! Thank you.', 
            am: 'ትዕዛዝዎ ተጠናቋል! እናመሰግናለን።' 
        },
        rejected: { 
            en: 'Your order has been rejected. Contact us.', 
            am: 'ትዕዛዝዎ ውድቅ ተደርጓል። ያግኙን።' 
        }
    };
    
    const notificationData = {
        orderId: order.orderId,
        customerName: order.name,
        customerEmail: order.email,
        customerPhone: order.phone,
        status: status,
        statusTextEn: statusMessages[status]?.en || status,
        statusTextAm: statusMessages[status]?.am || status,
        note: note || ''
    };
    
    // Send to server (Email + SMS)
    fetch('http://localhost:3000/api/order-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationData)
    }).then(response => response.json())
      .then(data => {
          if (data.success) {
              console.log('✅ Email sent');
              if (data.smsSent) {
                  console.log('✅ SMS sent to:', order.phone);
              }
          }
      }).catch(error => {
          console.log('⚠️ Server not reachable');
      });
    
    // Save notification locally
    let notifications = JSON.parse(localStorage.getItem('orderNotifications')) || [];
    notifications.push(notificationData);
    localStorage.setItem('orderNotifications', JSON.stringify(notifications));
}

function loadCustomers() {
    const tbody = document.getElementById('customers-table-body');
    if (!tbody) return;
    orders = JSON.parse(localStorage.getItem('orders')) || [];
    tbody.innerHTML = '';
    if (orders.length === 0) { tbody.innerHTML = '<tr><td colspan="5">No customers</td></tr>'; return; }
    const customers = {};
    orders.forEach(order => {
        if (!customers[order.email]) customers[order.email] = { name: order.name, email: order.email, phone: order.phone, orders: 1 };
        else customers[order.email].orders++;
    });
    Object.values(customers).forEach((customer, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `<td>${index + 1}</td><td>${customer.name}</td><td>${customer.email}</td><td>${customer.phone || 'N/A'}</td><td>${customer.orders}</td>`;
    });
}

function loadSettings() {
    const userData = JSON.parse(sessionStorage.getItem('currentUser')) || {};
    document.getElementById('profile-name').value = userData.name || '';
    document.getElementById('profile-email').value = userData.email || '';
    document.getElementById('profile-phone').value = userData.phone || '';
    
    const storeSettings = JSON.parse(localStorage.getItem('storeSettings')) || {};
    document.getElementById('store-name').value = storeSettings.storeName || 'Hulegeb Electronics';
    document.getElementById('store-email').value = storeSettings.email || 'hulgebmereja2017@gmail.com';
    document.getElementById('store-phone').value = storeSettings.phone || '+251 911 234 567';
    document.getElementById('store-location').value = storeSettings.location || 'Debre Berhan, Ethiopia';
}

// ==================== Category Functions ====================
function updateCategoryFilter() {
    const filterSelect = document.getElementById('category-filter');
    if (filterSelect) {
        filterSelect.innerHTML = '<option value="all">All Categories</option>';
        categories.filter(c => c.status !== 'inactive').forEach(category => {
            const option = document.createElement('option');
            option.value = category.slug;
            option.textContent = category.name;
            filterSelect.appendChild(option);
        });
    }
}

function loadCategoriesIntoProductForm() {
    const categorySelect = document.getElementById('product-category');
    if (!categorySelect) return;
    categories = JSON.parse(localStorage.getItem('categories')) || [];
    categorySelect.innerHTML = '<option value="">Select Category</option>';
    categories.filter(c => c.status !== 'inactive').forEach(category => {
        const option = document.createElement('option');
        option.value = category.slug;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
}

function showAddCategoryModal() {
    editingCategoryId = null;
    document.getElementById('category-modal-title').textContent = 'Add Category';
    document.getElementById('category-form').reset();
    document.getElementById('category-order').value = categories.length + 1;
    document.getElementById('category-modal').classList.add('active');
}

function editCategory(index) {
    const category = categories[index];
    editingCategoryId = index;
    document.getElementById('category-modal-title').textContent = 'Edit Category';
    document.getElementById('category-name-en').value = category.name || '';
    document.getElementById('category-name-am').value = category.name_am || '';
    document.getElementById('category-icon').value = category.icon || 'fa-tag';
    document.getElementById('category-desc').value = category.description || '';
    document.getElementById('category-status').value = category.status || 'active';
    document.getElementById('category-order').value = category.order || 1;
    document.getElementById('category-modal').classList.add('active');
}

function toggleCategoryStatus(index) {
    categories[index].status = categories[index].status === 'inactive' ? 'active' : 'inactive';
    localStorage.setItem('categories', JSON.stringify(categories));
    syncToWebsite();
    loadCategories();
    showToast(`Category ${categories[index].status === 'active' ? 'activated' : 'deactivated'}`);
}

function deleteCategory(index) {
    const category = categories[index];
    const productCount = products.filter(p => p.category === category.slug).length;
    if (productCount > 0) { showToast(`⚠️ Cannot delete. ${productCount} products use this category.`); return; }
    if (confirm(`Delete category "${category.name}"?`)) {
        categories.splice(index, 1);
        localStorage.setItem('categories', JSON.stringify(categories));
        syncToWebsite();
        loadCategories();
        showToast('✅ Category deleted');
    }
}

document.getElementById('category-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const nameEn = document.getElementById('category-name-en').value;
    const slug = nameEn.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const categoryData = {
        name: nameEn,
        name_am: document.getElementById('category-name-am').value,
        icon: document.getElementById('category-icon').value,
        description: document.getElementById('category-desc').value,
        status: document.getElementById('category-status').value,
        order: parseInt(document.getElementById('category-order').value) || 1,
        slug: slug
    };
    
    if (editingCategoryId !== null) {
        categoryData.id = categories[editingCategoryId].id;
        categories[editingCategoryId] = {...categories[editingCategoryId], ...categoryData};
        showToast('✅ Category updated');
    } else {
        categoryData.id = Date.now();
        categories.push(categoryData);
        showToast('✅ Category added');
    }
    
    localStorage.setItem('categories', JSON.stringify(categories));
    syncToWebsite();
    closeModal('category-modal');
    this.reset();
    loadCategories();
});

// ==================== Product Functions ====================
function showAddProductModal() {
    editingProductId = null;
    uploadedImageData = null;
    document.getElementById('modal-title').textContent = 'Add Product';
    document.getElementById('product-form').reset();
    loadCategoriesIntoProductForm();
    document.getElementById('product-image-data').value = '';
    document.getElementById('product-image-input').value = '';
    const preview = document.getElementById('image-preview');
    preview.innerHTML = '<i class="fas fa-image"></i><span>Click "Choose from Gallery" to upload image</span>';
    preview.classList.remove('has-image');
    document.getElementById('remove-image-btn').style.display = 'none';
    document.getElementById('product-modal').classList.add('active');
}

function editProduct(index) {
    const product = products[index];
    editingProductId = index;
    uploadedImageData = null;
    
    document.getElementById('modal-title').textContent = 'Edit Product';
    document.getElementById('product-name-en').value = product.name || '';
    document.getElementById('product-name-am').value = product.name_am || '';
    document.getElementById('product-desc-en').value = product.description || '';
    document.getElementById('product-desc-am').value = product.description_am || '';
    document.getElementById('product-price').value = product.price || '';
    document.getElementById('product-old-price').value = product.oldPrice || '';
    loadCategoriesIntoProductForm();
    document.getElementById('product-category').value = product.category || '';
    document.getElementById('product-stock').value = product.stock || 0;
    document.getElementById('product-status').value = product.status || 'active';
    document.getElementById('product-rating').value = product.rating || 4.5;
    document.getElementById('product-badge').value = product.badge || '';
    document.getElementById('product-image-data').value = '';
    document.getElementById('product-image-input').value = '';
    
    const preview = document.getElementById('image-preview');
    if (product.image) {
        preview.innerHTML = `<img src="${product.image}" style="width:100%;height:100%;object-fit:cover;">`;
        preview.classList.add('has-image');
        document.getElementById('remove-image-btn').style.display = 'inline-block';
    }
    
    document.getElementById('product-modal').classList.add('active');
}

function toggleProductStatus(index) {
    products[index].status = products[index].status === 'inactive' ? 'active' : 'inactive';
    syncToWebsite();
    loadProducts();
    loadDashboard();
    showToast(`Product ${products[index].status === 'active' ? 'activated' : 'deactivated'}`);
}

function deleteProduct(index) {
    if (confirm('Delete this product?')) {
        products.splice(index, 1);
        syncToWebsite();
        loadProducts();
        loadDashboard();
        showToast('Product deleted');
    }
}

function viewOrder(index) {
    const order = orders[index];
    if (!order) return;
    let itemsList = '';
    order.items?.forEach(item => {
        itemsList += `• ${item.name} x ${item.quantity} = ETB ${(item.price * item.quantity).toLocaleString()}\n`;
    });
    alert(`
ORDER: ${order.orderId}
Status: ${getStatusText(order.status || 'pending')}

CUSTOMER:
${order.name}
${order.email}
${order.phone || 'N/A'}
${order.city}, ${order.address}

ITEMS:
${itemsList}
Total: ETB ${order.finalTotal?.toLocaleString() || order.total?.toLocaleString()}
    `);
}

function filterProducts() {
    const search = document.getElementById('product-search')?.value.toLowerCase() || '';
    const category = document.getElementById('category-filter')?.value || 'all';
    const status = document.getElementById('status-filter')?.value || 'all';
    const tbody = document.getElementById('products-table-body');
    tbody.innerHTML = '';
    
    products.filter(p => 
        p.name.toLowerCase().includes(search) && 
        (category === 'all' || p.category === category) &&
        (status === 'all' || p.status === status)
    ).forEach((product) => {
        const originalIndex = products.indexOf(product);
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${product.id || originalIndex + 1}</td>
            <td><img src="${product.image}" style="width:50px;height:50px;"></td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>ETB ${product.price?.toLocaleString()}</td>
            <td>${product.stock}</td>
            <td><span class="status-badge ${product.status === 'active' ? 'status-active' : 'status-inactive'}">${product.status || 'active'}</span></td>
            <td>
                <button class="action-btn btn-edit" onclick="editProduct(${originalIndex})"><i class="fas fa-edit"></i></button>
                <button class="action-btn btn-toggle" onclick="toggleProductStatus(${originalIndex})"><i class="fas fa-power-off"></i></button>
                <button class="action-btn btn-delete" onclick="deleteProduct(${originalIndex})"><i class="fas fa-trash"></i></button>
            </td>`;
    });
}

document.getElementById('product-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const imageData = document.getElementById('product-image-data').value;
    const productNameEn = document.getElementById('product-name-en').value;
    
    const productData = {
        name: productNameEn,
        name_am: document.getElementById('product-name-am').value,
        description: document.getElementById('product-desc-en').value,
        description_am: document.getElementById('product-desc-am').value,
        price: parseFloat(document.getElementById('product-price').value),
        category: document.getElementById('product-category').value,
        stock: parseInt(document.getElementById('product-stock').value),
        status: document.getElementById('product-status').value,
        rating: parseFloat(document.getElementById('product-rating').value),
        badge: document.getElementById('product-badge')?.value || undefined,
        image: imageData || `https://placehold.co/400x300/2563eb/ffffff?text=${encodeURIComponent(productNameEn.substring(0, 20))}`
    };
    
    if (editingProductId !== null) {
        if (!imageData && products[editingProductId].image) productData.image = products[editingProductId].image;
        products[editingProductId] = {...products[editingProductId], ...productData};
        showToast('✅ Product updated');
    } else {
        productData.id = Date.now();
        products.push(productData);
        showToast('✅ Product added');
    }
    
    syncToWebsite();
    closeModal('product-modal');
    this.reset();
    loadProducts();
    loadDashboard();
});

// ==================== Settings Functions ====================
document.getElementById('profile-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const userData = JSON.parse(sessionStorage.getItem('currentUser')) || {};
    const users = JSON.parse(localStorage.getItem('adminUsers')) || {};
    userData.name = document.getElementById('profile-name').value;
    userData.email = document.getElementById('profile-email').value;
    userData.phone = document.getElementById('profile-phone').value;
    sessionStorage.setItem('currentUser', JSON.stringify(userData));
    if (userData.username && users[userData.username]) {
        users[userData.username].name = userData.name;
        users[userData.username].email = userData.email;
        users[userData.username].phone = userData.phone;
        localStorage.setItem('adminUsers', JSON.stringify(users));
    }
    document.getElementById('current-user').textContent = userData.name;
    showToast('✅ Profile updated');
});

document.getElementById('password-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const userData = JSON.parse(sessionStorage.getItem('currentUser')) || {};
    const users = JSON.parse(localStorage.getItem('adminUsers')) || {};
    const user = users[userData.username];
    
    if (!user || user.password !== currentPassword) { showToast('❌ Current password incorrect'); return; }
    if (newPassword !== confirmPassword) { showToast('❌ Passwords do not match'); return; }
    if (newPassword.length < 6) { showToast('❌ Minimum 6 characters'); return; }
    
    users[userData.username].password = newPassword;
    localStorage.setItem('adminUsers', JSON.stringify(users));
    sessionStorage.setItem('currentUser', JSON.stringify({...userData, password: newPassword}));
    this.reset();
    showToast('✅ Password changed');
});

document.getElementById('store-settings-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const settings = {
        storeName: document.getElementById('store-name').value,
        email: document.getElementById('store-email').value,
        phone: document.getElementById('store-phone').value,
        location: document.getElementById('store-location').value
    };
    localStorage.setItem('storeSettings', JSON.stringify(settings));
    showToast('✅ Store settings saved');
});

// ==================== Helpers ====================
function closeModal(id) { document.getElementById(id)?.classList.remove('active'); }

function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 50);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 200); }, 2000);
}

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// ==================== Export ====================
window.switchPage = switchPage;
window.toggleSidebar = toggleSidebar;
window.toggleProductStatus = toggleProductStatus;
window.deleteProduct = deleteProduct;
window.showAddProductModal = showAddProductModal;
window.editProduct = editProduct;
window.closeModal = closeModal;
window.viewOrder = viewOrder;
window.filterProducts = filterProducts;
window.logout = logout;
window.handleImageUpload = handleImageUpload;
window.removeImage = removeImage;
window.showAddCategoryModal = showAddCategoryModal;
window.editCategory = editCategory;
window.toggleCategoryStatus = toggleCategoryStatus;
window.deleteCategory = deleteCategory;
window.updateOrderStatusInstant = updateOrderStatusInstant;
window.getStatusText = getStatusText;
window.sendOrderStatusNotification = sendOrderStatusNotification;

// ==================== Initialize ====================
loadDashboard();
loadCategories();