// frontend/src/components/Home/ProductImageShowcase.jsx
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const ProductImageShowcase = () => {
  const showcaseItems = [
    {
      id: 1,
      image: "./ourfarm1.png",
      title: "Processed Premium Butter",
      subtitle: "स्वस्थ र स्वादिलो (Healthy & Tasty)",
      description: "Our Sita Ram Butter is crafted for a rich, creamy texture that melts perfectly. Sourced from cows grazing in pristine Himalayan-view pastures, it brings the traditional taste of pure dairy to your morning bread.",
      features: ["Pure Pasteurized", "Rich Golden Texture", "Himalayan Farm Sourced"],
      reversed: false
    },
    {
      id: 2,
      image: "./ourfarm2.png",
      title: "Traditional Creamy Dahi",
      subtitle: "शुद्ध दुधबाट बनेको (Made from Pure Milk)",
      description: "Experience the authentic taste of Sita Ram Dahi. Set using traditional methods from 100% pure milk, our yogurt is naturally thick, smooth, and packed with probiotic goodness for a healthy lifestyle.",
      features: ["No Added Preservatives", "Naturally Thick", "Traditional Culture"],
      reversed: true
    }
  ];

  return (
    <section className="py-24 bg-cheeseCream overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-dairyRed text-sm uppercase tracking-[0.3em] font-bold mb-4">
            From Our Farm to Your Table
          </h2>
          <h3 className="text-4xl md:text-5xl font-serif font-bold text-dairyBlack">
            Our Signature Showcase
          </h3>
        </div>

        <div className="space-y-32">
          {showcaseItems.map((item) => (
            <div 
              key={item.id} 
              className={`flex flex-col ${item.reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20`}
            >
              {/* Image Side with 3D Effect */}
              <motion.div 
                initial={{ opacity: 0, x: item.reversed ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="w-full lg:w-1/2"
              >
                <div className="relative group">
                  {/* Decorative background element */}
                  <div className="absolute -inset-4 bg-dairyRed/5 rounded-full blur-3xl group-hover:bg-dairyRed/10 transition-colors duration-500" />
                  
                  <motion.img
                    whileHover={{ scale: 1.02, rotateY: item.reversed ? -5 : 5 }}
                    src={item.image}
                    alt={item.title}
                    className="relative z-10 w-full h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl"
                  />
                </div>
              </motion.div>

              {/* Description Side */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full lg:w-1/2 space-y-6"
              >
                <div className="space-y-2">
                  <span className="text-dairyRed font-bold tracking-widest text-sm uppercase">
                    {item.subtitle}
                  </span>
                  <h4 className="text-4xl font-serif font-bold text-dairyBlack">
                    {item.title}
                  </h4>
                </div>
                
                <p className="text-gray-600 text-lg leading-relaxed">
                  {item.description}
                </p>

                <ul className="grid grid-cols-1 gap-3 pt-4">
                  {item.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-dairyBlack font-medium">
                      <CheckCircle2 className="text-dairyRed" size={20} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="pt-6">
                  <button className="border-2 border-dairyRed text-dairyRed px-8 py-3 rounded-full font-bold uppercase tracking-wider hover:bg-dairyRed hover:text-white transition-all duration-300">
                    Learn More
                  </button>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductImageShowcase;