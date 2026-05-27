import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, BookOpen, User, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BLOG_POSTS = [
  {
    id: 1,
    title: "Why Sita Ram Gokul Milk is Kathmandu’s Top Choice for Purity",
    excerpt: "Sourced directly from the lush, green pastures of Nepal, our Gokul Milk represents generations of dairy excellence, unmatched farm-to-table freshness, and a steadfast commitment to your family's health.",
    fullContent: "Every drop of Sita Ram Gokul Milk undergoes a rigorous 28-point quality check before it reaches your home. In the bustling heart of Kathmandu, finding <b>pure, unadulterated cow milk</b> can be a significant challenge. We bridge that gap by sourcing directly from local cooperative farmers who share our deep commitment to ethical and organic farming practices.<br/><br/>Our state-of-the-art pasteurization process preserves essential nutrients—like Vitamin B12, Calcium, and Vitamin D—while completely eliminating harmful bacteria. Furthermore, our milk is carefully homogenized to ensure a consistent, creamy texture in every single sip. Whether you are boiling it for your robust morning <i>chia</i>, pouring it over cereal for growing children, or enjoying a warm glass before bed, Sita Ram Gokul Milk is the perfect choice for health-conscious individuals who refuse to compromise on quality and taste.",
    image: "/milk.png",
    date: "May 10, 2026",
    category: "Fresh Milk",
    keywords: ["Fresh milk Kathmandu", "Sita Ram Gokul Milk", "Pasteurized milk Nepal"]
  },
  {
    id: 2,
    title: "The Golden Superfood: Ayurvedic Benefits of Pure Cow Ghee",
    excerpt: "Far more than just a kitchen staple, Sita Ram Pure Cow Ghee is a legacy of wellness, known for its rich aroma, granular texture, and incredible healing properties in Nepali households.",
    fullContent: "Our <b>Danedar Ghee</b> is meticulously prepared using methods inspired by the traditional bilona process. This time-honored technique ensures a rich, nutty aroma and a perfect granular texture that mass-produced, factory-processed ghees simply cannot replicate. <br/><br/>Rich in beneficial short-chain fatty acids like butyric acid, our ghee actively aids digestion, reduces inflammation, and helps in maintaining a healthy gut microbiome. In Ayurveda, pure cow ghee is considered a 'medhya rasayana'—a food that nourishes the brain and nervous system. It has a high smoke point, making it exceptionally safe for deep frying and sautéing. Whether you are tempering your daily <i>Dal-Bhat</i>, using it for sacred puja rituals, or applying it topically for skin health, our ghee promises 100% purity with absolutely no added preservatives, artificial flavors, or colors.",
    image: "/ghee.png",
    date: "May 08, 2026",
    category: "Superfoods",
    keywords: ["Pure cow ghee Nepal", "Traditional ghee benefits", "Best Ghee Kathmandu"]
  },
  {
    id: 3,
    title: "The Probiotic Power of Sita Ram Dahi: A Gut-Health Revolution",
    excerpt: "Naturally fermented and proudly 'Shuddha Dudh Bata Baneko', our Dahi is the creamy, cooling, and gut-friendly companion your everyday spicy meals truly deserve.",
    fullContent: "Sita Ram Dahi is universally celebrated across the valley for its thick, velvety consistency and perfectly balanced tartness. As a potent, natural <b>probiotic</b>, it contains billions of active, live cultures that actively populate your digestive tract, helping to break down food and significantly strengthen your immune system.<br/><br/>In the intense summer heat of Nepal, a bowl of fresh curd is not just a side dish; it is essential for hydration and balancing your body's internal temperature. We use only high-fat, premium whole milk to ensure that every scoop is as nutritionally dense as it is delicious. It serves as the perfect base for marinades, a cooling complement to spicy curries, or a healthy dessert when mixed with fresh fruits. Regular consumption of our Dahi improves bone density and keeps acidity at bay.",
    image: "/dahi.png",
    date: "May 06, 2026",
    category: "Probiotics",
    keywords: ["Best dahi in Nepal", "Fresh curd Kathmandu", "Probiotic benefits"]
  },
  {
    id: 4,
    title: "Soft & Nutritious: How to Cook with Sita Ram Fresh Paneer",
    excerpt: "Discover why our vacuum-packed fresh paneer stays incredibly soft and moist, making it the ultimate high-protein, versatile choice for vegetarian diets and rich curries.",
    fullContent: "Finding genuinely <b>soft paneer in Nepal</b> can often be a frustrating experience, as many store-bought options become rubbery, dry, and chewy the moment they are cooked. Sita Ram Fresh Paneer completely changes the game. Because we use only the highest-quality whole milk and employ an immediate vacuum-sealing process, our paneer retains its natural moisture, delicate flavor, and spongy texture.<br/><br/>Paneer is a powerhouse of vegetarian nutrition. It is an excellent source of high-quality protein, calcium, and conjugated linoleic acid—a fatty acid associated with fat loss. Because it absorbs flavors beautifully, it is perfect for everything from a rich, creamy <i>Palak Paneer</i> to grilled Paneer Tikka. We never use artificial softeners or chemical preservatives, ensuring that your family gets pure, farm-fresh cottage cheese every time.",
    image: "/paneer.png",
    date: "May 04, 2026",
    category: "Vegetarian Protein",
    keywords: ["Soft paneer Nepal", "High protein paneer", "Fresh cottage cheese"]
  },
  {
    id: 5,
    title: "Start Your Morning with Sita Ram Processed Butter",
    excerpt: "Swastha ra Swadilo. Crafted for families who refuse to compromise, our creamy, perfectly salted table butter makes every breakfast special.",
    fullContent: "Nothing quite beats the nostalgic taste of <b>Sita Ram Butter</b> melting beautifully over a hot, crispy <i>Sel Roti</i>, a warm paratha, or freshly toasted bread. Crafted exclusively from farm-fresh cream, our butter boasts a subtle, perfectly balanced saltiness and a rich, luxurious mouthfeel that elevates the simplest of foods.<br/><br/>Unlike highly processed margarines, our butter is naturally rich in fat-soluble vitamins like A, E, and K2. It is churned and processed in a state-of-the-art facility utilizing strict cold-chain logistics to ensure absolute zero contamination. Free from harmful trans fats and synthetic additives, it is a remarkably safe, energy-dense, and tasty choice for your children's tiffin boxes every single day. Baking, cooking, or spreading—Sita Ram butter delivers golden perfection.",
    image: "/butter.png",
    date: "May 02, 2026",
    category: "Dairy Essentials",
    keywords: ["Best butter in Nepal", "Creamy table butter", "Salted butter"]
  },
  {
    id: 6,
    title: "Keshar Milk: The Ultimate Energy Drink for the Modern Lifestyle",
    excerpt: "Experience the perfect fusion of health and taste by combining the ancient healing properties of pure Saffron with our premium low-fat milk for an antioxidant-rich boost.",
    fullContent: "Sita Ram Energy Fresh Keshar Milk is a meticulously crafted premium flavored milk designed specifically for busy people constantly on the move. Saffron (Keshar) has been revered for centuries in Ayurveda for its remarkable ability to improve skin glow, boost memory, and elevate mood through natural antioxidants.<br/><br/>By expertly blending pure saffron extracts with our <b>energy-rich, easily digestible low-fat milk</b>, we've created a rejuvenating drink that completely satisfies your sweet cravings while providing a steady, sustainable stream of nutrition. Unlike highly caffeinated energy drinks or sugary sodas that lead to a sudden energy crash, our Keshar milk offers sustained vitality, essential proteins, and bone-building calcium. Serve it chilled on a hot afternoon or gently warmed before bed for a restful sleep.",
    image: "/keshar-milk.png",
    date: "April 30, 2026",
    category: "Wellness Drinks",
    keywords: ["Saffron milk benefits Nepal", "Keshar milk", "Healthy flavored milk"]
  },
  {
    id: 7,
    title: "Traditional Lassi: Beating the Kathmandu Heat Naturally",
    excerpt: "Relive the authentic, nostalgic taste of classic Nepali Lassi, packed with calcium, beneficial probiotics, and chilled to absolute perfection for instant summer refreshment.",
    fullContent: "Our traditional Lassi is a heartfelt tribute to the iconic street-side flavors of old Kathmandu, but reimagined and crafted with the uncompromising hygiene standards of a modern, world-class dairy. It is unequivocally the perfect <b>refreshing summer drink</b> for Nepal's sweltering months.<br/><br/>While carbonated beverages strip your body of hydration and introduce empty calories, our rich, yogurt-based Lassi provides a substantial dose of protein, calcium, and B vitamins. The natural probiotics aid heavily in neutralizing stomach acidity after a spicy meal, making it the healthiest way to cool down, rehydrate, and settle your digestion after a long, exhausting day in the city. Thick, creamy, and mildly sweetened, it’s a guilt-free indulgence for all ages.",
    image: "/lassi.png",
    date: "April 28, 2026",
    category: "Refreshments",
    keywords: ["Best lassi in Kathmandu", "Healthy summer drinks", "Sita Ram Lassi"]
  },
  {
    id: 8,
    title: "Fruity Delight: Why Kids Love Sita Ram Strawberry Lassi",
    excerpt: "A vibrant, fruity twist on our classic favorite that masterfully combines the potent probiotic goodness of fresh yogurt with irresistible, natural strawberry flavors.",
    fullContent: "Getting energetic kids to sit down and eat plain yogurt can often be a daily struggle for parents, but they simply cannot resist the vibrant and tasty <b>Strawberry Lassi from Sita Ram</b>. We purposefully use natural fruit extracts to give it that highly appealing pink glow and authentic, sweet berry taste.<br/><br/>This drink is a brilliant way to sneak essential nutrients into your child's diet. It ensures your children eagerly get their vital daily dose of calcium and gut-friendly bacteria while thoroughly enjoying a sweet treat that feels just like a dessert but acts like a potent health supplement. Packaged conveniently for on-the-go consumption, it is the ultimate healthy lunchbox addition that parents trust and kids actually ask for.",
    image: "/strawberry-lassi.png",
    date: "April 26, 2026",
    category: "Kids Nutrition",
    keywords: ["Strawberry lassi benefits", "Fruit yogurt drink Nepal", "Healthy snacks for kids"]
  },
  {
    id: 9,
    title: "Inside Our Farm: The Journey of Purity",
    excerpt: "Take an exclusive look behind the scenes at how Sita Ram maintains the highest global standards of animal welfare, sustainability, and hygiene.",
    fullContent: "Absolute purity must always start at the source. At <b>Sita Ram Farms</b>, the well-being of our cattle is our highest priority. Our cows are free-roaming and are fed a carefully formulated, natural, and nutrient-rich diet with absolutely no artificial growth hormones or preventive antibiotics. We firmly believe that healthy, happy cows naturally produce significantly better, richer milk.<br/><br/>Our flagship facility in Sanepa utilizes advanced, fully automated closed-circuit milking systems. This incredible technology ensures that the milk is extracted, pasteurized, and packaged without ever touching human hands or being exposed to open air until you open the packet in your own kitchen. We also employ eco-friendly waste management practices to ensure our dairy footprint is as green as the pastures our cows graze on.",
    image: "/farm.png",
    date: "April 24, 2026",
    category: "Farm Life",
    keywords: ["Organic dairy farming Nepal", "Sita Ram Farm", "Dairy hygiene standards"]
  },
  {
    id: 10,
    title: "Milk Subscriptions: Never Run Out of Freshness Again",
    excerpt: "Discover the ultimate convenience with our automated doorstep subscription service, ensuring fresh Gokul milk and dairy essentials reach your home every morning.",
    fullContent: "Imagine waking up every single day to fresh, chilled milk waiting right at your door, without ever having to rush to the local shop or worry about them running out of stock. Our innovative <b>Dairy Subscription Service</b> is specifically designed for the busy, modern Kathmandu family that values both quality and convenience.<br/><br/>Through our seamless digital platform, you have total control. You can easily customize your weekly delivery days, add extra items like paneer or dahi for the weekends, and even pause deliveries with a single click when you go on vacation. Payments are completely hassle-free with secure integrations for local wallets like Khalti, eSewa, and FonePay. Powered by our dedicated cold-chain delivery fleet, we guarantee that the milk you receive at 6 AM is as fresh as when it left our farm.",
    image: "/subscription.png", 
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