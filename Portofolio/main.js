// ===== AOS =====
AOS.init({ duration: 700, once: true, offset: 60 });

// ===== LOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.style.opacity = '0';
    setTimeout(() => loader.style.display = 'none', 500);
  }, 1300);
});

// ===== TYPING =====
const text = "Fajri";
let i = 0;
const typingEl = document.getElementById("typing");
(function typing() {
  if (i < text.length) {
    typingEl.innerHTML += text.charAt(i++);
    setTimeout(typing, 100);
  }
})();

// ===== NAVBAR SCROLL + ACTIVE LINK =====
const mainNav = document.getElementById('mainNav');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  mainNav.classList.toggle('scrolled', window.scrollY > 50);

  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
});

// ===== SKILL BAR ANIMATION =====
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.progress-bar[data-width]').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const aboutSection = document.getElementById('about');
if (aboutSection) skillObserver.observe(aboutSection);

// ===== PARTICLE CANVAS =====
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.5 + 0.2;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(56,189,248,${this.alpha})`;
    ctx.fill();
  }
}

const particles = Array.from({ length: 80 }, () => new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  for (let a = 0; a < particles.length; a++) {
    for (let b = a + 1; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x;
      const dy = particles[a].y - particles[b].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.strokeStyle = `rgba(56,189,248,${0.1 * (1 - dist / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== GALLERY =====
const images = [
  "Fajri 01.jpg","Fajri 02.jpg","Fajri 03.jpg","Fajri 04.jpg",
  "Fajri 05.jpg","Fajri 06.jpg","Fajri 07.jpg","Fajri 08.jpg",
  "Fajri 09.jpg","Fajri 10.jpg","Fajri 11.jpg","Fajri 12.jpg"
];
const placeholderEmoji = ["📊","🤖","🧠","📈","💻","🗄️","🔬","📉","🧮","⚡","🌐","📡"];
const galleryContainer = document.getElementById("galleryContainer");

images.forEach((src, index) => {
  const col = document.createElement("div");
  col.className = "col-6 col-md-4 col-lg-3";
  col.setAttribute('data-aos', 'zoom-in');
  col.setAttribute('data-aos-delay', String((index % 4) * 60));

  const wrap = document.createElement("div");
  wrap.className = "gallery-img-wrap position-relative";

  const img = document.createElement("img");
  img.src = src;
  img.alt = "Gallery " + (index + 1);
  img.loading = "lazy";

  // Fallback jika gambar tidak ada
  img.onerror = () => {
    wrap.innerHTML = '';
    wrap.className = 'gallery-placeholder';
    wrap.textContent = placeholderEmoji[index % placeholderEmoji.length];
    wrap.title = "Tambahkan " + src + " ke folder ini";
  };

  const overlay = document.createElement("div");
  overlay.className = "gallery-overlay";
  overlay.textContent = "🔍";

  wrap.addEventListener('click', () => {
    if (img.complete && img.naturalWidth > 0) {
      document.getElementById('modalImg').src = src;
      new bootstrap.Modal(document.getElementById('imageModal')).show();
    }
  });

  wrap.appendChild(img);
  wrap.appendChild(overlay);
  col.appendChild(wrap);
  galleryContainer.appendChild(col);
});

// ===== THEME TOGGLE =====
function toggleTheme() {
  document.body.classList.toggle('light-mode');
  const isLight = document.body.classList.contains('light-mode');
  document.getElementById('themeBtn').textContent = isLight ? '☀️' : '🌙';
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

// Restore theme
if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light-mode');
  document.getElementById('themeBtn').textContent = '☀️';
}

// ===== CLOSE NAVBAR on mobile nav-link click =====
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    const el = document.getElementById('nav');
    const instance = bootstrap.Collapse.getInstance(el);
    if (instance) instance.hide();
  });
});