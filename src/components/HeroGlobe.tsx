import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const EARTH_VERTEX_SHADER = `
  varying vec3 vNormal;
  varying vec2 vUv;
  void main() {
    vNormal = normalize( normalMatrix * normal );
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`;

const EARTH_FRAGMENT_SHADER = `
  uniform sampler2D globeTexture;
  varying vec3 vNormal;
  varying vec2 vUv;
  void main() {
    vec3 diffuse = texture2D( globeTexture, vUv ).xyz;
    float lum = dot(diffuse, vec3(0.3, 0.59, 0.11));
    
    // Land color with a hint of natural green/brown from original texture
    vec3 landBase = vec3(0.95, 0.95, 1.0);
    vec3 naturalLand = mix(landBase, diffuse, 0.3);
    
    vec3 oceanColor = vec3(0.1, 0.3, 0.6); // Keeping slightly darker ocean for contrast
    
    // Base color using original luminance for natural land detail
    vec3 finalColor = mix(oceanColor, naturalLand, lum) * 1.15;
    
    float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );
    vec3 atmosphere = vec3( 0.4, 0.7, 1.0 ) * pow( intensity, 3.0 );
    
    vec3 lightDir = normalize(vec3(-0.4, 0.7, -0.3));
    float rimPower = pow(1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
    float directionFactor = pow(max(0.0, dot(vNormal, lightDir + vec3(0,0,0.5))), 4.0);
    // Slightly less intense sun highlight (1.7 multiplier)
    vec3 sunHighlight = vec3(1.0, 0.98, 0.9) * rimPower * directionFactor * 1.7;

    // Solid visibility (0.85 alpha)
    gl_FragColor = vec4( finalColor + atmosphere + sunHighlight, 0.85 );
  }
`;

const ATMOSPHERE_VERTEX_SHADER = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize( normalMatrix * normal );
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`;

const ATMOSPHERE_FRAGMENT_SHADER = `
  varying vec3 vNormal;
  void main() {
    // Very thin falloff (high power) for a subtle edge glow
    float intensity = pow( 0.55 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 12.0 );
    gl_FragColor = vec4( 0.8, 0.9, 1.0, 1.0 ) * intensity * 0.6;
  }
`;

const SunBeam = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const shaderArgs = useMemo(() => ({
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform float uTime;
      void main() {
        vec2 center = vec2(0.5, 0.5);
        vec2 rel = vUv - center;
        float dist = length(rel);
        
        float glow = 0.012 / (dist + 0.005);
        glow = pow(glow, 1.2);
        
        float angle = atan(rel.y, rel.x);
        float rays = pow(sin(angle * 4.0 - uTime * 0.1), 2.0) * 0.5 + 0.5;
        rays *= pow(sin(angle * 11.0 + uTime * 0.05), 2.0) * 0.5 + 0.5;
        
        float streaks = exp(-3.0 * abs(rel.x + rel.y)) * 0.5;
        streaks += exp(-5.0 * abs(rel.x - rel.y * 0.3)) * 0.3;
        
        float finalGlow = glow * (1.0 + rays * 0.7 + streaks * 3.5);
        float edgeFade = smoothstep(0.5, 0.1, dist);
        finalGlow *= edgeFade;
        
        if (finalGlow < 0.001) discard;
        
        // Slightly less intense sunbeam (0.5 brightness)
        gl_FragColor = vec4(0.85, 0.96, 1.0, finalGlow * 0.5);
      }
    `
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} position={[-2.0, 4.5, -2]} scale={[40, 40, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial 
        args={[shaderArgs]} 
        transparent 
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
};

const GlobeScene = () => {
  const { viewport } = useThree();
  const sphereRef = useRef<THREE.Mesh>(null);
  
  const texture = useTexture('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg');
  const earthUniforms = useMemo(() => ({ globeTexture: { value: texture } }), [texture]);

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.0005;
      sphereRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.05) * 0.02;
    }
  });

  const isMobile = viewport.width < 10;
  const scale = isMobile ? viewport.width * 0.12 : viewport.width * 0.08;
  const posX = viewport.width / 2 - (isMobile ? 1 : 2);
  const posY = -viewport.height / 2 + (isMobile ? 2.5 : 1.5);

  return (
    <group position={[posX, posY, 0]} scale={scale}>
      <SunBeam />
      
      {/* Very Thin Atmospheric Glow */}
      <mesh scale={[1.08, 1.08, 1.08]}>
        <sphereGeometry args={[5, 64, 64]} />
        <shaderMaterial
          vertexShader={ATMOSPHERE_VERTEX_SHADER}
          fragmentShader={ATMOSPHERE_FRAGMENT_SHADER}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          transparent
        />
      </mesh>

      {/* Earth Sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[5, 64, 64]} />
        <shaderMaterial
          vertexShader={EARTH_VERTEX_SHADER}
          fragmentShader={EARTH_FRAGMENT_SHADER}
          uniforms={earthUniforms}
          transparent
        />
      </mesh>
    </group>
  );
};

const HeroGlobe: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <Suspense fallback={null}>
        <Canvas 
          camera={{ position: [0, 0, 20], fov: 45 }} 
          dpr={[1, 2]}
          gl={{ alpha: true, antialias: true }}
        >
          <GlobeScene />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default HeroGlobe;
