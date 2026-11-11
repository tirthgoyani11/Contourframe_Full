/**
 * Exact Fit Bounds & Mercator Viewport Projection for Contourframe Studio.
 * Fully optimized for both 16:9 Landscape and 9:16 Vertical/Shorts/Reels viewports.
 */

export const DESIGN_WIDTH_16_9 = 1920;
export const DESIGN_HEIGHT_16_9 = 1080;
export const DESIGN_WIDTH_9_16 = 1080;
export const DESIGN_HEIGHT_9_16 = 1920;
export const TILE_SIZE = 512;
export const DEFAULT_PADDING = 60;

/**
 * Normalizes latitude to Mercator Y in [0, 1] range.
 */
export function mercatorY(lat) {
  const rad = (lat * Math.PI) / 180.0;
  const clampedRad = Math.max(-1.4844222, Math.min(1.4844222, rad));
  return (1.0 / (2.0 * Math.PI)) * Math.log(Math.tan(Math.PI / 4.0 + clampedRad / 2.0));
}

/**
 * Calculates center and zoom to fit a bounding box [minLng, minLat, maxLng, maxLat].
 * @param {Array<number>} bbox [minLng, minLat, maxLng, maxLat]
 * @param {number} clientWidth Current canvas/viewport width
 * @param {number} clientHeight Current canvas/viewport height
 * @param {number} padding Custom pixel padding (default 60)
 * @returns {{ center: [number, number], zoom: number }}
 */
export function calculateFitBounds(bbox, clientWidth = 1920, clientHeight = 1080, padding = DEFAULT_PADDING) {
  const [minLng, minLat, maxLng, maxLat] = bbox;

  // Center
  const centerLng = (minLng + maxLng) / 2.0;
  const centerLat = (minLat + maxLat) / 2.0;

  // Delta x across Mercator circle
  let dLng = maxLng - minLng;
  if (dLng < 0) dLng += 360;
  const dx = Math.max(0.00001, dLng / 360.0);

  // Delta y
  const yMax = mercatorY(maxLat);
  const yMin = mercatorY(minLat);
  const dy = Math.max(0.00001, Math.abs(yMax - yMin));

  const p = Math.max(DEFAULT_PADDING, padding);
  const isPortrait = clientWidth < clientHeight;

  const designW = isPortrait ? DESIGN_WIDTH_9_16 : DESIGN_WIDTH_16_9;
  const designH = isPortrait ? DESIGN_HEIGHT_9_16 : DESIGN_HEIGHT_16_9;

  const availW = Math.max(100, designW - 2 * p);
  const availH = Math.max(100, designH - 2 * p);

  const zoomX = Math.log2(availW / (dx * TILE_SIZE));
  const zoomY = Math.log2(availH / (dy * TILE_SIZE));
  const baseZoom = Math.min(zoomX, zoomY);

  const clientOffset = Math.log2(clientWidth / designW);
  const finalZoom = Math.max(0.5, Math.min(22, baseZoom + clientOffset));

  return {
    center: [centerLng, centerLat],
    zoom: Math.round(finalZoom * 100) / 100
  };
}

/**
 * Computes bounding box from GeoJSON geometry or feature collection.
 */
export function getGeoJSONBBox(geojson) {
  let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;

  function traverse(coords) {
    if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
      const [lng, lat] = coords;
      if (lng < minLng) minLng = lng;
      if (lat < minLat) minLat = lat;
      if (lng > maxLng) maxLng = lng;
      if (lat > maxLat) maxLat = lat;
    } else if (Array.isArray(coords)) {
      for (const item of coords) {
        traverse(item);
      }
    }
  }

  if (!geojson) {
    return [-180, -85, 180, 85];
  }

  if (geojson.type === 'FeatureCollection' && Array.isArray(geojson.features)) {
    for (const f of geojson.features) {
      if (f.geometry && f.geometry.coordinates) {
        traverse(f.geometry.coordinates);
      }
    }
  } else if (geojson.type === 'Feature' && geojson.geometry) {
    traverse(geojson.geometry.coordinates);
  } else if (geojson.coordinates) {
    traverse(geojson.coordinates);
  }

  if (minLng === Infinity) {
    return [-180, -85, 180, 85];
  }
  return [minLng, minLat, maxLng, maxLat];
}
