import { useNavigate } from 'react-router-dom';
import { useRef, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, PerspectiveCamera, Environment, OrbitControls } from '@react-three/drei';
import { ArrowLeft, Award, Calendar, LogOut, Settings, Shield, ExternalLink, Check, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import * as THREE from 'three';
import { auth } from '../lib/firebase';
import { updateProfile } from 'firebase/auth';

// --- Hologram Component ---
const Hologram = () => {
  const projectorRef = useRef<THREE.Group>(null);
  const helmetRef = useRef<THREE.Group>(null);

  const pod = useGLTF('/the_science_fiction_colba.glb');
  const helmet = useGLTF('/greek_helmet.glb');

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (helmetRef.current) {
      // Rotate the helmet like a display
      helmetRef.current.rotation.y = t * 0.5;
    }
  });

  return (
    <group position={[0, -1.2, 0]} scale={0.5}>
      {/* Sci-Fi Pod Base */}
      <primitive 
        ref={projectorRef} 
        object={pod.scene} 
        scale={1.8} 
        position={[0, -1.2, 0]} 
      />

      {/* Hovering Helmet Hologram - Scale set to 0.95 */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <primitive 
          ref={helmetRef} 
          object={helmet.scene} 
          scale={0.95} 
          position={[0, 3.0, 0]} 
        />
        {/* Dedicated "Specimen Light" that stays with the helmet to pop the metal textures */}
        <pointLight position={[0, 3.0, 1.5]} intensity={4} color="#ffffff" distance={6} />
      </Float>

      {/* Internal Pod Lighting (Atmospheric) */}
      <pointLight position={[0, 1.0, 0]} intensity={2} color="#00ffff" distance={3} />
      <pointLight position={[0, -0.5, 0]} intensity={1} color="#44aaff" distance={3} />
    </group>
  );
};

interface ProfileProps {
  onLogout: () => void;
}

const Profile = ({ onLogout }: ProfileProps) => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!user || !displayName.trim()) return;
    
    setIsSaving(true);
    try {
      await updateProfile(user, {
        displayName: displayName
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const mockUser = {
    role: "PLAYER (CEO)",
    joinedDate: "2025.12.01",
    badges: [
      { id: 1, name: "BATCH_04 ALUMNI", variant: "secondary" },
      { id: 2, name: "TOP_PERFORMER", variant: "beige" },
      { id: 3, name: "PERFECT_ATTENDANCE", variant: "white" },
    ],
    history: [
      { batch: "BATCH 04", team: "ALPHA PROJECT", role: "CEO", status: "GRADUATED" },
      { batch: "BATCH 05", team: "NEO ECOSYSTEM", role: "LEAD", status: "ACTIVE" },
    ]
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 pb-20 pt-24">
      {/* Top Left Logo */}
      <div 
        className="fixed top-6 left-6 z-50 cursor-pointer group"
        onClick={() => navigate('/')}
      >
        <img src="/No_back_Logo.png" alt="Odyssey Logo" className="h-9 w-auto filter brightness-0 invert opacity-80 hover:opacity-100 transition-opacity" />
      </div>

      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Left Side: Hologram and Quick Info */}
          <aside className="w-full md:w-80 space-y-6">
            <Card className="bg-zinc-950 border-zinc-800 overflow-hidden">
              <CardContent className="p-0 flex flex-col items-center text-center">
                {/* 3D Hologram Display */}
                <div className="w-full h-80 bg-zinc-900/20 border-b border-zinc-800 relative">
                  <Canvas shadows>
                    {/* Camera back to 7.5 to fit everything clearly */}
                    <PerspectiveCamera makeDefault position={[0, 0, 7.5]} fov={50} />
                    <OrbitControls enableZoom={false} enablePan={true} />
                    <ambientLight intensity={1.2} /> {/* Increased Ambient */}
                    <spotLight position={[10, 15, 10]} angle={0.15} penumbra={1} intensity={2.5} castShadow />
                    <pointLight position={[-10, -10, -10]} intensity={1} />
                    <Suspense fallback={null}>
                      <Hologram />
                      <Environment preset="night" />
                    </Suspense>
                  </Canvas>
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                </div>

                <div className="pt-8 px-6 pb-8 w-full flex flex-col items-center">
                  {isEditing ? (
                    <div className="flex items-center gap-2 w-full px-4">
                      <input 
                        type="text" 
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-sm w-full focus:outline-none focus:border-white transition-colors"
                        placeholder="Display Name"
                        autoFocus
                      />
                      <button 
                        onClick={handleUpdateProfile}
                        disabled={isSaving}
                        className="text-green-500 hover:text-green-400 disabled:opacity-50"
                      >
                        <Check size={18} />
                      </button>
                      <button 
                        onClick={() => {
                          setIsEditing(false);
                          setDisplayName(user?.displayName || '');
                        }}
                        className="text-red-500 hover:text-red-400"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <h2 className="text-xl font-bold tracking-tight uppercase">
                      {user?.displayName || "UNNAMED VOYAGER"}
                    </h2>
                  )}
                  
                  <Badge variant="secondary" className="mt-2 text-[10px] font-mono uppercase tracking-widest">{mockUser.role}</Badge>
                  <p className="text-xs text-zinc-500 mt-4 font-mono">{user?.email}</p>
                  
                  <div className="w-full h-[1px] bg-zinc-800 my-6" />
                  
                  <div className="w-full space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-xs" 
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      disabled={isEditing}
                    >
                      <Settings className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-xs text-red-400 hover:text-red-300 hover:bg-red-950/20" size="sm" onClick={onLogout}>
                      <LogOut className="mr-2 h-4 w-4" /> Terminate Session
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button variant="ghost" className="text-zinc-500 hover:text-zinc-300 text-xs" onClick={() => navigate('/')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to HQ
            </Button>
          </aside>

          {/* Right Side: Content */}
          <main className="flex-1 space-y-8">
            
            {/* Badges Section */}
            <section className="space-y-4">
              <h3 className="text-[10px] font-mono font-bold tracking-[0.2em] text-zinc-500 uppercase flex items-center gap-2">
                <Award size={14} /> Earned Badges
              </h3>
              <div className="flex flex-wrap gap-2">
                {mockUser.badges.map(badge => (
                  <Badge key={badge.id} variant={badge.variant as any} className="py-1 px-3 text-[10px] uppercase tracking-wider">
                    {badge.name}
                  </Badge>
                ))}
              </div>
            </section>

            {/* History Section */}
            <section className="space-y-4">
              <h3 className="text-[10px] font-mono font-bold tracking-[0.2em] text-zinc-500 uppercase flex items-center gap-2">
                <Calendar size={14} /> Deployment History
              </h3>
              <div className="grid gap-4">
                {mockUser.history.map((item, idx) => (
                  <Card key={idx} className="bg-zinc-950 border-zinc-800 hover:border-zinc-700 transition-colors">
                    <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div>
                        <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">{item.batch}</div>
                        <h4 className="text-lg font-bold text-zinc-100">{item.team}</h4>
                        <p className="text-xs text-zinc-400 mt-1 tracking-tight">ROLE: <span className="text-zinc-200">{item.role}</span></p>
                      </div>
                      <Badge variant={item.status === 'ACTIVE' ? 'default' : 'outline'} className="mt-4 md:mt-0 text-[10px]">
                        {item.status}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-zinc-950 border-zinc-800 hover:bg-zinc-900/50 cursor-pointer transition-all group">
                <CardHeader className="p-6 flex flex-row items-center justify-between space-y-0">
                  <div className="space-y-1">
                    <CardTitle className="text-xs font-bold tracking-widest uppercase">Recovery Key</CardTitle>
                    <CardDescription className="text-[10px] text-zinc-500">Secure your account access</CardDescription>
                  </div>
                  <Shield size={18} className="text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                </CardHeader>
              </Card>
              <Card className="bg-zinc-950 border-zinc-800 hover:bg-zinc-900/50 cursor-pointer transition-all group">
                <CardHeader className="p-6 flex flex-row items-center justify-between space-y-0">
                  <div className="space-y-1">
                    <CardTitle className="text-xs font-bold tracking-widest uppercase">Resources</CardTitle>
                    <CardDescription className="text-[10px] text-zinc-500">Access alumni-only drive</CardDescription>
                  </div>
                  <ExternalLink size={18} className="text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                </CardHeader>
              </Card>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
