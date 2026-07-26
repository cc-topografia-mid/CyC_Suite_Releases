# Licencias, telemetria y apoyo al proyecto

## Estados de licencia

La Suite maneja dos estados principales para el usuario final:

- **Basico:** identifica a usuarios sin aportacion activa registrada.
- **Donador:** identifica a usuarios que han apoyado economicamente el desarrollo y mantenimiento del proyecto.

Ambos estados tienen acceso a las mismas herramientas de la Suite. El sistema de licencias no bloquea ni desbloquea funciones, modulos, calculos, exportaciones o flujos de trabajo.

La diferencia entre un usuario Basico y un usuario Donador estara relacionada con los banners publicitarios o recordatorios de apoyo, una funcion aun no implementada en su esquema final. Cuando una aportacion este registrada, la Suite podra reducir o pausar esos banners durante el periodo correspondiente.

## Verificacion de licencia

La verificacion de licencia puede consultar informacion en la nube para confirmar el estado actual del usuario. Cuando no hay conexion a internet, la Suite puede usar informacion local previamente validada para mantener la continuidad de uso durante trabajo de campo o zonas sin cobertura.

Este mecanismo existe para:

- reconocer aportaciones activas;
- evitar mostrar banners cuando corresponde pausarlos;
- mantener una experiencia estable cuando el equipo trabaja sin conexion;
- proteger la continuidad del proyecto y su distribucion.

La licencia y la telemetria son sistemas separados. La telemetria no decide si una licencia es valida.

La verificacion de licencia no se usa como mecanismo de bloqueo de herramientas. Su proposito es reconocer el estado Basico o Donador y aplicar, cuando este implementado, el comportamiento correspondiente de banners.

## Banners de apoyo

La Suite puede mostrar banners discretos de apoyo dentro de la interfaz. Estos banners tienen un objetivo simple: recordar al usuario que el proyecto puede sostenerse mediante aportaciones voluntarias.

Los banners se muestran considerando el contexto de uso de cada herramienta. La intencion es que sean oportunos y no invasivos.

Cuando una aportacion queda registrada, los banners se pausan por un periodo determinado. Como criterio general, una aportacion puede pausar los banners durante al menos 6 meses, y el tiempo puede variar segun el monto aportado.

## Montos de aportacion

Los botones de apoyo pueden abrir enlaces de aportacion con montos especificos, por ejemplo:

- $50
- $100
- otros montos disponibles segun la configuracion vigente

El objetivo de estos botones es facilitar una aportacion rapida y clara. La confirmacion final del pago ocurre fuera de la Suite, en la plataforma de pago correspondiente.

## Registro de aportaciones

Para que la Suite pueda reconocer una aportacion y aplicar sus beneficios, el flujo de donacion incluye una referencia tecnica de la instalacion. Esta referencia se usa solo para asociar el pago con el estado de licencia correspondiente.

Este registro no forma parte de la telemetria opcional. Es un dato necesario para procesar la aportacion solicitada por el usuario y activar beneficios como:

- cambiar el estado de licencia a **Donador**;
- pausar banners durante el periodo correspondiente;
- conservar una validacion local cuando el equipo trabaje sin conexion.

Si la telemetria esta desactivada, la Suite no envia estadisticas de uso, impresiones o clics de banners. Sin embargo, una aportacion iniciada por el usuario puede seguir incluyendo la referencia necesaria para registrar el beneficio de licencia.

## Telemetria opcional

La telemetria es un sistema independiente cuyo objetivo es ayudar a entender el uso general de la Suite para mejorarla con datos reales.

La telemetria permite conocer, de forma anonima y agregada:

- que modulos se abren con mas frecuencia;
- cuantas sesiones se inician;
- que versiones de la Suite estan en uso;
- cuantas veces se muestran o se presionan banners;
- metricas generales de alcance y mejora del producto.

La telemetria esta desactivada por defecto y solo envia informacion si el usuario otorga consentimiento.

La telemetria no es necesaria para reconocer una aportacion. Si esta desactivada, simplemente no se enviaran metricas anonimas de uso o rendimiento de banners.

## Datos que no se recopilan por telemetria

La telemetria de la Suite no envia:

- archivos del usuario;
- coordenadas;
- rutas de proyectos;
- nombres de carpetas o archivos;
- usuario de Windows;
- nombre del equipo;
- correo electronico;
- HWID o identificadores de licencia.

Los eventos se registran con un identificador anonimo local para poder contar actividad general sin conocer la identidad real del usuario.

## Clics en banners

Si la telemetria esta activada por consentimiento del usuario, la Suite puede registrar eventos como:

- impresion de banner;
- clic en banner;
- modulo desde donde se mostro;
- monto seleccionado, si aplica.

Estos datos ayudan a saber si los banners son utiles, excesivos o poco claros. No se usan para validar la licencia ni para bloquear funciones.

## Privacidad y control

El usuario conserva control sobre la telemetria. Si no otorga consentimiento, la Suite no envia eventos de uso.

La informacion de licencia y la informacion de telemetria cumplen funciones distintas:

- la **licencia** reconoce el estado del usuario y sus beneficios;
- la **telemetria** ayuda a mejorar la Suite con datos anonimos y opcionales;
- la **monetizacion** muestra banners de apoyo de forma regulada y puede pausarlos cuando existe una aportacion registrada.
- el **registro de aportacion** asocia un pago iniciado por el usuario con su licencia para activar beneficios, y no depende de la telemetria opcional.

Ninguno de estos sistemas tiene como objetivo bloquear herramientas al usuario. El acceso funcional de la Suite es el mismo para usuarios Basico y Donador.

## Resumen

CyC Desktop Suite busca mantener un equilibrio entre acceso, sostenibilidad y transparencia:

- puedes usar todas y cada una de las herramientas de la Suite con estado Basico sin limitaciones;
- puedes apoyar el desarrollo mediante aportaciones;
- usuarios Basico y Donador tienen acceso a las mismas herramientas;
- la licencia no bloquea ni desbloquea funciones;
- las aportaciones pueden pausar banners durante un periodo definido;
- el reconocimiento de una aportacion no depende de activar telemetria;
- la telemetria es opcional, anonima y separada de la licencia;
- los datos tecnicos o proyectos del usuario no se recopilan por telemetria.

Gracias por usar y apoyar CyC Desktop Suite.
