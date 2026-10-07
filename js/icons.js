// A small, hand-drawn icon set. 24px grid, 1.6 stroke, round caps.

const svg = (body, size = 20) =>
  `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

export const icon = {
  sun: (s) => svg('<circle cx="12" cy="12" r="4.2"/><path d="M12 2.8v2M12 19.2v2M4.6 4.6 6 6M18 18l1.4 1.4M2.8 12h2M19.2 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>', s),
  cloud: (s) => svg('<path d="M7.5 18.5h9.2a4 4 0 0 0 .4-8 5.5 5.5 0 0 0-10.6 1.2A3.4 3.4 0 0 0 7.5 18.5Z"/>', s),
  sunset: (s) => svg('<path d="M3 17h18M6 20.5h12"/><path d="M7.5 17a4.5 4.5 0 0 1 9 0"/><path d="M12 4v4M9.5 6.5 12 4l2.5 2.5"/>', s),
  wind: (s) => svg('<path d="M3 9h11a3 3 0 1 0-3-3"/><path d="M3 14h15a3 3 0 1 1-3 3"/>', s),
  wave: (s) => svg('<path d="M2 9c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/><path d="M2 15c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/>', s),
  pin: (s) => svg('<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/>', s),
  clock: (s) => svg('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>', s),
  people: (s) => svg('<circle cx="9" cy="8.5" r="3.2"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><path d="M16 5.6a3.2 3.2 0 0 1 0 6"/><path d="M17.5 14.2A5.5 5.5 0 0 1 20.5 19"/>', s),
  calendar: (s) => svg('<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>', s),
  bell: (s) => svg('<path d="M6 16.5V11a6 6 0 1 1 12 0v5.5l1.5 2h-15Z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>', s),
  user: (s) => svg('<circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>', s),
  board: (s) => svg('<path d="M4.5 19.5C3 18 6 10 11 5s9.5-4 8.5-3-4.5 3.5-8.5 8.5-5 10.5-6.5 9Z"/>', s),
  arrowLeft: (s) => svg('<path d="M19 12H5M11 6l-6 6 6 6"/>', s),
  arrowRight: (s) => svg('<path d="M5 12h14M13 6l6 6-6 6"/>', s),
  close: (s) => svg('<path d="M6 6l12 12M18 6 6 18"/>', s),
  check: (s) => svg('<path d="m5 12.5 4.5 4.5L19 7.5"/>', s),
  plus: (s) => svg('<path d="M12 5v14M5 12h14"/>', s),
  camera: (s) => svg('<path d="M4 8.5A2 2 0 0 1 6 6.5h2l1.5-2h5l1.5 2h2a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><circle cx="12" cy="13" r="3.5"/>', s),
  bag: (s) => svg('<path d="M5 8h14l-1 12.5H6Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>', s),
  hand: (s) => svg('<path d="M8 14V7.5a1.5 1.5 0 0 1 3 0V12"/><path d="M11 11V9.5a1.5 1.5 0 0 1 3 0V12"/><path d="M14 11.5a1.5 1.5 0 0 1 3 0V14a6 6 0 0 1-6 6h-.5a5.5 5.5 0 0 1-4.6-2.5L4 14.6a1.5 1.5 0 0 1 2.4-1.8L8 14.5"/>', s),
  shaka: (s) => svg('<path d="M7 11.5V6.2a1.6 1.6 0 0 1 3.2 0V10"/><path d="M10.2 10.2h5.6a1.6 1.6 0 0 1 0 3.2"/><path d="M15.8 13.4h1.9a1.6 1.6 0 0 1 1.1 2.7L16 19a5 5 0 0 1-3.5 1.4H11a5 5 0 0 1-5-5v-1.6"/><path d="M6 13.8 3.6 11.5a1.5 1.5 0 0 1 2.1-2.1L7 10.6"/>', s),
  logout: (s) => svg('<path d="M14 4.5h3.5a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H14"/><path d="M10 16.5 5.5 12 10 7.5M5.5 12H15"/>', s),
  edit: (s) => svg('<path d="M4.5 19.5h4l10-10-4-4-10 10Z"/><path d="m13 7 4 4"/>', s),
  download: (s) => svg('<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14"/>', s),
  google: () => `<svg class="icon" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.6 12.3c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2-1.9 3.3-4.7 3.3-8Z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1-3.7 1-2.8 0-5.2-1.9-6.1-4.5H2.2v2.8A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M5.9 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2.2a11 11 0 0 0 0 9.8Z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3 .6 4.1 1.6l3.1-3.1A11 11 0 0 0 2.2 7.1l3.7 2.8C6.8 7.3 9.2 5.4 12 5.4Z"/></svg>`,
  apple: () => `<svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9a4.7 4.7 0 0 0-3.7-2c-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.3-.9a5 5 0 0 0-4.2 2.5c-1.8 3.1-.5 7.7 1.3 10.2.8 1.2 1.8 2.6 3.1 2.6 1.3-.1 1.7-.8 3.3-.8 1.5 0 1.9.8 3.3.8 1.4 0 2.2-1.3 3-2.5a10 10 0 0 0 1.4-2.8 4.3 4.3 0 0 1-2.5-4.1ZM13.9 5a4.3 4.3 0 0 0 1-3.2 4.4 4.4 0 0 0-2.9 1.5 4.1 4.1 0 0 0-1 3.1A3.6 3.6 0 0 0 13.9 5Z"/></svg>`,
  linkedin: () => `<svg class="icon" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="4" fill="#0A66C2"/><path fill="#fff" d="M7.2 9.6h-2.6V19h2.6V9.6ZM5.9 5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm13.5 8.3c0-2.8-1.5-4-3.5-4a3 3 0 0 0-2.7 1.5V9.6h-2.6V19h2.6v-5c0-1.3.3-2.5 1.9-2.5s1.7 1.5 1.7 2.6V19h2.6v-5.7Z"/></svg>`,
};

// The Pace mark: a sun with a trailing rhythm of echoes.
// `tone` is the colour of the leading circle; echoes fade behind it.
export function mark({ size = 40, tone = 'currentColor', label = 'Pace' } = {}) {
  return `<svg class="mark" width="${size * 1.45}" height="${size}" viewBox="0 0 87 60" role="img" aria-label="${label}">
    <circle cx="57" cy="30" r="29" fill="${tone}" opacity=".16"/>
    <circle cx="51" cy="30" r="29" fill="${tone}" opacity=".26"/>
    <circle cx="44" cy="30" r="29" fill="${tone}" opacity=".42"/>
    <circle cx="30" cy="30" r="29" fill="${tone}"/>
  </svg>`;
}

export function wordmark({ size = 28, tone = 'currentColor' } = {}) {
  return `<span class="wordmark" style="--wm:${size}px">${mark({ size, tone })}<span class="wordmark-type">Pace</span></span>`;
}
