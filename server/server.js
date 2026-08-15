const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, '..')));

// Email configuration with NEW app password
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'hulgebmereja2017@gmail.com',
        pass: 'puvopcbrcgnrzcqr'
    },
    tls: { rejectUnauthorized: false }
});

// Test email on startup
transporter.verify(function(error, success) {
    if (error) {
        console.log('Email Error:', error.message);
    } else {
        console.log('✅ Email Ready - Gmail Connected');
    }
});

// In-memory data (works on Render, resets on restart)
let products = [
    { id: 1, name: 'iPhone 15 Pro Max', name_am: 'አይፎን 15', price: 185000, category: 'phones', image: 'https://placehold.co/400x300/2563eb/ffffff?text=iPhone', stock: 15, status: 'active' },
    { id: 2, name: 'Samsung S24', name_am: 'ሳምሰንግ S24', price: 165000, category: 'phones', image: 'https://placehold.co/400x300/7c3aed/ffffff?text=Samsung', stock: 20, status: 'active' },
    { id: 3, name: 'MacBook Pro', name_am: 'ማክቡክ', price: 385000, category: 'laptops', image: 'https://placehold.co/400x300/059669/ffffff?text=MacBook', stock: 8, status: 'active' },
    { id: 4, name: 'Sony Headphones', name_am: 'ሶኒ ሄድፎኖች', price: 45000, category: 'audio', image: 'https://placehold.co/400x300/dc2626/ffffff?text=Sony', stock: 30, status: 'active' },
    { id: 5, name: 'PlayStation 5', name_am: 'PS5', price: 85000, category: 'gaming', image: 'https://placehold.co/400x300/be185d/ffffff?text=PS5', stock: 12, status: 'active' }
];

let categories = [
    { id: 1, name: 'Phones', name_am: 'ስልኮች', slug: 'phones', status: 'active' },
    { id: 2, name: 'Laptops', name_am: 'ላፕቶፖች', slug: 'laptops', status: 'active' },
    { id: 3, name: 'Audio', name_am: 'ኦዲዮ', slug: 'audio', status: 'active' },
    { id: 4, name: 'Gaming', name_am: 'ጨዋታ', slug: 'gaming', status: 'active' }
];

let orders = [];

// ==================== PRODUCTS ====================
app.get('/api/products', function(req, res) {
    res.json({ success: true, products: products });
});

app.post('/api/products', function(req, res) {
    products = req.body;
    res.json({ success: true });
});

// ==================== CATEGORIES ====================
app.get('/api/categories', function(req, res) {
    res.json({ success: true, categories: categories });
});

app.post('/api/categories', function(req, res) {
    categories = req.body;
    res.json({ success: true });
});

// ==================== ORDERS ====================
app.get('/api/orders', function(req, res) {
    res.json({ success: true, orders: orders });
});

app.post('/api/orders', async function(req, res) {
    try {
        const order = req.body;
        orders.push(order);
        console.log('Order received:', order.orderId);

        // Send email to ADMIN
        await transporter.sendMail({
            from: '"Hulegeb Electronics" <hulgebmereja2017@gmail.com>',
            to: 'hulgebmereja2017@gmail.com',
            replyTo: order.email,
            subject: '🛒 New Order ' + order.orderId + ' - ' + order.name,
            html: '<h2>New Order</h2>' +
                '<p><strong>Order ID:</strong> ' + order.orderId + '</p>' +
                '<p><strong>Customer:</strong> ' + order.name + '</p>' +
                '<p><strong>Email:</strong> ' + order.email + '</p>' +
                '<p><strong>Phone:</strong> ' + order.phone + '</p>' +
                '<p><strong>City:</strong> ' + order.city + '</p>' +
                '<p><strong>Address:</strong> ' + order.address + '</p>' +
                '<p><strong>Total:</strong> ETB ' + order.finalTotal + '</p>'
        });
        console.log('✅ Admin email sent');

        // Send confirmation email to CUSTOMER
        await transporter.sendMail({
            from: '"Hulegeb Electronics" <hulgebmereja2017@gmail.com>',
            to: order.email,
            subject: '✅ Order Confirmed - Hulegeb Electronics',
            html: '<h2>Order Confirmed!</h2>' +
                '<p>Dear ' + order.name + ',</p>' +
                '<p>Your order has been received.</p>' +
                '<p><strong>Order ID:</strong> ' + order.orderId + '</p>' +
                '<p><strong>Total:</strong> ETB ' + order.finalTotal + '</p>' +
                '<p>We will contact you soon for delivery.</p>' +
                '<p>Contact: hulgebmereja2017@gmail.com</p>'
        });
        console.log('✅ Customer email sent to:', order.email);

        res.json({ success: true, emailSent: true });
    } catch (error) {
        console.log('Order email error:', error.message);
        res.json({ success: true, emailSent: false });
    }
});

// ==================== ORDER STATUS ====================
app.post('/api/order-status', async function(req, res) {
    try {
        const { orderId, customerName, customerEmail, status, statusTextEn, statusTextAm, note } = req.body;
        
        // Update order status
        const idx = orders.findIndex(function(o) { return o.orderId === orderId; });
        if (idx !== -1) {
            orders[idx].status = status;
        }

        // Send email to CUSTOMER
        await transporter.sendMail({
            from: '"Hulegeb Electronics" <hulgebmereja2017@gmail.com>',
            to: customerEmail,
            subject: '📦 Order ' + orderId + ' Status: ' + statusTextEn,
            html: '<h2>Order Status Update</h2>' +
                '<p>Dear ' + customerName + ',</p>' +
                '<p><strong>Order:</strong> ' + orderId + '</p>' +
                '<p><strong>Status:</strong> ' + statusTextEn + '</p>' +
                '<p>' + statusTextEn + '</p>' +
                '<p>' + statusTextAm + '</p>' +
                (note ? '<p><strong>Note:</strong> ' + note + '</p>' : '') +
                '<p>Contact: hulgebmereja2017@gmail.com</p>'
        });
        console.log('✅ Status email sent to:', customerEmail);

        res.json({ success: true });
    } catch (error) {
        console.log('Status email error:', error.message);
        res.json({ success: true });
    }
});

// ==================== CONTACT ====================
app.post('/api/contact', async function(req, res) {
    try {
        const contact = req.body;
        await transporter.sendMail({
            from: '"Hulegeb Electronics" <hulgebmereja2017@gmail.com>',
            to: 'hulgebmereja2017@gmail.com',
            replyTo: contact.email,
            subject: '📧 Contact: ' + (contact.subject || 'Form'),
            html: '<h2>Contact Message</h2>' +
                '<p><strong>From:</strong> ' + contact.name + '</p>' +
                '<p><strong>Email:</strong> ' + contact.email + '</p>' +
                '<p><strong>Message:</strong></p>' +
                '<p>' + contact.message + '</p>'
        });
        res.json({ success: true });
    } catch (error) {
        res.json({ success: true });
    }
});

// ==================== HEALTH ====================
app.get('/api/health', function(req, res) {
    res.json({
        status: 'ok',
        products: products.length,
        orders: orders.length,
        email: 'configured'
    });
});

// Serve all routes
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, function() {
    console.log('=================================');
    console.log('Server running on port ' + PORT);
    console.log('Email: hulgebmereja2017@gmail.com');
    console.log('=================================');
});
