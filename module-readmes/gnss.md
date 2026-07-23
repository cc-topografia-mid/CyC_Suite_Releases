# Módulo Factores GNSS

## Vision general

El **Modulo Factores GNSS** conecta la precision geodesica con la representacion correcta de levantamientos en CAD. Calcula el **Factor de Cuadricula (K)**, el **Factor de Elevacion (Fe)**, el **Factor Combinado (Fc)** y el **Factor Inverso CAD (1/Fc)** para transformar datos de cuadricula UTM hacia dimensiones fisicas de terreno.

El modulo conserva la calculadora puntual original y ahora incorpora un flujo de **procesamiento por lote** para levantamientos GNSS completos. Esto permite pegar o importar una lista de puntos, seleccionar manualmente un punto pivote, aplicar el factor de escala y generar una nueva tabla de coordenadas ajustadas.

## Calculo individual

La pestana **Calculo Individual** calcula los factores para una coordenada UTM especifica.

### Entradas

- **Zona UTM**: referencia de zona del levantamiento.
- **Este (X)**: coordenada Este UTM.
- **Norte (Y)**: coordenada Norte UTM de referencia.
- **Elevacion (Z)**: altura ortometrica del punto.
- **Ondulacion (N)**: separacion geoidal usada para estimar altura elipsoidal.
- **Radio medio de la Tierra**: valor asociado al datum/elipsoide seleccionado.
- **Datum/Elipsoide**: ajusta automaticamente el radio base.
- **Ondulacion regional**: precarga valores aproximados para zonas comunes.

### Resultados

- **Factor de Cuadricula (K)**.
- **Factor de Elevacion (Fe)**.
- **Factor Combinado (Fc)**.
- **Inverso CAD (1/Fc)**, recomendado para escalar geometria Grid a Ground en AutoCAD/Civil3D.

## Levantamiento GNSS por lote

La pestana **Levantamiento GNSS** procesa multiples puntos en una sola operacion.

### Formas de ingreso

El usuario puede:

- Importar archivos **CSV** o **TXT**.
- Pegar directamente la tabla en el editor del modulo.

El sistema puede detectar separadores comunes:

- Coma.
- Punto y coma.
- Tabulador.
- Espacios.
- Pipe (`|`).
- Modo automatico.

Si el archivo no trae encabezados, el modulo interpreta por posicion el formato comun:

```text
Punto Este Norte Elevacion Codigo
```

Ejemplo:

```text
100 284847.643 2364016.216 1.003 Pav
101 284859.178 2364018.452 1.012 Pav
102 284874.506 2364021.471 1.052 Pav
```

En ese caso se asigna:

```text
col_1 = Punto
col_2 = Este
col_3 = Norte
col_4 = Elevacion/Z
```

La columna de codigo o descripcion puede permanecer sin usarse.

### Coordenadas admitidas

El lote acepta dos modos:

- **UTM**: usa directamente Este, Norte y Elevacion.
- **Geograficas decimales**: usa Latitud, Longitud y Elevacion; el modulo convierte internamente a UTM antes de aplicar el factor.

La aplicacion del factor siempre se realiza sobre coordenadas planas UTM, ya que Latitud/Longitud son coordenadas angulares y no deben escalarse directamente.

## Punto pivote

El punto pivote debe seleccionarse manualmente. Este punto funciona como base de escala y conserva su posicion original.

La transformacion se aplica asi:

```text
Este ajustado  = Este pivote + (Este original  - Este pivote)  * Factor
Norte ajustado = Norte pivote + (Norte original - Norte pivote) * Factor
```

Esto equivale a insertar el levantamiento en CAD como bloque y aplicar `SCALE` usando el mismo punto base y el mismo factor.

## Direccion del factor

El usuario puede elegir:

- **Grid a Ground (1/Fc)**: recomendado para llevar coordenadas de cuadricula a dimensiones reales de terreno.
- **Ground a Grid (Fc)**: util para regresar geometria de terreno hacia cuadricula.

## Salida y exportacion

El resultado se muestra en dos bloques:

- **Vista previa normalizada**: puntos interpretados por el sistema.
- **Resultado ajustado**: tabla final con el factor aplicado.

La exportacion permite:

- Guardar en **CSV** o **TXT**.
- Elegir separador de salida.
- Elegir numero de decimales.
- Seleccionar columnas mediante casillas.

Columnas disponibles:

- `punto`
- `este`
- `norte`
- `elevacion`
- `ondulacion`
- `latitud`
- `longitud`
- `zona`
- `k`
- `fe`
- `fc`
- `factor_aplicado`
- `pivote`
- `este_ajustado`
- `norte_ajustado`
- `delta_este`
- `delta_norte`

## Arquitectura

El modulo mantiene una arquitectura **MVC**:

- `modelo.py`: calculo geodesico, lectura de tablas, deteccion de columnas, conversion de puntos y formateo de salida.
- `vista.py`: interfaz de calculo individual y procesamiento por lote.
- `controlador.py`: importacion, validacion, procesamiento, seleccion de pivote y exportacion.

El motor de calculo permanece desacoplado de la interfaz para facilitar mantenimiento, auditoria y futuras extensiones.
