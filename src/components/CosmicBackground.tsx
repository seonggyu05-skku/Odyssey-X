import React, { useEffect, useRef } from 'react';

const CosmicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let time = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', resize);
    resize();

    // Configuration for the "Rebellious" aesthetic
    const colors = {
      bg: '#000000',
      chromeLight: '#E8E8E3', // Beige-ish white
      chromeDark: '#444440',
      accent: '#F5F5DC', // Beige
      void: '#050505'
    };

    // Shards generation
    const shardsCount = 35;
    const shards: any[] = [];
    
    for (let i = 0; i < shardsCount; i++) {
      shards.push({
        angle: (Math.PI * 2 * i) / shardsCount + (Math.random() - 0.5),
        distance: 50 + Math.random() * 150,
        size: 20 + Math.random() * 80,
        speed: 0.0005 + Math.random() * 0.001,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
        vertices: Array.from({ length: 3 + Math.floor(Math.random() * 3) }, () => Math.random())
      });
    }

    const draw = () => {
      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, width, height);
      
      const cx = width / 2;
      const cy = height / 2;
      
      // 1. Central Metallic Blast (Pulsing)
      const pulse = Math.sin(time * 1.5) * 0.1 + 1;
      const blastRadius = Math.min(width, height) * 0.35 * pulse;
      
      const gradient = ctx.createRadialGradient(cx, cy, 10, cx, cy, blastRadius);
      gradient.addColorStop(0, colors.chromeLight); // Hot center
      gradient.addColorStop(0.3, colors.chromeLight);
      gradient.addColorStop(0.6, colors.chromeDark); 
      gradient.addColorStop(0.9, colors.bg); // Fade to void
      gradient.addColorStop(1, 'transparent');
      
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, blastRadius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // 2. Chaotic Swirls (Chrome/Plasma)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(time * 0.2);
      ctx.globalCompositeOperation = 'overlay';
      ctx.strokeStyle = colors.chromeLight;
      ctx.lineWidth = 2;
      
      for(let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.rotate(Math.PI / 4);
        ctx.moveTo(100, 0);
        ctx.quadraticCurveTo(200 + Math.sin(time * 2 + i) * 50, 100, 400, 0);
        ctx.stroke();
      }
      ctx.restore();

      // 3. Sharp Black Polygonal Shards
      ctx.globalCompositeOperation = 'source-over'; // Draw on top
      
      shards.forEach((shard, i) => {
        const shardDist = shard.distance + Math.sin(time + i) * 20;
        const x = cx + Math.cos(shard.angle + time * 0.1) * shardDist;
        const y = cy + Math.sin(shard.angle + time * 0.1) * shardDist;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(shard.rotation + time * shard.rotationSpeed * 5);
        
        ctx.beginPath();
        const r = shard.size;
        
        // Draw irregular polygon
        shard.vertices.forEach((v: number, idx: number) => {
            const angle = (Math.PI * 2 * idx) / shard.vertices.length;
            const rad = r * (0.5 + v * 0.5);
            if (idx === 0) ctx.moveTo(Math.cos(angle) * rad, Math.sin(angle) * rad);
            else ctx.lineTo(Math.cos(angle) * rad, Math.sin(angle) * rad);
        });
        ctx.closePath();

        // Shard Styling: Black void with Chrome edges
        ctx.fillStyle = colors.void;
        ctx.shadowColor = colors.accent;
        ctx.shadowBlur = 15;
        ctx.fill();
        
        ctx.strokeStyle = colors.chromeLight;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        ctx.restore();
      });

      // 4. Parallax Particles / Specular Highlights
      ctx.globalCompositeOperation = 'lighter';
      for(let i=0; i < 20; i++) {
        const px = (cx + Math.cos(time * 0.5 + i) * (width * 0.4) + width) % width;
        const py = (cy + Math.sin(time * 0.3 + i * 1.5) * (height * 0.4) + height) % height;
        
        ctx.fillStyle = colors.accent;
        ctx.beginPath();
        ctx.arc(px, py, Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Scanlines / Grit (Overlay)
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      for(let y = 0; y < height; y += 4) {
        ctx.fillRect(0, y, width, 1);
      }

      time += 0.01;
      requestAnimationFrame(draw);
    };
    
    const animationId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      id="cosmic-bg"
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
    />
  );
};

export default CosmicBackground;
