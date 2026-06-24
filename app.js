document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) window.lucide.createIcons();

  const menuButton = document.querySelector(".menu-button");
  const mobileNav = document.querySelector(".mobile-nav");
  menuButton?.addEventListener("click", () => {
    const open = mobileNav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });
  mobileNav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    mobileNav.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  }));

  document.querySelectorAll(".filter-tabs button").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll(".filter-tabs button").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    document.querySelectorAll(".module-card").forEach(card => {
      card.classList.toggle("is-hidden", filter !== "all" && card.dataset.category !== filter);
    });
  }));

  const detailPanel = document.querySelector(".module-detail");
  const detailTitle = document.querySelector("[data-detail-title]");
  const detailCategory = document.querySelector("[data-detail-category]");
  const detailContent = document.querySelector("[data-detail-content]");

  async function openModule(card) {
    document.querySelectorAll(".module-card").forEach(item => item.classList.remove("selected"));
    card.classList.add("selected");
    detailPanel.style.setProperty("--detail-accent", card.dataset.accent);
    detailTitle.textContent = card.querySelector("h3").textContent;
    detailCategory.textContent = `${card.querySelector(".module-meta span").textContent} · ${card.querySelector(".module-meta small").textContent}`;
    detailPanel.hidden = false;
    detailContent.innerHTML = "<p>Cargando documentación...</p>";
    try {
      const response = await fetch(`module-readmes/${card.dataset.readme}.md`);
      if (!response.ok) throw new Error();
      const markdown = await response.text();
      detailContent.innerHTML = window.marked ? window.marked.parse(markdown) : `<pre>${markdown}</pre>`;
    } catch {
      detailContent.innerHTML = "<p>No fue posible cargar la documentación de este módulo.</p>";
    }
    detailPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  document.querySelectorAll(".module-card").forEach(card => card.addEventListener("click", () => openModule(card)));
  document.querySelector(".detail-close")?.addEventListener("click", () => {
    detailPanel.hidden = true;
    document.querySelectorAll(".module-card").forEach(item => item.classList.remove("selected"));
  });

  document.querySelectorAll("[data-current-year]").forEach(node => node.textContent = new Date().getFullYear());
  fetch("versions.json")
    .then(response => response.ok ? response.json() : Promise.reject())
    .then(versions => {
      document.querySelectorAll("[data-suite-version]").forEach(node => node.textContent = `Suite v${versions.suite}`);
      document.querySelectorAll("[data-latest-module]").forEach(node => node.textContent = `Última evolución: ${versions.latest_module}`);
      document.querySelectorAll(".module-card").forEach(card => {
        const version = versions.modules?.[card.dataset.readme];
        if (version) card.querySelector(".module-meta small").textContent = `v${version}`;
      });
    })
    .catch(() => {});

  fetch("https://api.github.com/repos/cc-topografia-mid/CyC_Suite_Releases/releases/latest", { headers: { Accept: "application/vnd.github+json" } })
    .then(response => response.ok ? response.json() : Promise.reject())
    .then(release => {
      const version = release.tag_name || "Versión estable";
      const date = release.published_at ? new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "long", year: "numeric" }).format(new Date(release.published_at)) : "Publicación oficial";
      document.querySelectorAll("[data-release-version]").forEach(node => node.textContent = version);
      document.querySelectorAll("[data-release-date]").forEach(node => node.textContent = `Publicada el ${date}`);
      document.querySelectorAll("[data-release-name]").forEach(node => node.textContent = release.name || "CyC Topografía Suite para Windows");
      document.querySelectorAll("[data-release-link]").forEach(node => node.href = release.html_url);
    }).catch(() => {});

  const canvas = document.getElementById("fieldCanvas");
  if (!canvas) return;
  const context = canvas.getContext("2d");
  let points = [], frame;
  function resize() {
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = canvas.clientWidth * scale;
    canvas.height = canvas.clientHeight * scale;
    context.setTransform(scale, 0, 0, scale, 0, 0);
    points = Array.from({ length: Math.max(24, Math.floor(canvas.clientWidth / 40)) }, (_, index) => ({
      x: Math.random() * canvas.clientWidth, y: Math.random() * canvas.clientHeight,
      phase: Math.random() * Math.PI * 2, speed: .0015 + Math.random() * .0015, r: index % 7 === 0 ? 2.2 : 1.1
    }));
  }
  function draw(time) {
    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    context.strokeStyle = "rgba(248,199,25,.13)"; context.fillStyle = "rgba(248,199,25,.55)";
    points.forEach((point, index) => {
      const y = point.y + Math.sin(time * point.speed + point.phase) * 13;
      context.beginPath(); context.arc(point.x, y, point.r, 0, Math.PI * 2); context.fill();
      for (let next = index + 1; next < points.length; next++) {
        const other = points[next], otherY = other.y + Math.sin(time * other.speed + other.phase) * 13;
        const distance = Math.hypot(point.x - other.x, y - otherY);
        if (distance < 145) {
          context.globalAlpha = 1 - distance / 145; context.beginPath(); context.moveTo(point.x, y);
          context.lineTo(other.x, otherY); context.stroke(); context.globalAlpha = 1;
        }
      }
    });
    frame = requestAnimationFrame(draw);
  }
  resize(); frame = requestAnimationFrame(draw); window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", () => document.hidden ? cancelAnimationFrame(frame) : frame = requestAnimationFrame(draw));
});
