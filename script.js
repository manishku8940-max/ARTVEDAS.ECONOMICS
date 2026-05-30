// ===== AarthVedas — The Society of Economics | JS =====

document.addEventListener('DOMContentLoaded', () => {

  // ===== Custom Cursor =====
  const cursor = document.querySelector('.cursor');
  const cursorRing = document.querySelector('.cursor-ring');
  let cursorX = 0, cursorY = 0, ringX = 0, ringY = 0;

  document.addEventListener('mousemove', e => {
    cursorX = e.clientX; cursorY = e.clientY;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
  });

  // Smooth ring follow
  function animateCursor() {
    ringX += (cursorX - ringX) * 0.12;
    ringY += (cursorY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .stat-card, .curriculum-card, .team-card, .social-card').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); cursorRing.classList.add('hover'); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); cursorRing.classList.remove('hover'); });
  });

  // ===== Particle Canvas =====
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.size = Math.random() * 1.5 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = -Math.random() * 0.4 - 0.1;
      this.opacity = Math.random() * 0.4 + 0.05;
      this.life = Math.random() * 200 + 100;
      this.maxLife = this.life;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life--;
      if (this.life <= 0 || this.y < -10) this.reset();
    }
    draw() {
      const alpha = (this.life / this.maxLife) * this.opacity;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,76,${alpha})`;
      ctx.fill();
    }
  }

  const particles = Array.from({ length: 80 }, () => new Particle());

  function animateParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });

    // Draw connecting lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(201,168,76,${0.06 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ===== Nav Scroll Effect =====
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  // ===== Smooth Scroll =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ===== Scroll Reveal =====
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ===== Animated Counters =====
  function animateCounter(el, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const update = () => {
      start += increment;
      if (start >= target) { el.textContent = target.toLocaleString() + (el.dataset.suffix || ''); return; }
      el.textContent = Math.floor(start).toLocaleString() + (el.dataset.suffix || '');
      requestAnimationFrame(update);
    };
    update();
  }

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateCounter(el, parseInt(el.dataset.target), 2200);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

  // ===== 3D Tilt Effect =====
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (-y / rect.height) * 10;
      const rotateY = (x / rect.width) * 10;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
  });

  // ===== Complaint Form =====
  const form = document.getElementById('complaintForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.btn-primary');
      btn.innerHTML = '<span>Submitting…</span>';
      btn.style.opacity = '0.7';

      setTimeout(() => {
        // Store in localStorage for persistence demo
        const complaints = JSON.parse(localStorage.getItem('av_complaints') || '[]');
        complaints.push({
          name: form.querySelector('#name').value,
          email: form.querySelector('#email').value,
          type: form.querySelector('#type').value,
          message: form.querySelector('#message').value,
          date: new Date().toISOString()
        });
        localStorage.setItem('av_complaints', JSON.stringify(complaints));

        form.style.display = 'none';
        formSuccess.style.display = 'block';
        formSuccess.style.animation = 'fadeUp 0.6s ease forwards';
      }, 1200);
    });
  }

  // ===== Applicant Join =====
  const joinBtn = document.getElementById('joinBtn');
  const joinCount = document.getElementById('joinCount');
  const joinMsg = document.getElementById('joinMsg');

  if (joinBtn) {
    // Load from storage
    let count = parseInt(localStorage.getItem('av_applicants') || '247');
    const joined = localStorage.getItem('av_joined');

    if (joined) {
      joinBtn.textContent = 'Application Submitted ✓';
      joinBtn.disabled = true;
      joinBtn.style.opacity = '0.6';
    }

    joinBtn.addEventListener('click', () => {
      if (localStorage.getItem('av_joined')) return;
      count++;
      localStorage.setItem('av_applicants', count);
      localStorage.setItem('av_joined', '1');
      joinBtn.textContent = 'Application Submitted ✓';
      joinBtn.disabled = true;
      joinBtn.style.opacity = '0.6';
      if (joinMsg) joinMsg.textContent = 'Welcome to AarthVedas. Your application has been recorded.';

      // Update visible counter
      const liveCounter = document.getElementById('liveApplicants');
      if (liveCounter) {
        liveCounter.dataset.target = count;
        animateCounter(liveCounter, count, 800);
      }
    });
  }

  // ===== Floating ornament animation =====
  const ornaments = document.querySelectorAll('.ornament');
  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; });

  function animateOrnaments() {
    ornaments.forEach((o, i) => {
      const speed = 0.05 + i * 0.02;
      o.style.transform = `translateY(${scrollY * speed}px)`;
    });
    requestAnimationFrame(animateOrnaments);
  }
  animateOrnaments();

  // ===== Hero text glitch shimmer =====
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    setInterval(() => {
      heroTitle.style.textShadow = `0 0 ${40 + Math.random() * 20}px rgba(201,168,76,${0.2 + Math.random() * 0.15})`;
    }, 2000);
  }

});
