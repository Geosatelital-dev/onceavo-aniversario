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

  // Formateo visual
  if(daysEl) daysEl.textContent = d < 10 ? '0' + d : d;
  if(hoursEl) hoursEl.textContent = h < 10 ? '0' + h : h;
  if(minutesEl) minutesEl.textContent = m < 10 ? '0' + m : m;
}

// Iniciar contador
updateCountdown();
setInterval(updateCountdown, 60000);

// 2. SCROLL Y NAVEGACIÓN
const scrollContainer = document.getElementById('scrollContainer');
const dots = document.querySelectorAll('.dot');
const panels = document.querySelectorAll('.panel');
let currentPanel = 0;

function scrollToPanel(index) {
  if (panels[index]) {
    const targetTop = panels[index].offsetTop;
    scrollContainer.scrollTo({ 
      top: targetTop, 
      behavior: 'smooth'
    });
  }
}

// Click en dots
dots.forEach((dot, i) => {
  dot.addEventListener('click', () => scrollToPanel(i));
});

// Observer para detectar sección activa
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const idx = Array.from(panels).indexOf(entry.target);
      
      dots.forEach(d => d.classList.remove('active'));
      if(dots[idx]) {
        dots[idx].classList.add('active');
      }
      
      const items = entry.target.querySelectorAll('.reveal-up');
      items.forEach(el => el.classList.add('visible'));
    }
  });
}, { 
  root: scrollContainer, 
  threshold: 0.3
});

// Observar panels
panels.forEach(p => observer.observe(p));

// Animar primer panel
const firstItems = panels[0].querySelectorAll('.reveal-up');
setTimeout(() => {
  firstItems.forEach(el => el.classList.add('visible'));
}, 100);


// ===== MÚSICA DE FONDO =====
let musicStarted = false;

function startExperience(){

  // Obtener el audio en tiempo real
  const music = document.getElementById("bg-music");

  if(!musicStarted && music){
    fadeInAudio(music);
    musicStarted = true;
  }

  scrollToPanel(1);
}

// Fade elegante
function fadeInAudio(audio){
  audio.volume = 0;

  const playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise.then(() => {

      let vol = 0;
      const target = 0.5;

      const interval = setInterval(() => {
        if(vol < target){
          vol += 0.05;
          audio.volume = vol;
        } else {
          clearInterval(interval);
        }
      }, 200);

    }).catch(error => {
      console.log("Error reproduciendo audio:", error);
    });
  }
}