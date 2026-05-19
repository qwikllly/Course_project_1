document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    if (slides.length === 0) return;

    let slideIndex = 0;
    let autoSlideInterval;
    
    function showSlides(n) {
        slides.forEach(s => s.classList.remove('active'));
        if (dots.length) dots.forEach(d => d.classList.remove('active'));
        
        slideIndex = (n + slides.length) % slides.length;
        
        slides[slideIndex].classList.add('active');
        if (dots.length) dots[slideIndex].classList.add('active');
    }
    
    function nextSlide() { 
        showSlides(slideIndex + 1); 
        resetAutoSlide();
    }
    
    function prevSlide() { 
        showSlides(slideIndex - 1); 
        resetAutoSlide();
    }
    
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => nextSlide(), 10000);
    }
    
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
    
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    
    if (prevBtn) prevBtn.onclick = () => prevSlide();
    if (nextBtn) nextBtn.onclick = () => nextSlide();
    
    if (dots.length) {
        dots.forEach((dot, i) => {
            dot.onclick = () => {
                showSlides(i);
                resetAutoSlide();
            };
        });
    }
    
    showSlides(0);
    startAutoSlide();

    let touchStartX = 0;
    let touchEndX = 0;
    
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        sliderContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50) {
                nextSlide();
            } else if (touchEndX - touchStartX > 50) {
                prevSlide();
            }
        });
    }
});