/**
 * Country Fill WebGL Shader Layer with Multi-Mode GLSL Masks.
 * Reconstructed from Contourframe production code (_0x2435 - _0x2590).
 * Implements MapLibre GL JS CustomLayerInterface.
 */

export const MASK_MODES = {
  fade: 0,
  none: 0,
  wipe: 1,
  split: 2,
  circularWipe: 3,
  iris: 4,
  diamond: 5,
  noiseWipe: 6,
  noiseCircular: 7
};

const VERTEX_SHADER_SOURCE = `
attribute vec2 a_pos;
attribute vec2 a_texCoord;
varying vec2 v_texCoord;
varying vec2 v_pos;
uniform mat4 u_matrix;

void main() {
  v_texCoord = a_texCoord;
  v_pos = a_pos;
  gl_Position = u_matrix * vec4(a_pos, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SOURCE = `
precision highp float;

varying vec2 v_texCoord;
varying vec2 v_pos;

uniform vec2 u_dims;
uniform float u_opacity;
uniform int u_maskMode;
uniform int u_maskActive;
uniform float u_progress;
uniform int u_invert;
uniform vec2 u_center;
uniform float u_angle;
uniform vec2 u_wipe;
uniform float u_maxR;
uniform float u_diamondMax;
uniform vec4 u_color;
uniform vec4 u_oldColor;
uniform int u_dual;
uniform float u_crossfade;

// FBM Procedural Noise (No external texture lookup)
float _nwHash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float _nwNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = _nwHash(i);
  float b = _nwHash(i + vec2(1.0, 0.0));
  float c = _nwHash(i + vec2(0.0, 1.0));
  float d = _nwHash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float _nwFbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int k = 0; k < 3; k++) {
    v += a * _nwNoise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v / 0.875;
}

float aaStep(float d) {
  return clamp(d + 0.5, 0.0, 1.0);
}

void main() {
  if (u_maskActive == 0) {
    discard;
  }

  vec2 screenPos = gl_FragCoord.xy;
  // Account for flipped Y or screen coordinates
  screenPos.y = u_dims.y - screenPos.y;

  float progress = clamp(u_progress, 0.0, 1.0);
  float mask = 1.0;

  // Evaluate Mask Mode
  if (u_maskMode == 0) {
    // 0: Fade
    mask = progress;
  } else if (u_maskMode == 1) {
    // 1: Wipe
    vec2 dir = vec2(cos(u_angle), sin(u_angle));
    vec2 rel = screenPos - u_center;
    float proj = dot(rel, dir);
    float span = max(1.0, u_wipe.x);
    float front = -span + 2.0 * span * progress;
    mask = aaStep(front - proj);
  } else if (u_maskMode == 2) {
    // 2: Split (Bilateral expansion from epicenter)
    vec2 dir = vec2(cos(u_angle), sin(u_angle));
    vec2 rel = screenPos - u_center;
    float proj = abs(dot(rel, dir));
    float span = max(1.0, u_wipe.x);
    float front = span * progress;
    mask = aaStep(front - proj);
  } else if (u_maskMode == 3) {
    // 3: Circular Wipe
    float dist = length(screenPos - u_center);
    float radius = u_maxR * progress;
    mask = aaStep(radius - dist);
  } else if (u_maskMode == 4) {
    // 4: Iris
    float dist = length(screenPos - u_center);
    float radius = u_maxR * (1.0 - progress);
    mask = aaStep(dist - radius);
  } else if (u_maskMode == 5) {
    // 5: Diamond
    vec2 rel = abs(screenPos - u_center);
    float manhattan = rel.x + rel.y;
    float maxD = u_diamondMax * progress;
    mask = aaStep(maxD - manhattan);
  } else if (u_maskMode == 6) {
    // 6: Noise Wipe
    vec2 dir = vec2(cos(u_angle), sin(u_angle));
    vec2 rel = screenPos - u_center;
    float proj = dot(rel, dir);
    float span = max(1.0, u_wipe.x);
    float noise = (_nwFbm(screenPos * 0.015) - 0.5) * 60.0;
    float front = -span + (2.0 * span + 60.0) * progress;
    mask = aaStep((front + noise) - proj);
  } else if (u_maskMode == 7) {
    // 7: Noise Circular
    float dist = length(screenPos - u_center);
    float noise = (_nwFbm(screenPos * 0.02) - 0.5) * 50.0;
    float radius = (u_maxR + 50.0) * progress;
    mask = aaStep((radius + noise) - dist);
  }

  if (u_invert == 1) {
    mask = 1.0 - mask;
  }

  vec4 finalColor = u_color;
  if (u_dual == 1) {
    finalColor = mix(u_oldColor, u_color, u_crossfade);
  }

  gl_FragColor = finalColor * (mask * u_opacity);
}
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const err = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compilation error: ${err}`);
  }
  return shader;
}

function parseHexColor(hex, alpha = 1.0) {
  if (!hex || typeof hex !== 'string') return [0.8, 0.2, 0.2, alpha];
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const num = parseInt(h, 16);
  return [
    ((num >> 16) & 255) / 255.0,
    ((num >> 8) & 255) / 255.0,
    (num & 255) / 255.0,
    alpha
  ];
}

/**
 * Creates MapLibre Custom Layer for Country Masked Fill Rendering.
 */
export function createFillMaskLayer(options = {}) {
  let program = null;
  let buffer = null;
  let uniformLocations = {};

  return {
    id: options.id || 'amm-country-fill-layer',
    type: 'custom',
    renderingMode: '2d',

    // Dynamic animation parameters updated by timeline runner
    state: {
      maskMode: 0,
      maskActive: 0,
      progress: 0.0,
      invert: 0,
      center: [960, 540],
      angle: 0.0,
      wipe: [500, 500],
      maxR: 800.0,
      diamondMax: 1000.0,
      color: [0.85, 0.2, 0.2, 0.75],
      oldColor: [0.2, 0.4, 0.8, 0.75],
      dual: 0,
      crossfade: 0.0,
      opacity: 1.0,
      geometryVertices: null // Float32Array of Mercator coordinates
    },

    setParams(params) {
      if (!params) return;
      if (params.animType !== undefined) {
        this.state.maskMode = MASK_MODES[params.animType] !== undefined ? MASK_MODES[params.animType] : 0;
      }
      if (params.progress !== undefined) this.state.progress = params.progress;
      if (params.maskActive !== undefined) this.state.maskActive = params.maskActive ? 1 : 0;
      if (params.center !== undefined) this.state.center = params.center;
      if (params.angle !== undefined) this.state.angle = params.angle;
      if (params.wipe !== undefined) this.state.wipe = params.wipe;
      if (params.maxR !== undefined) this.state.maxR = params.maxR;
      if (params.diamondMax !== undefined) this.state.diamondMax = params.diamondMax;
      if (params.color !== undefined) {
        this.state.color = typeof params.color === 'string' ? parseHexColor(params.color, params.opacity ?? 0.75) : params.color;
      }
      if (params.oldColor !== undefined) {
        this.state.oldColor = typeof params.oldColor === 'string' ? parseHexColor(params.oldColor, params.opacity ?? 0.75) : params.oldColor;
      }
      if (params.dual !== undefined) this.state.dual = params.dual ? 1 : 0;
      if (params.crossfade !== undefined) this.state.crossfade = params.crossfade;
      if (params.opacity !== undefined) this.state.opacity = params.opacity;
    },

    onAdd(map, gl) {
      this.map = map;
      const vert = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
      const frag = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
      program = gl.createProgram();
      gl.attachShader(program, vert);
      gl.attachShader(program, frag);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(`Program link failed: ${gl.getProgramInfoLog(program)}`);
      }

      uniformLocations = {
        u_matrix: gl.getUniformLocation(program, 'u_matrix'),
        u_dims: gl.getUniformLocation(program, 'u_dims'),
        u_opacity: gl.getUniformLocation(program, 'u_opacity'),
        u_maskMode: gl.getUniformLocation(program, 'u_maskMode'),
        u_maskActive: gl.getUniformLocation(program, 'u_maskActive'),
        u_progress: gl.getUniformLocation(program, 'u_progress'),
        u_invert: gl.getUniformLocation(program, 'u_invert'),
        u_center: gl.getUniformLocation(program, 'u_center'),
        u_angle: gl.getUniformLocation(program, 'u_angle'),
        u_wipe: gl.getUniformLocation(program, 'u_wipe'),
        u_maxR: gl.getUniformLocation(program, 'u_maxR'),
        u_diamondMax: gl.getUniformLocation(program, 'u_diamondMax'),
        u_color: gl.getUniformLocation(program, 'u_color'),
        u_oldColor: gl.getUniformLocation(program, 'u_oldColor'),
        u_dual: gl.getUniformLocation(program, 'u_dual'),
        u_crossfade: gl.getUniformLocation(program, 'u_crossfade')
      };

      // Full screen quad default buffer (mercator [0,0] to [1,1])
      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      const quad = new Float32Array([
        0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0,
        0.0, 1.0,
        1.0, 0.0,
        1.0, 1.0
      ]);
      gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);
    },

    render(gl, matrix) {
      if (!program || !this.state.maskActive) return;
      gl.useProgram(program);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      // Uniforms
      gl.uniformMatrix4fv(uniformLocations.u_matrix, false, matrix);
      const w = gl.canvas.width;
      const h = gl.canvas.height;
      gl.uniform2f(uniformLocations.u_dims, w, h);
      gl.uniform1f(uniformLocations.u_opacity, this.state.opacity);
      gl.uniform1i(uniformLocations.u_maskMode, this.state.maskMode);
      gl.uniform1i(uniformLocations.u_maskActive, this.state.maskActive);
      gl.uniform1f(uniformLocations.u_progress, this.state.progress);
      gl.uniform1i(uniformLocations.u_invert, this.state.invert);
      gl.uniform2f(uniformLocations.u_center, this.state.center[0], this.state.center[1]);
      gl.uniform1f(uniformLocations.u_angle, this.state.angle);
      gl.uniform2f(uniformLocations.u_wipe, this.state.wipe[0], this.state.wipe[1]);
      gl.uniform1f(uniformLocations.u_maxR, this.state.maxR);
      gl.uniform1f(uniformLocations.u_diamondMax, this.state.diamondMax);
      gl.uniform4fv(uniformLocations.u_color, this.state.color);
      gl.uniform4fv(uniformLocations.u_oldColor, this.state.oldColor);
      gl.uniform1i(uniformLocations.u_dual, this.state.dual);
      gl.uniform1f(uniformLocations.u_crossfade, this.state.crossfade);

      const aPos = gl.getAttribLocation(program, 'a_pos');
      gl.enableVertexAttribArray(aPos);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    },

    onRemove(map, gl) {
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
    }
  };
}

