import { motion } from 'framer-motion';

export default function AnimatedButton({ children, className, onClick, type = "button" }) {
  return (
    <motion.button
      type={type}
      className={className}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}
