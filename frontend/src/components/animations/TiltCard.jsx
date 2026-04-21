import { Tilt } from 'react-tilt';
import { motion } from 'framer-motion';

const defaultOptions = {
  reverse:        false,  // reverse the tilt direction
  max:            15,     // max tilt rotation (degrees)
  perspective:    1000,   // Transform perspective, the lower the more extreme the tilt gets.
  scale:          1.02,   // 2 = 200%, 1.5 = 150%, etc..
  speed:          1000,   // Speed of the enter/exit transition
  transition:     true,   // Set a transition on enter/exit.
  axis:           null,   // What axis should be disabled. Can be X or Y.
  reset:          true,   // If the tilt effect has to be reset on exit.
  easing:         "cubic-bezier(.03,.98,.52,.99)",    // Easing on enter/exit.
}

export default function TiltCard({ children, options = {}, onClick }) {
  return (
    <Tilt options={{ ...defaultOptions, ...options }} className="h-full w-full">
      <motion.div
        whileHover={{ boxShadow: "0px 20px 40px rgba(0,0,0,0.4)" }}
        className="h-full w-full cursor-pointer"
        onClick={onClick}
      >
        {children}
      </motion.div>
    </Tilt>
  );
}
