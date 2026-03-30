/* =============================================
   LÓGICA GEOSATELITAL - 11 ANIVERSARIO
   ============================================= */

// 1. CONFIGURACIÓN DEL CONTADOR (17 de Abril 2026, 19:00:00)
const EVENT_DATE = new Date('2026-04-17T19:00:00-05:00').getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const diff = EVENT_DATE - now;

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');

  // Si el evento ya pasó o es el momento
  if (diff <= 0) {
    if(daysEl) daysEl.textContent = '00';
    if(hoursEl) hoursEl.textContent = '00';
    if(minutesEl) minutesEl.textContent = '00';
    return;
  }

  // Cálculos matemáticos
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  // Formateo visual (añade 0 si es menor a 10)
  if(daysEl) daysEl.textContent = d < 10 ? '0' + d : d;
  if(hoursEl) hoursEl.textContent = h < 10 ? '0' + h : h;
  if(minutesEl) minutesEl.textContent = m < 10 ? '0' + m : m;
}

// Iniciar contador
updateCountdown();
setInterval(updateCountdown, 60000); // Actualiza cada minuto (no necesitamos segundos en la UI)

// 2. SCROLL Y ACTUALIZACIÓN DE PUNTOS DE NAVEGACIÓN
const scrollContainer = document.getElementById('scrollContainer');
const dots = document.querySelectorAll('.dot');
const panels = document.querySelectorAll('.panel');
let currentPanel = 0;

// Función para scrollear al hacer clic en un botón o punto
function scrollToPanel(index) {
  if (panels[index]) {
    // Obtenemos la distancia exacta de esa sección desde el tope
    const targetTop = panels[index].offsetTop;
    // Le ordenamos al contenedor que haga el scroll hasta esa distancia
    scrollContainer.scrollTo({ 
      top: targetTop, 
      behavior: 'smooth'
    });
  }
}

// Asignar clics a los puntos
dots.forEach((dot, i) => {
  dot.addEventListener('click', () => scrollToPanel(i));
});

// Usamos IntersectionObserver para detectar en qué panel estamos 
// (Es 100% a prueba de fallos frente a la matemática antigua)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const idx = Array.from(panels).indexOf(entry.target);
      
      // 1. Pintar el puntito correcto de forma segura
      dots.forEach(d => d.classList.remove('active'));
      if(dots[idx]) {
        dots[idx].classList.add('active');
      }
      
      // 2. Revelar las animaciones (fade-up) de esa sección
      const items = entry.target.querySelectorAll('.reveal-up');
      items.forEach(el => el.classList.add('visible'));
    }
  });
}, { 
  root: scrollContainer, 
  threshold: 0.3 // Se activa cuando al menos el 30% del panel se ve en pantalla
});

// Le decimos al observador que vigile todos los paneles
panels.forEach(p => observer.observe(p));

// Forzar la animación del primer panel al cargar
const firstItems = panels[0].querySelectorAll('.reveal-up');
setTimeout(() => {
  firstItems.forEach(el => el.classList.add('visible'));
}, 100);