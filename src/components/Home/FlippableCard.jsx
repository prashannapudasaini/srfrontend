// frontend/src/components/Home/FlippableCard.jsx
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useRef } from 'react';

const FlippableCard = ({ children }) => {
  const cardRef = useRef(null);

  // Motion values to track mouse X/Y relative to the element
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Transform those relative X/Y values into rotation (tilt) degrees
  // -10 degrees rotation if the mouse is on the far left (0.2), +10 if on far right (0.8)
  const rotateX = useTransform(y, [0.2, 0.8], [10, -10]);
  const rotateY = useTransform(x, [0.2, 0.8], [-10, 10]);

  const handleMouseMove = (event) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate mouse position as a factor from 0.0 to 1.0 within the card
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    // Reset rotations when mouse leaves
    x.set(0.5); // Center the rotation
    y.set(0.5);
  };

  return (
    // Preserve 3D space for the inner elements
    <div style={{ perspective: "1500px" }} className="w-full h-full">
      <motion.div
        ref={cardRef}
        className="w-full h-full relative"
        style={{ rotateX, rotateY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default FlippableCard;