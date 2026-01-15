
// ==========================
// SWIPE EN MÓVIL PARA EL CARRUSEL
// ==========================
const carousel = document.querySelector('.carousel');
if (carousel) {
  let startX;
  carousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });
  carousel.addEventListener('touchend', (e) => {
    let endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) {
      document.getElementById('nextBtn').click();
    } else if (endX - startX > 50) {
      document.getElementById('prevBtn').click();
    }
  });
}

// ==========================
// MENÚ HAMBURGUESA
// ==========================
const toggleBtn = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('nav');
if (toggleBtn && navMenu) {
  toggleBtn.addEventListener('click', () => {
    if (navMenu.style.display === 'flex') {
      navMenu.style.display = 'none';
    } else {
      navMenu.style.display = 'flex';
    }
  });
}
