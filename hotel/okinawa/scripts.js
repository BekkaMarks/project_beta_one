const toggleBtn = document.getElementById("toggleBtn");
const choices = document.getElementById("choices");

toggleBtn.addEventListener("click", () => {
  const isHidden = choices.classList.toggle("hidden");
  // atualizar atributos ARIA
  toggleBtn.setAttribute("aria-expanded", (!isHidden).toString());
  choices.setAttribute("aria-hidden", isHidden.toString());
});

// Toggle da lista de praias (agora fora de .choices)
const beachBtn = document.getElementById("beachBtn");
const beachList = document.getElementById("beachList");

beachBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  // garantir choices visível ao abrir praias
  if (choices.classList.contains("hidden")) {
    choices.classList.remove("hidden");
    toggleBtn.setAttribute("aria-expanded", "true");
    choices.setAttribute("aria-hidden", "false");
  }
  const isHidden = beachList.classList.toggle("hidden");
  beachBtn.setAttribute("aria-expanded", (!isHidden).toString());
  beachList.setAttribute("aria-hidden", isHidden.toString());
});

// Fecha o menu ao clicar fora (inclui beachList)
document.addEventListener("click", (e) => {
  if (
    !document.querySelector(".dropdown").contains(e.target) &&
    !document.getElementById("beachList").contains(e.target)
  ) {
    if (!choices.classList.contains("hidden")) {
      choices.classList.add("hidden");
      toggleBtn.setAttribute("aria-expanded", "false");
      choices.setAttribute("aria-hidden", "true");
    }
    if (beachList && !beachList.classList.contains("hidden")) {
      beachList.classList.add("hidden");
      beachBtn.setAttribute("aria-expanded", "false");
      beachList.setAttribute("aria-hidden", "true");
    }
  }
});

// Impedir que cliques dentro do painel façam o document click fechar tudo instantaneamente
document.querySelector(".dropdown").addEventListener("click", (e) => {
  e.stopPropagation();
});

// Inicializa todos os carousels com a classe .mini-carousel
(function initMiniCarousels() {
  const carousels = document.querySelectorAll(".mini-carousel");
  carousels.forEach((carousel) => {
    const track = carousel.querySelector(".track");
    if (!track) return;
    const slides = Array.from(track.children);
    const prev = carousel.querySelector(".prev");
    const next = carousel.querySelector(".next");
    let idx = 0;

    function update() {
      const w = slides[0].getBoundingClientRect().width;
      track.style.transform = `translateX(${-idx * w}px)`;
      if (slides.length <= 1) {
        if (prev) prev.style.display = "none";
        if (next) next.style.display = "none";
      } else {
        if (prev) prev.style.display = "";
        if (next) next.style.display = "";
      }
    }

    if (prev)
      prev.addEventListener("click", () => {
        idx = (idx - 1 + slides.length) % slides.length;
        update();
      });
    if (next)
      next.addEventListener("click", () => {
        idx = (idx + 1) % slides.length;
        update();
      });

    window.addEventListener("resize", update);
    // swipe simples em touch
    let startX = null;
    track.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });
    track.addEventListener("touchend", (e) => {
      if (startX === null) return;
      const endX = (e.changedTouches && e.changedTouches[0].clientX) || 0;
      const diff = startX - endX;
      if (Math.abs(diff) > 30) {
        idx = diff > 0 ? (idx + 1) % slides.length : (idx - 1 + slides.length) % slides.length;
        update();
      }
      startX = null;
    });

    update();
  });
})();
