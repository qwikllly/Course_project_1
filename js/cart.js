// функция обновления счетчика в шапке
function updateCartCount() {
    const cartCount = document.getElementById("cart-count");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cartCount) cartCount.textContent = cart.length;
}

// функция показа уведомлений (только создание DOM, стили в CSS)
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) notification.remove();
        }, 300);
    }, 2500);
    
    notification.onclick = () => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) notification.remove();
        }, 300);
    };
}

// функция добавления товара
window.addToCart = function(name, price) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({ name: name, price: parseFloat(price) });
    localStorage.setItem("cart", JSON.stringify(cart));
    
    showNotification(`✓ ${name} добавлен в корзину!`, 'success');
    updateCartCount();
};

// отрисовка товаров в корзине
function renderCart() {
    const container = document.getElementById("cart-items");
    const totalSpan = document.getElementById("cart-total");
    
    if (!container) return; 

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <p>🛒 Ваша корзина пуста</p>
                <a href="catalog.html" class="btn">Перейти в каталог</a>
            </div>
        `;
        if (totalSpan) totalSpan.textContent = "0";
        return;
    }

    let html = `
        <div style="background: #fff; border-radius: 15px; overflow: hidden;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead style="background: #27AE60; color: white;">
                    <tr>
                        <th style="padding: 12px; text-align: left;">Товар</th>
                        <th style="padding: 12px; text-align: center;">Цена</th>
                        <th style="padding: 12px; text-align: center;">Действие</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    let total = 0;

    cart.forEach((item, index) => {
        total += parseFloat(item.price);
        html += `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px;">${item.name}</td>
                <td style="padding: 12px; text-align: center;">${parseFloat(item.price).toFixed(2)} BYN</td>
                <td style="padding: 12px; text-align: center;">
                    <button class="remove-btn" onclick="removeFromCart(${index})">
                        Удалить
                    </button>
                </td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
    `;

    container.innerHTML = html;
    if (totalSpan) totalSpan.textContent = total.toFixed(2);
}

// функция удаления товара
window.removeFromCart = function(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const removedItem = cart[index];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    
    if (removedItem) {
        showNotification(`✗ ${removedItem.name} удален из корзины`, 'error');
    }
    
    renderCart();
    updateCartCount();
};

// очистка всей корзины
window.clearCart = function() {
    if (confirm('Вы уверены, что хотите очистить всю корзину?')) {
        localStorage.removeItem('cart');
        renderCart();
        updateCartCount();
        showNotification('Корзина очищена', 'info');
    }
};

// оформление заказа
window.checkout = function() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    if (cart.length === 0) {
        showNotification('Корзина пуста. Добавьте товары для оформления заказа.', 'error');
        return;
    }
    
    const address = document.getElementById('delivery-address')?.value;
    const phone = document.getElementById('delivery-phone')?.value;
    const comment = document.getElementById('delivery-comment')?.value;
    
    if (!address) {
        showNotification('Пожалуйста, укажите адрес доставки', 'error');
        document.getElementById('delivery-address')?.focus();
        return;
    }
    
    if (!phone) {
        showNotification('Пожалуйста, укажите телефон для связи', 'error');
        document.getElementById('delivery-phone')?.focus();
        return;
    }
    
    const order = {
        items: cart,
        total: cart.reduce((sum, item) => sum + parseFloat(item.price), 0),
        delivery: {
            address: address,
            phone: phone,
            comment: comment || ''
        },
        date: new Date().toLocaleString()
    };
    
    console.log('Заказ оформлен:', order);
    
    showNotification('✓ Заказ оформлен! Наш менеджер свяжется с вами.', 'success');
    
    localStorage.removeItem('cart');
    if (document.getElementById('delivery-address')) {
        document.getElementById('delivery-address').value = '';
        document.getElementById('delivery-phone').value = '';
        document.getElementById('delivery-comment').value = '';
    }
    
    renderCart();
    updateCartCount();
};

// запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderCart();
});