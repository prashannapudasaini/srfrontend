import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, BookOpen, Clock, TrendingUp, Eye, Heart, Share2, Bookmark, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BLOG_POSTS = [
  {
    id: 1,
    title: "Why Sita Ram Gokul Milk is Kathmandu's Top Choice for Purity",
    excerpt: "Sourced directly from the lush, green pastures of Nepal, our Gokul Milk represents generations of dairy excellence, unmatched farm-to-table freshness, and a steadfast commitment to your family's health.",
    fullContent: `<p>Every drop of Sita Ram Gokul Milk undergoes a rigorous 28-point quality check before it reaches your home. In the bustling heart of Kathmandu, finding <strong>pure, unadulterated cow milk</strong> can be a significant challenge. We bridge that gap by sourcing directly from local cooperative farmers who share our deep commitment to ethical and organic farming practices.</p>

<p>Our state-of-the-art pasteurization process preserves essential nutrients—like Vitamin B12, Calcium, and Vitamin D—while completely eliminating harmful bacteria. Furthermore, our milk is carefully homogenized to ensure a consistent, creamy texture in every single sip. Whether you are boiling it for your robust morning chia, pouring it over cereal for growing children, or enjoying a warm glass before bed, Sita Ram Gokul Milk is the perfect choice for health-conscious individuals who refuse to compromise on quality and taste.</p>

<h2>The Science Behind Our Purity</h2>
<p>We employ HTST (High Temperature Short Time) pasteurization at 72°C for 15 seconds, which eliminates pathogens while retaining beneficial enzymes. Our milk is tested for antibiotics, aflatoxins, and adulterants like urea, starch, and formalin. Each batch carries a unique QR code for complete traceability—scan it to know which farm your milk came from, the date of collection, and the quality parameters met.</p>

<h2>Why Local Matters</h2>
<p>By choosing Sita Ram, you're supporting over 2,500 small family farms across the Kathmandu Valley. We pay fair prices that allow farmers to invest in better animal husbandry, creating a virtuous cycle of quality. Our milk travels less than 50km from farm to your doorstep, reducing carbon footprint and ensuring maximum freshness.</p>

<h3>Nutritional Profile (per 240ml serving)</h3>
<ul>
<li>Calories: 150 | Protein: 8g | Fat: 8g | Calcium: 30% DV</li>
<li>Vitamin D: 25% DV | Vitamin B12: 50% DV | Phosphorus: 20% DV</li>
</ul>

<p><strong>📍 Most Searched Keywords:</strong> fresh milk Kathmandu, pure cow milk Nepal, organic milk delivery, pasteurized milk benefits, A2 milk Nepal, full cream milk price, daily milk subscription, best milk brand in Nepal, chemical-free milk, farm fresh milk near me.</p>`,
    image: "/milk.png",
    date: "May 10, 2026",
    category: "Fresh Milk",
    keywords: ["Fresh milk Kathmandu", "pure cow milk Nepal", "organic milk delivery", "A2 milk Nepal", "best milk brand in Nepal", "farm fresh milk near me"],
    readTime: "12 min read",
    highSearchVolume: true
  },
  {
    id: 2,
    title: "The Golden Superfood: Ayurvedic Benefits of Pure Cow Ghee",
    excerpt: "Far more than just a kitchen staple, Sita Ram Pure Cow Ghee is a legacy of wellness, known for its rich aroma, granular texture, and incredible healing properties.",
    fullContent: `<p>Our <strong>Danedar Ghee</strong> is meticulously prepared using methods inspired by the traditional bilona process. This time-honored technique ensures a rich, nutty aroma and a perfect granular texture that mass-produced ghees cannot replicate.</p>

<h2>The Traditional Bilona Method</h2>
<p>Our ghee begins with curd made from A2 milk of indigenous cows. This curd is churned using a wooden churner to separate butter. The butter is then slow-simmered for 4-6 hours until the milk solids caramelize, creating that signature nutty aroma.</p>

<h2>Health Benefits Backed by Science</h2>
<ul>
<li>Butyric acid supports colon health and reduces inflammation</li>
<li>Conjugated Linoleic Acid (CLA) aids in fat metabolism</li>
<li>Vitamin K2 works for bone and cardiovascular health</li>
<li>Medium-chain triglycerides (MCTs) provide quick energy</li>
</ul>

<p><strong>📍 Most Searched Keywords:</strong> pure cow ghee Nepal, bilona ghee benefits, danedar ghee price, A2 cow ghee Kathmandu, organic ghee for babies, ghee for weight loss, best ghee brand Nepal.</p>`,
    image: "/ghee.png",
    date: "May 08, 2026",
    category: "Superfoods",
    keywords: ["Pure cow ghee Nepal", "bilona ghee", "danedar ghee price", "A2 cow ghee", "organic ghee for babies", "ghee for weight loss", "best ghee brand Nepal"],
    readTime: "14 min read",
    highSearchVolume: true
  },
  {
    id: 3,
    title: "The Probiotic Power of Sita Ram Dahi: A Gut-Health Revolution",
    excerpt: "Naturally fermented and proudly 'Shuddha Dudh Bata Baneko', our Dahi is the creamy, cooling, and gut-friendly companion your everyday meals deserve.",
    fullContent: `<p>Sita Ram Dahi is celebrated across the valley for its thick, velvety consistency and perfectly balanced tartness. As a potent <strong>probiotic</strong>, it contains billions of active, live cultures that populate your digestive tract.</p>

<h2>The Fermentation Science</h2>
<p>Our dahi uses specific strains of Lactobacillus bulgaricus and Streptococcus thermophilus. A single 150g serving contains over 100 billion live probiotic cultures—more than most supplement capsules.</p>

<h2>Gut Health Benefits</h2>
<ul>
<li>Improves lactose digestion</li>
<li>Produces short-chain fatty acids that heal the gut lining</li>
<li>Competes with pathogenic bacteria like H. pylori</li>
<li>Enhances mineral absorption</li>
<li>Supports immune function</li>
</ul>

<p><strong>📍 Most Searched Keywords:</strong> best dahi in Nepal, fresh curd Kathmandu, probiotic yogurt benefits, thick curd delivery, dahi for weight loss, gut health foods Nepal.</p>`,
    image: "/dahi.png",
    date: "May 06, 2026",
    category: "Probiotics",
    keywords: ["Best dahi in Nepal", "Fresh curd Kathmandu", "probiotic yogurt", "thick curd delivery", "dahi for weight loss", "gut health foods Nepal"],
    readTime: "13 min read",
    highSearchVolume: true
  },
  {
    id: 4,
    title: "Soft & Nutritious: How to Cook with Sita Ram Fresh Paneer",
    excerpt: "Discover why our vacuum-packed fresh paneer stays incredibly soft and moist, making it the ultimate high-protein choice for vegetarian diets.",
    fullContent: `<p>Finding genuinely <strong>soft paneer in Nepal</strong> can be frustrating. Sita Ram Fresh Paneer changes the game. Using only high-quality whole milk and vacuum-sealing, our paneer retains natural moisture, delicate flavor, and spongy texture.</p>

<h2>Why Our Paneer Stays Soft</h2>
<ul>
<li>Fat content of 25% creates tenderness</li>
<li>No calcium chloride or preservatives</li>
<li>Vacuum sealing prevents moisture loss</li>
<li>Freshness guaranteed within 5 days</li>
</ul>

<h2>Cooking Tips</h2>
<ul>
<li>For curries: soak in warm water for 10 minutes before adding</li>
<li>For grilling: marinate for minimum 2 hours</li>
<li>Never boil paneer for extended periods</li>
</ul>

<p><strong>📍 Most Searched Keywords:</strong> soft paneer Nepal, high protein paneer, fresh cottage cheese delivery, homemade paneer recipe, paneer for weight loss, calcium rich foods.</p>`,
    image: "/paneer.png",
    date: "May 04, 2026",
    category: "Vegetarian Protein",
    keywords: ["Soft paneer Nepal", "High protein paneer", "fresh cottage cheese", "homemade paneer recipe", "paneer for weight loss", "calcium rich foods"],
    readTime: "5 min read",
    highSearchVolume: true
  },
  {
    id: 5,
    title: "Start Your Morning with Sita Ram Processed Butter",
    excerpt: "Swastha ra Swadilo. Crafted for families who refuse to compromise, our creamy, perfectly salted table butter makes every breakfast special.",
    fullContent: `<p>Nothing beats the taste of <strong>Sita Ram Butter</strong> melting over hot Sel Roti, warm paratha, or freshly toasted bread. Crafted exclusively from farm-fresh cream, our butter has a perfectly balanced saltiness and rich mouthfeel.</p>

<h2>From Cream to Butter</h2>
<p>The journey begins with cream separated from our Gokul milk within 2 hours of milking. The cream is aged at 5°C for 12 hours, then churned slowly. The butter is washed three times with chilled water and finished with Himalayan rock salt.</p>

<h2>Butter vs Margarine</h2>
<ul>
<li>Butter: natural dairy fat with vitamins A, D, E, K2; contains butyrate for gut health</li>
<li>Margarine: processed vegetable oils; may contain trans fats; lacks fat-soluble vitamins</li>
</ul>

<p><strong>📍 Most Searched Keywords:</strong> best butter in Nepal, creamy table butter, white butter vs yellow butter, homemade butter recipe, grass fed butter benefits.</p>`,
    image: "/butter.png",
    date: "May 02, 2026",
    category: "Dairy Essentials",
    keywords: ["Best butter in Nepal", "creamy table butter", "white butter", "homemade butter", "grass fed butter benefits"],
    readTime: "5 min read",
    highSearchVolume: true
  },
  {
    id: 6,
    title: "Keshar Milk: The Ultimate Energy Drink for the Modern Lifestyle",
    excerpt: "Experience the fusion of health and taste by combining pure Saffron with our premium low-fat milk for an antioxidant-rich boost.",
    fullContent: `<p>Sita Ram Energy Fresh Keshar Milk blends pure saffron extracts with <strong>energy-rich, easily digestible low-fat milk</strong>. Saffron improves skin glow, boosts memory, and elevates mood through natural antioxidants.</p>

<h2>The Science of Saffron</h2>
<p>Saffron contains crocin, safranal, and picrocrocin. Research shows crocin acts as an antidepressant, safranal has anti-anxiety properties, and antioxidants protect retinal cells.</p>

<h3>Nutritional Highlights (per 250ml)</h3>
<ul>
<li>Calories: 120 | Protein: 9g | Carbs: 14g</li>
<li>Calcium: 35% DV | Vitamin D: 20% DV | Vitamin B12: 40% DV</li>
<li>Saffron content: 15mg of pure Kashmir saffron per bottle</li>
</ul>

<p><strong>📍 Most Searched Keywords:</strong> saffron milk benefits Nepal, keshar milk price, healthy flavored milk, kesar badam milk, traditional Nepali beverages.</p>`,
    image: "/kesharmilk.png",
    date: "April 30, 2026",
    category: "Wellness Drinks",
    keywords: ["Saffron milk benefits", "keshar milk", "healthy flavored milk", "kesar badam milk", "traditional Nepali beverages"],
    readTime: "4 min read",
    highSearchVolume: true
  },
  {
    id: 7,
    title: "Traditional Lassi: Beating the Kathmandu Heat Naturally",
    excerpt: "Relive the authentic taste of classic Nepali Lassi, packed with calcium, beneficial probiotics, and chilled to perfection.",
    fullContent: `<p>Our traditional Lassi is a tribute to the street-side flavors of old Kathmandu. The rich, yogurt-based drink provides protein, calcium, and B vitamins while probiotics neutralize stomach acidity after spicy meals.</p>

<h2>How We Make Lassi</h2>
<p>Our recipe uses 3 parts Sita Ram Dahi to 1 part chilled water, blended until frothy. We add rose water and cardamom for the classic Nepali flavor profile.</p>

<h2>Hydration Science</h2>
<p>Lassi contains electrolytes (sodium, potassium, calcium, magnesium) that match what your body loses through sweat. A 300ml serving hydrates more effectively than 500ml of plain water.</p>

<p><strong>📍 Most Searched Keywords:</strong> best lassi in Kathmandu, healthy summer drinks, sweet lassi vs salted lassi, mango lassi recipe, probiotic drink benefits.</p>`,
    image: "/lassi.png",
    date: "April 28, 2026",
    category: "Refreshments",
    keywords: ["Best lassi Kathmandu", "healthy summer drinks", "sweet lassi", "mango lassi recipe", "probiotic drink benefits"],
    readTime: "4 min read",
    highSearchVolume: true
  },
  {
    id: 8,
    title: "Fruity Delight: Why Kids Love Sita Ram Strawberry Lassi",
    excerpt: "A vibrant, fruity twist that combines probiotic goodness of fresh yogurt with natural strawberry flavors kids can't resist.",
    fullContent: `<p>Kids can't resist the <strong>Strawberry Lassi from Sita Ram</strong>. We use natural fruit extracts for the pink glow and authentic berry taste.</p>

<h2>Why Strawberries Are a Superfruit for Kids</h2>
<ul>
<li>100% of daily Vitamin C (more than an orange!)</li>
<li>3g of fiber for growing digestive systems</li>
<li>Manganese for bone development</li>
<li>Folate for cell growth</li>
<li>Anthocyanins that protect developing brains</li>
</ul>

<h2>Better Than Sugary Drinks</h2>
<p>A typical juice box contains 20-25g of added sugar. Our Strawberry Lassi has 12g natural sugars plus 8g protein, 300mg calcium, and live probiotics.</p>

<p><strong>📍 Most Searched Keywords:</strong> strawberry lassi benefits, fruit yogurt drink Nepal, healthy snacks for kids, calcium for children, probiotic for kids immunity.</p>`,
    image: "/strawberrylassi.png",
    date: "April 26, 2026",
    category: "Kids Nutrition",
    keywords: ["Strawberry lassi benefits", "fruit yogurt drink", "healthy snacks for kids", "calcium for children", "probiotic for kids"],
    readTime: "4 min read",
    highSearchVolume: true
  },
  {
    id: 9,
    title: "Inside Our Farm: The Journey of Purity",
    excerpt: "Take an exclusive look behind the scenes at how Sita Ram maintains global standards of animal welfare, sustainability, and hygiene.",
    fullContent: `<p>At <strong>Sita Ram Farms</strong>, cow well-being is our highest priority. Our cows are free-roaming and fed natural diets with no artificial growth hormones or antibiotics.</p>

<h2>Our Cattle: Heritage Breeds</h2>
<p>We raise indigenous Nepali breeds: Pahadi and Achhami. These breeds produce A2 beta-casein milk—the traditional protein type that's easier to digest. Our herd of 850 cows are identified by name, not number.</p>

<h2>Sustainable Practices</h2>
<ul>
<li>Biogas plant converts manure into cooking fuel</li>
<li>Rainwater harvesting collects 2 million liters annually</li>
<li>Solar panels provide 40% of electricity needs</li>
<li>Delivery fleet reduced carbon emissions by 35%</li>
</ul>

<p><strong>📍 Most Searched Keywords:</strong> organic dairy farming Nepal, A2 milk farms Kathmandu, ethical dairy practices, sustainable farming Nepal, grass fed cows.</p>`,
    image: "/farm.png",
    date: "April 24, 2026",
    category: "Farm Life",
    keywords: ["Organic dairy farming Nepal", "A2 milk farms", "ethical dairy practices", "sustainable farming Nepal", "grass fed cows"],
    readTime: "8 min read",
    highSearchVolume: true
  },
  {
    id: 10,
    title: "Milk Subscriptions: Never Run Out of Freshness Again",
    excerpt: "Discover the ultimate convenience with our automated doorstep subscription service for fresh Gokul milk and dairy essentials.",
    fullContent: `<p>Our innovative <strong>Dairy Subscription Service</strong> is designed for the busy modern family. Customize delivery days, add extra items, and pause deliveries when on vacation.</p>

<h2>How It Works</h2>
<ol>
<li>Choose products: milk (choose fat %), dahi, paneer, ghee, lassi</li>
<li>Set delivery schedule: daily, alternate days, or specific days</li>
<li>Choose delivery window: 5-7 AM or 7-9 AM</li>
<li>Pay weekly/monthly or on delivery</li>
<li>Receive in reusable glass bottles</li>
</ol>

<h2>Subscription Tiers & Savings</h2>
<ul>
<li>Basic: 500ml milk daily → Save 5%</li>
<li>Family: 1L milk + dahi + paneer weekly → Save 12%</li>
<li>Complete: 2L milk + dahi + paneer + ghee + lassi → Save 18%</li>
</ul>

<p><strong>📍 Most Searched Keywords:</strong> milk delivery Kathmandu, online dairy subscription, fresh milk doorstep, daily milk home delivery, dairy app Nepal.</p>`,
    image: "/subscription.png",
    date: "April 22, 2026",
    category: "Services",
    keywords: ["Milk delivery Kathmandu", "online dairy subscription", "fresh milk doorstep", "daily milk home delivery", "dairy app Nepal"],
    readTime: "5 min read",
    highSearchVolume: true
  },
  {
    id: 11,
    title: "Sita Ram Ice Cream: Creamy, Natural & Perfect for Every Season",
    excerpt: "Made from farm-fresh milk and real fruits, our artisanal ice cream contains no artificial colors, no preservatives, and 100% natural ingredients.",
    fullContent: `<p><strong>Sita Ram Ice Cream</strong> is crafted using premium Gokul Milk and fresh cream, churned slowly for the densest, creamiest texture. Our recipe uses only five ingredients: milk, cream, sugar, real fruit/nuts, and love.</p>

<h2>Why Our Ice Cream Stands Out</h2>
<ul>
<li><strong>Farm-to-Freezer Freshness:</strong> Milk processed within 24 hours</li>
<li><strong>High Butterfat Content:</strong> Minimum 14% (standard has 10%)</li>
<li><strong>No Vegetable Oils:</strong> Never use palm oil instead of cream</li>
<li><strong>Real Fruit, Not Syrups:</strong> Real Alphonso mango pulp</li>
<li><strong>Lower Overrun:</strong> Less than 25% air (commercial has 100%+)</li>
</ul>

<h2>Our Flavors</h2>
<ul>
<li>🍦 Malai Kulfi Style - Cardamom and saffron</li>
<li>🍦 Fresh Mango - Seasonal Alphonso mangoes</li>
<li>🍦 Pure Chocolate - Belgian cocoa powder</li>
<li>🍦 Rose & Pistachio - Gulab flavor with Iranian pistachios</li>
<li>🍦 Kesar Pista - Premium saffron and pistachio</li>
</ul>

<p><strong>📍 Most Searched Keywords:</strong> natural ice cream Nepal, best ice cream Kathmandu, homemade ice cream recipe, dairy ice cream vs frozen dessert, mango ice cream seasonal, kulfi near me.</p>`,
    image: "/icecream.png",
    date: "May 12, 2026",
    category: "Ice Cream",
    keywords: ["natural ice cream Nepal", "best ice cream Kathmandu", "homemade ice cream", "mango ice cream", "kulfi near me", "artisanal ice cream"],
    readTime: "6 min read",
    highSearchVolume: true
  },
  {
    id: 12,
    title: "Chillax with Sita Ram: Frozen Yogurt & Chilled Desserts",
    excerpt: "When you want something cool and creamy but lighter than ice cream, our Chillax range of frozen yogurt is your perfect answer.",
    fullContent: `<p><strong>Chillax by Sita Ram</strong> offers frozen yogurt made from probiotic-rich Sita Ram Dahi, churned into a soft-serve consistency with less fat and calories plus live probiotics.</p>

<h2>What is Frozen Yogurt?</h2>
<p>Frozen yogurt is made with yogurt instead of primarily cream. It contains live bacterial cultures even after freezing. The result is a tangier, lighter dessert with more protein and fewer calories.</p>

<h2>Our Chillax Range</h2>
<ul>
<li>❄️ Plain Tart Froyo - Unsweetened, tangy</li>
<li>❄️ Berry Blast Froyo - Strawberry and blueberry puree</li>
<li>❄️ Mango Swirl Froyo - Real mango pulp</li>
<li>❄️ Honey Almond Froyo - Himalayan honey, roasted almonds</li>
<li>❄️ Choco Chip Froyo - For chocolate lovers</li>
</ul>

<h2>Chilled Desserts</h2>
<ul>
<li>🍮 Shrikhand - Traditional Gujarati dessert</li>
<li>🍮 Mishti Doi - Bengali-style sweetened fermented yogurt</li>
<li>🍮 Fruit & Granola Parfait - Layers of dahi, fruits, granola</li>
<li>🍮 Kheer (Rice Pudding) - Slow-cooked rice in reduced milk</li>
</ul>

<h3>Nutritional Comparison (per 150g)</h3>
<ul>
<li>Frozen Yogurt: 120 calories, 6g protein, 3g fat, probiotics</li>
<li>Regular Ice Cream: 270 calories, 4g protein, 15g fat</li>
<li>Shrikhand: 180 calories, 8g protein, 6g fat</li>
</ul>

<p><strong>📍 Most Searched Keywords:</strong> frozen yogurt Nepal, froyo Kathmandu, healthy dessert options, shrikhand near me, mishti doi delivery, guilt free sweets.</p>`,
    image: "/chillax.png",
    date: "May 14, 2026",
    category: "Chillax",
    keywords: ["frozen yogurt Nepal", "froyo Kathmandu", "healthy dessert options", "shrikhand near me", "mishti doi delivery", "guilt free sweets"],
    readTime: "7 min read",
    highSearchVolume: true
  }
];

const BlogPage = () => {
  const featuredPosts = BLOG_POSTS.slice(0, 3);
  const recentPosts = BLOG_POSTS.slice(3, 9);
  const iceCreamPosts = BLOG_POSTS.filter(p => p.category === "Ice Cream");
  const chillaxPosts = BLOG_POSTS.filter(p => p.category === "Chillax");

  return (
    <div className="bg-[#FDF8E7] min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        
        {/* HERO SECTION */}
        <header className="mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#9e111a] to-[#7a0d14] p-12 text-white"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6">
                <BookOpen size={16} /> 12 Articles
              </div>
              <h1 className="text-5xl lg:text-6xl font-serif font-bold mb-4">
                Dairy Wellness <br/>Journal
              </h1>
              <p className="text-white/80 text-lg mb-8 max-w-xl">
                Stories of purity, nutrition tips, and traditional recipes from the heart of Sita Ram Dairy.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm">#PureMilk</span>
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm">#TraditionalGhee</span>
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm">#FarmFresh</span>
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm">#NepaliDairy</span>
              </div>
            </div>
          </motion.div>
        </header>

        {/* FEATURED POSTS */}
        <section className="mb-20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-serif font-bold text-[#1A1A1A]">Featured Stories</h2>
            <Link to="/blog/all" className="text-[#9e111a] text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View all <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPosts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group cursor-pointer"
                onClick={() => window.location.href = `/blog/${post.id}`}
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full">
                  <div className="h-56 overflow-hidden relative">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#9e111a] text-white px-3 py-1 rounded-full text-xs font-bold">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-[#1A1A1A] mb-2 group-hover:text-[#9e111a] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-[#9e111a] text-sm font-medium flex items-center gap-1">
                        Read More <ArrowRight size={14} />
                      </span>
                      <div className="flex items-center gap-3 text-gray-300">
                        <Heart size={16} className="hover:text-red-500 cursor-pointer" />
                        <Share2 size={16} className="hover:text-blue-500 cursor-pointer" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ICE CREAM SECTION */}
        {iceCreamPosts.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-[#9e111a] rounded-full"></div>
              <h2 className="text-2xl font-serif font-bold text-[#1A1A1A]">🍦 Ice Cream Collection</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {iceCreamPosts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group cursor-pointer bg-gradient-to-r from-amber-50 to-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all"
                  onClick={() => window.location.href = `/blog/${post.id}`}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-2/5 h-56 md:h-auto overflow-hidden">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="md:w-3/5 p-6">
                      <span className="inline-flex items-center gap-1 text-amber-600 text-sm font-bold mb-2">🍨 Ice Cream</span>
                      <h3 className="text-xl font-serif font-bold text-[#1A1A1A] mb-2 group-hover:text-[#9e111a] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
                      <span className="text-[#9e111a] text-sm font-medium flex items-center gap-1">
                        Discover Flavor <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* CHILLAX SECTION */}
        {chillaxPosts.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-[#9e111a] rounded-full"></div>
              <h2 className="text-2xl font-serif font-bold text-[#1A1A1A]">❄️ Chillax - Guilt-Free Desserts</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {chillaxPosts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group cursor-pointer bg-gradient-to-r from-blue-50 to-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all"
                  onClick={() => window.location.href = `/blog/${post.id}`}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-2/5 h-56 md:h-auto overflow-hidden">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="md:w-3/5 p-6">
                      <span className="inline-flex items-center gap-1 text-blue-600 text-sm font-bold mb-2">🥄 Frozen Yogurt</span>
                      <h3 className="text-xl font-serif font-bold text-[#1A1A1A] mb-2 group-hover:text-[#9e111a] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
                      <span className="text-[#9e111a] text-sm font-medium flex items-center gap-1">
                        Explore Chillax <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* RECENT POSTS GRID */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-serif font-bold text-[#1A1A1A]">Latest Articles</h2>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <TrendingUp size={14} /> Most searched topics this week
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post, idx) => (
              <motion.article 
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col h-full"
                onClick={() => window.location.href = `/blog/${post.id}`}
              >
                <div className="h-56 overflow-hidden relative">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-[#9e111a] text-white px-3 py-1 rounded-full text-[10px] font-bold">
                      {post.category}
                    </span>
                    {post.highSearchVolume && (
                      <span className="bg-amber-500 text-white px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                        <TrendingUp size={10} /> Popular
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 text-gray-400 text-xs mb-3">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                  </div>
                  
                  <h3 className="text-lg font-serif font-bold text-[#1A1A1A] mb-2 leading-tight group-hover:text-[#9e111a] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-500 text-sm mb-4 leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.keywords.slice(0, 3).map((keyword, i) => (
                      <span key={i} className="text-[8px] bg-gray-50 text-gray-400 px-2 py-1 rounded-full font-medium">
                        {keyword.length > 20 ? keyword.slice(0, 18) + '…' : keyword}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[#9e111a] text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read Full Story <ArrowRight size={12} />
                    </span>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Eye size={14} className="hover:text-gray-500 cursor-pointer" />
                      <Bookmark size={14} className="hover:text-[#9e111a] cursor-pointer" />
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* NEWSLETTER SECTION */}
        <section className="mt-20 bg-[#1A1A1A] rounded-3xl p-10 text-center">
          <h3 className="text-2xl font-serif font-bold text-white mb-2">Never Miss a Story</h3>
          <p className="text-gray-400 mb-6">Get the latest dairy wellness articles delivered to your inbox.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 px-5 py-3 rounded-full bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:border-[#9e111a]"
            />
            <button className="bg-[#9e111a] text-white px-6 py-3 rounded-full font-bold hover:bg-[#7a0d14] transition-colors">
              Subscribe
            </button>
          </div>
        </section>

        {/* SEO FOOTER */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-400">
            <div>
              <h4 className="font-bold text-gray-500 mb-2">Trending Searches</h4>
              <ul className="space-y-1">
                <li>fresh milk Kathmandu</li>
                <li>pure cow ghee Nepal</li>
                <li>best dahi in Nepal</li>
                <li>soft paneer delivery</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-500 mb-2">Popular Products</h4>
              <ul className="space-y-1">
                <li>Gokul Milk</li>
                <li>Danedar Ghee</li>
                <li>Fresh Paneer</li>
                <li>Traditional Lassi</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-500 mb-2">Ice Cream</h4>
              <ul className="space-y-1">
                <li>Malai Kulfi</li>
                <li>Mango Ice Cream</li>
                <li>Kesar Pista</li>
                <li>Rose Pistachio</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-500 mb-2">Chillax Range</h4>
              <ul className="space-y-1">
                <li>Frozen Yogurt</li>
                <li>Shrikhand</li>
                <li>Mishti Doi</li>
                <li>Fruit Parfait</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;