"use client";

/**
 * HeroScene — compact rose/crimson Three.js scene.
 * Smaller geometry, reduced particle count, faster animation cadence.
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  EffectComposer,
  RenderPass,
  EffectPass,
  BloomEffect,
  VignetteEffect,
  NoiseEffect,
  BlendFunction,
} from "postprocessing";
import { createNoise3D } from "simplex-noise";
import { isLowEndDevice, prefersReducedMotion } from "@/lib/utils";

export function HeroScene() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reducedMotion = prefersReducedMotion();
    const lowEnd = isLowEndDevice() || window.innerWidth < 768;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0b, 0.015);

    const camera = new THREE.PerspectiveCamera(
      55,
      mount.clientWidth / mount.clientHeight,
      0.1,
      300,
    );
    camera.position.set(0, 0, 50);

    const renderer = new THREE.WebGLRenderer({
      antialias: !lowEnd,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowEnd ? 1 : 1.5));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mount.appendChild(renderer.domElement);

    /* Lights — rose/crimson */
    scene.add(new THREE.AmbientLight(0x110608, 0.6));

    const lightRose = new THREE.PointLight(0xf43f5e, 3.2, 160);
    lightRose.position.set(25, 15, 25);
    scene.add(lightRose);

    const lightCrimson = new THREE.PointLight(0xbe123c, 3.0, 160);
    lightCrimson.position.set(-25, -15, 25);
    scene.add(lightCrimson);

    const lightWhite = new THREE.PointLight(0xffb3c1, 1.1, 180);
    lightWhite.position.set(0, 25, -20);
    scene.add(lightWhite);

    /* Central icosahedron (smaller) */
    const icoDetail = lowEnd ? 1 : 2;
    const icoGeo = new THREE.IcosahedronGeometry(8, icoDetail);
    const positionAttribute = icoGeo.getAttribute("position") as THREE.BufferAttribute;
    const originalPositions = new Float32Array(positionAttribute.array);

    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0xfb7185,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const wireMesh = new THREE.Mesh(icoGeo, wireMaterial);
    scene.add(wireMesh);

    const solidGeo = new THREE.IcosahedronGeometry(7.6, icoDetail);
    const solidMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a0a0b,
      emissive: 0xe11d48,
      emissiveIntensity: 0.5,
      metalness: 0.85,
      roughness: 0.25,
      transparent: true,
      opacity: 0.9,
    });
    const solidMesh = new THREE.Mesh(solidGeo, solidMaterial);
    scene.add(solidMesh);

    /* Orbiting rings (smaller radii) */
    const rings: THREE.Mesh[] = [];
    const ringSpecs = [
      { radius: 13, tube: 0.14, color: 0xf43f5e, speed: { x: 0.003, y: 0.0022, z: 0 } },
      { radius: 17, tube: 0.1, color: 0xfb7185, speed: { x: -0.0024, y: 0.0036, z: 0.0014 } },
      { radius: 21, tube: 0.08, color: 0xfda4af, speed: { x: 0.0014, y: -0.0028, z: 0.0011 } },
    ];
    for (const spec of ringSpecs) {
      const geo = new THREE.TorusGeometry(spec.radius, spec.tube, 16, 100);
      const mat = new THREE.MeshBasicMaterial({
        color: spec.color,
        transparent: true,
        opacity: 0.4,
      });
      const ring = new THREE.Mesh(geo, mat);
      ring.userData.speed = spec.speed;
      ring.rotation.x = Math.random() * Math.PI;
      ring.rotation.y = Math.random() * Math.PI;
      scene.add(ring);
      rings.push(ring);
    }

    /* Floating shapes (smaller count) */
    const shapeCount = lowEnd ? 6 : 12;
    const shapes: THREE.Mesh[] = [];
    const shapeGeos = [
      new THREE.BoxGeometry(0.9, 0.9, 0.9),
      new THREE.OctahedronGeometry(0.7),
      new THREE.TetrahedronGeometry(0.85),
    ];
    const shapeColors = [0xf43f5e, 0xfb7185, 0xfda4af, 0xe11d48];

    for (let i = 0; i < shapeCount; i++) {
      const geo = shapeGeos[i % shapeGeos.length] ?? shapeGeos[0]!;
      const color = shapeColors[i % shapeColors.length] ?? 0xf43f5e;
      const mat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.35,
        metalness: 0.6,
        roughness: 0.4,
        transparent: true,
        opacity: 0.7,
      });
      const m = new THREE.Mesh(geo, mat);
      m.position.set(
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 30 - 8,
      );
      m.userData = {
        baseY: m.position.y,
        baseX: m.position.x,
        amplitude: 1.5 + Math.random() * 2,
        frequency: 0.0008 + Math.random() * 0.0014,
        phase: Math.random() * Math.PI * 2,
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.012,
          y: (Math.random() - 0.5) * 0.012,
        },
      };
      scene.add(m);
      shapes.push(m);
    }

    /* Particles (reduced) */
    const particleCount = lowEnd ? 500 : 1200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const basePositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const r = 28 + Math.random() * 35;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i3] = basePositions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = basePositions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = basePositions[i3 + 2] = r * Math.cos(phi) - 8;
      const deep = Math.random() > 0.55;
      colors[i3] = deep ? 0.88 : 0.98;
      colors[i3 + 1] = deep ? 0.11 : 0.44;
      colors[i3 + 2] = deep ? 0.28 : 0.52;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.12,
      transparent: true,
      opacity: 0.85,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particleMaterial);
    scene.add(particles);

    /* Post-processing — lighter */
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    if (!lowEnd) {
      const bloom = new BloomEffect({
        intensity: 0.7,
        luminanceThreshold: 0.22,
        luminanceSmoothing: 0.4,
        mipmapBlur: true,
      });
      const vignette = new VignetteEffect({ offset: 0.38, darkness: 0.55 });
      const noise = new NoiseEffect({ blendFunction: BlendFunction.OVERLAY, premultiply: true });
      noise.blendMode.opacity.value = 0.14;
      composer.addPass(new EffectPass(camera, bloom, vignette, noise));
    }

    /* Mouse / resize */
    const mouse = new THREE.Vector2(0, 0);
    const targetMouse = new THREE.Vector2(0, 0);
    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      targetMouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      targetMouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    /* Animation */
    const noise3D = createNoise3D();
    let frame = 0;
    let raf = 0;
    const startTime = performance.now();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const elapsed = performance.now() - startTime;

      mouse.x += (targetMouse.x - mouse.x) * 0.08;
      mouse.y += (targetMouse.y - mouse.y) * 0.08;

      if (!reducedMotion) {
        frame++;
        // Slowed cadence: morph every 3rd frame and a smaller noise step
        if (frame % 3 === 0) {
          const t = elapsed * 0.00018;
          const arr = positionAttribute.array as Float32Array;
          for (let i = 0; i < arr.length; i += 3) {
            const ox = originalPositions[i] ?? 0;
            const oy = originalPositions[i + 1] ?? 0;
            const oz = originalPositions[i + 2] ?? 0;
            const len = Math.hypot(ox, oy, oz) || 1;
            const nx = ox / len;
            const ny = oy / len;
            const nz = oz / len;
            const n = noise3D(nx + t, ny + t, nz + t);
            const offset = 1 + n * 0.16;
            arr[i] = ox * offset;
            arr[i + 1] = oy * offset;
            arr[i + 2] = oz * offset;
          }
          positionAttribute.needsUpdate = true;
        }

        wireMesh.rotation.x += 0.0011;
        wireMesh.rotation.y += 0.0014;
        solidMesh.rotation.x -= 0.0009;
        solidMesh.rotation.y -= 0.0011;
        wireMesh.position.x = mouse.x * 0.8;
        wireMesh.position.y = mouse.y * 0.8;
        solidMesh.position.copy(wireMesh.position);

        for (const ring of rings) {
          const s = ring.userData.speed as { x: number; y: number; z: number };
          ring.rotation.x += s.x * 0.4;
          ring.rotation.y += s.y * 0.4;
          ring.rotation.z += s.z * 0.4;
        }

        for (const s of shapes) {
          const u = s.userData as {
            baseY: number;
            baseX: number;
            amplitude: number;
            frequency: number;
            phase: number;
            rotationSpeed: { x: number; y: number };
          };
          s.position.y = u.baseY + Math.sin(elapsed * u.frequency * 0.45 + u.phase) * u.amplitude;
          s.rotation.x += u.rotationSpeed.x * 0.4;
          s.rotation.y += u.rotationSpeed.y * 0.4;
          s.position.x += 0.005;
          if (s.position.x > 40) {
            s.position.x = -40;
            u.baseX = -40;
          }
        }

        lightRose.position.x = Math.sin(elapsed * 0.00028) * 28;
        lightRose.position.z = Math.cos(elapsed * 0.00028) * 28;
        lightCrimson.position.x = Math.cos(elapsed * 0.00024) * 28;
        lightCrimson.position.z = Math.sin(elapsed * 0.00024) * 28;
        lightWhite.position.y = 22 + Math.sin(elapsed * 0.00035) * 8;

        const arr = positions;
        const mx = mouse.x * 22;
        const my = mouse.y * 16;
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          const px = arr[i3] ?? 0;
          const py = arr[i3 + 1] ?? 0;
          const pz = arr[i3 + 2] ?? 0;
          const dx = mx - px;
          const dy = my - py;
          const distSq = dx * dx + dy * dy;
          if (distSq < 300) {
            const force = (300 - distSq) * 0.00004;
            arr[i3] = px + dx * force;
            arr[i3 + 1] = py + dy * force;
          } else {
            const bx = basePositions[i3] ?? 0;
            const by = basePositions[i3 + 1] ?? 0;
            arr[i3] = px + (bx - px) * 0.006;
            arr[i3 + 1] = py + (by - py) * 0.006;
          }
          arr[i3 + 2] = pz + Math.sin(elapsed * 0.00018 + i * 0.12) * 0.012;
        }
        particleGeo.attributes.position!.needsUpdate = true;
        particles.rotation.y += 0.00025;
      }

      composer.render();
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);

      composer.dispose();
      renderer.dispose();

      icoGeo.dispose();
      solidGeo.dispose();
      wireMaterial.dispose();
      solidMaterial.dispose();
      particleGeo.dispose();
      particleMaterial.dispose();

      for (const ring of rings) {
        ring.geometry.dispose();
        (ring.material as THREE.Material).dispose();
      }
      for (const s of shapes) {
        (s.material as THREE.Material).dispose();
      }
      for (const g of shapeGeos) g.dispose();

      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
}
