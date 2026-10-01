# Ritmo V1.1

App de hábitos y productividad personal: hábitos con rachas e historial, recordatorios, checklist, tiempo de enfoque y análisis. Liquid glass, modo claro/oscuro, instalable (PWA). Cuentas y sincronización con **Supabase** (misma tabla `public.ritmo_state` de siempre). Sitio estático: no necesita build.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La app completa (HTML + CSS + JS) |
| `config.js` | URL y clave pública (publishable) de Supabase — **sin cambios** |
| `supabase/schema.sql` | Tabla `ritmo_state` + RLS — **sin cambios** (no hay que volver a ejecutarlo) |
| `sw.js` | Service worker: solo archivos públicos; nunca cachea Supabase |
| `manifest.webmanifest` | Instalación como app (íconos, atajos, colores) |
| `icon*.png`, `icon.svg`, `apple-touch-icon.png` | Íconos (incluye ícono *maskable* para Android) |
| `og-image.png` | Imagen al compartir el enlace |
| `vercel.json` | Cabeceras (no-cache para `config.js` y `sw.js`) |

## Publicar la actualización

1. Reemplaza los archivos del repositorio por los de esta carpeta (conserva tu `config.js`).
2. `git add . && git commit -m "Ritmo V1" && git push` → Vercel despliega solo.
3. Supabase no necesita cambios: los datos nuevos (perfil, ajustes, sesiones, categorías…) viven dentro de `ritmo_state.data` y se crean solos con valores por defecto.

**Open Graph:** algunas redes exigen URL absoluta. Si quieres la vista previa perfecta al compartir, cambia en `index.html` `content="./og-image.png"` por `https://TU-DOMINIO/og-image.png`.

## Probar en tu computadora

```bash
npx serve .
```
Abre http://localhost:3000 (agrega `http://localhost:3000/**` en *Redirect URLs* de Supabase).
Si `config.js` no tiene datos válidos, la app funciona en modo local (sin cuenta).

## Qué hace distinta a Ritmo (V1.1)

- **Día de respiro:** 1 por semana por hábito (+2 de regalo al empezar). Un mal día no rompe la racha; dos seguidos, sí.
- **Ancla:** cada hábito puede atarse a algo que ya haces (“después del café…”).
- **Versión mínima:** para días difíciles; cuenta para la racha (½).
- **Fuerza del hábito:** Semilla → Brote → Raíz → Natural, calibrada a ~66 repeticiones.
- **Sin culpa:** sin cruces rojas, “aún estás a tiempo”, días de descanso, límite suave de 3 hábitos la primera semana.
- **Avisos que se retiran:** si un hábito ya fluye, Ritmo sugiere apagar su aviso.
- **Volver sin culpa, semana nueva y revisión semanal de 1 minuto.**
- **Tarjeta “Mi mes en Ritmo”** para historias y estados.
- **Personalización:** 6 colores (Musgo, Océano, Arena, Coral, Lavanda, Grafito), 3 estilos (Cristal, Sólido, Mínimo) y fondo vivo.

## Datos

Todo el estado se guarda como un JSON en `ritmo_state.data`. Claves originales intactas: `habits, log, tasks, reminders, lists, focus, theme, updatedAt, lastP`.
Nuevas (opcionales, creadas por `normalize()`): `profile, settings, focusSessions, categories, progress, logT, deleted, metaU, v, mini, rest, reviews`. Los hábitos suman `anchor, mini, identity`.

## Sincronización

- Cada cambio se guarda al instante en este dispositivo y se sube a Supabase ~0,7 s después.
- Antes de subir, Ritmo revisa si otra pestaña u otro dispositivo escribió después; si es así, **fusiona** (gana el cambio más reciente de cada elemento, lo borrado no revive) y luego sube.
- Sin conexión: todo sigue funcionando y se sincroniza al volver.

## Avisos

Llegan mientras Ritmo está abierta (aunque sea en otra pestaña o en segundo plano). Con la app totalmente cerrada no hay avisos: eso requeriría un servidor de notificaciones push.


## v1.93 UX
- Navegación principal: Hoy, Tiempo y Progreso.
- Tiempo integra Pomodoro 25/5, tareas del día y pantalla completa.
- Progreso unifica Semana/Mes mediante selector.
- La fuerza del hábito (Semilla/Brote/Raíz/Natural) aparece junto al nombre del hábito.
- Recordatorios y gestión completa de tareas siguen accesibles desde Tiempo.
- No se modificó el esquema ni la configuración de Supabase.

## v1.96 · Mascota: carga robusta y modo ligero
- three.js y el modelo ahora van **dentro del proyecto** (`vendor/`, `mascota-glb.js`): no dependen de un CDN y funcionan también abriendo `index.html` desde el disco. El CDN queda solo como respaldo.
- Si el 3D no puede arrancar (sin WebGL, GPU bloqueada, archivo que no carga, contexto perdido), la mascota pasa sola al **modo ligero** (`mascota-sprites.js`: imágenes pre-renderizadas del mismo modelo recoloreadas en canvas 2D). Los colores, los accesorios y las animaciones funcionan igual; la hoja de personalización explica el motivo.
- El motivo del fallo también queda en la consola del navegador (`[Ritmo] 3D no disponible…`).
- Los botones "Ver animaciones" esperan a que la mascota cargue y luego animan.
- No se modificó Supabase, Auth, `config.js` ni `schema.sql`.
