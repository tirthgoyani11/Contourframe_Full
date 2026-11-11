/**
 * Naval Routing Engine ('StudioDeniz').
 * Reconstructed from Contourframe production code (studio-deniz.js).
 * Implements 15 Strategic Choke-Point Gateways, Hierarchical Routing, and Heading Interpolation.
 */

export const NAVAL_GATEWAYS = {
  Cebelitarik: { id: 'Cebelitarik', name: 'Strait of Gibraltar', coords: [-5.95, 35.94], links: ['Dover', 'Messina', 'Panama'] },
  Canakkale: { id: 'Canakkale', name: 'Dardanelles', coords: [26.38, 40.15], links: ['Istanbul', 'Messina', 'Korint'] },
  Istanbul: { id: 'Istanbul', name: 'Bosphorus', coords: [29.04, 41.08], links: ['Canakkale'] },
  Messina: { id: 'Messina', name: 'Strait of Messina', coords: [15.65, 38.22], links: ['Cebelitarik', 'Canakkale', 'Otranto', 'Suveys'] },
  Otranto: { id: 'Otranto', name: 'Strait of Otranto', coords: [18.90, 40.10], links: ['Messina'] },
  Dover: { id: 'Dover', name: 'Strait of Dover', coords: [1.40, 51.10], links: ['Cebelitarik', 'Kiel', 'Oresund'] },
  Oresund: { id: 'Oresund', name: 'Øresund', coords: [12.70, 55.75], links: ['Dover', 'Buyuk Belt'] },
  BuyukBelt: { id: 'BuyukBelt', name: 'Great Belt', coords: [11.00, 55.35], links: ['Oresund', 'Kiel'] },
  BabelMendeb: { id: 'BabelMendeb', name: 'Bab-el-Mandeb', coords: [43.35, 12.60], links: ['Suveys', 'Hurmuz', 'Malakka'] },
  Hurmuz: { id: 'Hurmuz', name: 'Strait of Hormuz', coords: [56.45, 26.55], links: ['BabelMendeb', 'Malakka'] },
  Panama: { id: 'Panama', name: 'Panama Canal', coords: [-79.90, 9.10], links: ['Cebelitarik', 'Malakka'] },
  Suveys: { id: 'Suveys', name: 'Suez Canal', coords: [32.35, 30.70], links: ['Messina', 'BabelMendeb'] },
  Kiel: { id: 'Kiel', name: 'Kiel Canal', coords: [9.55, 54.30], links: ['Dover', 'BuyukBelt'] },
  Korint: { id: 'Korint', name: 'Corinth Canal', coords: [22.98, 37.93], links: ['Messina', 'Canakkale'] },
  Malakka: { id: 'Malakka', name: 'Strait of Malacca', coords: [101.40, 2.50], links: ['Hurmuz', 'BabelMendeb', 'Panama'] }
};

function haversineDist(c1, c2) {
  const dLng = ((c2[0] - c1[0]) * Math.PI) / 180;
  const dLat = ((c2[1] - c1[1]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((c1[1] * Math.PI) / 180) * Math.cos((c2[1] * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Finds nearest gateway to a given coordinate.
 */
function findNearestGateway(coords) {
  let nearest = null;
  let minDist = Infinity;
  for (const key of Object.keys(NAVAL_GATEWAYS)) {
    const gw = NAVAL_GATEWAYS[key];
    const d = haversineDist(coords, gw.coords);
    if (d < minDist) {
      minDist = d;
      nearest = gw;
    }
  }
  return { gateway: nearest, distance: minDist };
}

/**
 * Solves shortest path across gateway topology using Dijkstra.
 */
function solveGatewayPath(startGwId, endGwId) {
  if (startGwId === endGwId) return [NAVAL_GATEWAYS[startGwId].coords];

  const distances = {};
  const previous = {};
  const unvisited = new Set(Object.keys(NAVAL_GATEWAYS));

  for (const id of Object.keys(NAVAL_GATEWAYS)) {
    distances[id] = Infinity;
  }
  distances[startGwId] = 0;

  while (unvisited.size > 0) {
    let current = null;
    let shortest = Infinity;
    for (const id of unvisited) {
      if (distances[id] < shortest) {
        shortest = distances[id];
        current = id;
      }
    }

    if (!current || shortest === Infinity) break;
    if (current === endGwId) break;

    unvisited.delete(current);
    const node = NAVAL_GATEWAYS[current];

    for (const neighborId of node.links) {
      if (!unvisited.has(neighborId)) continue;
      const neighbor = NAVAL_GATEWAYS[neighborId];
      const edgeWeight = haversineDist(node.coords, neighbor.coords);
      const alt = distances[current] + edgeWeight;
      if (alt < distances[neighborId]) {
        distances[neighborId] = alt;
        previous[neighborId] = current;
      }
    }
  }

  const path = [];
  let curr = endGwId;
  while (curr) {
    path.unshift(NAVAL_GATEWAYS[curr].coords);
    curr = previous[curr];
  }

  return path.length > 1 ? path : [NAVAL_GATEWAYS[startGwId].coords, NAVAL_GATEWAYS[endGwId].coords];
}

/**
 * Catmull-Rom spline interpolation for maritime waypoints.
 */
export function interpolateSpline(points, numSamples = 100) {
  if (!points || points.length < 2) return points;
  if (points.length === 2) {
    const res = [];
    for (let i = 0; i <= numSamples; i++) {
      const t = i / numSamples;
      res.push([
        points[0][0] + (points[1][0] - points[0][0]) * t,
        points[0][1] + (points[1][1] - points[0][1]) * t
      ]);
    }
    return res;
  }

  const sampled = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const segmentSamples = Math.max(5, Math.floor(numSamples / (points.length - 1)));
    for (let j = 0; j < segmentSamples; j++) {
      const t = j / segmentSamples;
      const t2 = t * t;
      const t3 = t2 * t;

      // Standard Catmull-Rom
      const lng = 0.5 * (
        (2 * p1[0]) +
        (-p0[0] + p2[0]) * t +
        (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
        (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3
      );
      const lat = 0.5 * (
        (2 * p1[1]) +
        (-p0[1] + p2[1]) * t +
        (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
        (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3
      );
      sampled.push([lng, lat]);
    }
  }
  sampled.push(points[points.length - 1]);
  return sampled;
}

/**
 * Evaluates heading bearing in degrees between two coordinates.
 */
export function calculateNavalHeading(from, to) {
  const dLng = ((to[0] - from[0]) * Math.PI) / 180;
  const lat1 = (from[1] * Math.PI) / 180;
  const lat2 = (to[1] * Math.PI) / 180;

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  const brng = Math.atan2(y, x) * (180 / Math.PI);
  return (brng + 360) % 360;
}

/**
 * Main Naval Router Class ('StudioDeniz').
 */
export class StudioDeniz {
  constructor() {
    this.cache = new Map();
    this.maxCache = 64;
  }

  solveRoute(fromLngLat, toLngLat) {
    const key = `${fromLngLat[0].toFixed(3)},${fromLngLat[1].toFixed(3)}->${toLngLat[0].toFixed(3)},${toLngLat[1].toFixed(3)}`;
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    const startNearest = findNearestGateway(fromLngLat);
    const endNearest = findNearestGateway(toLngLat);

    let waypoints = [fromLngLat];
    if (startNearest.distance > 500 || endNearest.distance > 500) {
      // Long distance oceanic trip crossing gateways
      const gwPath = solveGatewayPath(startNearest.gateway.id, endNearest.gateway.id);
      waypoints.push(...gwPath);
    } else {
      // Direct or single gateway route
      if (startNearest.gateway.id !== endNearest.gateway.id) {
        waypoints.push(startNearest.gateway.coords, endNearest.gateway.coords);
      }
    }
    waypoints.push(toLngLat);

    // Filter duplicate consecutive points
    waypoints = waypoints.filter((pt, idx) => {
      if (idx === 0) return true;
      const prev = waypoints[idx - 1];
      return Math.abs(pt[0] - prev[0]) > 0.01 || Math.abs(pt[1] - prev[1]) > 0.01;
    });

    const smoothedPath = interpolateSpline(waypoints, 60);

    if (this.cache.size >= this.maxCache) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, smoothedPath);

    return smoothedPath;
  }

  sampleAtProgress(path, progress) {
    if (!path || path.length === 0) return null;
    const t = Math.max(0.0, Math.min(1.0, progress));
    const index = t * (path.length - 1);
    const idx0 = Math.floor(index);
    const idx1 = Math.min(path.length - 1, idx0 + 1);
    const frac = index - idx0;

    const p0 = path[idx0];
    const p1 = path[idx1];

    const currentPos = [
      p0[0] + (p1[0] - p0[0]) * frac,
      p0[1] + (p1[1] - p0[1]) * frac
    ];

    const heading = calculateNavalHeading(p0, p1);

    return {
      position: currentPos,
      heading
    };
  }
}

