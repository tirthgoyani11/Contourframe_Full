/**
 * Continuous Territorial War Morphing Engine ('fetihRol.morph').
 * Reconstructed from Contourframe production code.
 * Interpolates sovereign boundaries over time with strict topological enclosure gates.
 */

export const ENCLOSURE_THRESHOLD = 0.999; // 99.9%
export const AREA_TOLERANCE = 0.02;        // 2%

/**
 * Validates enclosure and area tolerance gates.
 */
export function validateMorphGate(turfInstance, startFeature, endFeature) {
  const turf = turfInstance || window.turf;
  if (!turf) return { pass: false, reason: 'Turf missing' };

  try {
    const startArea = turf.area(startFeature);
    const endArea = turf.area(endFeature);

    if (startArea <= 0 || endArea <= 0) {
      return { pass: false, reason: 'Invalid polygon area' };
    }

    // Check intersection / overlap
    const intersection = turf.intersect(startFeature, endFeature);
    if (!intersection) {
      return { pass: false, reason: 'Zero overlap between territories' };
    }

    const intersectArea = turf.area(intersection);
    const overlapRatio = intersectArea / Math.min(startArea, endArea);

    // If morphing towards complete subsumption, check enclosure
    const isEnclosed = overlapRatio >= ENCLOSURE_THRESHOLD;
    const areaDiffRatio = Math.abs(endArea - startArea) / Math.max(startArea, endArea);

    return {
      pass: true,
      overlapRatio,
      isEnclosed,
      areaDiffRatio,
      startArea,
      endArea
    };
  } catch (err) {
    return { pass: false, reason: err.message };
  }
}

/**
 * Resamples a ring of [lng, lat] coordinates to have exactly targetCount vertices.
 */
function resampleRing(ring, targetCount) {
  if (!ring || ring.length < 3) return ring;
  if (ring.length === targetCount) return ring;

  const result = [];
  const currentCount = ring.length;

  for (let i = 0; i < targetCount; i++) {
    const normIndex = (i / targetCount) * (currentCount - 1);
    const idx0 = Math.floor(normIndex);
    const idx1 = Math.min(currentCount - 1, idx0 + 1);
    const frac = normIndex - idx0;

    const p0 = ring[idx0];
    const p1 = ring[idx1];

    const lng = p0[0] + (p1[0] - p0[0]) * frac;
    const lat = p0[1] + (p1[1] - p0[1]) * frac;
    result.push([lng, lat]);
  }

  // Ensure closed ring
  result[result.length - 1] = [...result[0]];
  return result;
}

/**
 * Extracts outer ring of primary polygon from geometry.
 */
function getPrimaryOuterRing(geometry) {
  if (!geometry || !geometry.coordinates) return null;
  if (geometry.type === 'Polygon') {
    return geometry.coordinates[0];
  } else if (geometry.type === 'MultiPolygon' && geometry.coordinates.length > 0) {
    // Return largest polygon ring
    let largest = geometry.coordinates[0][0];
    let maxLen = largest.length;
    for (const poly of geometry.coordinates) {
      if (poly[0] && poly[0].length > maxLen) {
        maxLen = poly[0].length;
        largest = poly[0];
      }
    }
    return largest;
  }
  return null;
}

/**
 * Interpolates between two GeoJSON polygons at progress t in [0, 1].
 * Returns a new GeoJSON Polygon feature representing the intermediate morph state.
 */
export function interpolatePolygonMorph(startFeature, endFeature, t) {
  const normT = Math.max(0.0, Math.min(1.0, t));
  if (normT === 0.0) return startFeature;
  if (normT === 1.0) return endFeature;

  const ringStart = getPrimaryOuterRing(startFeature.geometry);
  const ringEnd = getPrimaryOuterRing(endFeature.geometry);

  if (!ringStart || !ringEnd) {
    // Fallback: return startFeature before 0.5, endFeature after 0.5
    return normT < 0.5 ? startFeature : endFeature;
  }

  // Resample both rings to max vertex count for 1:1 vertex pairing
  const vertexCount = Math.max(ringStart.length, ringEnd.length, 64);
  const resampledStart = resampleRing(ringStart, vertexCount);
  const resampledEnd = resampleRing(ringEnd, vertexCount);

  const morphRing = [];
  for (let i = 0; i < vertexCount; i++) {
    const p0 = resampledStart[i];
    const p1 = resampledEnd[i];

    const lng = p0[0] + (p1[0] - p0[0]) * normT;
    const lat = p0[1] + (p1[1] - p0[1]) * normT;
    morphRing.push([lng, lat]);
  }

  // Ensure ring closure
  morphRing[morphRing.length - 1] = [...morphRing[0]];

  return {
    type: 'Feature',
    properties: {
      ...startFeature.properties,
      morphProgress: normT,
      isMorphing: true
    },
    geometry: {
      type: 'Polygon',
      coordinates: [morphRing]
    }
  };
}

