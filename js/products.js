// Helper function to generate fast-loading placeholder images
function getProductImage(category, name) {
    const colors = {
        phones: '2563eb',
        laptops: '7c3aed',
        tablets: '059669',
        audio: 'dc2626',
        watches: 'd97706',
        accessories: '0891b2',
        cameras: '4f46e5',
        gaming: 'be185d'
    };
    
    const color = colors[category] || '6b7280';
    const text = encodeURIComponent(name.substring(0, 20));
    return `https://placehold.co/400x300/${color}/ffffff?text=${text}`;
}

const products = [
    // ==================== PHONES ====================
    {
        id: 1,
        name: 'iPhone 15 Pro Max',
        name_am: 'አይፎን 15 ፕሮ ማክስ',
        description: 'Latest Apple flagship with A17 Pro chip, 48MP camera, and titanium design',
        description_am: 'የቅርብ ጊዜ የአፕል ባንዲራ ከ A17 Pro ቺፕ፣ 48MP ካሜራ እና የቲታኒየም ንድፍ ጋር',
        price: 185000,
        oldPrice: 195000,
        category: 'phones',
        image: '',
        rating: 4.9,
        reviews: 256,
        stock: 15,
        featured: true,
        badge: 'New'
    },
    {
        id: 2,
        name: 'Samsung Galaxy S24 Ultra',
        name_am: 'ሳምሰንግ ጋላክሲ S24 አልትራ',
        description: 'Premium Android with AI features, S-Pen, and 200MP camera',
        description_am: 'ከ AI ባህሪያት፣ S-Pen እና 200MP ካሜራ ጋር ፕሪሚየም አንድሮይድ',
        price: 165000,
        oldPrice: 175000,
        category: 'phones',
        image: '',
        rating: 4.8,
        reviews: 198,
        stock: 20,
        featured: true,
        badge: 'Hot'
    },
    {
        id: 3,
        name: 'Google Pixel 8 Pro',
        name_am: 'ጉግል ፒክስል 8 ፕሮ',
        description: 'Best camera phone with Google AI and pure Android experience',
        description_am: 'ከ Google AI እና ንጹህ አንድሮይድ ተሞክሮ ጋር ምርጥ የካሜራ ስልክ',
        price: 145000,
        category: 'phones',
        image: '',
        rating: 4.7,
        reviews: 145,
        stock: 18,
        badge: 'New'
    },
    {
        id: 4,
        name: 'Xiaomi 14 Pro',
        name_am: 'ሺዎሚ 14 ፕሮ',
        description: 'Flagship killer with Leica camera and Snapdragon 8 Gen 3',
        description_am: 'ከላይካ ካሜራ እና Snapdragon 8 Gen 3 ጋር ባንዲራ ገዳይ',
        price: 125000,
        category: 'phones',
        image: '',
        rating: 4.6,
        reviews: 112,
        stock: 25
    },
    {
        id: 5,
        name: 'Samsung Galaxy A55',
        name_am: 'ሳምሰንግ ጋላክሲ A55',
        description: 'Mid-range phone with excellent camera and battery life',
        description_am: 'ከምርጥ ካሜራ እና የባትሪ ህይወት ጋር መካከለኛ ደረጃ ስልክ',
        price: 55000,
        category: 'phones',
        image: '',
        rating: 4.5,
        reviews: 89,
        stock: 30
    },

    // ==================== LAPTOPS ====================
    {
        id: 6,
        name: 'MacBook Pro 16" M3 Max',
        name_am: 'ማክቡክ ፕሮ 16" M3 ማክስ',
        description: 'Ultimate performance with M3 Max chip, 32GB RAM, 1TB SSD',
        description_am: 'ከ M3 Max ቺፕ፣ 32GB RAM፣ 1TB SSD ጋር የመጨረሻ አፈጻጸም',
        price: 385000,
        oldPrice: 400000,
        category: 'laptops',
        image: '',
        rating: 4.9,
        reviews: 87,
        stock: 8,
        featured: true,
        badge: 'Premium'
    },
    {
        id: 7,
        name: 'Dell XPS 15',
        name_am: 'ዴል XPS 15',
        description: 'Premium Windows laptop with 4K OLED display and Intel i9',
        description_am: 'ከ4K OLED ማሳያ እና Intel i9 ጋር ፕሪሚየም ዊንዶውስ ላፕቶፕ',
        price: 245000,
        category: 'laptops',
        image: '',
        rating: 4.7,
        reviews: 64,
        stock: 12
    },
    {
        id: 8,
        name: 'Lenovo ThinkPad X1 Carbon',
        name_am: 'ሌኖቮ ቲንክፓድ X1 ካርቦን',
        description: 'Business laptop with military-grade durability and 14" display',
        description_am: 'ከወታደራዊ ደረጃ ጥንካሬ እና 14" ማሳያ ጋር የንግድ ላፕቶፕ',
        price: 195000,
        category: 'laptops',
        image: '',
        rating: 4.6,
        reviews: 92,
        stock: 15
    },
    {
        id: 9,
        name: 'ASUS ROG Strix G16',
        name_am: 'አሱስ ROG ስትሪክስ G16',
        description: 'Gaming laptop with RTX 4080 and 240Hz display',
        description_am: 'ከRTX 4080 እና 240Hz ማሳያ ጋር የጨዋታ ላፕቶፕ',
        price: 275000,
        category: 'laptops',
        image: '',
        rating: 4.8,
        reviews: 76,
        stock: 10,
        badge: 'Gaming'
    },
    {
        id: 10,
        name: 'HP Pavilion 15',
        name_am: 'HP ፓቪልዮን 15',
        description: 'Affordable laptop for students and everyday use',
        description_am: 'ለተማሪዎች እና ለዕለታዊ አገልግሎት ተመጣጣኝ ላፕቶፕ',
        price: 85000,
        category: 'laptops',
        image: '',
        rating: 4.4,
        reviews: 120,
        stock: 22
    },

    // ==================== TABLETS ====================
    {
        id: 11,
        name: 'iPad Pro 12.9"',
        name_am: 'አይፓድ ፕሮ 12.9"',
        description: 'Powerful tablet with M2 chip and Liquid Retina XDR display',
        description_am: 'ከM2 ቺፕ እና Liquid Retina XDR ማሳያ ጋር ኃይለኛ ታብሌት',
        price: 155000,
        oldPrice: 165000,
        category: 'tablets',
        image: '',
        rating: 4.8,
        reviews: 134,
        stock: 14,
        featured: true,
        badge: 'New'
    },
    {
        id: 12,
        name: 'Samsung Galaxy Tab S9 Ultra',
        name_am: 'ሳምሰንግ ጋላክሲ ታብ S9 አልትራ',
        description: '14.6" AMOLED tablet with S-Pen included',
        description_am: '14.6" AMOLED ታብሌት ከ S-Pen ጋር ተካቷል',
        price: 135000,
        category: 'tablets',
        image: '',
        rating: 4.7,
        reviews: 89,
        stock: 12
    },
    {
        id: 13,
        name: 'Samsung Galaxy Tab A8',
        name_am: 'ሳምሰንግ ጋላክሲ ታብ A8',
        description: 'Budget tablet perfect for entertainment and browsing',
        description_am: 'ለመዝናኛ እና ለማሰሻ ተስማሚ የሆነ የበጀት ታብሌት',
        price: 35000,
        category: 'tablets',
        image: '',
        rating: 4.3,
        reviews: 67,
        stock: 25
    },

    // ==================== AUDIO ====================
    {
        id: 14,
        name: 'Sony WH-1000XM5',
        name_am: 'ሶኒ WH-1000XM5',
        description: 'Industry-leading noise cancellation with 30hr battery life',
        description_am: 'ከ30 ሰዓት የባትሪ ህይወት ጋር የኢንዱስትሪ መሪ የድምጽ መከላከያ',
        price: 45000,
        oldPrice: 50000,
        category: 'audio',
        image: '',
        rating: 4.9,
        reviews: 345,
        stock: 30,
        featured: true,
        badge: 'Best Seller'
    },
    {
        id: 15,
        name: 'AirPods Pro 2',
        name_am: 'ኤርፖድስ ፕሮ 2',
        description: 'Wireless earbuds with active noise cancellation and spatial audio',
        description_am: 'ከንቁ የድምጽ መከላከያ እና የቦታ ኦዲዮ ጋር ሽቦ አልባ ኢርባድስ',
        price: 28000,
        category: 'audio',
        image: '',
        rating: 4.8,
        reviews: 289,
        stock: 40
    },
    {
        id: 16,
        name: 'JBL Charge 5',
        name_am: 'JBL ቻርጅ 5',
        description: 'Portable Bluetooth speaker with 20hr playtime and powerbank',
        description_am: 'ከ20 ሰዓት የማጫወት ጊዜ እና ፓወርባንክ ጋር ተንቀሳቃሽ የብሉቱዝ ድምጽ ማጉያ',
        price: 18000,
        category: 'audio',
        image: '',
        rating: 4.7,
        reviews: 167,
        stock: 25
    },
    {
        id: 17,
        name: 'Sony WH-CH720N',
        name_am: 'ሶኒ WH-CH720N',
        description: 'Affordable noise-cancelling headphones with great sound',
        description_am: 'ከምርጥ ድምጽ ጋር ተመጣጣኝ የድምጽ መከላከያ ሄድፎኖች',
        price: 15000,
        category: 'audio',
        image: '',
        rating: 4.5,
        reviews: 98,
        stock: 20
    },

    // ==================== SMART WATCHES ====================
    {
        id: 18,
        name: 'Apple Watch Series 9',
        name_am: 'አፕል ዎች ሲሪዝ 9',
        description: 'Advanced health monitoring with ECG and blood oxygen',
        description_am: 'ከECG እና የደም ኦክስጅን ጋር የላቀ የጤና ክትትል',
        price: 55000,
        category: 'watches',
        image: '',
        rating: 4.8,
        reviews: 198,
        stock: 22,
        featured: true,
        badge: 'New'
    },
    {
        id: 19,
        name: 'Samsung Galaxy Watch 6',
        name_am: 'ሳምሰንግ ጋላክሲ ዎች 6',
        description: 'Wear OS smartwatch with advanced sleep tracking',
        description_am: 'ከላቀ የእንቅልፍ ክትትል ጋር Wear OS ስማርትዎች',
        price: 38000,
        category: 'watches',
        image: '',
        rating: 4.6,
        reviews: 156,
        stock: 18
    },
    {
        id: 20,
        name: 'Xiaomi Mi Band 8',
        name_am: 'ሺዎሚ ሚ ባንድ 8',
        description: 'Affordable fitness tracker with heart rate monitoring',
        description_am: 'ከልብ ምት ክትትል ጋር ተመጣጣኝ የአካል ብቃት መከታተያ',
        price: 3500,
        category: 'watches',
        image: '',
        rating: 4.4,
        reviews: 234,
        stock: 50
    },

    // ==================== ACCESSORIES ====================
    {
        id: 21,
        name: 'USB-C Hub 8-in-1',
        name_am: 'ዩኤስቢ-ሲ ሃብ 8-በ-1',
        description: 'Multiport adapter with HDMI, USB 3.0, SD card, and Ethernet',
        description_am: 'ከHDMI፣ USB 3.0፣ SD ካርድ እና ኢተርኔት ጋር ብዙ ፖርት አስማሚ',
        price: 4500,
        category: 'accessories',
        image: '',
        rating: 4.5,
        reviews: 234,
        stock: 50
    },
    {
        id: 22,
        name: 'Anker Wireless Charger',
        name_am: 'አንከር ሽቦ አልባ ቻርጀር',
        description: '15W fast wireless charging pad for all Qi-enabled devices',
        description_am: 'ለሁሉም Qi-የነቁ መሳሪያዎች 15W ፈጣን ሽቦ አልባ ቻርጅ ፓድ',
        price: 2500,
        category: 'accessories',
        image: '',
        rating: 4.4,
        reviews: 178,
        stock: 60
    },
    {
        id: 23,
        name: 'Logitech MX Master 3S',
        name_am: 'ሎጊቴክ MX ማስተር 3S',
        description: 'Advanced wireless mouse with 8K DPI and silent clicks',
        description_am: 'ከ8K DPI እና ጸጥ ያለ ጠቅታዎች ጋር የላቀ ሽቦ አልባ መዳፊት',
        price: 6500,
        category: 'accessories',
        image: '',
        rating: 4.7,
        reviews: 267,
        stock: 35
    },
    {
        id: 24,
        name: 'Samsung 4K Monitor 32"',
        name_am: 'ሳምሰንግ 4K ሞኒተር 32"',
        description: 'UHD monitor with HDR support and USB-C connectivity',
        description_am: 'ከHDR ድጋፍ እና USB-C ግንኙነት ጋር UHD ሞኒተር',
        price: 45000,
        oldPrice: 50000,
        category: 'accessories',
        image: '',
        rating: 4.6,
        reviews: 92,
        stock: 15,
        badge: 'Sale'
    },
    {
        id: 25,
        name: 'Mechanical Keyboard RGB',
        name_am: 'ሜካኒካል ኪቦርድ RGB',
        description: 'Gaming keyboard with RGB backlight and blue switches',
        description_am: 'ከRGB የኋላ ብርሃን እና ሰማያዊ ማብሪያዎች ጋር የጨዋታ ኪቦርድ',
        price: 3500,
        category: 'accessories',
        image: '',
        rating: 4.5,
        reviews: 156,
        stock: 45
    },

    // ==================== CAMERAS ====================
    {
        id: 26,
        name: 'Sony A7 IV',
        name_am: 'ሶኒ A7 IV',
        description: 'Full-frame mirrorless camera with 33MP sensor and 4K video',
        description_am: 'ከ33MP ሴንሰር እና 4K ቪዲዮ ጋር ሙሉ ፍሬም መስታወት አልባ ካሜራ',
        price: 285000,
        category: 'cameras',
        image: '',
        rating: 4.9,
        reviews: 78,
        stock: 8,
        featured: true,
        badge: 'Pro'
    },
    {
        id: 27,
        name: 'Canon EOS R6 Mark II',
        name_am: 'ካኖን EOS R6 ማርክ II',
        description: 'Professional mirrorless camera with 40fps burst shooting',
        description_am: 'ከ40fps ፍንዳታ ቀረጻ ጋር ሙያዊ መስታወት አልባ ካሜራ',
        price: 305000,
        category: 'cameras',
        image: '',
        rating: 4.8,
        reviews: 56,
        stock: 6
    },
    {
        id: 28,
        name: 'DJI Mavic 3 Pro',
        name_am: 'DJI ማቪክ 3 ፕሮ',
        description: 'Professional drone with Hasselblad camera and 43min flight',
        description_am: 'ከሃሰልብላድ ካሜራ እና 43 ደቂቃ በረራ ጋር ሙያዊ ድሮን',
        price: 245000,
        category: 'cameras',
        image: '',
        rating: 4.7,
        reviews: 45,
        stock: 5
    },
    {
        id: 29,
        name: 'GoPro Hero 12',
        name_am: 'ጎፕሮ ሂሮ 12',
        description: 'Action camera with 5.3K video and waterproof design',
        description_am: 'ከ5.3K ቪዲዮ እና ውሃ የማያስገባ ንድፍ ጋር የድርጊት ካሜራ',
        price: 55000,
        category: 'cameras',
        image: '',
        rating: 4.6,
        reviews: 89,
        stock: 12
    },

    // ==================== GAMING ====================
    {
        id: 30,
        name: 'PlayStation 5',
        name_am: 'ፕሌይስቴሽን 5',
        description: 'Next-gen gaming console with 4K 120fps and ray tracing',
        description_am: 'ከ4K 120fps እና የጨረር ፍለጋ ጋር የቀጣይ ትውልድ የጨዋታ ኮንሶል',
        price: 85000,
        category: 'gaming',
        image: '',
        rating: 4.9,
        reviews: 345,
        stock: 12,
        featured: true,
        badge: 'Hot'
    },
    {
        id: 31,
        name: 'Xbox Series X',
        name_am: 'ኤክስቦክስ ሲሪዝ X',
        description: 'Most powerful Xbox with 12 teraflops of GPU performance',
        description_am: 'ከ12 ቴራፍሎፕስ የGPU አፈጻጸም ጋር በጣም ኃይለኛ Xbox',
        price: 85000,
        category: 'gaming',
        image: '',
        rating: 4.8,
        reviews: 234,
        stock: 10
    },
    {
        id: 32,
        name: 'Nintendo Switch OLED',
        name_am: 'ኒንቴንዶ ስዊች OLED',
        description: 'Hybrid gaming console with vibrant 7" OLED screen',
        description_am: 'ከደማቅ 7" OLED ማያ ገጽ ጋር ድብልቅ የጨዋታ ኮንሶል',
        price: 45000,
        category: 'gaming',
        image: '',
        rating: 4.7,
        reviews: 189,
        stock: 15
    }
];

// Set images after products are defined
products.forEach(product => {
    if (!product.image) {
        product.image = getProductImage(product.category, product.name);
    }
});