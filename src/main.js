import "./style.css";

const header = document.querySelector("[data-header]");
const yearEl = document.querySelector("[data-year]");
const backTop = document.querySelector("[data-back-top]");
const hudTime = document.querySelector("[data-hud-time]");
const hudStatus = document.querySelector("[data-hud-status]");
const footerStatus = document.querySelector("[data-footer-status]");
const scrollProgress = document.querySelector("[data-scroll-progress]");
const parallaxScene = document.querySelector("[data-parallax-scene]");
const matrixCanvas = document.querySelector("[data-matrix]");
const neuralCanvas = document.querySelector("[data-neural]");
const techGrid = document.querySelector("[data-tech-grid]");
const typingEl = document.querySelector("[data-typing-text]");
const tickerEl = document.querySelector("[data-ticker]");

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function onScroll() {
  if (header) {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  }

  if (scrollProgress) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    scrollProgress.style.width = `${pct}%`;
  }

  if (parallaxScene && !reducedMotion) {
    const y = window.scrollY * 0.35;
    parallaxScene.style.transform = `translate3d(0, ${y}px, 0) scale(1.05)`;
  }
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

if (backTop) {
  backTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

if (hudTime && !reducedMotion) {
  let frame = 0;
  const pad = (n) => String(n).padStart(2, "0");

  setInterval(() => {
    frame = (frame + 1) % 24;
    const now = new Date();
    hudTime.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}:${pad(frame)}`;
  }, 42);
}

if (hudStatus && !reducedMotion) {
  const states = ["LINK_OK", "PING 12ms", "UPLINK ↑", "NODE_ACTIVE"];
  let i = 0;
  setInterval(() => {
    hudStatus.textContent = `SAIGON · ${states[i++ % states.length]}`;
  }, 3200);
}

if (footerStatus && !reducedMotion) {
  const msgs = [
    "sys.idle — awaiting signal",
    "listener.active — port open",
    "collab.ready — send payload",
  ];
  let j = 0;
  setInterval(() => {
    footerStatus.textContent = msgs[j++ % msgs.length];
  }, 4500);
}

if (typingEl && !reducedMotion) {
  const full = typingEl.textContent ?? "";
  typingEl.textContent = "";
  let idx = 0;
  const type = () => {
    if (idx <= full.length) {
      typingEl.textContent = full.slice(0, idx);
      idx += 1;
      setTimeout(type, 28 + Math.random() * 40);
    }
  };
  setTimeout(type, 600);
}

if (tickerEl) {
  const hex = () =>
    Array.from({ length: 4 }, () =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, "0")
        .toUpperCase()
    ).join("");

  const chunk = () =>
    `0x${hex()} · NODE_${Math.floor(Math.random() * 999).toString().padStart(3, "0")} · SYNC_OK`;

  const line = Array.from({ length: 24 }, chunk).join("   ");
  tickerEl.textContent = `${line}   ${line}`;
}

if (techGrid && !reducedMotion) {
  window.addEventListener(
    "pointermove",
    (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      techGrid.style.setProperty("--mx", `${x}%`);
      techGrid.style.setProperty("--my", `${y}%`);
    },
    { passive: true }
  );
}

function initMatrix(canvas) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン$#@";
  const fontSize = window.innerWidth < 640 ? 14 : 16;
  let columns = 0;
  let drops = [];

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = Array.from({ length: columns }, () => Math.random() * -40);
  };

  const draw = () => {
    ctx.fillStyle = "rgba(1, 10, 4, 0.07)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

    for (let i = 0; i < drops.length; i += 1) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      const alpha = 0.15 + Math.random() * 0.45;
      ctx.fillStyle = `rgba(0, 255, 65, ${alpha})`;
      ctx.fillText(char, x, y);

      if (Math.random() > 0.985) {
        ctx.fillStyle = "rgba(200, 255, 220, 0.9)";
        ctx.fillText(char, x, y - fontSize * 0.8);
      }

      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i] += 0.5 + Math.random() * 0.8;
    }
  };

  resize();
  window.addEventListener("resize", resize);

  let running = true;
  const loop = () => {
    if (!running) return;
    draw();
    requestAnimationFrame(loop);
  };
  loop();

  return () => {
    running = false;
  };
}

function initNeural(canvas) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const count = window.innerWidth < 640 ? 28 : 48;
  let nodes = [];
  let mouse = { x: 0, y: 0, active: false };
  const linkDist = window.innerWidth < 640 ? 110 : 150;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
    }));
  };

  window.addEventListener(
    "pointermove",
    (e) => {
      mouse = { x: e.clientX, y: e.clientY, active: true };
    },
    { passive: true }
  );

  window.addEventListener("pointerleave", () => {
    mouse.active = false;
  });

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

      if (mouse.active) {
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 180) {
          n.x -= (dx / dist) * 0.4;
          n.y -= (dy / dist) * 0.4;
        }
      }
    }

    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < linkDist) {
          const alpha = (1 - dist / linkDist) * 0.35;
          ctx.strokeStyle = `rgba(0, 255, 65, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (const n of nodes) {
      ctx.fillStyle = "rgba(0, 255, 65, 0.55)";
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  resize();
  window.addEventListener("resize", resize);

  let running = true;
  const loop = () => {
    if (!running) return;
    draw();
    requestAnimationFrame(loop);
  };
  loop();

  return () => {
    running = false;
  };
}

if (matrixCanvas && !reducedMotion) {
  initMatrix(matrixCanvas);
}

if (neuralCanvas && !reducedMotion) {
  initNeural(neuralCanvas);
}

const revealEls = document.querySelectorAll(".reveal");
if (revealEls.length && !reducedMotion) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -5% 0px", threshold: 0.08 }
  );

  revealEls.forEach((el, i) => {
    if (i % 3 === 1) el.classList.add("reveal-delay-1");
    if (i % 3 === 2) el.classList.add("reveal-delay-2");
    observer.observe(el);
  });
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

function initSlideDeck(deck) {
  const track = deck.querySelector("[data-slide-track]");
  const slides = [...deck.querySelectorAll("[data-slide]")];
  const prevBtn = deck.querySelector("[data-slide-prev]");
  const nextBtn = deck.querySelector("[data-slide-next]");
  const dotsWrap = deck.querySelector("[data-slide-dots]");
  const counter = deck.querySelector("[data-slide-counter]");
  const viewport = deck.querySelector("[data-slide-viewport]");

  if (!track || !slides.length || !dotsWrap) return;

  const total = slides.length;
  let index = 0;
  let timer;

  const pad = (n) => String(n).padStart(2, "0");

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "slide-dot";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `Slide ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  const dots = [...dotsWrap.querySelectorAll(".slide-dot")];

  const goTo = (next) => {
    index = (next + total) % total;
    track.style.transform = `translate3d(-${index * 100}%, 0, 0)`;
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === index);
      slide.setAttribute("aria-hidden", i === index ? "false" : "true");
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
      dot.setAttribute("aria-selected", i === index ? "true" : "false");
    });
    if (counter) {
      counter.textContent = `${pad(index + 1)} / ${pad(total)}`;
    }
    resetAutoplay();
  };

  const resetAutoplay = () => {
    clearInterval(timer);
    if (reducedMotion) return;
    timer = setInterval(() => goTo(index + 1), 5500);
  };

  prevBtn?.addEventListener("click", () => goTo(index - 1));
  nextBtn?.addEventListener("click", () => goTo(index + 1));

  deck.addEventListener("mouseenter", () => clearInterval(timer));
  deck.addEventListener("mouseleave", resetAutoplay);

  let startX = 0;
  viewport?.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
    },
    { passive: true }
  );
  viewport?.addEventListener(
    "touchend",
    (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 48) {
        goTo(dx < 0 ? index + 1 : index - 1);
      }
    },
    { passive: true }
  );

  goTo(0);
}

const slideDeck = document.querySelector("[data-slide-deck]");
if (slideDeck) {
  initSlideDeck(slideDeck);
}
