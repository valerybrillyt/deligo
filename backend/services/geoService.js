/**
 * Geocodificación y rutas 100% gratis:
 * - Nominatim (OpenStreetMap) → dirección a coordenadas
 * - OSRM → ruta en carretera entre dos puntos
 */
const USER_AGENT = 'DeliGo-University-Project/1.0 (delivery demo)';

const DEFAULT_LIMA = { lat: -12.0464, lng: -77.0428 };

async function geocode(direccion) {
  if (!direccion?.trim()) return { ...DEFAULT_LIMA, fuente: 'default' };

  const q = encodeURIComponent(`${direccion.trim()}, Perú`);
  const url = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1&addressdetails=0`;

  try {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) throw new Error('Nominatim no respondió');
    const data = await res.json();
    if (!data.length) return { ...DEFAULT_LIMA, fuente: 'default' };
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      fuente: 'nominatim',
    };
  } catch {
    return { ...DEFAULT_LIMA, fuente: 'default' };
  }
}

async function obtenerRuta(origen, destino) {
  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${origen.lng},${origen.lat};${destino.lng},${destino.lat}` +
    `?overview=full&geometries=geojson`;

  try {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) throw new Error('OSRM no respondió');
    const data = await res.json();
    const coords = data.routes?.[0]?.geometry?.coordinates;
    if (!coords?.length) return lineaRecta(origen, destino);
    return coords.map(([lng, lat]) => [lat, lng]);
  } catch {
    return lineaRecta(origen, destino);
  }
}

function lineaRecta(origen, destino) {
  const pasos = 20;
  const pts = [];
  for (let i = 0; i <= pasos; i++) {
    const t = i / pasos;
    pts.push([
      origen.lat + (destino.lat - origen.lat) * t,
      origen.lng + (destino.lng - origen.lng) * t,
    ]);
  }
  return pts;
}

function puntoEnRuta(coordenadas, progresoPct) {
  if (!coordenadas?.length) return null;
  const pct = Math.max(0, Math.min(100, progresoPct)) / 100;
  const idx = Math.round(pct * (coordenadas.length - 1));
  const [lat, lng] = coordenadas[idx];
  return { lat, lng };
}

module.exports = { geocode, obtenerRuta, puntoEnRuta, DEFAULT_LIMA };
