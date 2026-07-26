# Módulo Control de Personal

## Visión general

El **Módulo Control de Personal** integra la administración operativa de
empleados y obras dentro de CyC Topografía Suite. Centraliza información
laboral, asignaciones, pagos y configuración de bases de datos por proyecto.

## Capacidades actuales

- Registro y actualización de empleados.
- Catálogo de obras activas.
- Asignación de personal y contratos.
- Control semanal de nómina, pagos y financiamiento.
- Selección de bases de datos SQLite por proyecto.
- Integración directa con el grupo Gestión Administrativa del Hub.

## Persistencia

La información se conserva en SQLite. La configuración de la base activa se
registra en `control_personal/config.json`, permitiendo trabajar con proyectos
independientes sin mezclar sus registros.

## Registro de versión

- **Versión actual:** `v260518.1000`
- **Estado:** Integrado y operativo dentro de CyC Topografía Suite.
