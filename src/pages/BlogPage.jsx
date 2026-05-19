import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, BookOpen, User, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BLOG_POSTS = [
  {
    id: 1,
    title: "Why Sita Ram Gokul Milk is Kathmandu’s Top Choice for Purity",
    excerpt: "Sourced from the lush pastures of Nepal, our Gokul Milk represents generations of dairy excellence and farm-to-table freshness.",
    fullContent: "Every drop of Sita Ram Gokul Milk undergoes a rigorous 28-point quality check. In the bustling heart of Kathmandu, finding <b>pure cow milk</b> can be a challenge. We bridge that gap by sourcing directly from local farmers who share our commitment to organic practices. Our pasteurization process preserves essential vitamins like B12 and Vitamin D, making it the perfect choice for growing children and health-conscious adults alike.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQULMeao9FhiteaPDcoy3rmUyh22m2plSOZhQ&s",
    date: "May 10, 2026",
    category: "Fresh Milk",
    keywords: ["Fresh milk Kathmandu", "Sita Ram Gokul Milk", "Pasteurized milk Nepal"]
  },
  {
    id: 2,
    title: "The Golden Superfood: Ayurvedic Benefits of Pure Cow Ghee",
    excerpt: "More than just a cooking ingredient, Sita Ram Pure Cow Ghee is a legacy of wellness used in Nepali households for decades.",
    fullContent: "Our <b>Danedar Ghee</b> is prepared using the traditional bilona-inspired method. This ensures a rich aroma and granular texture that factory-processed ghees lack. Rich in butyric acid, it aids digestion and helps in maintaining a healthy gut. Whether you are using it for your daily <i>Dal-Bhat</i> or for sacred rituals, our ghee promises 100% purity with no added preservatives or colors.",
    image: "https://img.drz.lazcdn.com/static/np/p/778a8817afb12b1df0d8c84c97ff6f97.jpg_720x720q80.jpg",
    date: "May 08, 2026",
    category: "Superfoods",
    keywords: ["Pure cow ghee Nepal", "Traditional ghee benefits", "Best Ghee Kathmandu"]
  },
  {
    id: 3,
    title: "The Probiotic Power of Sita Ram Dahi: A Gut-Health Revolution",
    excerpt: "Naturally fermented and 'Shuddha Dudh Bata Baneko', our Dahi is the creamy, cooling companion your meals deserve.",
    fullContent: "Sita Ram Dahi is celebrated for its thick, velvety consistency. As a natural <b>probiotic</b>, it contains live cultures that strengthen your immune system. In the summer heat of Nepal, a bowl of fresh curd is essential for hydration and balancing body temperature. We use only high-fat whole milk to ensure that every scoop is as nutritious as it is delicious.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD6_jMD_hq0ndTGsrDqmbyX0ee-3Igbt29Mg&s",
    date: "May 06, 2026",
    category: "Probiotics",
    keywords: ["Best dahi in Nepal", "Fresh curd Kathmandu", "Probiotic benefits"]
  },
  {
    id: 4,
    title: "Soft & Nutritious: How to Cook with Sita Ram Fresh Paneer",
    excerpt: "Our vacuum-packed paneer stays incredibly soft, making it the ultimate high-protein choice for vegetarian diets.",
    fullContent: "Finding <b>soft paneer in Nepal</b> can be difficult, as many store-bought options become rubbery when cooked. Sita Ram Fresh Paneer is different. Because we use high-quality milk and immediate vacuum sealing, our paneer retains its moisture and delicate flavor. It is an excellent source of protein and calcium, making it a staple for fitness enthusiasts and traditional Nepali kitchens.",
    image: "https://sewapoint.com/image-1684483772616-paneer200gm.jpg",
    date: "May 04, 2026",
    category: "Vegetarian Protein",
    keywords: ["Soft paneer Nepal", "High protein paneer", "Fresh cottage cheese"]
  },
  {
    id: 5,
    title: "Start Your Morning with Sita Ram Processed Butter",
    excerpt: "Swastha ra Swadilo. Our creamy table butter is crafted for families who refuse to compromise on breakfast quality.",
    fullContent: "Nothing beats the taste of <b>Sita Ram Butter</b> melting over a hot <i>Sel Roti</i> or toasted bread. Crafted from farm-fresh cream, our butter has a subtle saltiness and rich mouthfeel. It is processed in a state-of-the-art facility to ensure zero contamination, making it a safe and tasty choice for your children's tiffin boxes every single day.",
    image: "https://storage.googleapis.com/takeapp/media/cm3a8hpv200020cl583sl8cfj.jpeg",
    date: "May 02, 2026",
    category: "Dairy Essentials",
    keywords: ["Best butter in Nepal", "Creamy table butter", "Salted butter"]
  },
  {
    id: 6,
    title: "Keshar Milk: The Ultimate Energy Drink for the Modern Lifestyle",
    excerpt: "Combine the healing properties of pure Saffron (Keshar) with low-fat milk for a refreshing, antioxidant-rich boost.",
    fullContent: "Sita Ram Energy Fresh Keshar Milk is a premium flavored milk designed for people on the move. Saffron is known in Ayurveda for improving skin glow and boosting mood. By blending it with our <b>energy-rich low-fat milk</b>, we've created a drink that satisfies your sweet cravings while providing a steady stream of nutrition without the crash of sugary sodas.",
    image: "https://img.drz.lazcdn.com/static/np/p/efa59a0d1df5e7025b7f47220bbf5410.jpg_960x960q80.jpg_.webp",
    date: "April 30, 2026",
    category: "Wellness Drinks",
    keywords: ["Saffron milk benefits Nepal", "Keshar milk", "Healthy flavored milk"]
  },
  {
    id: 7,
    title: "Traditional Lassi: Beating the Kathmandu Heat Naturally",
    excerpt: "Experience the authentic taste of Nepali Lassi, packed with calcium and chilled to perfection for instant refreshment.",
    fullContent: "Our traditional Lassi is a tribute to the street-side flavors of old Kathmandu but made with the hygiene standards of a world-class dairy. It is the perfect <b>refreshing summer drink</b>. Unlike carbonated beverages, our Lassi provides protein and helps in neutralizing stomach acidity, making it the healthiest way to cool down after a long day.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeCSTgVxX2OOv7WVjONsrHOJFZtKmMlJ67Vg&s",
    date: "April 28, 2026",
    category: "Refreshments",
    keywords: ["Best lassi in Kathmandu", "Healthy summer drinks", "Sita Ram Lassi"]
  },
  {
    id: 8,
    title: "Fruity Delight: Why Kids Love Sita Ram Strawberry Lassi",
    excerpt: "A vibrant twist on our classic favorite, combining the probiotic goodness of yogurt with natural strawberry flavors.",
    fullContent: "Getting kids to eat yogurt can be a struggle, but they can't resist the <b>Strawberry Lassi from Sita Ram</b>. We use natural fruit extracts to give it that pink glow and berry taste. It's a great way to ensure your children get their daily dose of calcium while enjoying a treat that feels like a dessert but acts like a health supplement.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeCSTgVxX2OOv7WVjONsrHOJFZtKmMlJ67Vg&s",
    date: "April 26, 2026",
    category: "Kids Nutrition",
    keywords: ["Strawberry lassi benefits", "Fruit yogurt drink Nepal", "Healthy snacks for kids"]
  },
  {
    id: 9,
    title: "Inside Our Farm: The Journey of Purity",
    excerpt: "Explore how Sita Ram maintains the highest standards of animal welfare and hygiene to bring you 'Generations of Pure Goodness'.",
    fullContent: "Purity starts at the source. At <b>Sita Ram Farms</b>, our cows are fed a natural, nutrient-rich diet with no hormonal injections. We believe that happy cows produce better milk. Our facility in Sanepa uses closed-circuit systems to ensure the milk never touches human hands until you open the packet in your kitchen. This is the secret behind the consistency and safety of our entire product range.",
    image: "https://newbusinessage.prixacdn.net/img/news/20220801061710_1659346297.jpg",
    date: "April 24, 2026",
    category: "Farm Life",
    keywords: ["Organic dairy farming Nepal", "Sita Ram Farm", "Dairy hygiene standards"]
  },
  {
    id: 10,
    title: "Milk Subscriptions: Never Run Out of Freshness Again",
    excerpt: "Learn how our automated subscription service ensures that fresh Gokul milk reaches your doorstep every single morning.",
    fullContent: "Imagine waking up to fresh milk at your door without ever having to call a shop. Our <b>Dairy Subscription Service</b> is designed for the modern Kathmandu family. You can customize your delivery days, pause when you are on vacation, and pay easily through Khalti or FonePay. It's the most convenient way to keep your family healthy and hydrated without the morning hassle.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5G_JqA-Qr8Yyrj-ZBesD6or-xeFWI_fF9ug&s", // Using a placeholder dashboard-style image for service
    date: "April 22, 2026",
    category: "Services",
    keywords: ["Milk delivery Kathmandu", "Online dairy subscription", "Fresh milk doorstep"]
  }
];

export default function BlogPage() {
  return (
    <div className="bg-[#FDF8E7] min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        
        {/* === HEADER SECTION === */}
        <header className="mb-20 text-center lg:text-left flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 bg-[#9e111a]/10 text-[#9e111a] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] mb-6"
            >
              <BookOpen size={14} strokeWidth={3} /> Dairy Wellness & Nutrition
            </motion.div>
            <h1 className="text-5xl lg:text-7xl font-serif font-black text-[#1A1A1A] leading-none mb-6">
              Purity in <span className="text-[#9e111a]">Every Story.</span>
            </h1>
            <p className="text-gray-500 font-medium text-lg max-w-xl leading-relaxed">
              Explore professional insights on organic dairy, traditional Nepali recipes, and the science of pure nutrition from the pastures of Sita Ram Dairy.
            </p>
          </div>
        </header>

        {/* === BLOG GRID === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {BLOG_POSTS.map((post, idx) => (
            <motion.article 
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(158,17,26,0.1)] transition-all duration-500 group flex flex-col h-full border border-white"
            >
              <div className="h-72 overflow-hidden relative">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                />
                <div className="absolute top-6 left-6">
                  <span className="bg-[#9e111a] text-white px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-8 lg:p-10 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-gray-400 text-[10px] font-black uppercase tracking-widest mb-4">
                  <span className="flex items-center gap-1.5"><Calendar size={12} className="text-[#9e111a]" /> {post.date}</span>
                </div>
                
                <h2 className="text-2xl font-serif font-black text-[#1A1A1A] mb-4 leading-tight group-hover:text-[#9e111a] transition-colors line-clamp-2">
                  {post.title}
                </h2>
                
                <p className="text-gray-500 text-sm mb-8 leading-relaxed line-clamp-3 font-medium">
                  {post.excerpt}
                </p>

                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                  <Link 
                    to={`/blog/${post.id}`} 
                    className="inline-flex items-center gap-2 text-[#9e111a] font-black text-[10px] uppercase tracking-[0.2em] group/link"
                  >
                    Read Full Story <ArrowRight size={16} className="group-hover/link:translate-x-2 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}