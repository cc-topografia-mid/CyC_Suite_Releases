# Motor Postproceso GNSS - CyC Topografía Suite

## Visión General

El **Motor Postproceso GNSS** es el núcleo geodésico de la CyC Topografía Suite para transformar observaciones RINEX en coordenadas técnicas auditables. Su modo operativo principal es el **postproceso de punto estático**, con integración directa al Asistente RINEX GNSS, lectura de sidecar `_cyc.json`, ejecución de RTKLIB, estrategias de búsqueda de FIX, validación heurística y generación de reportes PDF.

El sistema se organiza alrededor de **CyC Resolve**, la capa asistente que coordina motor de cálculo, catálogo de estrategias, memoria técnica, conocimiento acumulado y reportes. Actualmente CyC Resolve utiliza RTKLIB como backend de procesamiento, pero su lógica no está conceptualmente limitada a ese motor: puede conservar sus reglas de auditoría, priorización y trazabilidad aun si en el futuro se integra otro motor geodésico.

## Familia CyC Resolve

- **CyC Resolve:** método general de postproceso, orquestación de estrategias, lectura RINEX, configuración RTKLIB, persistencia y selección de resultado.
- **CyC Resolve Integrity:** validador heurístico de calidad. No sustituye al motor de cálculo; audita coherencia temporal, tasa FIX, Ratio AR, estabilidad espacial, dispersión, geometría y evidencia de candidatos.
- **CyC Resolve IonoCore:** capa ionosférica. Evalúa IONEX global, productos regionales híbridos, modelos STEC/VTEC y elegibilidad de estrategias ionosféricas.
- **CyC Resolve GeoCore:** capa vertical posterior. Conserva la altura elipsoidal GNSS y, cuando existe modelo geoidal interpolable, calcula altura ortométrica mediante `H = h - N`.

## Capacidades Actuales

- Procesamiento de punto estático con Rover, Base, navegación transmitida, SP3, CLK, BRDC, ATX e IONEX cuando estén disponibles.
- Coordenadas de base fijas por configuración oficial, sidecar o cabecera RINEX convertida desde `APPROX POSITION XYZ`.
- Catálogo de estrategias FIX con variantes conservadoras, L1, dual, GPS/Galileo, GPS/GLONASS, ventanas temporales, exclusión PRN, IONEX y perfiles históricos auditados.
- Ciclo automático de estrategias hasta agotar catálogo o seleccionar un FIX ganador.
- Memoria progresiva por Rover: estrategias aplicadas, pendientes, candidatos, FIX aceptados, recetas y snapshots.
- Base global de conocimiento `conocimiento_fix.db` como guía orientativa. No declara FIX por historial ni reemplaza la validación de la sesión actual.
- Auditoría técnica única por carpeta Rover mediante `CyC_postproceso_auditoria.log`.
- Generación de reportes **V1 (Formal)** y **V2 (Ejecutivo Auditado)**.
- Recuperación de sesiones previas: sidecar, `.pos`, `.stat`, reportes PDF, rutas de Base/NAV/SP3/IONEX y estrategia ganadora.
- Priorización de estrategia desde reportes PDF V1/V2.
- Datos de proyecto persistentes: cliente, obra, ubicación y punto.
- GeoCore para registrar modelo geoidal, metadatos, hash, estado de aplicación y resultado ortométrico cuando sea posible.

## Línea de Control A-B

La función **Línea de Control A-B** permanece en desarrollo. En operación normal está deshabilitada y el módulo conserva únicamente el flujo de **punto estático**. Para pruebas internas puede habilitarse desde el panel de desarrollador del Hub principal. Este control evita que una función experimental se utilice accidentalmente en entregables de producción.

## GeoCore y Altura Ortométrica

GeoCore no modifica el cálculo GNSS ni las coordenadas elipsoidales generadas por el motor. Su trabajo ocurre después del postproceso:

1. Lee el modelo geoidal configurado para la sesión o el modelo global por defecto.
2. Registra nombre, formato, tamaño, hash SHA-256, datum vertical, cobertura y advertencias.
3. Si el formato tiene interpolador disponible, calcula la ondulación `N`.
4. Calcula altura ortométrica `H = h - N`.
5. Escribe el resultado y el estado de aplicación en reportes y sidecar.

Formatos reconocidos: GeoTIFF, BIL, GGF y GEM. La interpolación automática está disponible para BIL con `.hdr` y GeoTIFF cuando el entorno Python tiene `rasterio/GDAL`. GGF y GEM se reconocen para trazabilidad, pero requieren importador específico antes de usarse para cálculo automático.

## Flujo Operativo

1. Cargar Rover RINEX.
2. Recuperar o asignar Base, NAV, SP3, IONEX y datos de proyecto.
3. Validar que los archivos correspondan a la misma sesión/proyecto antes de procesar.
4. Ejecutar `Procesar Vectores`.
5. Aplicar estrategias CyC Resolve según catálogo, contexto RINEX y conocimiento orientativo.
6. Registrar cada intento en auditoría.
7. Seleccionar el mejor FIX aceptado o un consenso ponderado si no existe FIX certificable.
8. Generar reporte V1 o V2 con configuración efectiva, evidencia, calidad, anexos y trazabilidad.

## Entregables

- Archivo `.pos` y `.stat` del procesamiento.
- Coordenadas WGS84 y UTM.
- Calidad Q y métricas de solución.
- Reporte PDF V1 o V2.
- Bitácora `CyC_postproceso_auditoria.log`.
- Sidecar `_cyc.json` con rutas, configuración, datos de proyecto, estrategia ganadora y metadatos.
- Registro de conocimiento resumido cuando aplique.

## Criterio Técnico

El módulo no debe presentar un resultado FLOAT, Q=2 o FIX parcial como si fuera un FIX completo. CyC Resolve Integrity conserva evidencia positiva de fijación parcial, pero la reporta con su alcance real. Si existen varios FIX aceptados, el sistema selecciona el ganador por score, tasa FIX, Ratio AR, estabilidad, dispersión y trazabilidad de receta.

## Registro de Versión y Control

- **Versión actual:** `v260623.0600`
- **Estado:** Operativo para punto estático. Línea de Control A-B en desarrollo y habilitable sólo para pruebas internas. Reportes V1/V2, CyC Resolve, IonoCore, GeoCore, conocimiento FIX y auditoría técnica disponibles.

---

**CyC Topografía Suite - Innovación en Geodesia de Precisión**
