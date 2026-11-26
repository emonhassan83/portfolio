"use client";

import { useEffect, useRef } from "react";

const PALETTES = {
  dark: { body: "#262819", screen: "#101108", accent: "#c5f738", trim: "#3c3e2e", dust: "#c5f738", dustOpacity: 0.4 },
  light: { body: "#eceadb", screen: "#f6f4e8", accent: "#5e7d0c", trim: "#b9b7a4", dust: "#7d8a52", dustOpacity: 0.28 },
};

const QUIPS = ["beep boop", "sys.online ✓", "scroll on ↓", "200 ok", "queue drained ✓", "p95 looks fine"];

const CAMERA_Z = 10;
const FOV = 45;
const IDLE_SLEEP_MS = 25000;
const FOLLOW_WINDOW_MS = 3500;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
// Frame-rate independent easing: the same feel at 60, 120 or 144 Hz
const damp = (a, b, lambda, dt) => a + (b - a) * (1 - Math.exp(-lambda * dt));

/**
 * Critically damped spring towards `target` (velocity is carried in `vel`, so the
 * motion never snaps when the target jumps). `time` is roughly the seconds to arrive.
 */
function springTo(pos, vel, target, time, dt, axis) {
  const omega = 2 / time;
  const x = omega * dt;
  const decay = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const offset = pos[axis] - target[axis];
  const temp = (vel[axis] + omega * offset) * dt;
  vel[axis] = (vel[axis] - omega * temp) * decay;
  pos[axis] = target[axis] + (offset + temp) * decay;
}
const currentTheme = () => (document.documentElement.getAttribute("data-bk-theme") === "light" ? "light" : "dark");

/** Builds the scene and starts the loop. Returns a cleanup function. */
function start(THREE, RoundedBoxGeometry, host, bubble, calm) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
  } catch {
    return () => {}; // no WebGL: the page works without the mascot
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  host.prepend(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
  camera.position.set(0, 0, CAMERA_Z);

  scene.add(new THREE.AmbientLight(0xffffff, 1.1));
  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(4, 6, 8);
  const fill = new THREE.DirectionalLight(0xffffff, 0.4);
  fill.position.set(-5, -2, 6);
  scene.add(key, fill);

  // Materials (colours are filled in by applyPalette)
  const mat = {
    body: new THREE.MeshStandardMaterial({ metalness: 0.35, roughness: 0.55 }),
    screen: new THREE.MeshStandardMaterial({ metalness: 0.1, roughness: 0.4 }),
    trim: new THREE.MeshStandardMaterial({ metalness: 0.4, roughness: 0.5 }),
    glow: new THREE.MeshBasicMaterial({ toneMapped: false }),
    mouth: new THREE.MeshBasicMaterial({ toneMapped: false, transparent: true, opacity: 0.8 }),
    bulb: new THREE.MeshStandardMaterial({ emissiveIntensity: 1.6, toneMapped: false }),
    flame: new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.35, side: THREE.DoubleSide }),
    dust: new THREE.PointsMaterial({ size: 0.055, sizeAttenuation: true, transparent: true }),
  };
  const thruster = new THREE.PointLight(0xffffff, 1.8, 3);

  const applyPalette = () => {
    const p = PALETTES[currentTheme()];
    mat.body.color.set(p.body);
    mat.screen.color.set(p.screen);
    mat.trim.color.set(p.trim);
    mat.glow.color.set(p.accent);
    mat.mouth.color.set(p.accent);
    mat.bulb.color.set(p.accent);
    mat.bulb.emissive.set(p.accent);
    mat.flame.color.set(p.accent);
    mat.dust.color.set(p.dust);
    mat.dust.opacity = p.dustOpacity;
    thruster.color.set(p.accent);
  };
  applyPalette();

  const geometries = [];
  const mesh = (geometry, material, x = 0, y = 0, z = 0) => {
    geometries.push(geometry);
    const m = new THREE.Mesh(geometry, material);
    m.position.set(x, y, z);
    return m;
  };
  const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
  const rounded = (w, h, d, r) => new RoundedBoxGeometry(w, h, d, 3, r);

  // Robot: root (position) > sway (bob + lean) > head (looks at the pointer) + body parts
  const root = new THREE.Group();
  root.scale.setScalar(0.62);
  const sway = new THREE.Group();
  const head = new THREE.Group();

  const eyeL = mesh(box(0.15, 0.2, 0.02), mat.glow, -0.2, 0.08, 0.38);
  const eyeR = mesh(box(0.15, 0.2, 0.02), mat.glow, 0.2, 0.08, 0.38);
  const bulb = mesh(new THREE.SphereGeometry(0.06, 16, 16), mat.bulb, 0, 0.84, 0);
  head.add(
    mesh(rounded(1.2, 0.9, 0.65, 0.09), mat.body),
    mesh(rounded(0.95, 0.62, 0.08, 0.04), mat.screen, 0, 0.02, 0.32),
    eyeL,
    eyeR,
    mesh(box(0.28, 0.035, 0.02), mat.mouth, 0, -0.16, 0.38),
    mesh(box(0.1, 0.34, 0.34), mat.trim, -0.66, 0, 0),
    mesh(box(0.1, 0.34, 0.34), mat.trim, 0.66, 0, 0),
    mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.34), mat.trim, 0, 0.62, 0),
    bulb
  );

  const legL = mesh(box(0.09, 0.26, 0.09), mat.trim, -0.16, -1.08, 0);
  const legR = mesh(box(0.09, 0.26, 0.09), mat.trim, 0.16, -1.08, 0);
  const flame = mesh(new THREE.ConeGeometry(0.16, 0.42, 16, 1, true), mat.flame, 0, -1.05, 0);
  flame.rotation.x = Math.PI;
  thruster.position.set(0, -1.1, 0.4);

  sway.add(
    head,
    mesh(new THREE.CylinderGeometry(0.09, 0.12, 0.18), mat.trim, 0, -0.55, 0),
    mesh(rounded(0.6, 0.34, 0.42, 0.06), mat.body, 0, -0.8, 0),
    legL,
    legR,
    flame,
    thruster
  );
  root.add(sway);
  scene.add(root);

  // Background dust
  const DUST = 90;
  const dustPos = new Float32Array(DUST * 3);
  for (let i = 0; i < DUST; i++) {
    dustPos[i * 3] = (Math.random() * 2 - 1) * 12;
    dustPos[i * 3 + 1] = (Math.random() * 2 - 1) * 8;
    dustPos[i * 3 + 2] = -3.5 - Math.random() * 6;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  geometries.push(dustGeo);
  const dust = new THREE.Points(dustGeo, mat.dust);
  scene.add(dust);

  // Visible world size at z = 0
  const view = { w: 1, h: 2 * CAMERA_Z * Math.tan((FOV * Math.PI) / 360) };
  const resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    view.w = view.h * camera.aspect;
  };
  resize();

  const s = {
    pos: new THREE.Vector3(view.w / 2 + 3, view.h / 2 + 2, 0), // flies in from off-screen
    vel: new THREE.Vector3(),
    target: new THREE.Vector3(),
    look: new THREE.Vector3(0, 0, 8),
    pointer: { x: 0, y: 0, t: 0 }, // normalised -1..1, y up
    pointerDist: 1,
    approach: 0,
    side: 1,
    mood: "normal", // normal | startled | sleepy
    lastActivity: performance.now(),
    retargetAt: 0,
    blinkAt: 2.5,
    blinkUntil: 0,
    startledUntil: 0,
    startleReadyAt: 0,
    greeted: false,
    said: null,
    sayUntil: 0,
    quipAt: 18,
  };

  const say = (text) => {
    if (s.said === text) return;
    s.said = text;
    if (text) bubble.textContent = text;
    bubble.dataset.show = text ? "true" : "false";
  };
  const setMood = (mood) => {
    s.mood = mood;
    bubble.dataset.mood = mood;
  };

  // A resting spot away from the middle of the screen, where the content is
  const wander = () => {
    for (let i = 0; i < 8; i++) {
      const x = (Math.random() * 2 - 1) * (view.w / 2 - 1.2);
      const y = (Math.random() * 2 - 1) * (view.h / 2 - 1.2);
      if (Math.abs(x) > view.w * 0.18 || Math.abs(y) > view.h * 0.26) return s.target.set(x, y, 0);
    }
    return s.target.set(view.w / 2 - 1.4, view.h / 2 - 1.5, 0);
  };
  wander();

  const onMove = (e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -((e.clientY / window.innerHeight) * 2) + 1;
    const now = performance.now();
    const rx = s.pos.x / (view.w / 2);
    const ry = s.pos.y / (view.h / 2);
    const dist = Math.hypot(x - rx, y - ry);
    if (s.pointer.t) {
      const before = Math.hypot(s.pointer.x - rx, s.pointer.y - ry);
      s.approach = ((before - dist) / Math.max(now - s.pointer.t, 1)) * 1000;
    }
    s.pointerDist = dist;
    s.pointer = { x, y, t: now };
    s.lastActivity = now;
  };
  const onActivity = () => {
    s.lastActivity = performance.now();
  };

  let last = performance.now();
  let t = 0; // seconds of animation time (excludes time spent in a hidden tab)
  const anchor = new THREE.Vector3();
  const away = new THREE.Vector3();
  const lookGoal = new THREE.Vector3();
  let raf = 0;

  const frame = () => {
    raf = requestAnimationFrame(frame);
    const now = performance.now();
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    t += dt;
    const hw = view.w / 2;
    const hh = view.h / 2;
    const px = s.pointer.x * hw;
    const py = s.pointer.y * hh;

    // Mood: fall asleep in the corner after a while without input
    const idle = now - s.lastActivity;
    if (s.mood !== "startled") {
      if (idle > IDLE_SLEEP_MS && s.mood !== "sleepy") {
        setMood("sleepy");
        say("zzz…");
        s.sayUntil = Infinity;
        s.target.set(-hw + 1.1, -hh + 1, 0);
      } else if (idle < IDLE_SLEEP_MS && s.mood === "sleepy") {
        setMood("normal");
        say(null);
        s.sayUntil = 0;
        s.retargetAt = 0;
      }
    }

    // Startle: the pointer rushes at the robot, so it jumps away
    if (!calm && s.mood === "normal" && s.pointerDist < 0.3 && s.approach > 2.4 && t > s.startleReadyAt) {
      setMood("startled");
      s.startledUntil = t + 0.9;
      s.startleReadyAt = t + 5;
      say("!");
      s.sayUntil = t + 0.9;
      away.set(s.pos.x - px, s.pos.y - py, 0).normalize().multiplyScalar(2.4);
      s.target.copy(s.pos).add(away);
      s.target.x = clamp(s.target.x, -hw + 1, hw - 1);
      s.target.y = clamp(s.target.y, -hh + 1.1, hh - 1.1);
    }
    if (s.mood === "startled" && t > s.startledUntil) setMood("normal");

    // Follow the pointer while it moves, hovering beside it; otherwise drift between resting spots
    const following = s.pointer.t > 0 && now - s.pointer.t < FOLLOW_WINDOW_MS;
    if (s.mood === "normal") {
      if (following) {
        if (Math.abs(px) > 1.6) s.side = px > 0 ? -1 : 1; // stay on the side nearer the centre
        s.target.set(clamp(px + 1.7 * s.side, -hw + 0.9, hw - 0.9), clamp(py + 0.55, -hh + 1, hh - 1), 0);
        s.retargetAt = t + 4;
      } else if (!calm && (t > s.retargetAt || s.pos.distanceTo(s.target) < 0.25)) {
        wander();
        s.retargetAt = t + 6 + Math.random() * 6;
      }
    }

    // Spring to the target: eases in as well as out, and keeps its momentum when the target moves
    const settle = s.mood === "startled" ? 0.28 : s.mood === "sleepy" ? 1.6 : following ? (calm ? 0.7 : 0.45) : 1.2;
    springTo(s.pos, s.vel, s.target, settle, dt, "x");
    springTo(s.pos, s.vel, s.target, settle, dt, "y");
    root.position.copy(s.pos);

    // Bob, and lean into the direction of travel
    const sleepy = s.mood === "sleepy";
    sway.position.y = calm ? 0 : Math.sin(t * 2.1) * (sleepy ? 0.03 : 0.07);
    sway.rotation.z = damp(sway.rotation.z, clamp(-0.09 * s.vel.x, -0.42, 0.42) + (sleepy ? 0.22 : 0), 6, dt);
    sway.rotation.x = damp(sway.rotation.x, clamp(0.055 * s.vel.y, -0.26, 0.26), 6, dt);

    // Head tracks the pointer (looks down when asleep)
    if (sleepy) lookGoal.set(s.pos.x, s.pos.y - 4, 6);
    else lookGoal.set(px, py, 6);
    s.look.lerp(lookGoal, 1 - Math.exp(-dt * 9));
    head.lookAt(s.look);

    // Eyes: blink, squint when sleepy, widen when startled
    let eye = 1;
    if (sleepy) eye = 0.28;
    else {
      if (t > s.blinkAt) {
        s.blinkUntil = t + 0.13;
        s.blinkAt = t + 2.2 + Math.random() * 3.2;
      }
      if (t < s.blinkUntil) eye = 0.08;
      if (s.mood === "startled") eye = 1.45;
    }
    eyeL.scale.y = damp(eyeL.scale.y, eye, 24, dt);
    eyeR.scale.y = eyeL.scale.y;

    const swing = Math.sin(t * 2.6) * 0.12 - clamp(0.06 * s.vel.x, -0.3, 0.3);
    legL.rotation.x = damp(legL.rotation.x, swing, 10, dt);
    legR.rotation.x = -0.8 * legL.rotation.x;
    mat.bulb.emissiveIntensity = sleepy ? 0.4 : 1.6 + Math.sin(t * 4) * 0.8;
    const flicker = 0.78 + Math.sin(t * 14) * 0.12 + Math.sin(t * 23.7) * 0.06;
    flame.scale.set(flicker, flicker * (sleepy ? 0.5 : 1), flicker);

    // Speech
    if (!s.greeted && t > 1.2) {
      s.greeted = true;
      say("hi.");
      s.sayUntil = t + 3.5;
      s.quipAt = t + 16 + Math.random() * 14;
    }
    if (s.mood === "normal" && s.greeted) {
      if (s.said && t > s.sayUntil) say(null);
      if (!s.said && t > s.quipAt) {
        say(QUIPS[Math.floor(Math.random() * QUIPS.length)]);
        s.sayUntil = t + 3;
        s.quipAt = t + 16 + Math.random() * 18;
      }
    }
    if (s.said) {
      anchor.set(s.pos.x + 0.75 * 0.62, s.pos.y + 1.15 * 0.62, 0).project(camera);
      const bx = (anchor.x * 0.5 + 0.5) * window.innerWidth;
      const by = (-anchor.y * 0.5 + 0.5) * window.innerHeight;
      bubble.style.transform = `translate3d(${bx.toFixed(1)}px, ${by.toFixed(1)}px, 0) translate(-50%, -50%)`;
    }

    if (!calm) {
      dust.rotation.z = t * 0.008;
      dust.position.x = damp(dust.position.x, s.pointer.x * 1.1, 2, dt);
      dust.position.y = damp(dust.position.y, s.pointer.y * 0.7, 2, dt);
    }

    renderer.render(scene, camera);
  };

  const onVisibility = () => {
    cancelAnimationFrame(raf);
    if (!document.hidden) {
      last = performance.now(); // discard the time spent hidden
      raf = requestAnimationFrame(frame);
    }
  };

  const themeWatch = new MutationObserver(applyPalette);
  themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-bk-theme"] });

  window.addEventListener("mousemove", onMove, { passive: true });
  window.addEventListener("wheel", onActivity, { passive: true });
  window.addEventListener("keydown", onActivity);
  window.addEventListener("click", onActivity);
  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", onVisibility);
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    themeWatch.disconnect();
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("wheel", onActivity);
    window.removeEventListener("keydown", onActivity);
    window.removeEventListener("click", onActivity);
    window.removeEventListener("resize", resize);
    document.removeEventListener("visibilitychange", onVisibility);
    geometries.forEach((g) => g.dispose());
    Object.values(mat).forEach((m) => m.dispose());
    renderer.dispose();
    renderer.domElement.remove();
    say(null);
  };
}

/**
 * Small 3D robot that trails the pointer: it hovers beside it, looks at it, blinks,
 * jumps when the pointer rushes it and dozes off when the page is idle.
 * three.js is loaded on demand, on desktop pointers only. With reduced motion it
 * stays but moves gently (no wandering, bobbing or startle).
 */
export default function Mascot() {
  const host = useRef(null);
  const bubble = useRef(null);

  useEffect(() => {
    if (!window.matchMedia("(min-width: 768px) and (hover: hover) and (pointer: fine)").matches) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cancelled = false;
    let stop = () => {};

    Promise.all([import("three"), import("three/examples/jsm/geometries/RoundedBoxGeometry.js")])
      .then(([THREE, { RoundedBoxGeometry }]) => {
        if (cancelled || !host.current) return;
        stop = start(THREE, RoundedBoxGeometry, host.current, bubble.current, calm);
      })
      .catch(() => {
        /* chunk failed to load: skip the mascot */
      });

    return () => {
      cancelled = true;
      stop();
    };
  }, []);

  return (
    <div ref={host} className="bk-mascot" aria-hidden="true">
      <span ref={bubble} className="bk-mascot-say" data-show="false" data-mood="normal" />
    </div>
  );
}
