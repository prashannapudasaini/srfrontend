// frontend/src/components/Home/MilkDivider.jsx
import { motion } from 'framer-motion';

export default function MilkDivider({ position = 'bottom', className = '' }) {
  const isTop = position === 'top';
  
  return (
    <div className={`w-full overflow-hidden leading-none relative z-20 ${isTop ? 'rotate-180 -mb-1' : '-mt-1'} ${className}`}>
      <svg
        className="relative block w-full h-[80px] md:h-[150px]"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        {/* Back Wave (Slow) */}
        <motion.path
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
          fill="#F9F6F0"
          opacity=".3"
        />
        {/* Middle Wave (Medium) */}
        <motion.path
          animate={{ x: [-1000, 0] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
          fill="#F9F6F0"
          opacity=".6"
        />
        {/* Front Wave (Fast) */}
        <motion.path
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
          fill="#F9F6F0"
        />
      </svg>
    </div>
  );
}