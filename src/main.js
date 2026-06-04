import "./style.css";

const header = document.querySelector("[data-header]");
const yearEl = document.querySelector("[data-year]");
const backTop = document.querySelector("[data-back-top]");
const hudTime = document.querySelector("[data-hud-time]");
const scrollProgress = document.querySelector("[data-scroll-progress]");
const parallaxScene = document.querySelector("[data-parallax-scene]");

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
