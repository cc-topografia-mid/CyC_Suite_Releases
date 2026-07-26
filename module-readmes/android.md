# CyC Mobile Suite

**CyC Mobile Suite** es una aplicacion Android de apoyo tecnico para topografia, ingenieria civil y trabajo de campo. Reune en el telefono varias herramientas derivadas de la suite de escritorio de CyC Topografia, con el objetivo de consultar, calcular, registrar y preparar informacion tecnica sin depender siempre de una computadora.

La aplicacion esta pensada para jornadas de campo, supervision, revision rapida de datos y preparacion inicial de informacion para gabinete. Su enfoque es practico: calculos claros, interfaces compactas, exportaciones utiles y una identidad visual alineada con CyC Topografia.

## Herramientas incluidas

### Conversor Geodesico

Modulo para transformar coordenadas entre sistemas geograficos y proyectados.

**Alcances principales**

- Conversion Geodesica a UTM.
- Conversion UTM a Geodesica.
- Conversion Geodesica a TME.
- Conversion TME a Geodesica.
- Conversion UTM a TME.
- Conversion TME a UTM.
- Soporte para WGS84 / ITRF2008 y NAD27.
- Entrada geodesica decimal, GMS o autodetectada.
- Copia rapida de resultados al portapapeles.

**Uso recomendado**

Revision de coordenadas en campo, homologacion de datos, preparacion de entregables y verificacion rapida entre sistemas usados en proyectos topograficos.

### Factores GNSS

Herramienta para calcular factores de escala necesarios al relacionar coordenadas GNSS, cuadricula UTM y representacion en CAD.

**Alcances principales**

- Calculo de Factor de Cuadricula (K).
- Calculo de Factor de Elevacion (Fe).
- Calculo de Factor Combinado (Fc).
- Calculo del inverso CAD (1/Fc).
- Modo de calculo individual.
- Modo de procesamiento por lote para levantamientos GNSS.
- Seleccion de coordenadas desde mapa gratuito basado en OpenStreetMap.
- Flujo de retorno hacia Bitacora Digital para guardar factor de escala en puntos de campo.

**Uso recomendado**

Ajuste de levantamientos GNSS, preparacion de datos Grid/Ground y control de escala para dibujos CAD o entregables tecnicos.

### Ajuste de Linderos

Modulo orientado al analisis simple de tramos lineales a partir de puntos levantados en campo.

**Alcances principales**

- Ingreso manual o importacion de puntos CSV/TXT.
- Lectura de columnas como Punto, Este/X, Norte/Y, Elevacion/Z y Codigo/Tramo.
- Ajuste lineal por tramo mediante minimos cuadrados.
- Calculo de longitud, azimut, RMSE y R2.
- Calculo de vertices por interseccion entre tramos.
- Grafica sencilla de puntos y linea de mejor ajuste.

**Uso recomendado**

Revision rapida de bardas, colindancias, limites fisicos, alineamientos y tendencias lineales antes de continuar el procesamiento en gabinete.

### DataLink Converter

Conversor de libretas crudas de estacion total hacia formatos mas utiles para CAD, Excel o flujos de gabinete.

**Alcances principales**

- Lectura de formatos crudos comunes de estacion total.
- Soporte operativo para Sokkia SDR, Foif RTS DAT y Stonex / Leica GSI.
- Pegado manual de datos.
- Normalizacion de salida con estructura Punto, Este/X, Norte/Y, Elevacion/Z y Observacion.
- Inversion X/Y cuando el flujo de trabajo lo requiere.
- Reemplazo masivo de observaciones.
- Copia al portapapeles.
- Exportacion para CAD con separadores configurables.
- Generacion de archivo SDR para replanteo.

**Uso recomendado**

Limpieza rapida de datos de estacion total, preparacion de puntos para CAD y apoyo a procesos de replanteo desde el movil.

### Visor CAD

Visualizador ligero para revisar archivos DXF directamente desde Android.

**Alcances principales**

- Apertura de archivos DXF ASCII.
- Visualizacion de LINE, LWPOLYLINE, POLYLINE/VERTEX, CIRCLE, ARC, POINT, TEXT y MTEXT basico.
- Zoom por botones y gesto de pellizco.
- Pan por botones y arrastre.
- Encuadre automatico del dibujo.
- Consulta de coordenadas tocando el plano.
- Snap a extremos, vertices, medios, centros, radios, intersecciones y segmentos.
- Herramienta de medicion.
- Medicion ortogonal referenciada al objeto destino.
- Opcion para ocultar textos del plano.
- Al seleccionar un punto, puede mostrar solo su texto asociado.
- Opcion para apagar cuadricula y cambiar color de fondo.
- Capa de puntos de Bitacora Digital sobre el plano CAD.

**Uso recomendado**

Consulta de planos en campo, verificacion de coordenadas, ubicacion de puntos levantados, comparacion contra bitacora y revision visual de geometria sin abrir un CAD completo.

**Nota sobre DWG**

DWG es un formato propietario. Para esta version, el flujo recomendado es exportar o convertir el dibujo a DXF ASCII desde una herramienta CAD compatible antes de abrirlo en CyC Mobile Suite.

### Bitacora Digital

Sistema local para registrar obras, sesiones de trabajo, puntos, coordenadas, elevaciones, factor de escala, fotografias y ubicacion.

**Alcances principales**

- Creacion y carga de bases de datos locales.
- Registro de obras.
- Registro de sesiones por fecha.
- Captura de puntos por sesion.
- Campos para Punto, Este/X, Norte/Y, Elevacion, Factor de escala, Latitud, Longitud y Nota.
- Captura de ubicacion GPS del telefono.
- Adjuntar fotografia desde almacenamiento.
- Abrir camara del telefono para tomar evidencia.
- Miniaturas en lista de puntos registrados.
- Edicion de puntos existentes.
- Busqueda dinamica de puntos.
- Mapa de sesion con pines de puntos guardados.
- Vista normal y satelital del mapa.
- Exportacion de informe PDF en tamano carta.
- Exportacion KMZ con puntos.
- Exportacion opcional ZIP con imagenes.
- Enlace de coordenadas a mapas dentro del reporte.
- Paginas de reporte con pie: "Generado por CyC Mobile Suite" y paginacion.

**Uso recomendado**

Documentacion de avances, incidencias, bancos de nivel, puntos de control, evidencias fotograficas, sesiones de campo y memoria tecnica preliminar.

## Caracteristicas generales

- Aplicacion Android nativa desarrollada en Java.
- Interfaz optimizada para telefono y pantallas plegables.
- Diseno visual con verde corporativo y acentos amarillos de la identidad CyC.
- Menu principal con categorias: Geodesia, Campo y Gabinete.
- Busqueda dinamica de herramientas.
- Panel de configuracion.
- Seccion "Acerca de" con informacion general y contacto.
- Uso de OpenStreetMap para mapas, sin API key de Google.
- Persistencia local mediante `SharedPreferences` y bases SQLite.
- Exportaciones orientadas a trabajo real de campo y gabinete.

## Instalacion para pruebas

En Android puede ser necesario habilitar la instalacion desde origenes desconocidos para el gestor de archivos o navegador desde donde se abra el APK.

## Mapa y conectividad

Las funciones de mapa usan OpenStreetMap dentro de componentes WebView. No requieren cuenta de Google ni API key.

Para uso intensivo, comercial o de alto volumen, se recomienda revisar las politicas de uso de tiles publicos de OpenStreetMap y considerar un proveedor o servidor de tiles propio.

## Alcance actual del proyecto

CyC Mobile Suite no pretende sustituir por completo a un software CAD, GNSS o GIS de escritorio. Su objetivo es concentrar herramientas moviles de alta utilidad para campo, revision rapida y preparacion de informacion.

Algunas funciones avanzadas de la suite de escritorio, como edicion CAD completa, manejo complejo de bloques, hatch, cotas avanzadas, referencias externas o analisis pericial completo, quedan fuera del alcance de esta version mobile.

## Proteccion de version de prueba

La version debug incluye un bloqueo de uso despues de 30 dias. Esta proteccion esta pensada para pruebas controladas, no como sistema definitivo de licenciamiento comercial.

## Contacto

Desarrollado por **Christian Ramon Chi**  
Ingeniero Civil y Director General de **CyC Topografia**

- Telefono: 99.92.46.91.30
- Correo: christian@topografia.cc

## Estado

Proyecto en desarrollo activo. Las herramientas se estan integrando progresivamente desde CyC Topografia Suite de escritorio hacia una experiencia movil enfocada en campo.
