document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) window.lucide.createIcons();

  const modulePipelines = {
    postproceso: {
      summary: "Convierte observaciones satelitales en una solución geodésica evaluada, auditable y lista para entregar.",
      steps: [
        ["satellite", "Observaciones", "Rover, base y metadatos RINEX"],
        ["scan-search", "Diagnóstico", "Compatibilidad, calidad y estrategia"],
        ["cpu", "Procesamiento", "RTKLIB-EX y modelos geodésicos"],
        ["badge-check", "Resolución", "Ranking, consenso y validación FIX"],
        ["file-check-2", "Entrega", "POS, reporte y sidecar _cyc.json"]
      ]
    },
    rinex: {
      summary: "Prepara automáticamente la estación base y los productos geodésicos requeridos por la sesión.",
      steps: [
        ["file-input", "Lectura Rover", "Fecha, época y posición aproximada"],
        ["map-pin-check", "Selección Base", "Estación INEGI compatible"],
        ["cloud-download", "Descarga", "RINEX, BRDC, SP3, CLK, ATX e IONEX"],
        ["file-cog", "Preparación", "Descompresión, unión y homologación"],
        ["package-check", "Paquete GNSS", "Archivos listos para postproceso"]
      ]
    },
    gnss: {
      summary: "Calcula y verifica factores geodésicos para trabajar coherentemente entre Grid, Ground y CAD.",
      steps: [
        ["map-pinned", "Coordenadas", "Ubicación, zona y sistema de referencia"],
        ["mountain", "Elevación", "Altura y radio terrestre efectivo"],
        ["calculator", "Cálculo", "Factor de cuadrícula y elevación"],
        ["combine", "Factor Combinado", "Directo e inverso"],
        ["file-output", "Resultado", "Aplicación individual, lote o CAD"]
      ]
    },
    conversiones: {
      summary: "Transforma coordenadas entre representaciones geodésicas con parámetros controlados y resultados verificables.",
      steps: [
        ["table-properties", "Entrada", "Coordenadas y formato de origen"],
        ["shield-check", "Validación", "Datum, zona, hemisferio y unidades"],
        ["refresh-cw", "Transformación", "Geográficas, UTM o TME"],
        ["crosshair", "Verificación", "Consistencia y precisión numérica"],
        ["file-output", "Salida", "Resultados y exportación tabular"]
      ]
    },
    datalink: {
      summary: "Normaliza archivos de distintas estaciones totales y los conecta con un flujo de revisión y exportación CAD.",
      steps: [
        ["folder-input", "Archivo de Campo", "Sokkia, Foif, Stonex o Leica"],
        ["scan-search", "Detección", "Marca, estructura y codificación"],
        ["list-tree", "Normalización", "Puntos, códigos y observaciones"],
        ["table-2", "Revisión", "Vista previa y correcciones"],
        ["file-output", "Exportación", "Formatos interoperables y CAD"]
      ]
    },
    linderos: {
      summary: "Ajusta geometrías de colindancia mediante métodos robustos y documenta técnicamente el resultado.",
      steps: [
        ["waypoints", "Importación", "Puntos, códigos y tramos"],
        ["filter", "Depuración", "Agrupación y descarte de atípicos"],
        ["ruler", "Ajuste", "Regresión ortogonal y RANSAC"],
        ["move-diagonal-2", "Geometría", "Offsets e intersecciones"],
        ["notebook-tabs", "Dictamen", "Resultados y memoria técnica"]
      ]
    },
    presupuestos: {
      summary: "Estructura costos, análisis y avances para producir presupuestos y documentos administrativos consistentes.",
      steps: [
        ["library", "Catálogos", "Insumos, unidades y rendimientos"],
        ["calculator", "APU", "Costos directos e integración"],
        ["folder-kanban", "Proyecto", "Partidas, cantidades y avances"],
        ["chart-no-axes-combined", "Control", "Totales, variaciones y sobrecostos"],
        ["file-spreadsheet", "Entregables", "Reportes, Excel y documentos"]
      ]
    },
    control_personal: {
      summary: "Relaciona personal, obras y contratos para controlar asignaciones y financiamiento semanal por proyecto.",
      steps: [
        ["database", "Base Operativa", "Selección o creación del proyecto"],
        ["users-round", "Personal", "Empleados, puestos y expedientes"],
        ["briefcase-business", "Asignaciones", "Obras, contratos y periodos"],
        ["calendar-range", "Cálculo Semanal", "Nómina y financiamiento"],
        ["file-chart-column", "Seguimiento", "Historial y reportes de control"]
      ]
    }
  };

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
  const detailPipeline = document.querySelector("[data-detail-pipeline]");
  const pipelineTitle = document.querySelector("[data-pipeline-title]");
  const pipelineSummary = document.querySelector("[data-pipeline-summary]");
  const pipelineFlow = document.querySelector("[data-pipeline-flow]");
  const relatedDocs = document.querySelector("[data-related-docs]");
  const resolveContent = document.querySelector("[data-resolve-content]");
  const androidContent = document.querySelector("[data-android-content]");

  async function fetchMarkdown(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`No se pudo cargar ${path}`);
    return response.text();
  }

  function markdownToHtml(markdown) {
    return window.marked ? window.marked.parse(markdown) : `<pre>${markdown}</pre>`;
  }

  async function loadResolveDocument() {
    if (!resolveContent) return;
    try {
      const markdown = await fetchMarkdown("module-readmes/cyc-resolve.txt");
      resolveContent.innerHTML = markdownToHtml(markdown);
    } catch {
      resolveContent.innerHTML = "<p>No fue posible cargar el documento técnico CyC Resolve.</p>";
    }
  }

  async function loadAndroidDocument() {
    if (!androidContent) return;
    try {
      const markdown = await fetchMarkdown("module-readmes/android.md");
      androidContent.innerHTML = markdownToHtml(markdown);
    } catch {
      androidContent.innerHTML = "<p>No fue posible cargar la documentación Android.</p>";
    }
  }

  function renderRelatedDocs(card) {
    if (!relatedDocs) return;
    if (card.dataset.readme !== "postproceso") {
      relatedDocs.hidden = true;
      relatedDocs.innerHTML = "";
      return;
    }

    relatedDocs.innerHTML = `
      <div>
        <span>DOCUMENTO FUNDAMENTAL</span>
        <h4>CyC Resolve</h4>
        <p>Respaldo técnico del método de postproceso, validación Integrity, IonoCore, GeoCore y trazabilidad de reportes.</p>
      </div>
      <a href="#cyc-resolve" class="resolve-link"><i data-lucide="file-text"></i><span>Leer documento técnico</span></a>
    `;
    relatedDocs.hidden = false;
    if (window.lucide) window.lucide.createIcons();
  }

  function renderPipeline(card) {
    const pipeline = modulePipelines[card.dataset.readme];
    if (!pipeline) {
      detailPipeline.hidden = true;
      return;
    }
    pipelineTitle.textContent = `Pipeline de ${card.querySelector("h3").textContent}`;
    pipelineSummary.textContent = pipeline.summary;
    pipelineFlow.innerHTML = pipeline.steps.map((step, index) => `
      <div class="module-flow-step">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <i data-lucide="${step[0]}"></i>
        <div><b>${step[1]}</b><small>${step[2]}</small></div>
      </div>
      ${index < pipeline.steps.length - 1 ? '<div class="module-flow-line" aria-hidden="true"></div>' : ""}
    `).join("");
    detailPipeline.hidden = false;
    if (window.lucide) window.lucide.createIcons();
  }

  async function openModule(card) {
    document.querySelectorAll(".module-card").forEach(item => item.classList.remove("selected"));
    card.classList.add("selected");
    detailPanel.style.setProperty("--detail-accent", card.dataset.accent);
    detailTitle.textContent = card.querySelector("h3").textContent;
    detailCategory.textContent = `${card.querySelector(".module-meta span").textContent} · ${card.querySelector(".module-meta small").textContent}`;
    detailPanel.hidden = false;
    detailContent.innerHTML = "<p>Cargando documentación...</p>";
    detailPipeline.hidden = true;
    try {
      const markdown = await fetchMarkdown(`module-readmes/${card.dataset.readme}.md`);
      detailContent.innerHTML = markdownToHtml(markdown);
    } catch {
      detailContent.innerHTML = "<p>No fue posible cargar la documentación de este módulo.</p>";
    }
    renderPipeline(card);
    renderRelatedDocs(card);
    detailPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  document.querySelectorAll(".module-card").forEach(card => card.addEventListener("click", () => openModule(card)));
  document.querySelector(".detail-close")?.addEventListener("click", () => {
    detailPanel.hidden = true;
    if (relatedDocs) relatedDocs.hidden = true;
    document.querySelectorAll(".module-card").forEach(item => item.classList.remove("selected"));
  });

  document.querySelectorAll("[data-open-module]").forEach(link => {
    link.addEventListener("click", event => {
      const card = document.querySelector(`.module-card[data-readme="${link.dataset.openModule}"]`);
      if (!card) return;
      event.preventDefault();
      openModule(card);
    });
  });

  loadResolveDocument();
  loadAndroidDocument();

  document.querySelectorAll("[data-current-year]").forEach(node => node.textContent = new Date().getFullYear());

  function formatBytes(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) return "";
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes, unit = 0;
    while (size >= 1024 && unit < units.length - 1) {
      size /= 1024;
      unit += 1;
    }
    return `${size.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
  }

  fetch("versions.json")
    .then(response => response.ok ? response.json() : Promise.reject())
    .then(versions => {
      document.querySelectorAll("[data-suite-version]").forEach(node => node.textContent = `Suite v${versions.suite}`);
      const latestLabel = versions.latest_module === "desktop-release" ? "Última publicación Desktop" : `Última evolución: ${versions.latest_module}`;
      document.querySelectorAll("[data-latest-module]").forEach(node => node.textContent = latestLabel);
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
      const installer = release.assets?.find(asset => /\.exe$/i.test(asset.name)) || release.assets?.[0];
      const releaseUrl = release.html_url || "https://github.com/cc-topografia-mid/CyC_Suite_Releases/releases/latest";
      const downloadUrl = installer?.browser_download_url || releaseUrl;
      document.querySelectorAll("[data-release-version]").forEach(node => node.textContent = version);
      document.querySelectorAll("[data-release-date]").forEach(node => node.textContent = `Publicada el ${date}`);
      document.querySelectorAll("[data-release-name]").forEach(node => node.textContent = release.name || "CyC Topografía Suite para Windows");
      document.querySelectorAll("[data-release-link]").forEach(node => node.href = downloadUrl);
      document.querySelectorAll("[data-release-page]").forEach(node => node.href = releaseUrl);
      document.querySelectorAll("[data-release-asset]").forEach(node => node.textContent = installer?.name || "Ver archivos de la publicación");
      document.querySelectorAll("[data-release-size]").forEach(node => {
        const size = formatBytes(installer?.size);
        node.textContent = size ? `Tamaño: ${size}` : "";
        node.hidden = !size;
      });
      document.querySelectorAll("[data-release-sha]").forEach(node => {
        const sha = installer?.digest?.replace(/^sha256:/i, "").toUpperCase();
        node.textContent = sha ? `SHA-256: ${sha.slice(0, 12)}...${sha.slice(-8)}` : "";
        node.title = sha ? `SHA-256: ${sha}` : "";
        node.hidden = !sha;
      });
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
