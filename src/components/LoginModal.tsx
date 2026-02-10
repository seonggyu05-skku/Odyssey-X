import { motion } from 'framer-motion';
import { X, Chrome } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal = ({ onClose }: LoginModalProps) => {
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="relative w-full max-w-md z-10"
      >
        <Card className="shadow-2xl bg-zinc-950 border-zinc-800">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white"
          >
            <X size={20} />
          </Button>

          <CardHeader className="space-y-1 pt-12 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight text-white uppercase">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Continue your voyage into the Odyssey
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pb-12">
            <div className="h-[1px] w-full bg-zinc-800" />
            
            <Button 
              onClick={handleGoogleLogin} 
              variant="default" 
              size="lg" 
              className="w-full font-bold uppercase tracking-wider bg-white text-black hover:bg-zinc-200"
            >
              <Chrome className="mr-2 h-5 w-5" />
              Sign in with Google
            </Button>

            <div className="text-center">
              <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
                Secure Connection Established
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginModal;