# Pantalla "Recompensas" — diseño

## Objetivo
Una pantalla `/rewards` con 3 premios reales (físicos) que se desbloquean al reunir 2, 5 y todas las insignias. Cada premio se canjea una sola vez, y el canje se guarda en Firestore.

## Alcance
- Incluye: datos de premios, ruta y pantalla, canje con confirmación, campo `Redeemed` en Firestore.
- No incluye: validación por PIN o personal (modelo honor), panel de administración, premios dinámicos desde Firestore.

## Datos
- `REWARDS` en `src/assets/assets.jsx`, junto a `BADGES`. Cada premio: `id`, `title`, `description`, `required` (2, 5 y `BADGES.length`). Los textos son marcadores de posición ("Sticker", "Café", "Camiseta") que se editan después.
- Firestore: campo `Redeemed: []` en `Users/{nombre}`.
  - `redeemReward(userId, rewardId)` en `src/firebaseFunctions.js`, con `arrayUnion` (mismo patrón que `addBadge`).
  - `login.jsx` crea cuentas nuevas con `Redeemed: []`.
  - Usuarios existentes sin el campo: se lee `data?.Redeemed ?? []`; `arrayUnion` lo crea en el primer canje.

## Pantalla `/rewards`
- Ruta nueva en `src/main.jsx`. El botón "Recompensas" de `Home` navega a `/rewards`. La pantalla tiene su propia barra inferior con "Insignias" (vuelve a `/home`).
- Muestra el progreso (`count de total insignias`) y 3 tarjetas con uno de tres estados:
  - Bloqueada: "Te faltan N insignias" y el candado de `Home`.
  - Disponible: botón "Canjear".
  - Canjeada: marca "Canjeada ✓", sin botón.
- Estilo: español, tokens `--color-*`, `APP_BG`.

## Canje
- "Canjear" abre una confirmación: "¿Canjear ahora? Hazlo frente a quien entrega el premio".
- Al confirmar: `redeemReward` y la tarjeta pasa a "Canjeada".
- Si Firestore falla: mensaje de error y el premio sigue disponible.

## Fuente del progreso
- Insignias: `localStorage["badges"]`, como en `Home`.
- Canjes: siempre desde Firestore al abrir la pantalla, sin caché, para evitar doble canje desde otro dispositivo.

## Límites conocidos
- Modelo honor: el usuario puede tocar "Canjear" sin estar frente a nadie. Lo mitiga que "Canjeada" queda guardado y visible.
- Las reglas de Firestore deberían impedir quitar elementos de `Redeemed`. No están en este repositorio y no se modifican.

## Verificación
No hay pruebas en el proyecto. Se verifica con `vite build`, `eslint` y revisión manual de los 3 estados (2, 5 y 9 insignias).
