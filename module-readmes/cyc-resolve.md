# CyC Resolve - Documento tecnico de respaldo

Version del modulo documentada: 260613.1100  
Fecha de emision tecnica: 2026-06-19  
Modulo principal: Motor Postproceso GNSS / CyC Topografia Suite

## 1. Proposito del documento

Este documento describe la logica tecnica interna del sistema CyC Resolve, incluyendo sus componentes de postproceso GNSS, validacion heuristica, modelado ionosferico, modelo geoidal, gestion de estrategias, aprendizaje asistido y trazabilidad documental.

Su objetivo es servir como respaldo tecnico para los reportes generados por la CyC Topografia Suite. Cuando un reporte mencione expresiones como `CyC Resolve`, `CyC Resolve Integrity`, `CyC Resolve IonoCore` o `GeoCore`, este documento permite interpretar que funcion cumple cada componente, que parametros controla, que evidencia utiliza y cuales son sus limites.

Este documento no sustituye normas oficiales, dictamen pericial, validacion metrologica externa ni certificacion institucional. Su alcance es explicar el funcionamiento tecnico del software, su trazabilidad interna y el criterio usado para producir resultados reproducibles y auditables.

## 2. Familia tecnologica CyC Resolve

### 2.1 CyC Resolve

CyC Resolve es el metodo general de postproceso GNSS de la suite. Orquesta la preparacion de archivos RINEX, la configuracion de RTKLIB, la ejecucion del motor `rnx2rtkp.exe`, la lectura de archivos `.pos` y `.stat`, la extraccion de coordenadas, la evaluacion de calidad y la generacion de reportes.

En terminos operativos, CyC Resolve no es un unico parametro de RTKLIB. Es una capa de control que:

- Valida correspondencia entre Rover, Base, navegacion y efemerides.
- Inyecta coordenadas fijas de la base cuando corresponde.
- Selecciona o conserva archivos RINEX oficiales, incluyendo RINEX 2, RINEX 3, navegacion N/G/L, BRDC, SP3, CLK e IONEX.
- Ejecuta estrategias de procesamiento reproducibles.
- Guarda evidencia tecnica en sidecar `_cyc.json`, log de auditoria y reportes PDF.
- Decide si un resultado puede reportarse como FIX, FIX acotado, FLOAT recomendado o consenso ponderado.

Frase de reporte recomendada:

`Procesado con CyC Resolve.`

### 2.2 CyC Resolve Integrity

CyC Resolve Integrity es la capa de validacion heuristica del resultado. Internamente corresponde a la logica implementada alrededor del validador `CyCFixValidator` y las rutinas de ranking/seleccion final.

Su funcion es impedir que un resultado Q=1 de RTKLIB se acepte automaticamente si no cuenta con respaldo estadistico suficiente. El validador no modifica el archivo `.pos`, no altera las coordenadas y no fuerza el FIX. Solo evalua si el FIX detectado es defendible segun criterios de estabilidad temporal, dispersion, geometria, ratio AR, satelites y tasa de fijacion.

Frase de reporte recomendada:

`Resultado validado por CyC Resolve Integrity.`

### 2.3 CyC Resolve IonoCore

CyC Resolve IonoCore es el modulo de elaboracion y gestion ionosferica dentro del flujo GNSS. Integra productos IONEX globales, productos regionales hibridos CyC, diagnostico de conveniencia, priorizacion de estrategias y trazabilidad del archivo ionosferico efectivamente usado.

IonoCore no reemplaza por si solo al postproceso. Alimenta a CyC Resolve con una alternativa de modelado ionosferico cuando la geometria, longitud de vector, disponibilidad de L2 o rechazo de observables sugieren que un modelo TEC puede aportar informacion util.

Frase de reporte recomendada:

`Modelo ionosferico asistido por CyC Resolve IonoCore.`

### 2.4 CyC Resolve GeoCore

GeoCore es la capa vertical posterior al calculo GNSS. RTKLIB entrega alturas elipsoidales. GeoCore permite interpolar una ondulacion geoidal `N` desde un modelo gravimetrico y calcular altura ortometrica:

`H = h - N`

donde:

- `h` = altura elipsoidal GNSS.
- `N` = ondulacion geoidal interpolada.
- `H` = altura ortometrica reportada.

GeoCore documenta si el modelo fue aplicado o si solo fue reconocido. Por ejemplo, un GeoTIFF sin soporte `rasterio/GDAL` disponible no se usa para interpolacion, pero se registra en reporte como modelo reconocido no aplicado, junto con el motivo tecnico.

## 3. Flujo general de postproceso

El flujo estandar de CyC Resolve para punto estatico es:

1. Ingesta de archivos:
   - RINEX Rover.
   - RINEX Base.
   - Navegacion transmitida.
   - Efemerides precisas SP3 opcionales.
   - Relojes CLK opcionales.
   - IONEX opcional.
   - Modelo geoidal opcional.

2. Recuperacion de metadatos:
   - Version RINEX.
   - Intervalo temporal.
   - Altura de antena.
   - Coordenadas aproximadas.
   - Estacion base sugerida.
   - Archivos auxiliares generados por Asistente RINEX.

3. Validacion de sesion:
   - Coherencia Rover/Base/Nav.
   - Compatibilidad temporal.
   - Disponibilidad de observables L1/L2.
   - Deteccion de base INEGI clasica o moderna.

4. Construccion de estrategia:
   - Seleccion de constelaciones.
   - Frecuencia.
   - Modelo ionosferico.
   - Modelo troposferico.
   - Modo AR.
   - Sentido de solucion.
   - Filtros de elevacion/SNR.
   - Exclusiones de PRN cuando existe evidencia.

5. Ejecucion RTKLIB:
   - Generacion de `cycmotor.conf`.
   - Ejecucion de `rnx2rtkp.exe`.
   - Captura de terminal.
   - Produccion de `.pos`, `.stat` y archivos auxiliares.

6. Extraccion de resultados:
   - Coordenadas geodesicas.
   - Coordenadas UTM.
   - Calidad Q.
   - Estadisticas de epocas.
   - Ratio AR.
   - Satelites usados/rechazados.
   - Residuos y dispersion.

7. Validacion:
   - CyC Resolve Integrity evalua si Q=1 es defendible.
   - Si no es defendible, se conserva como evidencia, no como resultado final.

8. Ciclo automatico de estrategias:
   - Si no hay FIX aceptado, se recorren estrategias pendientes.
   - Si hay multiples FIX aceptados, se selecciona el mejor segun ranking auditado.
   - Si no hay FIX aceptado, puede generarse consenso ponderado de candidatos.

9. Reporte:
   - Se genera V1 Formal o V2 Ejecutivo Auditado.
   - El reporte incluye resultado, configuracion efectiva, evidencia, estrategias y trazabilidad.

## 4. Independencia del motor de calculo

CyC Resolve debe entenderse como un asistente tecnico y sistema experto de postproceso, no como sinonimo de un motor matematico unico. En la version documentada, CyC Resolve utiliza RTKLIB y `rnx2rtkp.exe` como motor principal de calculo GNSS, pero su arquitectura conceptual no depende exclusivamente de RTKLIB.

La separacion funcional es la siguiente:

- RTKLIB / `rnx2rtkp.exe`: motor de calculo que resuelve matematicamente observaciones GNSS y genera archivos `.pos` y `.stat`.
- CyC Resolve: capa experta que prepara insumos, selecciona estrategias, configura el motor, ejecuta corridas, analiza resultados, aplica validacion, conserva trazabilidad y genera reportes.
- CyC Resolve Integrity: capa independiente de validacion heuristica que evalua si un resultado es defendible, sin modificar los archivos calculados por el motor.
- CyC Resolve IonoCore y GeoCore: modulos auxiliares especializados que aportan modelado ionosferico y conversion vertical, respectivamente.

Por esta razon, CyC Resolve podria integrar en el futuro otros motores de postproceso, librerias propias, servicios externos o comparativas multi-motor, siempre que los resultados entreguen evidencia suficiente para ser evaluada por las capas de trazabilidad e integridad del sistema.

En los reportes, cuando se indique que un resultado fue `Procesado con CyC Resolve`, debe interpretarse que fue procesado bajo el marco metodologico, de control y auditoria de la suite. Si el motor utilizado fue RTKLIB, este debera documentarse como motor de calculo empleado en esa corrida, no como la definicion completa del metodo CyC Resolve.

## 5. Parametros RTKLIB controlados por CyC Resolve

CyC Resolve no modifica arbitrariamente todos los parametros de RTKLIB. Aplica perfiles de estrategia con parametros tecnicos especificos. Los mas relevantes son:

### 5.1 Modo de procesamiento

- `pos1-posmode`: normalmente `static` para punto estatico.
- `pos1-soltype`: `combined`, `forward` o `backward`.
- `combined` ejecuta barrido de ida y vuelta y suele ser preferible para soluciones estaticas.

### 5.2 Frecuencia

- `freq=1`: L1/E1.
- `freq=2`: doble frecuencia.
- `freq=3`: triple frecuencia cuando el contexto y los datos lo permiten.

La seleccion depende de la disponibilidad real de observables, rechazo de bandas y tipo de receptor.

### 5.3 Ionosphera

Opciones frecuentes:

- `brdc`: modelo broadcast.
- `dual-freq`: eliminacion algebraica mediante doble frecuencia.
- `iono-free`: combinacion iono-free cuando aplica.
- `est-stec`: estimacion de STEC en el filtro.
- `ionex` / `ionex-tec`: uso de mapa TEC IONEX validado.

La eleccion no se hace solo por disponibilidad. IonoCore puede priorizar o degradar estrategias IONEX segun longitud de vector, rechazo L2, soporte local, sigma TECU y extrapolacion.

### 5.4 Troposfera

Opciones frecuentes:

- `saas`: modelo Saastamoinen.
- `est-ztd`: estimacion de retraso troposferico cenital.

En vectores largos, `est-ztd` puede ayudar, pero tambien puede inestabilizarse si no existe soporte satelital suficiente. Por eso se prueba mediante estrategias controladas, no como imposicion global.

### 5.5 Ambiguedades y AR

Parametros de interes:

- `armode`: modo de resolucion de ambiguedad (`fix-and-hold`, `continuous`, etc.).
- `gloar`: manejo de ambiguedades GLONASS (`off`, `on`, `autocal`).
- `ratio`: umbral AR.
- `arfilter`: filtro AR.
- `minfix`, `minlock`, `aroutcnt`, `armaxiter`: controles avanzados en estrategias especificas.

La suite evita aceptar falsos FIX reduciendo demasiado el ratio. Un ratio bajo solo puede usarse si el validador de integridad acepta el resultado por evidencia adicional.

### 5.6 Filtros de observacion

- `elev_mask`: mascara de elevacion.
- `snr`: filtro por relacion senal/ruido.
- `rejion`: rechazo ionosferico.
- `rejtrop`: rechazo troposferico.
- `exclsats`: exclusion de satelites con evidencia tecnica.

Las exclusiones dinamicas se basan en `.stat` y deben documentar que PRN fue excluido y por que.

## 6. Catalogo de estrategias

El catalogo de estrategias es el mecanismo que permite intentar rutas de procesamiento distintas sin alterar de forma permanente la configuracion global.

Cada estrategia contiene:

- `id`: identificador tecnico.
- `nombre`: nombre legible.
- `motivo`: justificacion tecnica.
- `ajustes`: parametros RTKLIB y preferencias de archivos.

Tipos de estrategias:

- Historicas auditadas.
- Conservadoras duales.
- Tipo Emlid Studio.
- Tipo Leica/Infinity.
- L1 / L2 segun observables.
- GPS-only.
- GPS+Galileo.
- Sin GLONASS por sesgo FDMA.
- Ventanas temporales.
- Exclusion dinamica por PRN.
- IONEX global.
- IONEX local hibrido.
- Estrategias adaptativas derivadas del aprendizaje.

## 7. Estado finito del ciclo FIX

El ciclo automatico no debe crecer indefinidamente. Para ello CyC Resolve usa un catalogo finito con:

- Reconciliacion al cargar Rover.
- Version de catalogo.
- Huella del catalogo.
- Lista congelada de estrategias pendientes.
- Maximo de generaciones dinamicas.
- Cierre idempotente del ciclo.

Durante una corrida, el catalogo se congela para impedir que cada resultado parcial genere infinitamente nuevas estrategias. Al finalizar, puede desbloquearse una segunda generacion acotada si los resultados aportan informacion nueva, como una ventana temporal de convergencia.

## 8. Reconocimiento de estrategias ya aplicadas

Para evitar repetir estrategias dinamicas ya evaluadas, el sistema guarda:

- IDs aplicados.
- Firmas de ajustes.
- Firmas funcionales de estrategia.
- Historial de intentos.
- Version y huella del catalogo.

La firma funcional de estrategia combina:

- Familia de estrategia.
- Parametros RTKLIB normalizados.
- Configuracion tecnica realmente usada.

No depende exclusivamente del nombre dinamico. Esto evita que una estrategia generada por una ventana o por un ranking de PRN reaparezca como pendiente si ya fue evaluada de forma equivalente.

Si una estrategia conserva el mismo ID pero cambia parametros, la firma cambia y vuelve a quedar pendiente. Esto permite detectar modificaciones tecnicas reales sin repetir corridas equivalentes.

## 9. CyC Resolve Integrity: criterios de validacion

CyC Resolve Integrity evalua resultados Q=1/Q=2 con FIX parcial mediante criterios ponderados.

Pesos actuales:

- Dispersion: 35%.
- Temporalidad: 20%.
- Ratio AR: 15%.
- Satelites: 15%.
- Geometria: 10%.
- Tasa FIX: 5%.

### 9.1 Dispersion

Evalua dispersion Este, Norte y Vertical del bloque FIX estable. En frecuencia simple se toleran limites mas amplios que en doble frecuencia, porque la solucion L1 es mas sensible a ionosfera, geometria y ruido.

### 9.2 Temporalidad

No basta con que exista una epoca Q=1 aislada. El sistema busca ventanas FIX con longitud minima, dominancia temporal y continuidad. Bloques demasiado cortos pueden ser evidencia, pero no resultado certificable.

### 9.3 Ratio AR

El ratio requerido aumenta cuando:

- Hay pocos satelites.
- La longitud de vector es grande.
- Existen muchas ventanas fragmentadas.
- GLONASS requiere autocalibracion.
- El bloque FIX es corto.

### 9.4 Satelites

El validador penaliza satelites con:

- Residuos altos.
- Porcentaje de rechazo elevado.
- Slips significativos.
- Comportamiento anomalo de GLONASS en hardware heterogeneo.

### 9.5 Geometria

Evalua si la dispersion horizontal/vertical y la distribucion satelital son compatibles con un resultado defendible.

### 9.6 Tasa FIX

La tasa FIX se interpreta junto con el bloque estable. Una tasa global baja puede ser aceptable solo si existe una subventana robusta y se reporta como FIX acotado, no como solucion total de toda la sesion.

## 10. Decisiones posibles de CyC Resolve Integrity

El validador puede emitir:

- `FIX_ACEPTADO`: resultado defendible.
- `FIX_MARGINAL`: resultado aceptable con reservas documentadas.
- `RECHAZADO`: no debe certificarse como FIX.

Razones de rechazo:

- Sin epocas FIX.
- Veto duro por dispersion.
- Veto temporal.
- Score insuficiente.
- Geometria o satelites incompatibles.

Un Q=1 rechazado no se elimina. Se conserva como evidencia tecnica en log, sidecar y memoria de estrategias.

## 11. Ranking y seleccion final

Cuando existen varios FIX aceptados, CyC Resolve no usa simplemente el ultimo resultado. Selecciona un ganador mediante ranking que considera:

- Decision del validador.
- Score de integridad.
- Tasa FIX.
- Ratio AR.
- Continuidad temporal.
- Cobertura de epocas.
- Dispersion robusta.
- Separacion espacial frente a otros candidatos.
- Coherencia frente a estrategias independientes.

Si no hay FIX aceptado, se puede construir un consenso ponderado de candidatos Q=2 o FIX no certificables. Ese consenso no debe presentarse como FIX; debe documentarse como resultado recomendado por confianza.

## 12. Consenso ponderado

El consenso ponderado se usa cuando ninguna estrategia logra un FIX aceptado. Su objetivo no es inventar precision, sino producir una coordenada recomendada con trazabilidad de incertidumbre.

Principios:

- Se seleccionan candidatos con mejor score tecnico.
- Se ponderan por confianza, dispersion, ratio, tasa FIX y coherencia espacial.
- Se descartan candidatos claramente divergentes.
- El reporte debe indicar que el resultado no equivale a Q=1 certificable.

## 13. CyC Resolve IonoCore

IonoCore gestiona mapas ionosfericos globales y locales.

### 13.1 IONEX global

Un IONEX global aporta mapas TEC/RMS oficiales o externos. Para usarlo de forma efectiva, RTKLIB debe recibir:

- `pos1-ionoopt = ionex-tec`.
- `file-ionofile = ruta del archivo IONEX`.

El reporte debe mostrar el archivo usado, origen, cobertura y hash cuando esos datos existan.

### 13.2 Producto ionosferico local hibrido

El producto regional hibrido CyC combina informacion local estimada desde la sesion con un prior global. El objetivo es caracterizar variaciones ionosfericas del entorno Base-Rover sin confundirlas con sesgos de hardware.

El producto local se evalua por:

- Longitud del vector.
- Disponibilidad real de L2.
- Rechazo masivo de observables.
- Cantidad de gradientes locales.
- Sigma TECU.
- Soporte espacial.
- Extrapolacion.

### 13.3 Decision contextual

IonoCore no impone siempre el producto local. Puede clasificar su uso como:

- Alta prioridad.
- Media prioridad.
- Diagnostico.

Si el producto local no mejora o no es coherente con un FIX de referencia, se penaliza o se mantiene solo como evidencia diagnostica.

## 14. CyC Resolve GeoCore

GeoCore aplica conversion vertical posterior al resultado GNSS.

### 14.1 Formatos reconocidos

Actualmente se reconocen:

- GeoTIFF (`.tif`, `.tiff`).
- BIL (`.bil` + `.hdr`).
- GGF (`.ggf`).
- GEM (`.gem`).

Soporte operativo:

- BIL: interpolacion bilineal propia cuando existe HDR valido.
- GeoTIFF: requiere `rasterio/GDAL` instalado en el Python de la suite.
- GGF/GEM: reconocidos para auditoria, pendientes de interpolador automatico.

### 14.2 Metadatos rescatables

GeoCore puede registrar:

- Ruta.
- Nombre del modelo.
- Archivo.
- Formato.
- Datum vertical indicado por usuario.
- Tamano.
- SHA-256 parcial.
- Numero de filas/columnas si el formato lo permite.
- Resolucion.
- Cobertura.
- CRS.
- Byte order.
- Profundidad de bits.

### 14.3 Aplicado vs reconocido

Si el modelo se puede interpolar, el reporte debe mostrar:

- Altura elipsoidal.
- Ondulacion geoidal.
- Altura ortometrica.
- Modelo.
- Metodo de interpolacion.
- Metadatos auditables.

Si no se puede interpolar, el reporte debe mostrar:

- Modelo reconocido.
- Motivo por el que no fue aplicado.
- Metadatos disponibles.
- Altura elipsoidal conservada.

Esto evita que un reporte sugiera uso de geoide cuando tecnicamente no fue aplicado.

## 15. Sidecar `_cyc.json`

El sidecar es el registro persistente de la sesion. Puede contener:

- Metadatos RINEX.
- Archivos usados.
- Datos del proyecto.
- Coordenadas resultado.
- Estrategia ganadora.
- Historial de estrategias.
- Firmas de catalogo.
- Candidatos FIX.
- Geoide asignado.
- Configuracion de reporte.
- Snapshots tecnicos.

Su funcion es permitir que una sesion ya procesada pueda reabrirse, reconstruir resultados y generar reportes sin repetir innecesariamente todo el postproceso.

## 16. Log de auditoria

El log de auditoria documenta:

- Archivos cargados.
- Configuracion aplicada.
- Comando RTKLIB.
- Estrategia en ejecucion.
- Resultado Q.
- Estadisticas extraidas.
- Candidatos aceptados/rechazados.
- Diagnosticos satelitales.
- Decisiones del validador.
- Errores no fatales.
- Modelo ionosferico/geoidal reconocido o aplicado.

El log no debe reemplazar al reporte, pero permite auditar tecnicamente una corrida completa.

## 17. Reportes V1 y V2

### 17.1 V1 Formal

Formato mas tecnico y completo, orientado a memoria de calculo. Incluye secciones formales, anexos, configuracion y evidencia.

### 17.2 V2 Ejecutivo Auditado

Formato mas sintetico, con resumen ejecutivo, trazabilidad, metodologia y configuracion reproducible. Esta pensado para lectura profesional mas directa.

Ambos formatos deben conservar:

- Estrategia ganadora.
- Configuracion usada.
- Parametros criticos.
- Resultado principal.
- Estado de validacion.
- Evidencia de IonoCore cuando aplique.
- Evidencia de GeoCore cuando aplique.

## 18. Linea de control GNSS

El flujo de linea de control permite evaluar dos puntos A/B calculados o certificados. Puede usar:

- Coordenadas FIX previas desde sidecar.
- Informacion de reportes PDF previos.
- Vector teorico por diferencia de coordenadas.
- Vector fisico directo A -> B.

El objetivo es comparar la consistencia geometrica entre soluciones y documentar discrepancias, tolerancias y ponderacion. Si existen coordenadas Q=1 FIX previas para A y B, el sistema puede evitar repetir descargas o postprocesos principales y concentrarse en la auditoria directa del vector A-B.

## 19. Aprendizaje asistido

El aprendizaje de CyC Resolve actua como guia, no como imposicion. No certifica automaticamente una estrategia solo porque funciono antes.

Capas usadas:

- Ranking por familia de estrategias.
- Penalizacion de rutas fallidas.
- Trayectoria de parametros.
- Perfiles por contexto RINEX/equipo/base.
- Mutacion etica de configuraciones derivadas.

La memoria global puede sugerir que una familia se pruebe antes, pero el resultado final debe pasar por CyC Resolve Integrity.

## 20. Limites y controles eticos

CyC Resolve adopta los siguientes limites:

- No declara FIX solo porque RTKLIB entregue Q=1.
- No oculta estrategias fallidas.
- No mezcla coordenadas de una estrategia con configuracion de otra.
- No presenta consenso ponderado como FIX.
- No declara uso de IONEX o geoide si no fue aplicado realmente.
- No reduce umbrales AR por debajo de limites prudentes sin validacion adicional.
- No repite estrategias dinamicas equivalentes si ya fueron aplicadas.
- No borra evidencia tecnica de resultados intermedios.

## 21. Interpretacion de terminos en reportes

`Procesado con CyC Resolve` significa que el resultado fue producido por el flujo integral de postproceso, gestion de archivos, estrategias, ejecucion RTKLIB y generacion de evidencias.

`Resultado validado por CyC Resolve Integrity` significa que el resultado fue evaluado por criterios heuristico-estadisticos independientes del Q bruto de RTKLIB.

`Modelo ionosferico asistido por CyC Resolve IonoCore` significa que la corrida incorporo o evaluo productos ionosfericos dentro de las estrategias del sistema.

`Conversion vertical por GeoCore` significa que la altura ortometrica fue calculada mediante un modelo geoidal reconocible y auditado. Si el modelo no fue aplicable, el reporte debe indicarlo expresamente.

`FIX acotado` significa que existe un bloque temporal defendible, pero no necesariamente una solucion Q=1 sostenida en toda la sesion.

`Consenso ponderado` significa resultado recomendado por confianza cuando no hay FIX aceptado. No equivale a certificacion Q=1.

## 22. Reproducibilidad tecnica

Un resultado CyC Resolve debe poder reconstruirse mediante:

- RINEX Rover.
- RINEX Base.
- Archivo de navegacion.
- SP3/CLK/IONEX si fueron usados.
- Modelo geoidal si fue aplicado.
- Sidecar `_cyc.json`.
- Log de auditoria.
- `.pos` y `.stat`.
- Configuracion efectiva de la estrategia.
- Version y huella del catalogo de estrategias.

Si falta alguno de estos elementos, la reproducibilidad puede seguir siendo parcial, pero el reporte debe evitar afirmar trazabilidad completa.

## 23. Resumen ejecutivo tecnico

CyC Resolve es una capa de orquestacion geodesica sobre RTKLIB orientada a resultados trazables. Su fortaleza no consiste en forzar un FIX, sino en documentar por que una configuracion produce o no produce un resultado defendible. CyC Resolve Integrity funciona como filtro conservador frente a falsos FIX. IonoCore agrega modelado ionosferico contextual, especialmente util en lineas base medias/largas o sesiones con limitaciones de frecuencia. GeoCore agrega trazabilidad vertical mediante modelo geoidal.

El sistema esta disenado para que cada reporte pueda defender tecnicamente:

- Que archivos se usaron.
- Que parametros se aplicaron.
- Que estrategias se probaron.
- Que resultado gano y por que.
- Que evidencia fue rechazada.
- Que limitaciones permanecen.

Esta trazabilidad es la base tecnica de la familia CyC Resolve dentro de la CyC Topografia Suite.
