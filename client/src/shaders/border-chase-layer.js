/**
 * Country Border Animation & Chase Shader Layer.
 * Supports all 9 border anim types:
 * 'oneWay', 'twoWay', 'twoWayReverse', 'fourWay', 'fadeIn', 'typewriter', 'chaseBorder', 'chaseWipe', 'chaseCircular'.
 */

export const BORDER_ANIM_TYPES = [
  'oneWay',
  'twoWay',
  'twoWayReverse',
  'fourWay',
  'fadeIn',
  'typewriter',
  'chaseBorder',
  'chaseWipe',
  'chaseCircular'
];

/**
 * Calculates line dash and trim parameters for MapLibre line layers given borderAnimType and normalized progress t in [0, 1].
 */
export function calculateBorderDash(borderType, progress, totalLength = 1000) {
  const t = Math.max(0.0, Math.min(1.0, progress));

  switch (borderType) {
    case 'fadeIn':
      return {
        opacity: t,
        dasharray: [1, 0],
        offset: 0
      };

    case 'typewriter': {
      // 10 stepped increments
      const steps = 10;
      const steppedT = Math.floor(t * steps) / steps;
      return {
        opacity: 1.0,
        dasharray: [Math.max(0.001, steppedT * totalLength), Math.max(0.001, (1.0 - steppedT) * totalLength)],
        offset: 0
      };
    }

    case 'oneWay':
      // Single continuous stroke encircling clockwise
      return {
        opacity: 1.0,
        dasharray: [Math.max(0.001, t * totalLength), Math.max(0.001, (1.0 - t) * totalLength)],
        offset: 0
      };

    case 'twoWay': {
      // Bidirectional from two halves
      const half = totalLength / 2.0;
      const filled = half * t;
      const gap = half * (1.0 - t);
      return {
        opacity: 1.0,
        dasharray: [Math.max(0.001, filled), Math.max(0.001, gap)],
        offset: 0
      };
    }

    case 'twoWayReverse': {
      // Inward collision trace
      const half = totalLength / 2.0;
      const filled = half * t;
      const gap = half * (1.0 - t);
      return {
        opacity: 1.0,
        dasharray: [Math.max(0.001, filled), Math.max(0.001, gap)],
        offset: gap
      };
    }

    case 'fourWay': {
      // 4 segments simultaneous trace
      const quad = totalLength / 4.0;
      const filled = quad * t;
      const gap = quad * (1.0 - t);
      return {
        opacity: 1.0,
        dasharray: [Math.max(0.001, filled), Math.max(0.001, gap)],
        offset: 0
      };
    }

    case 'chaseBorder':
    case 'chase': {
      // Continuous marching dash loop
      const dashSize = 15;
      const gapSize = 10;
      const loopOffset = (t * 100) % (dashSize + gapSize);
      return {
        opacity: 1.0,
        dasharray: [dashSize, gapSize],
        offset: loopOffset
      };
    }

    case 'chaseWipe': {
      // High speed pulse ahead of wipe
      const pulseLen = totalLength * 0.2;
      const pos = totalLength * t;
      return {
        opacity: 1.0,
        dasharray: [pulseLen, Math.max(0.001, totalLength - pulseLen)],
        offset: pos
      };
    }

    case 'chaseCircular': {
      // Radial border ring pulse
      return {
        opacity: Math.sin(t * Math.PI),
        dasharray: [20, 10],
        offset: t * 50
      };
    }

    default:
      return {
        opacity: 1.0,
        dasharray: [1, 0],
        offset: 0
      };
  }
}

/**
 * Controller to manage border animation on a MapLibre GL map instance.
 */
export class BorderAnimationController {
  constructor(map, layerId = 'amm-border-layer') {
    this.map = map;
    this.layerId = layerId;
  }

  update(borderAnimType, progress, color = '#ffffff', width = 2.0) {
    if (!this.map || !this.map.getLayer(this.layerId)) return;

    const dashParams = calculateBorderDash(borderAnimType, progress);
    this.map.setPaintProperty(this.layerId, 'line-opacity', dashParams.opacity);
    this.map.setPaintProperty(this.layerId, 'line-color', color);
    this.map.setPaintProperty(this.layerId, 'line-width', width);

    if (dashParams.dasharray && dashParams.dasharray.length === 2) {
      // MapLibre dasharray expects relative dash/gap ratios (e.g. [2, 1])
      const sum = dashParams.dasharray[0] + dashParams.dasharray[1];
      if (sum > 0) {
        const d = (dashParams.dasharray[0] / sum) * 10;
        const g = (dashParams.dasharray[1] / sum) * 10;
        this.map.setPaintProperty(this.layerId, 'line-dasharray', [Math.max(0.01, d), Math.max(0.01, g)]);
      }
    }
  }
}

