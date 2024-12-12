// Sample product data with images and prices
const products = {
    general: [
        { id: 1, name: 'Rice', price: '₹60/kg', image: 'images/rice.webp', stock: 50 },
        { id: 2, name: 'Dal', price: '₹100/kg', image: 'images/dal.jpg', stock: 40 },
        { id: 3, name: 'Sugar', price: '₹40/kg', image: 'images/sugar.webp', stock: 30 },
        { id: 4, name: 'Salt', price: '₹20/kg', image: 'images/salt.webp', stock: 45 }
    ],
    pooja: [
        { id: 5, name: 'Agarbatti', price: '₹30', image: 'images/agarbati.webp', stock: 100 },
        { id: 6, name: 'Diya', price: '₹15', image: 'images/diya.webp', stock: 200 },
        { id: 7, name: 'Camphor', price: '₹50', image: 'images/camphor.webp', stock: 80 },
        { id: 8, name: 'Kumkum', price: '₹25', image: 'images/kumkum.jpg', stock: 150 }
    ],
    kirana: [
        { id: 9, name: 'Wheat Flour', price: '₹45/kg', image: 'images/wheat flour.jpg', stock: 60 },
        { id: 10, name: 'Oil', price: '₹150/L', image: 'images/oil.jpg', stock: 40 },
        { id: 11, name: 'Spices', price: '₹80', image: 'images/spices.jpg', stock: 70 },
        { id: 12, name: 'Pulses', price: '₹90/kg', image: 'images/pulses.jpg', stock: 55 }
    ],
    stationary: [
        { id: 13, name: 'Notebook', price: '₹40', image: 'images/notebook.jpg', stock: 100 },
        { id: 14, name: 'Pen', price: '₹10', image: 'images/pen.jpg', stock: 200 },
        { id: 15, name: 'Pencil', price: '₹5', image: 'images/pencil.jpg', stock: 300 },
        { id: 16, name: 'Eraser', price: '₹5', image: 'images/eraser.jpg', stock: 250 }
    ]
};

// Shopping cart
let cart = [];

// Create product card with animation
function createProductCard(product) {
    return `
        <div class="product-card" data-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" 
                 onerror="this.src='https://via.placeholder.com/150?text=${product.name}'">
            <h3>${product.name}</h3>
            <p class="price">${product.price}</p>
            <p class="stock">In Stock: ${product.stock}</p>
            <button onclick="addToCart(${product.id})" 
                    ${product.stock === 0 ? 'disabled' : ''}>
                ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
        </div>
    `;
}

// Display products with animation
function displayProducts() {
    for (const category in products) {
        const section = document.querySelector(`#${category} .product-grid`);
        if (section) {
            section.innerHTML = products[category].map(createProductCard).join('');
            animateProducts(section);
        }
    }
}

// Animate products appearance
function animateProducts(container) {
    const cards = container.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Add to cart functionality
function addToCart(productId) {
    let product;
    for (const category in products) {
        product = products[category].find(p => p.id === productId);
        if (product) break;
    }

    if (product && product.stock > 0) {
        cart.push(product);
        product.stock--;
        updateCartDisplay();
        updateProductDisplay(product);
        showNotification(`${product.name} added to cart!`);
    }
}

// Update cart display
function updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');
    cartCount.textContent = cart.length;
    cartCount.style.transform = 'scale(1.2)';
    setTimeout(() => cartCount.style.transform = 'scale(1)', 200);
}

// Update product display
function updateProductDisplay(product) {
    const productCard = document.querySelector(`.product-card[data-id="${product.id}"]`);
    if (productCard) {
        const stockElement = productCard.querySelector('.stock');
        const button = productCard.querySelector('button');
        stockElement.textContent = `In Stock: ${product.stock}`;
        if (product.stock === 0) {
            button.disabled = true;
            button.textContent = 'Out of Stock';
        }
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }, 100);
}

// Search functionality
const searchInput = document.querySelector('.search-bar input');
searchInput.addEventListener('input', debounce((e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    // Get all product sections
    const productSections = document.querySelectorAll('.product-section');
    
    // Hide all sections initially
    productSections.forEach(section => {
        section.style.display = 'none';
    });
    
    // If search is empty, show all sections
    if (searchTerm === '') {
        productSections.forEach(section => {
            section.style.display = 'block';
        });
        return;
    }
    
    // Search through sections and products
    productSections.forEach(section => {
        const categoryName = section.querySelector('h2').textContent.toLowerCase();
        const productGrid = section.querySelector('.product-grid');
        const category = section.id;
        
        // If category name matches, show all products in that category
        if (categoryName.includes(searchTerm)) {
            section.style.display = 'block';
            productGrid.innerHTML = products[category].map(createProductCard).join('');
            animateProducts(productGrid);
        } else {
            // Otherwise, filter products by name
            const filteredProducts = products[category].filter(product => 
                product.name.toLowerCase().includes(searchTerm)
            );
            
            if (filteredProducts.length > 0) {
                section.style.display = 'block';
                productGrid.innerHTML = filteredProducts.map(createProductCard).join('');
                animateProducts(productGrid);
            }
        }
    });
}, 300));

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();

    const accountBtn = document.querySelector('.account');
    const loginModal = document.getElementById('loginModal');
    const closeBtn = document.querySelector('.close-btn');
    const loginForm = document.getElementById('loginForm');

    // Open modal
    accountBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'flex';
    });

    // Close modal
    closeBtn.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });

    // Handle form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Add your login logic here
        console.log('Login attempt:', { username, password });
        
        // Show success notification
        showNotification('Login successful!');
        loginModal.style.display = 'none';
    });

    // Shop Now button functionality
    const shopNowBtn = document.getElementById('shopNowBtn');
    shopNowBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Show all product sections
        const productSections = document.querySelectorAll('.product-section');
        productSections.forEach(section => {
            section.style.display = 'block';
        });
        
        // Scroll to products smoothly
        document.querySelector('.product-section').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Reset search input if any
        document.querySelector('.search-bar input').value = '';
    });
}); 