import { useRef, useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, useGLTF, useAnimations, Hud, PerspectiveCamera } from '@react-three/drei';
import { ChevronDown } from 'lucide-react';
import * as THREE from 'three';

interface HomeProps {
  onOpenLogin: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

// --- Soldier Component ---
const Soldier = ({ active, onMove }: { active: boolean; onMove: (pos: THREE.Vector3) => void }) => {
  const group = useRef<THREE.Group>(null);
  const { viewport, pointer } = useThree();
  const [isWalking, setIsWalking] = useState(false);

  const { scene, animations } = useGLTF('/greek_warrior_-_atrius.glb');
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (!actions) return;
    const walkAction = actions['Walk'] || actions['walk'] || actions['run'] || actions['Run'] || Object.values(actions)[0];
    const idleAction = actions['Idle'] || actions['idle'] || Object.values(actions)[1];

    if (active && isWalking) {
      idleAction?.fadeOut(0.2);
      walkAction?.reset().fadeIn(0.2).play();
    } else {
      walkAction?.fadeOut(0.2);
      idleAction?.reset().fadeIn(0.2).play();
    }
  }, [isWalking, actions, active]);

  useFrame(({ clock }) => {
    if (!group.current) return;

    if (active) {
      const targetX = group.current.position.x + pointer.x * (viewport.width / 2);
      const targetZ = group.current.position.z - pointer.y * (viewport.height / 2);

      const currentPos = group.current.position;
      const dx = targetX - currentPos.x;
      const dz = targetZ - currentPos.z;
      const distance = Math.sqrt(dx * dx + dz * dz);

      if (distance > 0.8) {
        if (!isWalking) setIsWalking(true);
        currentPos.x += (dx / distance) * 0.1;
        currentPos.z += (dz / distance) * 0.1;

        const targetAngle = Math.atan2(dx, dz);
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetAngle, 0.1);

        if (animations.length === 0) {
          group.current.position.y = 1.0 + Math.abs(Math.sin(clock.elapsedTime * 10)) * 0.1;
        }
      } else {
        if (isWalking) setIsWalking(false);
        if (animations.length === 0) {
          group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, 1.0, 0.1);
        }
      }
    }

    onMove(group.current.position);
  });

  return (
    <group ref={group}>
      <primitive object={scene} scale={3.5} position-y={1.3} />
    </group>
  );
};

// --- Snow Components ---
const SnowField = ({ soldierPos }: { soldierPos: THREE.Vector3 }) => {
  const particleCount = 3000;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 1] = Math.random() * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return pos;
  }, []);
  const pointsRef = useRef<THREE.Points>(null);
  useFrame(() => {
    if (!pointsRef.current) return;
    pointsRef.current.position.set(soldierPos.x, 0, soldierPos.z);
    const attr = pointsRef.current.geometry.attributes.position;
    for (let i = 0; i < particleCount; i++) {
      let y = attr.getY(i);
      y -= 0.05;
      if (y < 0) y = 20;
      attr.setY(i, y);
    }
    attr.needsUpdate = true;
  });
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="white" size={0.08} transparent opacity={0.3} />
    </points>
  );
};

const Ground = ({ soldierPos }: { soldierPos: THREE.Vector3 }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const shaderArgs = useMemo(() => ({
    uniforms: {
      uColor: { value: new THREE.Color('#ffffff') },
      uSoldierPos: { value: new THREE.Vector3(0, 0, 0) },
      uRadius: { value: 10.0 },
      uFeather: { value: 6.0 }
    },
    vertexShader: `varying vec3 vWorldPosition; void main() { vec4 worldPosition = modelMatrix * vec4(position, 1.0); vWorldPosition = worldPosition.xyz; gl_Position = projectionMatrix * viewMatrix * worldPosition; }`,
    fragmentShader: `uniform vec3 uColor; uniform vec3 uSoldierPos; uniform float uRadius; uniform float uFeather; varying vec3 vWorldPosition; void main() { float dist = distance(vWorldPosition.xz, uSoldierPos.xz); float alpha = 1.0 - smoothstep(uRadius - uFeather, uRadius, dist); gl_FragColor = vec4(uColor, alpha); }`
  }), []);
  useFrame(() => {
    if (meshRef.current) (meshRef.current.material as THREE.ShaderMaterial).uniforms.uSoldierPos.value.copy(soldierPos);
  });
  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[4000, 4000]} />
      <shaderMaterial args={[shaderArgs]} transparent={true} depthWrite={false} />
    </mesh>
  );
};

const SnowPiles = ({ soldierPos }: { soldierPos: THREE.Vector3 }) => {
  const range = 40;
  const pileOffsets = useMemo(() => Array.from({ length: 300 }).map(() => ({ x: Math.random() * range, z: Math.random() * range, scale: Math.random() * 0.12 + 0.04 })), []);
  const clumpShaderArgs = useMemo(() => ({
    uniforms: { uSoldierPos: { value: new THREE.Vector3(0, 0, 0) }, uRadius: { value: 10.0 }, uFeather: { value: 6.0 } },
    vertexShader: `varying vec3 vWorldPosition; void main() { vec4 worldPosition = modelMatrix * vec4(position, 1.0); vWorldPosition = worldPosition.xyz; gl_Position = projectionMatrix * viewMatrix * worldPosition; }`,
    fragmentShader: `uniform vec3 uSoldierPos; uniform float uRadius; uniform float uFeather; varying vec3 vWorldPosition; void main() { float dist = distance(vWorldPosition.xz, uSoldierPos.xz); float alpha = 1.0 - smoothstep(uRadius - uFeather, uRadius, dist); if (alpha < 0.01) discard; gl_FragColor = vec4(1.0, 1.0, 1.0, alpha); }`
  }), []);
  useFrame(() => { clumpShaderArgs.uniforms.uSoldierPos.value.copy(soldierPos); });
  return (
    <group>
      {pileOffsets.map((offset, i) => {
        const x = ((offset.x - soldierPos.x % range + range) % range) - range / 2 + soldierPos.x;
        const z = ((offset.z - soldierPos.z % range + range) % range) - range / 2 + soldierPos.z;
        return (
          <mesh key={i} position={[x, 0.2, z]} scale={offset.scale}>
            <sphereGeometry args={[1, 8, 8]} />
            <shaderMaterial args={[clumpShaderArgs]} transparent={true} />
          </mesh>
        );
      })}
    </group>
  );
};

// --- Column Component ---
const Column = ({ position, opacity }: { position: [number, number, number], opacity: number }) => {
  const { scene } = useGLTF('/greek_column.glb');
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(m => {
            m.transparent = true;
            m.opacity = opacity;
          });
        } else if (mesh.material) {
          mesh.material.transparent = true;
          mesh.material.opacity = opacity;
        }
      }
    });
    return clone;
  }, [scene, opacity]);
  return <primitive object={clonedScene} position={position} scale={0.8} />;
};

// --- Scene Controller ---
const SceneController = ({ soldierPos, onMove, scrollProgress }: { soldierPos: THREE.Vector3; onMove: (pos: THREE.Vector3) => void; scrollProgress: number }) => {
  useFrame(({ camera }) => {
    const transitionFactor = THREE.MathUtils.smoothstep(scrollProgress, 0, 0.3);
    const targetY = THREE.MathUtils.lerp(6, -50, transitionFactor);
    const targetZ = THREE.MathUtils.lerp(soldierPos.z + 15, 25, transitionFactor);
    
    camera.position.set(soldierPos.x, targetY, targetZ);
    camera.lookAt(soldierPos.x, targetY - 5, soldierPos.z);
  });

  // Calculate pillar fade
  // Fades in from 0 to 0.1, stays until 0.25, fades out by 0.3
  const pillarOpacity = scrollProgress < 0.15 
    ? THREE.MathUtils.smoothstep(scrollProgress, 0.001, 0.1) 
    : 1 - THREE.MathUtils.smoothstep(scrollProgress, 0.25, 0.3);

  return (
    <>
      <group>
        <group visible={scrollProgress < 0.3}>
          <Soldier onMove={onMove} active={scrollProgress < 0.1} />
          <SnowField soldierPos={soldierPos} />
          <Ground soldierPos={soldierPos} />
          <SnowPiles soldierPos={soldierPos} />
        </group>
      </group>

      <Hud>
        <PerspectiveCamera makeDefault position={[0, 0, 20]} />
        <ambientLight intensity={0.5} />
        <group 
          position={[0, THREE.MathUtils.lerp(-12, 35, THREE.MathUtils.smoothstep(scrollProgress, 0, 0.3)), 0]} 
          visible={scrollProgress > 0.001 && scrollProgress < 0.35}
        >
          <Column position={[-9, 0, 0]} opacity={pillarOpacity} />
          <Column position={[-3, 0, 0]} opacity={pillarOpacity} />
          <Column position={[3, 0, 0]} opacity={pillarOpacity} />
          <Column position={[9, 0, 0]} opacity={pillarOpacity} />
          <pointLight position={[0, 5, 5]} intensity={15 * pillarOpacity} color="#fff" />
        </group>
      </Hud>
    </>
  );
};

const Home = ({ onOpenLogin, isLoggedIn, onLogout }: HomeProps) => {
  const navigate = useNavigate();
  const [soldierPos, setSoldierPos] = useState(new THREE.Vector3(0, 0, 0));
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const progress = window.scrollY / (window.innerHeight * 4);
      setScrollProgress(Math.min(1, progress));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollClick = () => {
    const target = window.innerHeight * 4;
    const start = window.scrollY;
    const distance = target - start;
    const duration = 5000; // 5 seconds for a very slow cinematic scroll
    let startTime: number | null = null;

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Easing function: easeInOutCubic
      const ease = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, start + distance * ease);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  return (
    <div className="bg-black text-white overflow-x-hidden min-h-[500vh]">
      <div className="fixed inset-0 z-0">
        <Canvas shadows dpr={[1, 2]}>
          <color attach="background" args={['#000']} />
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 15, 5]} intensity={1.5} castShadow />
          <pointLight position={[0, 2, 0]} intensity={0.8} color="#44aaff" />
          <Stars radius={300} depth={60} count={8000} factor={7} saturation={0} fade speed={0.5} />
          <SceneController soldierPos={soldierPos} onMove={(pos) => setSoldierPos(pos.clone())} scrollProgress={scrollProgress} />
        </Canvas>
      </div>

      <div className="fixed inset-0 z-10 pointer-events-none">
        <div className="absolute top-8 left-8 flex items-center gap-8 pointer-events-auto">
          <div className="cursor-pointer" onClick={() => navigate('/')}>
            <img src="/No_back_Logo.png" alt="Odyssey Logo" className="h-9 w-auto filter brightness-0 invert opacity-80 hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex gap-6 items-center border-l border-white/10 pl-8">
            {isLoggedIn ? (
              <>
                <button onClick={() => navigate('/profile')} className="text-white font-mono text-[10px] tracking-[0.3em] uppercase hover:text-white/60 transition-colors pointer-events-auto">PROFILE</button>
                <button onClick={onLogout} className="text-white/30 font-mono text-[10px] tracking-[0.3em] uppercase hover:text-white transition-colors pointer-events-auto">LOGOUT</button>
              </>
            ) : (
              <button onClick={onOpenLogin} className="text-white/40 font-mono text-[10px] tracking-[0.3em] uppercase hover:text-white transition-colors pointer-events-auto">LOGIN</button>
            )}
          </div>
        </div>

        <div 
          style={{ opacity: Math.max(0, 1 - scrollProgress * 6) }} 
          className="absolute bottom-24 md:bottom-12 left-8 md:left-12 max-w-lg transition-opacity duration-300"
        >
          <h1 className="text-2xl md:text-3xl font-mythic text-white tracking-[0.4em] mb-2 uppercase opacity-80">Building Ecosystems</h1>
          <p className="text-[10px] font-mono text-white/70 uppercase tracking-[0.2em]">Unlock your Journey. Make your ideas a reality.</p>
        </div>

        <div 
          className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer transition-opacity duration-300 pointer-events-auto"
          style={{ opacity: Math.max(0, 1 - scrollProgress * 15) }}
          onClick={handleScrollClick}
        >
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] hover:text-white transition-colors">Explore Media Wall</span>
          <ChevronDown className="text-white/20 animate-bounce" size={24} />
        </div>

        <div 
          style={{ 
            opacity: Math.max(0, (scrollProgress - 0.12) * 30),
            transform: `translate(-50%, ${THREE.MathUtils.lerp(50, 0, Math.min(1, (scrollProgress - 0.12) * 20))}px)`
          }} 
          className="absolute top-32 left-1/2 flex flex-col items-center transition-opacity duration-500"
        >
          <h1 className="text-2xl md:text-5xl font-mythic text-white tracking-[0.5em] uppercase opacity-90 text-center px-4 whitespace-nowrap">Live Media Wall</h1>
          <div className="h-[1px] w-24 bg-white/20 mt-8" />
        </div>
      </div>
    </div>
  );
};

export default Home;
