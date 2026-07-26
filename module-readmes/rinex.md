# Asistente RINEX GNSS - CyC Topografía Suite

## Visión General

El **Asistente RINEX GNSS** prepara los insumos técnicos necesarios para el postproceso geodésico dentro de la CyC Topografía Suite. Su función principal es leer un archivo Rover, extraer sus metadatos de tiempo y posición, localizar la estación base INEGI más conveniente, descargar los productos GNSS requeridos y dejar un paquete ordenado, trazable y listo para el Motor de Postproceso GNSS.

El módulo combina descarga automática, validación de productos, unión conservadora de fragmentos RINEX y persistencia de sesión mediante `_cyc.json`. Esto permite que el flujo entre Asistente RINEX GNSS y Postproceso GNSS sea continuo: el usuario carga el Rover, el asistente identifica fecha, DOY, rango horario y estación sugerida, y el pipeline conserva las rutas de observación, navegación, órbitas, relojes, antenas e IONEX cuando existen.

## Funciones Principales

- **Carga y análisis de Rover:** extrae fecha, semana GPS, día del año, hora inicial, hora final, posición aproximada y altura disponible en la cabecera.
- **Selección automática de estación INEGI:** sugiere la base RGNA más cercana y genera los nombres oficiales requeridos por estación, DOY y hora.
- **Servidor INEGI configurable:** usa por defecto el **Nuevo SFTP INEGI** (`geodesia2.inegi.org.mx`) y conserva el **FTP antiguo INEGI** como respaldo.
- **Fallback de descarga:** si el servidor seleccionado no entrega archivos útiles, intenta la alternativa configurada.
- **Descarga de bases RINEX INEGI:** obtiene fragmentos horarios RINEX 2 y RINEX 3 cuando están disponibles.
- **Unión conservadora RINEX:** une fragmentos horarios sin homologar ni sustituir observables; ordena cronológicamente, elimina épocas duplicadas y actualiza tiempos de cabecera.
- **Separación Multi-Track:** conserva observación y navegación en canales independientes (`O`, `N`, `G`, `L`, `.rnx`) para evitar mezclas inválidas.
- **Productos geodésicos auxiliares:** puede descargar efemérides precisas SP3, relojes CLK, navegación combinada BRDC MGEX, antenas ATX y mapas ionosféricos IONEX.
- **Validación IONEX:** verifica cabecera, cobertura temporal, intervalo, tamaño y hash antes de entregar el mapa al postproceso.
- **Sidecar de sesión:** registra en `_cyc.json` las rutas y metadatos relevantes para que Postproceso GNSS pueda recuperar automáticamente la base, navegación, SP3, CLK, BRDC, ATX e IONEX.
- **Flujo en directorio del Rover:** permite guardar productos descargados y unificados junto al archivo Rover para mantener la sesión autocontenida.

## Flujo Operativo

1. Cargar el archivo RINEX Rover.
2. Confirmar o ajustar estación, DOY y rango horario detectado.
3. Seleccionar servidor INEGI y productos auxiliares requeridos.
4. Ejecutar la descarga.
5. Descomprimir, validar y unir los fragmentos disponibles.
6. Generar o actualizar el sidecar `_cyc.json`.
7. Enviar el paquete preparado al Motor de Postproceso GNSS.

## Entregables

- RINEX de observación de base unificado, cuando los fragmentos INEGI están disponibles.
- Navegación clásica separada por constelación (`N`, `G`, `L`) cuando aplique.
- Navegación combinada BRDC MGEX, si se solicita y está disponible.
- Efemérides precisas SP3 y relojes CLK, según disponibilidad de servidores.
- Archivo de antenas ATX, si se solicita.
- Mapa ionosférico IONEX validado, si se solicita.
- Archivo `_cyc.json` con rutas y metadatos auditables de la sesión.

## Criterio Técnico

El asistente no modifica artificialmente los observables del RINEX ni fuerza homologaciones de señal. Su criterio es preparar insumos limpios y trazables; las decisiones de compatibilidad, filtrado, estrategias de FIX o uso de modelos ionosféricos se realizan en el módulo de Postproceso GNSS.

## Registro de Versión y Control

- **Versión actual:** `v260623.0100`
- **Estado:** Operativo. Asistente de carga, descarga, validación y preparación RINEX con SFTP/FTP INEGI, productos auxiliares GNSS, IONEX validado, sidecar `_cyc.json` y pipeline hacia Postproceso GNSS.

---

**CyC Topografía Suite - Innovación en Geodesia de Precisión**
