/**
 * Exact Sequence Expansion & Timeline Construction (_0xaafcaa).
 * Transforms scenes into an executable timeline of camera transitions, holds, and layer events.
 */

import { shortestBearingDelta } from './camera-sampler.js';
import { calculateFitBounds, getGeoJSONBBox } from './fit-bounds.js';

export const TRANSITION_DEFAULTS = {
  flyToCountry: {
    duration: 3.0,
    pitch: 60.0,
    bearing: 20.0,
    bounceScale: 0.0,
    holdAnim: null,
    linearMotion: false
  },
  orbitZoom: {
    duration: 3.0,
    pitch: 55.0,
    bearing: 45.0,
    bounceScale: 0.5,
    holdAnim: 'orbit',
    linearMotion: false
  },
  cinematicSweep: {
    duration: 3.0,
    pitch: 60.0,
    bearing: 0.0, // lands at 0, hold sweeps to 45
    targetBearing: 45.0,
    bounceScale: 1.0,
    holdAnim: 'sweep',
    linearMotion: false
  },
  topDownBounce: {
    duration: 3.0,
    pitch: 0.0,
    bearing: 0.0,
    bounceScale: 1.2,
    holdAnim: null,
    linearMotion: false
  },
  topDownLinear: {
    duration: 3.0,
    pitch: 0.0,
    bearing: 0.0,
    bounceScale: 0.0,
    holdAnim: null,
    linearMotion: true
  },
  topDown: {
    duration: 3.0,
    pitch: 0.0,
    bearing: 0.0,
    bounceScale: 0.0,
    holdAnim: null,
    linearMotion: false
  }
};

/**
 * Normalizes camera parameters with defaults.
 */
export function normalizeCamera(cam) {
  if (!cam) {
    return {
      center: [0.0, 20.0],
      zoom: 2.5,
      pitch: 0.0,
      bearing: 0.0
    };
  }
  return {
    center: [
      Array.isArray(cam.center) ? cam.center[0] : (cam.lng || 0.0),
      Array.isArray(cam.center) ? cam.center[1] : (cam.lat || 20.0)
    ],
    zoom: typeof cam.zoom === 'number' ? cam.zoom : 2.5,
    pitch: typeof cam.pitch === 'number' ? cam.pitch : 0.0,
    bearing: typeof cam.bearing === 'number' ? cam.bearing : 0.0
  };
}

/**
 * Normalizes project scenes whether stored as `scenes` array or production `sequenceItems` alternating transitions & countryGroups.
 */
export function normalizeProjectScenes(project) {
  if (Array.isArray(project.scenes) && project.scenes.length > 0) {
    return project.scenes;
  }

  if (Array.isArray(project.sequenceItems) && project.sequenceItems.length > 0) {
    const scenes = [];
    let pendingTransition = null;

    for (let i = 0; i < project.sequenceItems.length; i++) {
      const item = project.sequenceItems[i];
      if (item.type === 'transition') {
        pendingTransition = item;
      } else if (item.type === 'countryGroup') {
        const trans = pendingTransition || {};
        scenes.push({
          id: item.id || `scene_${scenes.length}`,
          title: item.label || (item.countries && item.countries[0] && item.countries[0].name) || `Scene ${scenes.length + 1}`,
          transitionType: trans.animationType || 'topDown',
          transitionDuration: typeof trans.durationSec === 'number' ? trans.durationSec : 3.0,
          holdDuration: typeof item.holdDurationSec === 'number' ? item.holdDurationSec : 2.5,
          camera: item.cameraOverride || null,
          countries: item.countries || [],
          annotations: item.annotations || [],
          actors3d: item.actors3d || [],
          fetihRol: trans.fetihRol || null
        });
        pendingTransition = null;
      }
    }
    return scenes;
  }

  return [];
}

/**
 * Converts high-level scenes back to production sequenceItems schema.
 */
export function scenesToSequenceItems(scenes) {
  const items = [];
  (scenes || []).forEach((sc, idx) => {
    items.push({
      type: 'transition',
      id: `item_trans_${idx}`,
      animationType: sc.transitionType || 'topDown',
      durationSec: sc.transitionDuration || 3.0,
      fetihRol: sc.fetihRol || null
    });
    items.push({
      type: 'countryGroup',
      id: sc.id || `item_cg_${idx}`,
      label: sc.title || `Scene ${idx + 1}`,
      holdDurationSec: sc.holdDuration || 2.5,
      cameraOverride: sc.camera || null,
      countries: sc.countries || [],
      annotations: sc.annotations || [],
      actors3d: sc.actors3d || []
    });
  });
  return items;
}

/**
 * Expands project scenes into continuous timeline segments.
 * Each segment is either type: 'transition' or type: 'hold'.
 */
export function expandTimelineSequence(project, countryLookup = null) {
  const scenes = normalizeProjectScenes(project);
  const segments = [];
  let currentTime = 0.0;

  let currentCamera = normalizeCamera(project.startCamera || (scenes[0] && scenes[0].camera));

  // Initial anchor hold if requested or start transition
  if (project.startHoldDuration && project.startHoldDuration > 0) {
    const dur = project.startHoldDuration;
    segments.push({
      id: 'start-hold',
      type: 'hold',
      sceneIndex: -1,
      startTime: currentTime,
      endTime: currentTime + dur,
      duration: dur,
      camera: { ...currentCamera },
      holdAnim: null
    });
    currentTime += dur;
  }

  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    const transType = scene.transitionType || 'topDown';
    const config = TRANSITION_DEFAULTS[transType] || TRANSITION_DEFAULTS.topDown;

    // Target camera for this scene
    let targetCamera;
    if (scene.camera) {
      targetCamera = normalizeCamera(scene.camera);
    } else {
      let bbox = scene.bbox || null;
      if (!bbox && scene.countries && scene.countries.length > 0 && countryLookup) {
        let combinedBBox = null;
        for (const c of scene.countries) {
          const feat = countryLookup(c.id || c.name);
          if (feat) {
            const b = getGeoJSONBBox(feat);
            if (!combinedBBox) {
              combinedBBox = [...b];
            } else {
              combinedBBox[0] = Math.min(combinedBBox[0], b[0]);
              combinedBBox[1] = Math.min(combinedBBox[1], b[1]);
              combinedBBox[2] = Math.max(combinedBBox[2], b[2]);
              combinedBBox[3] = Math.max(combinedBBox[3], b[3]);
            }
          }
        }
        bbox = combinedBBox;
        scene.bbox = combinedBBox;
      }

      if (bbox) {
        const fit = calculateFitBounds(bbox);
        targetCamera = {
          center: fit.center,
          zoom: fit.zoom,
          pitch: config.pitch,
          bearing: config.bearing
        };
      } else {
        targetCamera = {
          center: [...currentCamera.center],
          zoom: currentCamera.zoom,
          pitch: config.pitch,
          bearing: config.bearing
        };
      }
    }

    // Apply preset overrides if scene doesn't lock pitch/bearing
    if (scene.pitch !== undefined) targetCamera.pitch = scene.pitch;
    if (scene.bearing !== undefined) targetCamera.bearing = scene.bearing;

    // Transition segment
    const transDuration = typeof scene.transitionDuration === 'number' ? scene.transitionDuration : config.duration;
    
    // Calculate zoom dip
    let zoomDip = 0.0;
    if (config.bounceScale > 0) {
      zoomDip = 1.2 * config.bounceScale;
    }

    const transSegment = {
      id: `trans-${scene.id || i}`,
      type: 'transition',
      sceneIndex: i,
      sceneId: scene.id,
      startTime: currentTime,
      endTime: currentTime + transDuration,
      duration: transDuration,
      startCamera: { ...currentCamera },
      endCamera: { ...targetCamera },
      linearMotion: config.linearMotion || scene.linearMotion || false,
      _zoomDip: zoomDip,
      transitionType: transType,
      positionCurve: scene.positionCurve || [0.65, 0.0, 0.35, 1.0],
      zoomCurve: scene.zoomCurve || [0.65, 0.0, 0.35, 1.0]
    };

    segments.push(transSegment);
    currentTime += transDuration;
    currentCamera = { ...targetCamera };

    // Hold segment for scene
    const holdDuration = typeof scene.holdDuration === 'number' ? scene.holdDuration : 2.5;
    if (holdDuration > 0) {
      const holdSegment = {
        id: `hold-${scene.id || i}`,
        type: 'hold',
        sceneIndex: i,
        sceneId: scene.id,
        startTime: currentTime,
        endTime: currentTime + holdDuration,
        duration: holdDuration,
        camera: { ...currentCamera },
        holdAnim: config.holdAnim || null,
        targetBearing: config.targetBearing !== undefined ? config.targetBearing : currentCamera.bearing,
        sceneData: scene
      };

      segments.push(holdSegment);
      currentTime += holdDuration;

      // Update current camera after hold animation if holdAnim altered it
      if (holdSegment.holdAnim === 'orbit') {
        currentCamera.bearing = -currentCamera.bearing;
      } else if (holdSegment.holdAnim === 'sweep' && config.targetBearing !== undefined) {
        currentCamera.bearing = config.targetBearing;
      }
    }
  }

  // End camera transition or hold if defined
  if (project.endCamera) {
    const endCam = normalizeCamera(project.endCamera);
    const endTransDur = project.endTransitionDuration || 3.0;
    segments.push({
      id: 'end-trans',
      type: 'transition',
      sceneIndex: scenes.length,
      startTime: currentTime,
      endTime: currentTime + endTransDur,
      duration: endTransDur,
      startCamera: { ...currentCamera },
      endCamera: { ...endCam },
      linearMotion: false,
      _zoomDip: 0.0,
      transitionType: 'topDown'
    });
    currentTime += endTransDur;
    currentCamera = { ...endCam };
  }

  if (project.endHoldDuration && project.endHoldDuration > 0) {
    const endHoldDur = project.endHoldDuration;
    segments.push({
      id: 'end-hold',
      type: 'hold',
      sceneIndex: scenes.length,
      startTime: currentTime,
      endTime: currentTime + endHoldDur,
      duration: endHoldDur,
      camera: { ...currentCamera },
      holdAnim: null,
      fadeOutAll: Boolean(project.fadeOutAll)
    });
    currentTime += endHoldDur;
  }

  return {
    totalDuration: currentTime,
    segments
  };
}

/**
 * Finds the active segment and local normalized time t for a given global timestamp T.
 */
export function queryTimelineAtTime(timeline, timeSec) {
  const clampedTime = Math.max(0.0, Math.min(timeline.totalDuration, timeSec));
  const segments = timeline.segments;

  if (segments.length === 0) return null;

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    if (clampedTime >= seg.startTime && clampedTime <= seg.endTime) {
      const localT = seg.duration > 0 ? (clampedTime - seg.startTime) / seg.duration : 1.0;
      return {
        segment: seg,
        localT: Math.max(0.0, Math.min(1.0, localT)),
        globalTime: clampedTime,
        segmentIndex: i
      };
    }
  }

  // Fallback to last segment
  const last = segments[segments.length - 1];
  return {
    segment: last,
    localT: 1.0,
    globalTime: clampedTime,
    segmentIndex: segments.length - 1
  };
}

