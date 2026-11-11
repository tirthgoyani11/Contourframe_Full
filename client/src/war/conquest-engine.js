/**
 * Territorial Conquest Engine ('fetih').
 * Reconstructed from Contourframe production code (studio-core.js & studio-map.js).
 * Executes geometric annexation, remnant elimination, and donor validation.
 */

export const REMNANT_AREA_THRESHOLD = 5000000; // 5,000,000 m² (5 km²)
export const REMNANT_RATIO_THRESHOLD = 0.002;  // 0.2% of original area
export const DONOR_EXPANSION_LIMIT = 1.5;     // 1.5x area ratio limit
export const DONOR_OVERLAP_MIN = 0.60;        // 60% minimum overlap

/**
 * Checks whether remaining polygon fragment is an negligible remnant.
 */
export function isRemnantFragment(remainingArea, originalArea) {
  return (
    remainingArea < REMNANT_RATIO_THRESHOLD * originalArea &&
    remainingArea < REMNANT_AREA_THRESHOLD
  );
}

/**
 * Validates donor boundary expansion against unnatural ballooning.
 */
export function validateDonorLand(donorArea, targetArea, overlapRatio) {
  if (donorArea > DONOR_EXPANSION_LIMIT * targetArea && overlapRatio < DONOR_OVERLAP_MIN) {
    return false; // Rejected: unnatural land ballooning
  }
  return true;
}

/**
 * Executes classic territorial conquest ('fetih') between an attacker and one or more defenders.
 * Uses Turf.js spatial functions.
 * 
 * @param {Object} turfInstance Reference to window.turf (v6.5.0)
 * @param {Object} attackerFeature GeoJSON Feature of attacking country
 * @param {Array<Object>} defenderFeatures Array of GeoJSON Features of defending countries
 * @param {number} conquestRatio Fraction of territory annexed [0.0, 1.0] (default 1.0 = total)
 * @returns {{
 *   conquerorFeature: Object,
 *   updatedDefenders: Array<Object>,
 *   annexedFragments: Array<Object>
 * }}
 */
export function executeConquest(turfInstance, attackerFeature, defenderFeatures, conquestRatio = 1.0) {
  const turf = turfInstance || window.turf;
  if (!turf) {
    throw new Error('Turf.js 6.5.0 is required for territorial conquest');
  }

  let currentAttacker = JSON.parse(JSON.stringify(attackerFeature));
  const updatedDefenders = [];
  const annexedFragments = [];

  for (const defender of defenderFeatures) {
    try {
      const origDefenderArea = turf.area(defender);
      if (origDefenderArea <= 0) continue;

      if (conquestRatio >= 0.999) {
        // Complete annexation
        // Union defender territory into attacker
        const merged = turf.union(currentAttacker, defender);
        if (merged) {
          currentAttacker = merged;
          annexedFragments.push(defender);
        }

        // Defender territory is completely dissolved
        const dissolvedDefender = {
          ...defender,
          geometry: {
            type: 'MultiPolygon',
            coordinates: []
          },
          properties: {
            ...defender.properties,
            annexed: true,
            remnantEliminated: true
          }
        };
        updatedDefenders.push(dissolvedDefender);
      } else {
        // Partial territorial annexation
        // For partial conquests, slice a portion or compute difference
        const defenderArea = origDefenderArea;
        const diff = turf.difference(defender, currentAttacker);

        if (!diff || !diff.geometry || !diff.geometry.coordinates || diff.geometry.coordinates.length === 0) {
          // Entire defender was engulfed
          updatedDefenders.push({
            ...defender,
            geometry: { type: 'MultiPolygon', coordinates: [] }
          });
        } else {
          const remainingArea = turf.area(diff);
          if (isRemnantFragment(remainingArea, origDefenderArea)) {
            // Remnant elimination rule triggered
            updatedDefenders.push({
              ...defender,
              geometry: { type: 'MultiPolygon', coordinates: [] },
              properties: { ...defender.properties, remnantEliminated: true }
            });
          } else {
            updatedDefenders.push(diff);
          }
        }
      }
    } catch (err) {
      console.warn('[AMM Conquest] Geometric operation warning:', err);
      // Fallback: preserve original features
      updatedDefenders.push(defender);
    }
  }

  return {
    conquerorFeature: currentAttacker,
    updatedDefenders,
    annexedFragments
  };
}

