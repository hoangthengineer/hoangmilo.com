import "./style.css";

const header = document.querySelector("[data-header]");
const yearEl = document.querySelector("[data-year]");
const backTop = document.querySelector("[data-back-top]");
const hudTime = document.querySelector("[data-hud-time]");
const hudStatus = document.querySelector("[data-hud-status]");
const footerStatus = document.querySelector("[data-footer-status]");
const scrollProgress = document.querySelector("[data-scroll-progress]");
const matrixCanvas = document.querySelector("[data-matrix]");
const techGrid = document.querySelector("[data-tech-grid]");
const typingEl = document.querySelector("[data-typing-text]");
const tickerEl = document.querySelector("[data-ticker]");

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobile = window.matchMedia("(max-width: 767px)").matches;
const liteEffects = reducedMotion || isMobile;

let scrollTicking = false;

function onScroll() {
  if (header) {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  }

  if (scrollProgress) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    scrollProgress.style.width = `${pct}%`;
  }
}

function queueScroll() {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(() => {
    onScroll();
    scrollTicking = false;
  });
}

window.addEventListener("scroll", queueScroll, { passive: true });
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

if (techGrid && !liteEffects) {
  let gridTicking = false;
  window.addEventListener(
    "pointermove",
    (e) => {
      if (gridTicking) return;
      gridTicking = true;
      requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        techGrid.style.setProperty("--mx", `${x}%`);
        techGrid.style.setProperty("--my", `${y}%`);
        gridTicking = false;
      });
    },
    { passive: true }
  );
}

function initMatrix(canvas) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン$#@";
  const fontSize = window.innerWidth < 640 ? 14 : 18;
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
  let frame = 0;
  const loop = () => {
    if (!running) return;
    frame += 1;
    if (frame % 2 === 0) draw();
    requestAnimationFrame(loop);
  };
  loop();

  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running) loop();
  });

  return () => {
    running = false;
  };
}

if (matrixCanvas && !reducedMotion) {
  initMatrix(matrixCanvas);
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
