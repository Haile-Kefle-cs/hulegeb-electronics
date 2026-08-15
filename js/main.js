// ==================== Global Variables ====================
let currentLanguage = localStorage.getItem('language') || 'en';
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentFilter = 'all';
let currentProducts = [...products];
let dynamicCategories = [];

// ==================== DOM Elements ====================
const loadingScreen = document.getElementById('loading-screen');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const productsGrid = document.getElementById('products-grid');
const cartIcon = document.getElementById('cart-icon');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutModal = document.getElementById('checkout-modal');
const closeCheckout = document.getElementById('close-checkout');
const checkoutForm = document.getElementById('checkout-form');
const orderItems = document.getElementById('order-items');
const orderTotal = document.getElementById('order-total');
const contactForm = document.getElementById('contact-form');

// ==================== Currency Formatting ====================
function formatETB(amount) {
    if (currentLanguage === 'am') {
        return 'ብር ' + amount.toLocaleString('en-ET', {minimumFractionDigits: 0, maximumFractionDigits: 0});
    } else {
        return 'ETB ' + amount.toLocaleString('en-ET', {minimumFractionDigits: 0, maximumFractionDigits: 0});
    }
}

// ==================== Admin Sync ====================
function loadProductsFromAdmin() {
    const adminProducts = JSON.parse(localStorage.getItem('products'));
    if (adminProducts && adminProducts.length > 0) {
        const activeProducts = adminProducts.filter(p => p.status !== 'inactive');
        if (activeProducts.length > 0) {
            currentProducts = activeProducts;
            return true;
        }
    }
    return false;
}

function loadCategoriesFromAdmin() {
    const storedCategories = JSON.parse(localStorage.getItem('categories'));
    if (storedCategories && storedCategories.length > 0) {
        dynamicCategories = storedCategories.filter(c => c.status !== 'inactive');
        return true;
    }
    return false;
}

function updateProductFilters() {
    const filtersContainer = document.querySelector('.product-filters');
    if (!filtersContainer) return;
    
    loadCategoriesFromAdmin();
    filtersContainer.innerHTML = '';
    
    const allBtn = document.createElement('button');
    allBtn.className = 'filter-btn' + (currentFilter === 'all' ? ' active' : '');
    allBtn.dataset.filter = 'all';
    allBtn.innerHTML = `<i class="fas fa-th-large"></i> ${translations[currentLanguage]?.all || 'All'}`;
    filtersContainer.appendChild(allBtn);
    
    if (dynamicCategories.length > 0) {
        dynamicCategories.forEach(category => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn' + (currentFilter === category.slug ? ' active' : '');
            btn.dataset.filter = category.slug;
            btn.innerHTML = `<i class="fas ${category.icon || 'fa-tag'}"></i> ${currentLanguage === 'am' ? (category.name_am || category.name) : category.name}`;
            filtersContainer.appendChild(btn);
        });
    }
    
    attachFilterListeners();
}

function attachFilterListeners() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.dataset.filter;
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadProducts();
        });
    });
}

window.addEventListener('storage', function(e) {
    if (e.key === 'products' || e.key === 'productsUpdated') {
        loadProductsFromAdmin();
        loadProducts();
    }
    if (e.key === 'categories' || e.key === 'categoriesUpdated') {
        updateProductFilters();
        loadProducts();
    }
});

setInterval(() => {
    const lastProductUpdate = localStorage.getItem('productsUpdated');
    if (lastProductUpdate && lastProductUpdate !== sessionStorage.getItem('lastProductCheck')) {
        sessionStorage.setItem('lastProductCheck', lastProductUpdate);
        loadProductsFromAdmin();
        loadProducts();
    }
    
    const lastCategoryUpdate = localStorage.getItem('categoriesUpdated');
    if (lastCategoryUpdate && lastCategoryUpdate !== sessionStorage.getItem('lastCategoryCheck')) {
        sessionStorage.setItem('lastCategoryCheck', lastCategoryUpdate);
        updateProductFilters();
        loadProducts();
    }
}, 2000);

// ==================== Initialize ====================
document.addEventListener('DOMContentLoaded', () => {
    hideLoadingScreen();
    loadProductsFromAdmin();
    loadCategoriesFromAdmin();
    updateProductFilters();
    loadProducts();
    updateCart();
    setLanguage(currentLanguage);
    initializeEventListeners();
});

function hideLoadingScreen() {
    loadingScreen.classList.add('hidden');
    setTimeout(() => { loadingScreen.style.display = 'none'; }, 300);
}

// ==================== Event Listeners ====================
function initializeEventListeners() {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });
    
    cartIcon.addEventListener('click', () => {
        cartModal.classList.add('active');
        updateCartDisplay();
    });
    
    closeCart.addEventListener('click', () => cartModal.classList.remove('active'));
    
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) { showToast(translations[currentLanguage].emptyCart); return; }
        cartModal.classList.remove('active');
        checkoutModal.classList.add('active');
        updateCheckoutDisplay();
    });
    
    closeCheckout.addEventListener('click', () => checkoutModal.classList.remove('active'));
    
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) cartModal.classList.remove('active');
        if (e.target === checkoutModal) checkoutModal.classList.remove('active');
    });
    
    checkoutForm.addEventListener('submit', handleCheckout);
    contactForm.addEventListener('submit', handleContactForm);
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

// ==================== Language ====================
function setLanguage(lang) {
    currentLanguage = lang;
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.dataset.i18n;
        if (translations[lang] && translations[lang][key]) element.textContent = translations[lang][key];
    });
    document.documentElement.lang = lang === 'am' ? 'am' : 'en';
    updateProductFilters();
    loadProducts();
    updateCart();
    localStorage.setItem('language', lang);
}

// ==================== Products ====================
function loadProducts() {
    loadProductsFromAdmin();
    
    const filteredProducts = currentFilter === 'all' 
        ? currentProducts 
        : currentProducts.filter(p => p.category === currentFilter);
    
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `<p class="no-products">${translations[currentLanguage].noProducts}</p>`;
        return;
    }
    
    const fragment = document.createDocumentFragment();
    filteredProducts.forEach((product, index) => {
        const card = createProductCard(product);
        card.style.animationDelay = `${index * 0.01}s`;
        fragment.appendChild(card);
    });
    productsGrid.appendChild(fragment);
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card fade-in';
    const isAmharic = currentLanguage === 'am';
    const productName = isAmharic ? (product.name_am || product.name) : product.name;
    const productDescription = isAmharic ? (product.description_am || product.description) : product.description;
    const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
    
    let stockClass = 'in-stock';
    let stockText = translations[currentLanguage].inStock;
    if (product.stock === 0) { stockClass = 'out-of-stock'; stockText = translations[currentLanguage].outOfStock; }
    else if (product.stock <= 10) { stockClass = 'low-stock'; stockText = `${translations[currentLanguage].lowStock} ${product.stock} ${translations[currentLanguage].left}`; }
    
    let badgeText = '', badgeClass = '';
    if (product.badge) { badgeText = product.badge; badgeClass = product.badge.toLowerCase(); }
    else if (discount > 0) { badgeText = `-${discount}%`; badgeClass = 'sale'; }
    
    card.innerHTML = `
        <div class="product-image-container">
            ${badgeText ? `<span class="product-badge ${badgeClass}">${badgeText}</span>` : ''}
            <img src="${product.image || 'https://placehold.co/400x300'}" alt="${productName}" class="product-image" loading="lazy" onerror="this.src='https://placehold.co/400x300/2563eb/ffffff?text=${encodeURIComponent(productName.substring(0, 20))}'">
            <button class="quick-view-btn" onclick="quickView(${product.id})"><i class="fas fa-eye"></i> ${translations[currentLanguage].quickView}</button>
        </div>
        <div class="product-info">
            <h3 class="product-name">${productName}</h3>
            <p class="product-description">${productDescription}</p>
            <div class="product-price-container">
                <span class="product-price">${formatETB(product.price)}</span>
                ${product.oldPrice ? `<span class="product-old-price">${formatETB(product.oldPrice)}</span>` : ''}
                ${discount > 0 ? `<span class="product-discount">-${discount}%</span>` : ''}
            </div>
            <div class="product-rating">${generateStars(product.rating || 4.5)} <span>(${product.reviews || 0} ${translations[currentLanguage].reviews})</span></div>
            <div class="product-stock ${stockClass}"><i class="fas ${product.stock > 0 ? 'fa-check-circle' : 'fa-times-circle'}"></i> ${stockText}</div>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
                <i class="fas fa-shopping-cart"></i> ${translations[currentLanguage].addToCart}
            </button>
        </div>`;
    return card;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let stars = '';
    for (let i = 0; i < fullStars; i++) stars += '<i class="fas fa-star"></i>';
    if (halfStar) stars += '<i class="fas fa-star-half-alt"></i>';
    for (let i = 0; i < 5 - Math.ceil(rating); i++) stars += '<i class="far fa-star"></i>';
    return stars;
}

// ==================== Quick View ====================
function quickView(productId) {
    const product = currentProducts.find(p => p.id === productId);
    if (!product) return;
    const isAmharic = currentLanguage === 'am';
    const productName = isAmharic ? (product.name_am || product.name) : product.name;
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
        <div class="quick-view-content">
            <button class="close-quick-view" onclick="this.closest('.quick-view-modal').remove()">&times;</button>
            <div class="quick-view-image"><img src="${product.image || 'https://placehold.co/400x300'}" alt="${productName}"></div>
            <div class="quick-view-info">
                <h2>${productName}</h2>
                <p>${isAmharic ? (product.description_am || product.description) : product.description}</p>
                <div class="product-price-container"><span class="product-price">${formatETB(product.price)}</span></div>
                <button class="btn btn-primary" onclick="addToCart(${product.id}); this.closest('.quick-view-modal').remove();">
                    <i class="fas fa-shopping-cart"></i> ${translations[currentLanguage].addToCart}
                </button>
            </div>
        </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
}

// ==================== Cart Functions ====================
function addToCart(productId) {
    const product = currentProducts.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: currentLanguage === 'am' ? (product.name_am || product.name) : product.name,
            price: product.price,
            quantity: 1,
            image: product.image
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    animateCartIcon();
    showToast('✓ Added to cart');
}

function removeFromCart(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
        showToast('✓ Removed');
    }
}

function increaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    const product = currentProducts.find(p => p.id === productId);
    if (item && product) {
        if (item.quantity < (product.stock || 10)) {
            item.quantity += 1;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
        } else {
            showToast('⚠ Max stock');
        }
    }
}

function decreaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
        } else {
            removeFromCart(productId);
        }
    }
}

function clearCart() {
    if (cart.length === 0) return;
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    showToast('✓ Cart cleared');
}

function updateCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    updateCartDisplay();
}

function updateCartDisplay() {
    cartItems.innerHTML = '';
    let total = 0, totalItems = 0;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart-container">
                <i class="fas fa-shopping-cart empty-cart-icon"></i>
                <p class="empty-cart">${translations[currentLanguage].emptyCart}</p>
                <button class="btn btn-primary" onclick="closeCartAndShop()">${translations[currentLanguage].shopNow}</button>
            </div>`;
        cartTotal.textContent = formatETB(0);
        const summary = document.getElementById('cart-summary');
        if (summary) summary.innerHTML = '';
        return;
    }
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        totalItems += item.quantity;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-image"><img src="${item.image || 'https://placehold.co/80x80'}" alt="${item.name}"></div>
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-unit-price">${formatETB(item.price)} ${translations[currentLanguage].each}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="decreaseQuantity(${item.id})"><i class="fas fa-minus"></i></button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="increaseQuantity(${item.id})"><i class="fas fa-plus"></i></button>
                </div>
            </div>
            <div class="cart-item-right">
                <div class="cart-item-total">${formatETB(itemTotal)}</div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
            </div>`;
        cartItems.appendChild(itemElement);
    });
    
    cartTotal.textContent = formatETB(total);
    updateCartSummary(total, totalItems);
}

function updateCartSummary(total, totalItems) {
    const deliveryFee = total >= 50000 ? 0 : 200;
    const finalTotal = total + deliveryFee;
    const summary = document.getElementById('cart-summary');
    if (summary) {
        summary.innerHTML = `
            <div class="summary-row"><span>${translations[currentLanguage].items}:</span><span>${totalItems}</span></div>
            <div class="summary-row"><span>${translations[currentLanguage].subtotal}:</span><span>${formatETB(total)}</span></div>
            <div class="summary-row"><span>${translations[currentLanguage].delivery}:</span><span>${deliveryFee === 0 ? translations[currentLanguage].freeDelivery : formatETB(deliveryFee)}</span></div>
            <div class="summary-row total-row"><span>${translations[currentLanguage].total}:</span><span>${formatETB(finalTotal)}</span></div>`;
    }
}

function updateCheckoutDisplay() {
    orderItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        const itemElement = document.createElement('div');
        itemElement.className = 'checkout-item';
        itemElement.innerHTML = `
            <div class="checkout-item-info">
                <img src="${item.image || 'https://placehold.co/50x50'}" class="checkout-item-image">
                <div><h5>${item.name}</h5><p>${translations[currentLanguage].quantity}: ${item.quantity}</p></div>
            </div>
            <div class="checkout-item-total">${formatETB(itemTotal)}</div>`;
        orderItems.appendChild(itemElement);
    });
    
    const deliveryFee = total >= 50000 ? 0 : 200;
    const finalTotal = total + deliveryFee;
    orderTotal.innerHTML = `
        <div class="order-total-breakdown">
            <div class="summary-row"><span>${translations[currentLanguage].subtotal}:</span><span>${formatETB(total)}</span></div>
            <div class="summary-row"><span>${translations[currentLanguage].delivery}:</span><span>${deliveryFee === 0 ? translations[currentLanguage].freeDelivery : formatETB(deliveryFee)}</span></div>
            <div class="summary-row total-row"><span>${translations[currentLanguage].total}:</span><span>${formatETB(finalTotal)}</span></div>
        </div>`;
}

function animateCartIcon() {
    cartIcon.classList.add('cart-bounce');
    setTimeout(() => cartIcon.classList.remove('cart-bounce'), 300);
}

function closeCartAndShop() {
    cartModal.classList.remove('active');
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// ==================== CHECKOUT WITH FORMSPLIT EMAIL ====================
function handleCheckout(e) {
    e.preventDefault();
    
    const orderData = {
        orderId: `ORD-${Date.now()}`,
        name: document.getElementById('order-name').value,
        email: document.getElementById('order-email').value,
        phone: document.getElementById('order-phone').value,
        city: document.getElementById('order-city').value,
        address: document.getElementById('order-address').value,
        notes: document.getElementById('order-notes') ? document.getElementById('order-notes').value : '',
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        status: 'pending',
        date: new Date().toISOString()
    };
    orderData.finalTotal = orderData.total;
    
    if (cart.length === 0) { showToast('Cart is empty'); return; }
    
    // Save locally
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // SEND EMAIL VIA FORMSPLIT (FREE - NO SERVER NEEDED)
    fetch('https://formsubmit.co/ajax/hulgebmereja2017@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
            _subject: '🛒 New Order: ' + orderData.orderId + ' - ' + orderData.name,
            _template: 'table',
            'Order ID': orderData.orderId,
            'Customer Name': orderData.name,
            'Customer Email': orderData.email,
            'Customer Phone': orderData.phone,
            'City': orderData.city,
            'Address': orderData.address,
            'Notes': orderData.notes || 'None',
            'Total': 'ETB ' + orderData.finalTotal,
            'Items': JSON.stringify(cart.map(function(i) { return i.name + ' x ' + i.quantity; }))
        })
    }).then(function(res) { return res.json(); })
      .then(function(data) { console.log('Email sent via FormSubmit'); })
      .catch(function(err) { console.log('Email error:', err); });
    
    // Clear cart
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    
    // Close modal
    checkoutModal.classList.remove('active');
    checkoutForm.reset();
    
    // Show success
    showOrderSuccess(orderData);
}

function showOrderSuccess(orderData) {
    const overlay = document.createElement('div');
    overlay.className = 'order-success-overlay';
    overlay.id = 'order-success-overlay';
    
    overlay.innerHTML = `
        <div class="order-success-box">
            <div class="success-checkmark"><div class="check-icon"><i class="fas fa-check"></i></div></div>
            <h2 class="success-title">${currentLanguage === 'am' ? '✅ ትዕዛዝ በተሳካ ሁኔታ ተልኳል!' : '✅ Order Placed Successfully!'}</h2>
            <p>Order ID: <strong>${orderData.orderId}</strong></p>
            <p>Total: <strong>${formatETB(orderData.finalTotal)}</strong></p>
            <div class="success-actions">
                <button class="btn btn-primary" onclick="closeSuccessAndGoHome()">OK</button>
            </div>
        </div>`;
    
    document.body.appendChild(overlay);
    setTimeout(() => overlay.classList.add('show'), 50);
}

function closeSuccessAndGoHome() {
    const overlay = document.getElementById('order-success-overlay');
    if (overlay) overlay.remove();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeSuccessAndContinue() {
    const overlay = document.getElementById('order-success-overlay');
    if (overlay) overlay.remove();
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// ==================== CONTACT FORM WITH FORMSPLIT ====================
function handleContactForm(e) {
    e.preventDefault();
    
    const contactData = {
        name: document.getElementById('contact-name').value,
        email: document.getElementById('contact-email').value,
        subject: document.getElementById('contact-subject') ? document.getElementById('contact-subject').value : 'Contact',
        message: document.getElementById('contact-message').value
    };
    
    fetch('https://formsubmit.co/ajax/hulgebmereja2017@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
            _subject: '📧 Contact: ' + contactData.subject,
            'Name': contactData.name,
            'Email': contactData.email,
            'Message': contactData.message
        })
    });
    
    showToast('Message sent!');
    contactForm.reset();
}

// ==================== Toast ====================
function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 50);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 200); }, 2000);
}

// ==================== Category Filter ====================
function filterCategory(category) {
    currentFilter = category;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.filter === category));
    loadProducts();
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// ==================== Export ====================
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.quickView = quickView;
window.filterCategory = filterCategory;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.clearCart = clearCart;
window.closeCartAndShop = closeCartAndShop;
window.loadProductsFromAdmin = loadProductsFromAdmin;
window.loadCategoriesFromAdmin = loadCategoriesFromAdmin;
window.closeSuccessAndGoHome = closeSuccessAndGoHome;
window.closeSuccessAndContinue = closeSuccessAndContinue;
