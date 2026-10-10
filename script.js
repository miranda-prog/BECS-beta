// Número oficial actualizado
const WHATSAPP_NUMBER = "50259378835"; 
let cart = [];

const productDB = {
    'waka': {
        name: 'Waka Pocket',
        oldPrice: '220.00',
        price: 179,
        images: [
            'assets/waka_pocket/azul.webp',
            'assets/waka_pocket/azul2.webp',
            'assets/waka_pocket/beige.webp',
            'assets/waka_pocket/beige2.webp'
        ],
        desc: '6,000 Puffs | 5% Nicotina. El dispositivo recargable definitivo con retención de sabor extrema.',
        flavors: ['Blueberry Mint', 'Watermelon', 'Strawberry Kiwi', 'Cherry Bomb', 'Grape']
    },
    'maskking': {
        name: 'Maskking High Pro',
        oldPrice: '150.00',
        price: 119,
        images: [
            'assets/maskking/rosa.webp',
            'assets/maskking/rojo.webp',
            'assets/maskking/menta.webp',
            'assets/maskking/morado.webp',
            'assets/maskking/azul.webp'
        ],
        desc: '1,800 Puffs | 5% Nicotina. Diseño compacto, golpe perfecto y perfiles intensos helados.',
        flavors: ['Lush Ice', 'Blue Razz Ice', 'Cool Mint', 'Mixed Berries Ice', 'Tropical Ice']
    }
};

let currentSelectedProduct = null;

// Lógica de Edad
document.body.style.overflow = 'hidden';

function acceptAge() {
    document.getElementById('age-modal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Fade-in animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));

// ---- MENSAJES PERSUASIVOS (POPUP) ----
const persuasiveMessages = [
    "¿Aún lo estás pensando? El stock vuela. 🔥",
    "Pide ahora y coordina tu pick-up de inmediato.",
    "Quedan pocas unidades disponibles.",
    "Tu próximo vape está a un solo clic.",
    "No te quedes sin probar el Drop este fin de semana."
];

function triggerFakeSale() {
    const popup = document.getElementById('sales-popup');
    if (!popup) return;
    
    const randomMsg = persuasiveMessages[Math.floor(Math.random() * persuasiveMessages.length)];
    document.getElementById('popup-message').innerText = randomMsg;
    
    popup.classList.add('show');
    
    setTimeout(() => {
        popup.classList.remove('show');
    }, 4500);
}
setTimeout(() => {
    triggerFakeSale();
    setInterval(triggerFakeSale, 20000);
}, 6000);

// ---- CRONÓMETRO INVERSO ----
function startStopwatch() {
    let timeElapsed = 0; 
    const display = document.getElementById('stopwatch');
    const phraseDisplay = document.getElementById('stopwatch-phrase');
    const phrases = [
        "sin probar el nuevo drop.", 
        "sin disfrutar del mejor sabor.", 
        "sin vapear.", 
        "perdiéndote esta experiencia."
    ];
    
    if(!display) return;

    setInterval(() => {
        timeElapsed++;
        let h = Math.floor(timeElapsed / 3600);
        let m = Math.floor((timeElapsed % 3600) / 60);
        let s = Math.floor(timeElapsed % 60);

        h = h < 10 ? "0" + h : h;
        m = m < 10 ? "0" + m : m;
        s = s < 10 ? "0" + s : s;

        display.innerText = `${h}:${m}:${s}`;

        if(timeElapsed % 15 === 0) {
            const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
            phraseDisplay.innerText = randomPhrase;
        }
    }, 1000);
}
startStopwatch();

// Lógica de la Galería (Miniaturas interactivas)
function changeImage(element, imageUrl) {
    const thumbs = document.querySelectorAll('.thumb');
    thumbs.forEach(t => t.classList.remove('active'));
    element.classList.add('active');
    
    const mainImg = document.getElementById('modal-main-img');
    mainImg.style.backgroundImage = `url('${imageUrl}')`;
}

// Modal Productos
function openProductModal(productId) {
    const product = productDB[productId];
    currentSelectedProduct = product;
    
    document.getElementById('modal-title').innerText = product.name;
    document.getElementById('modal-old-price').innerText = `Q${product.oldPrice}`;
    document.getElementById('modal-price').innerText = `Q${product.price}.00`;
    document.getElementById('modal-desc').innerText = product.desc;
    
    const flavorSelect = document.getElementById('modal-flavor');
    flavorSelect.innerHTML = '<option value="" disabled selected>Selecciona un sabor</option>';
    product.flavors.forEach(flavor => {
        flavorSelect.innerHTML += `<option value="${flavor}">${flavor}</option>`;
    });

    // Cargar imagen principal (la primera del array)
    const mainImg = document.getElementById('modal-main-img');
    mainImg.style.backgroundImage = `url('${product.images[0]}')`;
    mainImg.style.backgroundSize = 'cover';
    mainImg.style.backgroundPosition = 'center';

    // Generar miniaturas dinámicamente según cuántas imágenes tenga el producto
    const thumbsContainer = document.getElementById('gallery-thumbs');
    thumbsContainer.innerHTML = '';
    
    product.images.forEach((imgUrl, index) => {
        const activeClass = index === 0 ? 'active' : '';
        thumbsContainer.innerHTML += `
            <div class="thumb ${activeClass}" 
                 style="background-image: url('${imgUrl}'); background-size: cover; background-position: center;" 
                 onclick="changeImage(this, '${imgUrl}')">
            </div>
        `;
    });

    document.getElementById('product-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden'; 
}

function closeProductModal() {
    document.getElementById('product-modal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Agregar al Carrito (Con control de flujo limpio)
document.getElementById('modal-add-btn').onclick = function() {
    const flavorSelect = document.getElementById('modal-flavor');
    
    if (flavorSelect.value === "") {
        const btn = document.getElementById('modal-add-btn');
        const originalText = btn.innerText;
        btn.innerText = "SELECCIONA UN SABOR";
        btn.style.background = "#ff4444";
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = "var(--neon-purple)";
        }, 1500);
        return;
    }

    const selectedFlavor = flavorSelect.options[flavorSelect.selectedIndex].text;
    
    const existingItemIndex = cart.findIndex(i => i.name === currentSelectedProduct.name && i.flavor === selectedFlavor);
    
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({ 
            name: currentSelectedProduct.name, 
            price: currentSelectedProduct.price, 
            flavor: selectedFlavor,
            quantity: 1
        });
    }
    
    updateCartUI();
    closeProductModal();
    
    setTimeout(() => {
        document.getElementById('cart-sidebar').classList.add('open');
    }, 150);
};

// Lógica del Sidebar (Carrito)
function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('open');
}

// Cambiar cantidad (+ y -)
function changeQty(index, delta) {
    cart[index].quantity += delta;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    updateCartUI();
}

function updateCartUI() {
    const itemsContainer = document.getElementById('cart-items');
    const emptyMsg = document.getElementById('empty-cart');
    const checkoutBtn = document.getElementById('btn-checkout');
    const shippingSelect = document.getElementById('shipping');
    const checkoutData = document.getElementById('checkout-data');
    
    itemsContainer.innerHTML = '';
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').innerText = totalItems;

    if (cart.length === 0) {
        emptyMsg.classList.remove('hidden');
        checkoutData.classList.add('hidden');
        checkoutBtn.disabled = true;
        shippingSelect.disabled = true;
    } else {
        emptyMsg.classList.add('hidden');
        checkoutData.classList.remove('hidden');
        checkoutBtn.disabled = false;
        shippingSelect.disabled = false;
        
        cart.forEach((item, index) => {
            const linePrice = item.price * item.quantity;
            
            itemsContainer.innerHTML += `
                <div class="cart-item">
                    <h4>${item.name}</h4>
                    <span class="cart-item-flavor">${item.flavor}</span>
                    <div class="cart-item-controls">
                        <span class="cart-item-price">Q${linePrice}.00</span>
                        <div class="qty-wrap">
                            <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                            <span class="qty-display">${item.quantity}</span>
                            <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    updateTotal();
}

function updateTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingSelect = document.getElementById('shipping');
    const shippingCost = (cart.length > 0 && shippingSelect.value) ? parseInt(shippingSelect.value) : 0;
    const total = subtotal + shippingCost;
    document.getElementById('cart-total').innerText = `Q${total}.00`;
}

// Enviar a WhatsApp
function sendWhatsApp() {
    if (cart.length === 0) return;

    const clientName = document.getElementById('client-name').value.trim();
    const clientPhone = document.getElementById('client-phone').value.trim();

    if(clientName === "" || clientPhone === "") {
        const btn = document.getElementById('btn-checkout');
        btn.innerText = "FALTAN DATOS";
        btn.style.background = "#ff4444";
        btn.style.color = "white";
        setTimeout(() => {
            btn.innerText = "PROCESAR ORDEN";
            btn.style.background = "#25D366";
            btn.style.color = "#000";
        }, 2000);
        return;
    }

    let msg = `*NUEVA ORDEN WEB BECS*\n\n`;
    msg += `👤 *Cliente:* ${clientName}\n`;
    msg += `📱 *Teléfono:* ${clientPhone}\n\n`;
    msg += `*Pedido:*\n`;
    
    cart.forEach((item) => {
        msg += `- ${item.quantity}x ${item.name} | ${item.flavor} (Q${item.price * item.quantity}.00)\n`;
    });

    const shippingSelect = document.getElementById('shipping');
    const shippingText = shippingSelect.options[shippingSelect.selectedIndex].text;
    const totalText = document.getElementById('cart-total').innerText;

    msg += `\n*Logística:* ${shippingText}`;
    msg += `\n*Total a pagar:* ${totalText}\n`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
}

// Newsletter
function joinCrew() {
    const emailInput = document.getElementById('crew-email');
    const btn = document.getElementById('btn-crew');
    if(emailInput.value.includes('@')) {
        btn.innerText = "¡DENTRO!";
        btn.style.background = "var(--neon-purple)";
        emailInput.value = '';
        setTimeout(() => { 
            btn.innerText = "ENTRAR"; 
        }, 2000);
    }
}