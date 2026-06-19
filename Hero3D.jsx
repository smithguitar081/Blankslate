// Hero3D.jsx — BLANKSLATE spinning chrome head hero
// Props:
//   title   — page title (rendered as CSS overlay with z-index BELOW canvas)
//   axis    — 'y' | 'x' | 'z' | 'xy' | 'xz' | 'dvd'
//   zoom    — camera z (default 2.2)

const Hero3D = ({ title, axis = 'y', zoom = 2.2 }) => {
  const canvasRef = React.useRef(null);
  const wrapperRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    const W = wrapper.clientWidth || window.innerWidth;
    const H = wrapper.clientHeight || window.innerHeight;

    // ── Renderer ──────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(W, H);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.6;
    renderer.physicallyCorrectLights = true;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);

    // ── Stars ─────────────────────────────────────────────────────
    // Realistic starfield: per-star size, color tint, and twinkle phase
    const STAR_COUNT = 5500;
    const starPositions = new Float32Array(STAR_COUNT * 3);
    const starColors    = new Float32Array(STAR_COUNT * 3);
    const starSizes     = new Float32Array(STAR_COUNT);
    const starPhases    = new Float32Array(STAR_COUNT);

    for (let i = 0; i < STAR_COUNT; i++) {
      const r = 40 + Math.random() * 20;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      starPositions[i*3+0] = r * Math.sin(p) * Math.cos(t);
      starPositions[i*3+1] = r * Math.cos(p);
      starPositions[i*3+2] = r * Math.sin(p) * Math.sin(t);

      // Power-law brightness: lots of dim, few bright
      const brightness = Math.pow(Math.random(), 3); // 0 → 1, skewed to 0
      starSizes[i] = 0.6 + brightness * 4.0;

      // Color tint: 70% neutral white, 15% warm, 15% cool
      const tint = Math.random();
      let r0 = 1, g0 = 1, b0 = 1;
      if (tint < 0.15)      { r0 = 1.00; g0 = 0.86; b0 = 0.70; } // warm yellow
      else if (tint < 0.30) { r0 = 0.78; g0 = 0.86; b0 = 1.00; } // cool blue
      // brighter stars are slightly more saturated
      const sat = 0.5 + brightness * 0.5;
      starColors[i*3+0] = 1 - (1-r0) * sat;
      starColors[i*3+1] = 1 - (1-g0) * sat;
      starColors[i*3+2] = 1 - (1-b0) * sat;

      starPhases[i] = Math.random() * Math.PI * 2;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color',    new THREE.BufferAttribute(starColors, 3));
    starGeo.setAttribute('aSize',    new THREE.BufferAttribute(starSizes, 1));
    starGeo.setAttribute('aPhase',   new THREE.BufferAttribute(starPhases, 1));

    const starMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        attribute vec3  color;
        attribute float aSize;
        attribute float aPhase;
        uniform float uTime;
        varying vec3  vColor;
        varying float vTwinkle;
        void main() {
          vColor = color;
          // subtle twinkle: each star has its own phase + frequency
          float tw = 0.75 + 0.25 * sin(uTime * 1.5 + aPhase);
          vTwinkle = tw;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * tw;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying vec3  vColor;
        varying float vTwinkle;
        void main() {
          // soft round star with bright core
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          float core = smoothstep(0.5, 0.0, d);
          float glow = pow(core, 2.2);
          float a = glow * vTwinkle;
          gl_FragColor = vec4(vColor * (0.6 + 0.4 * core), a);
        }
      `,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(0, 0, zoom);

    // ── Environment ───────────────────────────────────────────────
    const rgbeLoader = new THREE.RGBELoader();
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    rgbeLoader.load(
      'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_08_1k.hdr',
      hdrTex => {
        scene.environment = pmrem.fromEquirectangular(hdrTex).texture;
        hdrTex.dispose(); pmrem.dispose();
      }
    );

    // ── Lights ────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const key = new THREE.DirectionalLight(0xffffff, 2.0);
    key.position.set(2, 3, 4); scene.add(key);
    const fillLight = new THREE.DirectionalLight(0xaaccff, 0.8);
    fillLight.position.set(-3, 1, -2); scene.add(fillLight);
    const rim = new THREE.DirectionalLight(0xffffff, 1.0);
    rim.position.set(0, -2, -3); scene.add(rim);

    // ── Model ─────────────────────────────────────────────────────
    let model = null;

    // DVD bounce state
    let dvdX = 0, dvdY = 0;
    let dvdVX = 0.004, dvdVY = 0.003;  // much slower
    const dvdBounds = { bX: 2.0, bY: 1.2 };

    // Rotation direction — flips on wall hit
    let dvdRotDir = 1;

    const loader = new THREE.GLTFLoader();
    loader.load(
      'assets/head2.glb',
      gltf => {
        model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size   = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        model.position.sub(center);
        // Face orientation: -90° X + 180° Z
        model.rotation.order = 'XYZ';
        model.rotation.x = -Math.PI / 2;
        model.rotation.y = 0;
        model.rotation.z = Math.PI;
        model.scale.setScalar(4.0 / maxDim);
        // Pivot slightly below center for spinning pages
        model.position.y = -0.15;

        const chromeMat = new THREE.MeshStandardMaterial({
          color: 0xffffff, metalness: 1.0, roughness: 0.0,
          envMapIntensity: 1.0, side: THREE.DoubleSide,
        });
        model.traverse(child => {
          if (child.isMesh) { child.material = chromeMat; child.castShadow = false; }
        });
        scene.add(model);

        // Wide bounds — head travels across full hero before bouncing
        const scaledRadius = (4.0 / maxDim) * (maxDim * 0.4);
        const halfH2 = zoom * Math.tan((22.5 * Math.PI) / 180);
        const halfW2 = halfH2 * (W / H);
        dvdBounds.bX = halfW2 + scaledRadius * 0.5;
        dvdBounds.bY = halfH2 + scaledRadius * 0.5;
      },
      null,
      err => console.error('GLTFLoader error:', err)
    );

    // ── Animate ───────────────────────────────────────────────────
    let animId;
    const clock = new THREE.Clock();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      starMat.uniforms.uTime.value = t;
      // slow celestial drift on two axes for parallax-y feel
      starField.rotation.y = t * 0.012;
      starField.rotation.x = t * 0.004;
      if (model) {
        if (axis === 'y')  { model.rotation.y += 0.008; }
        if (axis === 'x')  { model.rotation.z += 0.008; }
        if (axis === 'z')  { model.rotation.z += 0.008; }
        if (axis === 'xy') { model.rotation.z += 0.004; model.rotation.y += 0.007; }
        if (axis === 'xz') { model.rotation.z += 0.005; model.rotation.x += 0.006; }
        if (axis === 'dvd') {
          dvdX += dvdVX; dvdY += dvdVY;
          const { bX, bY } = dvdBounds;
          let bounced = false;
          if (dvdX >  bX) { dvdX =  bX; dvdVX *= -1; bounced = true; }
          if (dvdX < -bX) { dvdX = -bX; dvdVX *= -1; bounced = true; }
          if (dvdY >  bY) { dvdY =  bY; dvdVY *= -1; bounced = true; }
          if (dvdY < -bY) { dvdY = -bY; dvdVY *= -1; bounced = true; }
          if (bounced) dvdRotDir *= -1;  // flip rotation direction on hit
          model.position.x = dvdX;
          model.position.y = dvdY - 0.15;
          model.rotation.x += 0.006 * dvdRotDir;
          model.rotation.y += 0.004 * dvdRotDir;
        }
      }
      renderer.render(scene, camera);
    };
    animate();

    // ── Resize ────────────────────────────────────────────────────
    const onResize = () => {
      const w = wrapper.clientWidth, h = wrapper.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: '#000' }}>
      {/* Canvas fills the background */}
      <canvas ref={canvasRef} style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        display: 'block', zIndex: 0,
      }} />
      {/* Title on top of canvas */}
      {title && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          pointerEvents: 'none',
        }}>
          <h1 style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: 'clamp(4rem, 10vw, 9rem)', fontWeight: 400, color: '#fff',
            letterSpacing: '-1px', textAlign: 'center', margin: 0, lineHeight: 1,
            textShadow: '0 2px 40px rgba(0,0,0,0.5)',
          }}>{title}</h1>
        </div>
      )}
    </div>
  );
};

Object.assign(window, { Hero3D });
