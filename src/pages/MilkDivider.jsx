// frontend/src/components/Home/MilkDivider.jsx
export default function MilkDivider() {
  return (
    <div className="relative w-full overflow-hidden leading-none rotate-180">
      <svg 
        className="relative block w-full h-[60px] md:h-[100px]" 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none"
      >
        {/* Using cheeseCream (#FDF8E7) for the wave color */}
        <path 
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C41.39,36.56,128.56,69.57,238,76.45,263.13,78.02,292.1,76.51,321.39,56.44Z" 
          fill="#FDF8E7" 
        ></path>
      </svg>
    </div>
  );
}