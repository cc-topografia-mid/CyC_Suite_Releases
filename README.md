# 🎯 CyC Topografía Suite

![Versión](https://img.shields.io/badge/Versión-v260424.0800-blue)
![Python](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python)
![UI](https://img.shields.io/badge/UI-CustomTkinter-success)
![Estado](https://img.shields.io/badge/Estado-Producción-success)

**CyC Topografía Suite** es un entorno de escritorio (Hub) diseñado para automatizar, estandarizar y optimizar los flujos de trabajo de gabinete en geodesia, topografía, construcción y urbanismo. 

Desarrollada bajo una filosofía de reducción de horas-hombre, la suite ofrece una interfaz gráfica moderna, herramientas analíticas avanzadas y un motor de procesamiento continuo sin fricciones.

---

## ✨ Características Principales

* 🎨 **Interfaz Moderna y Minimalista:** Entorno visual limpio desarrollado con `CustomTkinter`, con modo de aprendizaje (ToolTips, alguos modulos concluidos y otros en desarrollo) y áreas de trabajo dinámicas.
* 🔄 **Pipeline CyC (`_cyc.json`):** Sistema de enrutamiento inteligente que conecta las herramientas entre sí. Los datos fluyen de un módulo al siguiente de forma automática y transparente.
* 🌍 **Internacionalización (i18n):** Soporte multi-idioma con cambio en caliente y persistencia de preferencias de usuario.
* 🛡️ **Navegación Segura:** Guardias de memoria que previenen la pérdida de progreso al cambiar de herramienta durante cálculos intensivos.
* 🏗️ **Arquitectura Escalable:** Construido sobre patrones **MVC** y **Factory**, permitiendo el crecimiento orgánico del catálogo de herramientas.

---

## 🧩 Ecosistema de Módulos

La suite se compone de herramientas autónomas especializadas que se integran en el directorio del Hub principal:

### 📡 Área Geodésica
* **🔬 Postproceso GNSS:** Núcleo geodésico con heurística de diagnóstico. Orquesta el motor **RTKLIB-EX** recompliado sin `MAX_LOOP` para resoluciones bidireccionales (**Q=1 FIX**) en triple frecuencia. Auto-reprocesa fallos y emite dictámenes forenses PDF.
* **🛰️ Orquestador Descargas GNSS:** Motor de automatización. Analiza archivos Rover, ubica la estación base INEGI, y descarga efemérides (SP3), relojes (CLK) y navegación (BRDC) en streaming.
* **🌍 Conversor Geodésico:** Transformación matemática rigurosa y bidireccional de coordenadas Geográficas (Lat/Lon) a UTM. Preparado para procesamiento masivo. (homologado con INEGI tmcalc)
* **📐 Factores GNSS:** Cálculo del Factor Combinado ($F_c$) y Factor Inverso de Escala CAD. Convierte coordenadas de cuadrícula a distancias físicas reales sobre el terreno.

### 🏗️ Área Topográfica y Analítica
* **🔌 DataLink Converter:** Puente universal para ingesta multimarca (Sokkia, Foif, Stonex, Leica) a software de gabinete (CivilCAD, AutoCAD). Elimina formateos manuales.
* **🚧 Ajuste de Linderos:** Herramienta estadística basada en ODR y filtros RANSAC para el control de colindancias a partir de nubes de puntos.

### 💼 Área Administrativa
* **📊 Presupuestos:** Motor financiero robusto basado en Análisis de Precios Unitarios (APU) mediante SQLite. Genera reportes corporativos estructurados por partidas en formato PDF.

---

## 💻 Stack Tecnológico

El núcleo del sistema está diseñado combinando librerías de alto rendimiento matemático y renderizado de interfaces:

* **Core & UI:** Python, `customtkinter`, `ttkbootstrap`, `Pillow`.
* **Motor Matemático y Análisis:** `numpy`, `scipy` (ODR, optimización), `pandas`, `scikit-learn` (RANSAC).
* **Geodesia y Mapeo:** RTKLIB (C++), `tkintermapview`, `utm`.
* **Reportes y BBDD:** `reportlab` (Platypus), `fpdf`, `sqlite3`.

---

## 📦 Compilación y Despliegue

El proyecto cuenta con un entorno de empaquetado optimizado para proteger la propiedad intelectual y garantizar un despliegue sin dependencias externas en sistemas Windows.

* **Motor de Compilación:** Integración con PyInstaller y Nuitka.
* **Integración Continua:** Inclusión dinámica de assets, bases de datos (`/db`), banderas para librerías C/C++ (`scipy`, `sklearn`), y blindaje a código máquina (`.pyd`) de los controladores críticos (Lógica financiera y licenciamiento).
* **Modelo de Acceso:** Sistema Freemium / Donationware integrado con validación de Hardware ID (HWID) y módulos de auto-parcheo en segundo plano.

---

<div align="center">
  <b>Desarrollado con pasión para la ingeniería por <a href="#">CyC Topografía</a></b><br>
  <i>Mérida, Yucatán, México.</i>
</div>
