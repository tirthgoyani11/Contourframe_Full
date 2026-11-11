/**
 * Exact Asymmetric Quintic Camera Transition Sampler.
 * Reconstructed from Contourframe production code (_0x4b672a, _0x104cd0, _0x32f32a, _0x49540d, _0x4ac01d).
 */

/**
 * 7th-degree quintic-blend polynomial easing.
 * E(u) = 70u^4 - 224u^5 + 280u^6 - 160u^7 + 35u^8
 */
export function easeQuintic(u) {
  if (u <= 0.0) return 0.0;
  if (u >= 1.0) return 1.0;
  const u4 = u * u * u * u;
  return u4 * (70.0 + u * (-224.0 + u * (280.0 + u * (-160.0 + 35.0 * u))));
}

/**
 * Quadratic smoothstep for holds.
 */
export function easeSmoothstep(t) {
  if (t <= 0.0) return 0.0;
  if (t >= 1.0) return 1.0;
  return t < 0.5 ? 2.0 * t * t : 1.0 - Math.pow(-2.0 * t + 2.0, 2) / 2.0;
}

/**
 * Normalizes shortest bearing angular distance into [-180, 180] degrees.
 */
export function shortestBearingDelta(fromBearing, toBearing) {
  const rawDelta = toBearing - fromBearing;
  return ((rawDelta + 540.0) % 360.0) - 180.0;
}

/**
 * Asymmetric lead/trail power-law staging evaluator.
 */
export function evaluateStaging(startCamera, endCamera, t) {
  const dz = endCamera.zoom - startCamera.zoom;
  const absDz = Math.abs(dz);
  const midLat = (startCamera.center[1] + endCamera.center[1]) * 0.5;
  const dx = (endCamera.center[0] - startCamera.center[0]) * Math.cos((midLat * Math.PI) / 180.0);
  const dy = endCamera.center[1] - startCamera.center[1];
  const dist = Math.sqrt(dx * dx + dy * dy);

  const zoomFactor = Math.min(1.0, absDz / 3.0); // zoomThreshold = 3.0
  const distFactor = Math.min(1.0, dist / 30.0); // distThreshold = 30.0
  const rawMagnitude = Math.max(zoomFactor, distFactor);
  const magnitude = Math.pow(rawMagnitude, 3.0); // magnitudeExponent = 3.0
  const p = 1.0 + magnitude; // asymmetry = 1.0

  const leadProgress = easeQuintic(1.0 - Math.pow(1.0 - t, p));
  const trailProgress = easeQuintic(Math.pow(t, p));

  let posProgress, zoomProgress, direction;
  if (dz < -0.01) {
    direction = 'zoomOut';
    posProgress = leadProgress;
    zoomProgress = trailProgress;
  } else if (dz > 0.01) {
    direction = 'zoomIn';
    posProgress = trailProgress;
    zoomProgress = leadProgress;
  } else {
    direction = 'pan';
    posProgress = easeQuintic(t);
    zoomProgress = posProgress;
  }

  return {
    posProgress,
    zoomProgress,
    magnitude,
    direction,
    distance: dist,
    zoomDelta: absDz
  };
}

/**
 * Evaluates camera transform at normalized progress t in [0, 1].
 */
export function sampleTransitionCamera(transitionItem, t) {
  const start = transitionItem.startCamera;
  const end = transitionItem.endCamera;

  const sinT = Math.sin(t * Math.PI);
  const zoomDip = typeof transitionItem._zoomDip === 'number' ? transitionItem._zoomDip * sinT * sinT : 0.0;

  if (transitionItem.linearMotion) {
    const deltaBearing = shortestBearingDelta(start.bearing, end.bearing);
    return {
      center: [
        start.center[0] + (end.center[0] - start.center[0]) * t,
        start.center[1] + (end.center[1] - start.center[1]) * t
      ],
      zoom: Math.max(0.0, start.zoom + (end.zoom - start.zoom) * t - zoomDip),
      pitch: start.pitch + (end.pitch - start.pitch) * t,
      bearing: start.bearing + deltaBearing * t
    };
  }

  const staging = evaluateStaging(start, end, t);
  const deltaBearing = shortestBearingDelta(start.bearing, end.bearing);

  return {
    center: [
      start.center[0] + (end.center[0] - start.center[0]) * staging.posProgress,
      start.center[1] + (end.center[1] - start.center[1]) * staging.posProgress
    ],
    zoom: Math.max(0.0, start.zoom + (end.zoom - start.zoom) * staging.zoomProgress - zoomDip),
    pitch: start.pitch + (end.pitch - start.pitch) * staging.posProgress,
    bearing: start.bearing + deltaBearing * staging.posProgress
  };
}

/**
 * Evaluates hold scene camera, executing active sweep/orbit rotations if present.
 */
export function sampleHoldCamera(holdItem, localT = 0.0, totalDurationSec = null) {
  const baseCamera = holdItem.camera || {
    center: [0.0, 20.0],
    zoom: 2.5,
    pitch: 0.0,
    bearing: 0.0
  };

  if (!holdItem.holdAnim) {
    return {
      center: [...baseCamera.center],
      zoom: Number.isFinite(baseCamera.zoom) ? baseCamera.zoom : 2.5,
      pitch: Number.isFinite(baseCamera.pitch) ? baseCamera.pitch : 0.0,
      bearing: Number.isFinite(baseCamera.bearing) ? baseCamera.bearing : 0.0
    };
  }

  // Calculate normalized progress safely in [0, 1]
  let t = 0.0;
  if (totalDurationSec !== null && totalDurationSec > 0) {
    t = localT / Math.max(1.0, totalDurationSec - 1.0);
  } else {
    t = Number.isFinite(localT) ? localT : 0.0;
  }
  t = Math.max(0.0, Math.min(1.0, t));
  const progress = easeSmoothstep(t);

  const anim = typeof holdItem.holdAnim === 'object' ? holdItem.holdAnim : { type: holdItem.holdAnim };
  const baseBearing = Number.isFinite(baseCamera.bearing) ? baseCamera.bearing : 0.0;
  const basePitch = Number.isFinite(baseCamera.pitch) ? baseCamera.pitch : 0.0;

  let fromBearing = anim.fromBearing;
  let toBearing = anim.toBearing;

  if (anim.type === 'orbit') {
    if (fromBearing === undefined) fromBearing = baseBearing;
    if (toBearing === undefined) toBearing = -baseBearing;
  } else if (anim.type === 'sweep') {
    if (fromBearing === undefined) fromBearing = 0.0;
    if (toBearing === undefined) toBearing = holdItem.targetBearing !== undefined ? holdItem.targetBearing : 45.0;
  } else {
    if (fromBearing === undefined) fromBearing = baseBearing;
    if (toBearing === undefined) toBearing = baseBearing;
  }

  const deltaBearing = shortestBearingDelta(fromBearing, toBearing);
  const fromPitch = Number.isFinite(anim.fromPitch) ? anim.fromPitch : basePitch;
  const toPitch = Number.isFinite(anim.toPitch) ? anim.toPitch : (anim.pitch !== undefined ? anim.pitch : basePitch);

  const finalPitch = fromPitch + (toPitch - fromPitch) * progress;
  const finalBearing = fromBearing + deltaBearing * progress;

  return {
    center: [...baseCamera.center],
    zoom: Number.isFinite(baseCamera.zoom) ? baseCamera.zoom : 2.5,
    pitch: Number.isFinite(finalPitch) ? finalPitch : basePitch,
    bearing: Number.isFinite(finalBearing) ? finalBearing : baseBearing
  };
}

