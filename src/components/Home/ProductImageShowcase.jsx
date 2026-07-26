import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// 1. Import your images here
import farm1 from '../../assets/butter.webp';
import farm3 from '../../assets/icecream.png';

const ProductImageShowcase = () => {
  const { t, i18n } = useTranslation();

  // Typography helper for Nepali script
  const isNepali = i18n.language === 'ne';
  // NEW
const nepaliFontClass = isNepali ? "nepali-heading" : "tracking-wider";

  // 2. Extract translations as an array
  const translatedItems = t('productShowcase.items', {
    returnObjects: true,
    defaultValue: [
      {
        title: "Processed Premium Butter",
        subtitle: "Healthy & Tasty",
        description: "Our Sita Ram Butter is crafted for a rich, creamy texture that melts perfectly. Sourced from cows grazing in pristine Himalayan-view pastures, it brings the traditional taste of pure dairy to your morning bread.",
        note: "Note: Only bulk orders are available.",
        features: ["Pure Pasteurized", "Rich Golden Texture", "Himalayan Farm Sourced"],
        buttonText: "Learn More"
      },
      {
        title: "Premium Ice Cream",
        subtitle: "Made from Pure Milk",
        description: "Experience the rich, creamy delight of our premium ice cream made from 100% pure milk. Smooth, indulgent, and crafted for perfect taste in every scoop.",
        note: "Note: Only bulk orders are available.",
        features: ["No Added Preservatives", "Creamy Texture", "Premium Dairy Base"],
        buttonText: "Explore Flavors"
      }
    ]
  });

  // 3. Merge static image/layout data with translated text
  const showcaseItems = [
    {
      ...translatedItems[0],
      id: 1,
      image: farm1,
      reversed: false,
      buttonLink: "/about"
    },
    {
      ...translatedItems[1],
      id: 2,
      image: farm3,
      reversed: true,
      buttonLink: "/ice-cream"
    }
  ];

  return (
   <section className="py-10 md:py-20 bg-cheeseCream overflow-hidden">
  <div className="max-w-7xl mx-auto px-6">
    
    {/* Reduced margin bottom from mb-20 to mb-10 for mobile */}
    <div className="text-center mb-10 md:mb-16">
      <h2 className={`text-dairyRed text-sm uppercase font-bold mb-2 md:mb-4 ${isNepali ? nepaliFontClass : 'tracking-[0.3em]'}`}>
        {t('productShowcase.subtitle', 'From Our Farm to Your Table')}
      </h2>
      <h3 className={`text-3xl md:text-5xl font-serif font-bold text-dairyBlack ${isNepali ? nepaliFontClass : ''}`}>
        {t('productShowcase.title', 'Our Signature Showcase')}
      </h3>
    </div>

    {/* Reduced massive gap between items from space-y-32 to space-y-16 on mobile */}
    <div className="space-y-16 md:space-y-32">
      {showcaseItems.map((item) => (
        <div
          key={item.id}
          className={`flex flex-col ${
            item.reversed ? "lg:flex-row-reverse" : "lg:flex-row"
          } items-center gap-8 lg:gap-20`} /* Reduced mobile gap from gap-12 to gap-8 */
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
                  <div className="absolute -inset-4 bg-dairyRed/5 rounded-full blur-3xl group-hover:bg-dairyRed/10 transition-colors duration-500" />

                  <motion.img
                    whileHover={{
                      scale: 1.02,
                      rotateY: item.reversed ? -5 : 5
                    }}
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
                <div className="space-y-4">
                  {/* Applied the established typography helper */}
                  <span className={`text-dairyRed font-bold uppercase ${isNepali ? nepaliFontClass : 'tracking-widest block'}`}>
                    {item.subtitle}
                  </span>
                  
                  <h4 className={`text-4xl font-serif font-bold text-dairyBlack ${isNepali ? nepaliFontClass : ''}`}>
                    {item.title}
                  </h4>
                </div>

                <p className={`text-gray-600 text-lg leading-relaxed ${isNepali ? nepaliFontClass : ''}`}>
                  {item.description}
                  <br />
                  <span className="text-dairyRed font-medium mt-1 inline-block">{item.note}</span>
                </p>

                <ul className="grid grid-cols-1 gap-3 pt-4">
                  {item.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className={`flex items-center gap-3 text-dairyBlack font-medium ${isNepali ? nepaliFontClass : ''}`}
                    >
                      <CheckCircle2 className="text-dairyRed shrink-0" size={20} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="pt-6">
                  {/* Dynamic Button Text and Link */}
                  <Link
                    to={item.buttonLink}
                    className={`inline-block border-2 border-dairyRed text-dairyRed px-8 py-3 rounded-full font-bold uppercase hover:bg-dairyRed hover:text-white transition-all duration-300 ${isNepali ? nepaliFontClass : 'tracking-wider'}`}
                  >
                    {item.buttonText}
                  </Link>
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