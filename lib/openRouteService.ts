// OpenRouteService Road Routing Client with Demo Grid Fallback

export interface RouteResult {
  coordinates: [number, number][]; // [lng, lat] GeoJSON format
  distanceKm: number;
  durationMinutes: number;
  etaString: string;
  isDemoRoute: boolean;
  status: 'SUCCESS' | 'DEMO_FALLBACK' | 'ERROR';
}

const ORS_API_KEY = process.env.NEXT_PUBLIC_ORS_API_KEY || '';

/**
 * Fetch road route from OpenRouteService Direction API.
 * Falls back to realistic multi-waypoint road simulation if offline or API key absent.
 */
export async function getRoadRoute(
  startLngLat: [number, number],
  endLngLat: [number, number]
): Promise<RouteResult> {
  const [startLng, startLat] = startLngLat;
  const [endLng, endLat] = endLngLat;

  if (ORS_API_KEY && ORS_API_KEY.trim().length > 10) {
    try {
      const response = await fetch(
        `https://api.openrouteservice.org/v2/directions/driving-car/geojson`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': ORS_API_KEY
          },
          body: JSON.stringify({
            coordinates: [
              [startLng, startLat],
              [endLng, endLat]
            ],
            preference: 'fastest',
            units: 'km'
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const feature = data.features?.[0];
        if (feature && feature.geometry?.coordinates) {
          const coords = feature.geometry.coordinates as [number, number][];
          const summary = feature.properties?.summary;
          const distanceKm = summary?.distance ? parseFloat((summary.distance).toFixed(2)) : calculateHaversineKm(startLngLat, endLngLat) * 1.3;
          const durationSeconds = summary?.duration || (distanceKm / 40) * 3600;
          const durationMinutes = Math.max(1, Math.round(durationSeconds / 60));

          return {
            coordinates: coords,
            distanceKm,
            durationMinutes,
            etaString: `${durationMinutes} min`,
            isDemoRoute: false,
            status: 'SUCCESS'
          };
        }
      }
    } catch (err) {
      console.warn('OpenRouteService API request failed, falling back to simulated road route:', err);
    }
  }

  // DEMO MODE ROAD ROUTING:
  // Instead of a straight diagonal line (which looks fake), we construct an authentic urban street grid route
  // with turn waypoints along road corridors.
  const coords = generateRealisticRoadPath(startLngLat, endLngLat);
  const distanceKm = parseFloat((calculatePathDistanceKm(coords)).toFixed(1));
  // Emergency vehicle speed average: 42 km/h in urban streets
  const durationMinutes = Math.max(2, Math.round((distanceKm / 42) * 60));

  return {
    coordinates: coords,
    distanceKm,
    durationMinutes,
    etaString: `${durationMinutes < 10 ? '0' + durationMinutes : durationMinutes} min`,
    isDemoRoute: true,
    status: 'DEMO_FALLBACK'
  };
}

/**
 * Generates realistic urban road waypoints (avoiding straight line flight paths)
 */
function generateRealisticRoadPath(
  start: [number, number],
  end: [number, number]
): [number, number][] {
  const [x1, y1] = start;
  const [x2, y2] = end;

  const points: [number, number][] = [start];

  // Divide path into 4-6 realistic urban segments following cardinal street grids
  const steps = 6;
  const midX = x1 + (x2 - x1) * 0.45;
  const midY = y1 + (y2 - y1) * 0.55;

  // Waypoint 1: Initial avenue stretch
  points.push([x1 + (midX - x1) * 0.5, y1 + (midY - y1) * 0.1]);
  // Waypoint 2: Right-angle boulevard turn
  points.push([midX, y1 + (midY - y1) * 0.4]);
  // Waypoint 3: Mid-intersection
  points.push([midX + 0.001, midY]);
  // Waypoint 4: Ring road curve
  points.push([midX + (x2 - midX) * 0.6, midY + (y2 - midY) * 0.3]);
  // Waypoint 5: Approach street
  points.push([x2 - (x2 - midX) * 0.15, y2 - (y2 - midY) * 0.1]);

  points.push(end);
  return points;
}

function calculateHaversineKm(p1: [number, number], p2: [number, number]): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((p2[1] - p1[1]) * Math.PI) / 180;
  const dLon = ((p2[0] - p1[0]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1[1] * Math.PI) / 180) *
      Math.cos((p2[1] * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function calculatePathDistanceKm(coords: [number, number][]): number {
  let total = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    total += calculateHaversineKm(coords[i], coords[i + 1]);
  }
  return total;
}
