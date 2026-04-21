import { motion } from 'framer-motion';

export default function Hero3D() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
      <motion.div
        animate={{
          rotate: [0, 90, 180, 270, 360],
          scale: [1, 1.2, 1, 0.8, 1],
          borderRadius: ["20%", "40%", "30%", "50%", "20%"],
        }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Infinity,
        }}
        className="w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-gradient-to-tr from-blue-500/20 to-emerald-500/20 blur-3xl mix-blend-screen"
        style={{
          boxShadow: "inset 0 0 100px rgba(59, 130, 246, 0.5), 0 0 100px rgba(16, 185, 129, 0.5)"
        }}
      />
      
      <motion.div
        animate={{
          rotate: [360, 270, 180, 90, 0],
          scale: [0.8, 1, 1.2, 1, 0.8],
          borderRadius: ["50%", "20%", "40%", "30%", "50%"],
        }}
        transition={{
          duration: 25,
          ease: "linear",
          repeat: Infinity,
        }}
        className="absolute w-[300px] h-[300px] md:w-[450px] md:h-[450px] bg-gradient-to-br from-purple-500/10 to-blue-500/20 blur-2xl mix-blend-screen"
      />
    </div>
  );
}
