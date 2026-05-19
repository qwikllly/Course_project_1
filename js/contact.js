document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name')?.value;
    const email = document.getElementById('email')?.value;
    const message = document.getElementById('message')?.value;
    
    if (!name || !email || !message) {
        showNotification('Пожалуйста, заполните все поля', 'error');
        return;
    }
    
    showNotification(`✓ Спасибо, ${name}! Ваше сообщение отправлено.`, 'success');
    this.reset();
});

function showNotification(message, type) {
    const oldNotify = document.querySelector('.notification');
    if (oldNotify) oldNotify.remove();
    
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    
    document.body.appendChild(notification);
    
    notification.onclick = () => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) notification.remove();
        }, 300);
    };
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) notification.remove();
        }, 300);
    }, 2500);
}