// High-Speed Client-Side Reverse Geocoding with Zero Rate Limits
// Primary: BigDataCloud Client API
// Fallback: OpenStreetMap Nominatim
// Cache: localStorage('resqai_exact_location')
// Fallback Coords: { lat: 17.47218, lng: 78.42259 } (Hyderabad West Zone)

export interface GeocodedLocation {
  lat: number;
  lng: number;
  address: string;
  zone: string;
  accuracy?: number;
  updatedAt?: string;
}

export const HYDERABAD_FALLBACK_COORDS = {
  lat: 17.47218,
  lng: 78.42259,
  address: 'Hyderabad West Zone (Emergency Sector Alpha)',
  zone: 'Hyderabad West Zone'
};

const CACHE_KEY = 'resqai_exact_location';

export function getCachedLocation(): GeocodedLocation | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      return JSON.parse(raw) as GeocodedLocation;
    }
  } catch (err) {
    console.warn('Unable to access localStorage for cached location:', err);
  }
  return null;
}

export function setCachedLocation(location: GeocodedLocation): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(location));
  } catch (err) {
    console.warn('Unable to write to localStorage for cached location:', err);
  }
}

export async function reverseGeocodeCoords(lat: number, lng: number): Promise<{ address: string; zone: string }> {
  // 1. Try BigDataCloud Client API (High speed, zero API token required)
  try {
    const bdcUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
    const res = await fetch(bdcUrl, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(3500)
    });

    if (res.ok) {
      const data = await res.json();
      const locality = data.locality || data.city || data.principalSubdivision || '';
      const parts = [
        data.locality,
        data.city,
        data.principalSubdivision,
        data.countryName
      ].filter(Boolean);

      const address = parts.length > 0
        ? parts.join(', ')
        : `Lat ${lat.toFixed(5)}°, Lng ${lng.toFixed(5)}°`;

      const zone = locality || data.principalSubdivision || 'Hyderabad Sector';

      const result = { address, zone };
      setCachedLocation({ lat, lng, address, zone, updatedAt: new Date().toLocaleTimeString() });
      return result;
    }
  } catch (err) {
    console.warn('BigDataCloud reverse geocode timed out or failed, trying Nominatim fallback:', err);
  }

  // 2. Fallback to OpenStreetMap Nominatim
  try {
    const nomUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
    const res = await fetch(nomUrl, {
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en'
      },
      signal: AbortSignal.timeout(4000)
    });

    if (res.ok) {
      const data = await res.json();
      const road = data.address?.road || data.address?.pedestrian || data.address?.suburb || '';
      const city = data.address?.city || data.address?.town || data.address?.state_district || 'Hyderabad';
      const suburb = data.address?.suburb || data.address?.neighbourhood || 'Regional Sector';

      const formatted = [road, city].filter(Boolean).join(', ') || data.display_name?.split(',').slice(0, 3).join(',') || `Lat ${lat.toFixed(5)}°, Lng ${lng.toFixed(5)}°`;

      const result = { address: formatted, zone: suburb };
      setCachedLocation({ lat, lng, address: formatted, zone: suburb, updatedAt: new Date().toLocaleTimeString() });
      return result;
    }
  } catch (err) {
    console.warn('Nominatim reverse geocode failed:', err);
  }

  // 3. Fallback to cached or sector coordinates
  const cached = getCachedLocation();
  if (cached && Math.abs(cached.lat - lat) < 0.05 && Math.abs(cached.lng - lng) < 0.05) {
    return { address: cached.address, zone: cached.zone };
  }

  return {
    address: `Live GPS Fix: ${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E`,
    zone: 'Hyderabad Regional Sector'
  };
}
