/**
 * AriaIcon — Ícono futurista de IA para el asistente Aria.
 * Diseño orbital: tres anillos elípticos rotados alrededor de un núcleo central,
 * evocando un átomo cuántico / esfera de inteligencia artificial.
 */
const AriaIcon = ({ size = 22, animated = false }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    style={animated ? { animation: "ariaOrbitSpin 6s linear infinite" } : undefined}
    aria-hidden="true"
  >
    {/* Núcleo central */}
    <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />

    {/* Orbital 1 — horizontal */}
    <ellipse cx="12" cy="12" rx="10" ry="3.5" />

    {/* Orbital 2 — rotado 60° */}
    <ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(60 12 12)" />

    {/* Orbital 3 — rotado 120° */}
    <ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(120 12 12)" />

    {/* Puntos en los extremos de los orbitales — sensación de electrones */}
    <circle cx="22" cy="12" r="1"   fill="currentColor" stroke="none" />
    <circle cx="2"  cy="12" r="1"   fill="currentColor" stroke="none" />
    <circle cx="17" cy="3.7" r="1"  fill="currentColor" stroke="none" />
    <circle cx="7"  cy="20.3" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export default AriaIcon;
