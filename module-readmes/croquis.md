# Generador de Croquis de Ubicación - CyC Topografía Suite

## Visión General

El **Generador de Croquis de Ubicación** crea composiciones cartográficas listas para anexar a planos, reportes y expedientes técnicos. Permite definir un punto mediante el mapa o por coordenadas, preparar encuadres independientes de ubicación local, ciudad y estado, aplicar estilos cartográficos por vista y exportar una lámina uniforme con identidad CyC.

El módulo utiliza proveedores abiertos y no requiere una API cartográfica de pago. Las teselas y consultas vectoriales se almacenan en una caché local reutilizable; cuando la red o el proveedor no están disponibles, la generación puede continuar en modo degradado o mediante la opción de salida sin mapa base.

## Familia de Vistas

- **Ubicación local:** muestra el entorno inmediato, normalmente calles, manzanas y varias cuadras alrededor del punto.
- **Ubicación en la ciudad:** sitúa el punto dentro del área urbana y sus accesos principales.
- **Ubicación en el estado:** proporciona el contexto regional más alejado.

Las tres vistas son opcionales. Cada una conserva su propio centro, zoom, proporción, tema, encabezado, símbolo y encuadre. Cuando corresponde, la vista más alejada puede mostrar el rectángulo del siguiente nivel más cercano.

## Capacidades Actuales

- Selección de ubicación mediante clic en un mapa interactivo.
- Captura por coordenadas UTM WGS84, geográficas decimales o geográficas GMS.
- Conversión y validación de zona, hemisferio, latitud, longitud, grados, minutos y segundos.
- Tres vistas configurables e independientes: Local, Ciudad y Estado.
- Seis distribuciones de salida: columna, fila, dos arriba, dos abajo, dos a la derecha y dos a la izquierda.
- Proporciones independientes por recuadro: automática, 16:9, 3:2, 4:3 y 1:1.
- Símbolos de ubicación configurables: pin, punto, cruz, círculos concéntricos y recuadros concéntricos.
- Tamaño, color y grosor independientes del símbolo por vista, además de opción para ocultarlo.
- Encabezado y rectángulo de encuadre activables por vista.
- Vista previa final con zoom, desplazamiento, cancelación y tiempo máximo de generación.
- Guardado y apertura de proyectos de croquis.
- Exportación PNG y PDF.

## Temas Cartográficos

### Estilo Maps

Conserva la simbología del proveedor raster. Los nombres viales pueden mostrarse u ocultarse; la salida sin nombres utiliza CARTO Positron sin etiquetas con la atribución correspondiente. Cada vista dispone de brillo, contraste, nivel negro, nivel blanco, intensidad de grises y autocontraste, con botones para restaurar los valores predeterminados de Local, Ciudad o Estado.

### Cartográfico Monocromático

Transforma el mapa raster en una representación de líneas en blanco y negro. La simplificación puede ajustarse para equilibrar detalle y limpieza gráfica. Este tema no superpone las capas del plano vectorial CAD.

### Plano Vectorial CAD

Consulta OpenStreetMap mediante Overpass y dibuja únicamente las capas seleccionadas dentro del encuadre visible. Permite incluir nombres viales, vías principales, secundarias, locales, de servicio, peatonales y ciclovías; también admite límites internacionales, estatales y municipales, así como contornos costeros.

El fondo, color y grosor de líneas se configuran por vista. Los límites marítimos están desactivados por defecto, y las consultas regionales se recortan al fragmento realmente utilizado para evitar cargas innecesarias.

## Flujo Operativo

1. Elegir `Ubicación por mapa` o `Ubicación por coordenadas`.
2. Seleccionar el punto y pulsar `Confirmar ubicación`.
3. Activar Local, Ciudad y Estado según el alcance requerido.
4. Editar cada vista por separado: tema, zoom, proporción, símbolo y opciones específicas.
5. Seleccionar la distribución de los recuadros.
6. Pulsar `Actualizar vista previa` y revisar la composición completa.
7. Guardar el proyecto o exportar el resultado en PNG o PDF.

## Entregables

- Proyecto editable de croquis con configuración persistente.
- Lámina PNG de la composición final.
- Documento PDF con dimensiones calculadas según el perfil de salida.
- Coordenadas y metadatos visibles cuando están habilitados.
- Atribución de los proveedores cartográficos utilizados.

## Operación con Conectividad Limitada

La caché conserva teselas raster y respuestas vectoriales ya utilizadas. El módulo no realiza descargas masivas ni precarga áreas completas. Si faltan recursos, informa las vistas degradadas y permite generar una salida sin mapa base para conservar marcos, símbolos, escala, norte y demás elementos de composición.

## Criterio Técnico

Maps, Monocromático y Plano vectorial CAD son renderizadores separados. Las capas CAD no deben superponerse sobre Maps ni sobre Monocromático. El plano vectorial actual es una representación gráfica raster dentro de la lámina; la exportación DXF editable con capas y coordenadas proyectadas permanece como trabajo posterior.

La integración automática con datos procedentes de otros módulos de la Suite corresponde a la fase siguiente del proyecto. La versión actual funciona como herramienta independiente integrada al Hub.

## Registro de Versión y Control

- **Versión actual:** `v260716.1941`
- **Estado:** Operativo como módulo independiente del Hub. Captura por mapa, UTM, decimal y GMS; tres temas; tres niveles de vista; composición configurable; caché; guardado y exportación PNG/PDF disponibles. Integración de intercambio con otros módulos pendiente.

---

**CyC Topografía Suite - Cartografía Técnica para Planos y Expedientes**
