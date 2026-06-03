import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Share2, Clock, Tag, Heart, Bookmark, Home, IceCream, Sparkles, TrendingUp, ChevronLeft, ChevronRight, Award, Shield, Leaf, Droplets, Sun, Moon, Zap, Lightbulb } from 'lucide-react';

// BLOG POSTS DATA - Embedded directly to avoid import issues
const BLOG_POSTS = [
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

export default function BlogPostDetail() {
  const { id } = useParams();
  const post = BLOG_POSTS.find(p => p.id === parseInt(id));
  const otherPosts = BLOG_POSTS.filter(p => p.id !== parseInt(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const scrollCarousel = (direction) => {
    const container = document.getElementById('blog-carousel');
    if (container) {
      const scrollAmount = 420;
      container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  // Show loading or not found state
  if (!post) {
    return (
      <div className="bg-[#FDF8E7] min-h-screen pt-40 text-center">
        <div className="max-w-md mx-auto px-6">
          <div className="text-6xl mb-6">🥛</div>
          <h2 className="text-2xl font-serif font-bold text-[#1A1A1A] mb-3">Article Not Found</h2>
          <p className="text-gray-500 mb-6">The dairy story you're looking for has been milked away or never existed.</p>
          <Link to="/blog" className="inline-flex items-center gap-2 bg-[#9e111a] text-white px-6 py-3 rounded-full font-bold hover:bg-[#7a0d14] transition-colors">
            <ArrowLeft size={18} /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const getCategoryIcon = () => {
    if (post.category === "Ice Cream") return <IceCream size={16} />;
    if (post.category === "Chillax") return <Sparkles size={16} />;
    return null;
  };

  const getCategoryStyle = () => {
    if (post.category === "Ice Cream") return "bg-amber-100 text-amber-700";
    if (post.category === "Chillax") return "bg-blue-100 text-blue-700";
    return "bg-[#9e111a] text-white";
  };

  return (
    <div className="bg-[#FDF8E7] min-h-screen pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6 font-medium">
          <Link to="/" className="hover:text-[#9e111a] transition-colors flex items-center gap-1">
            <Home size={12} /> Home
          </Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-[#9e111a] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-[#9e111a] truncate max-w-[200px]">{post.title.substring(0, 40)}...</span>
        </div>
        
        {/* Back Button */}
        <Link to="/blog" className="inline-flex items-center gap-2 text-[#9e111a] font-black text-xs uppercase tracking-widest mb-8 hover:gap-3 transition-all group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Blog
        </Link>
        
        {/* Hero Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-8">
          <img src={post.image} alt={post.title} className="w-full h-[400px] lg:h-[500px] object-cover" />
          {post.highSearchVolume && (
            <div className="absolute top-5 right-5 bg-amber-500 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-lg">
              <TrendingUp size={12} /> Trending on Google
            </div>
          )}
        </div>
        
        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-gray-400 text-xs font-black uppercase tracking-wider mb-6">
          <span className={`${getCategoryStyle()} px-3 py-1.5 rounded-lg flex items-center gap-1.5`}>
            {getCategoryIcon()} {post.category}
          </span>
          <span className="flex items-center gap-1.5"><Calendar size={13} /> {post.date}</span>
          <span className="flex items-center gap-1.5"><Clock size={13} /> {post.readTime}</span>
          <span className="flex items-center gap-1.5"><User size={13} /> Sita Ram Dairy</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl lg:text-6xl font-serif font-black text-[#1A1A1A] leading-tight mb-6">
          {post.title}
        </h1>

        {/* Excerpt */}
        <p className="text-xl text-[#9e111a]/80 font-serif italic leading-relaxed mb-8 border-l-4 border-[#9e111a] pl-6">
          {post.excerpt}
        </p>

        {/* Full Content */}
        <div className="prose prose-lg max-w-none text-gray-600 font-medium leading-relaxed space-y-8">
          <div dangerouslySetInnerHTML={{ __html: post.fullContent }} />
        </div>

        {/* Keywords Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold text-[#1A1A1A] flex items-center gap-2 text-sm">
              <Tag size={16} /> Most Searched Keywords:
            </span>
            <div className="flex flex-wrap gap-2">
              {post.keywords?.map((kw, i) => (
                <span key={i} className="text-[10px] bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full text-gray-600 font-medium hover:bg-[#9e111a]/10 hover:text-[#9e111a] hover:border-[#9e111a]/30 transition-all cursor-pointer">
                  #{kw.replace(/\s+/g, '')}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 pt-6 border-t border-gray-200 flex justify-between items-center">
          <div className="flex gap-3">
            <button className="p-2.5 bg-white rounded-full shadow-md text-gray-400 hover:text-red-500 hover:shadow-lg transition-all">
              <Heart size={18} />
            </button>
            <button className="p-2.5 bg-white rounded-full shadow-md text-gray-400 hover:text-[#9e111a] hover:shadow-lg transition-all">
              <Bookmark size={18} />
            </button>
            <button className="p-2.5 bg-white rounded-full shadow-md text-gray-400 hover:text-blue-500 hover:shadow-lg transition-all">
              <Share2 size={18} />
            </button>
          </div>
          <div className="text-xs text-gray-400">
            Article #{post.id} • Last updated {post.date}
          </div>
        </div>
      </div>

      {/* FULL WIDTH SCROLLABLE MORE DAIRY STORIES SECTION */}
      <div className="w-full bg-[#f5f0e0] mt-16 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-3xl font-serif font-bold text-[#1A1A1A] flex items-center gap-2">
                📚 More Dairy Stories
              </h3>
              <p className="text-gray-500 mt-1">Explore our collection of {otherPosts.length} wellness articles and traditional recipes</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => scrollCarousel('left')}
                className="w-11 h-11 rounded-full bg-white shadow-md hover:bg-[#9e111a] hover:text-white transition-all flex items-center justify-center"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => scrollCarousel('right')}
                className="w-11 h-11 rounded-full bg-white shadow-md hover:bg-[#9e111a] hover:text-white transition-all flex items-center justify-center"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          
          {/* Scrollable Carousel */}
          <div 
            id="blog-carousel"
            className="flex gap-8 overflow-x-auto scroll-smooth pb-8"
            style={{ 
              scrollbarWidth: 'thin', 
              msOverflowStyle: 'auto',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {otherPosts.map((related) => (
              <Link 
                key={related.id} 
                to={`/blog/${related.id}`}
                className="group flex-shrink-0 w-[380px] bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="h-56 overflow-hidden relative">
                  <img 
                    src={related.image} 
                    alt={related.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  {related.highSearchVolume && (
                    <div className="absolute top-3 right-3 bg-amber-500 text-white px-2 py-0.5 rounded-full text-[8px] font-bold flex items-center gap-1">
                      <TrendingUp size={8} /> Trending
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3">
                    <span className={`text-[9px] font-black px-2.5 py-1 rounded-full ${
                      related.category === "Ice Cream" ? "bg-amber-100 text-amber-700" :
                      related.category === "Chillax" ? "bg-blue-100 text-blue-700" :
                      "bg-[#9e111a] text-white"
                    }`}>
                      {related.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-2">
                    <span className="flex items-center gap-1"><Calendar size={11} /> {related.date}</span>
                    <span className="flex items-center gap-1"><Clock size={11} /> {related.readTime}</span>
                  </div>
                  <h4 className="font-serif font-bold text-[#1A1A1A] mb-2 group-hover:text-[#9e111a] transition-colors line-clamp-2 text-lg">
                    {related.title}
                  </h4>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                    {related.excerpt.substring(0, 120)}...
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-[#9e111a] text-[11px] font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read Full Story <ChevronRight size={11} />
                    </span>
                    <button className="text-gray-300 hover:text-[#9e111a] transition-colors">
                      <Bookmark size={14} />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Carousel Scroll Hint */}
          <div className="text-center mt-8">
            <p className="text-xs text-gray-400 flex items-center justify-center gap-3">
              <ChevronLeft size={14} /> 
              Scroll horizontally to explore all {otherPosts.length} articles 
              <ChevronRight size={14} />
            </p>
            <p className="text-[10px] text-gray-300 mt-2">
              Showing {otherPosts.length} of {otherPosts.length} dairy stories
            </p>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="w-full bg-gradient-to-r from-[#1A1A1A] to-[#2a2a2a] py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-serif font-bold text-white mb-2">Never Miss a Dairy Story</h3>
          <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">Get the latest wellness articles, traditional recipes, and product updates delivered to your inbox.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 px-5 py-3 rounded-full bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:border-[#9e111a] text-sm"
            />
            <button className="bg-[#9e111a] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-[#7a0d14] transition-colors">
              Subscribe
            </button>
          </div>
          <p className="text-gray-500 text-[10px] mt-4">No spam. Unsubscribe anytime. Read our privacy policy.</p>
        </div>
      </div>

      {/* SEO Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-10">
        <div className="text-center text-[10px] text-gray-300 border-t border-gray-200 pt-8">
          <p>Sita Ram Dairy - Premium dairy products in Kathmandu, Nepal | Most searched: fresh milk delivery, pure cow ghee, probiotic dahi, soft paneer, traditional lassi, natural ice cream, frozen yogurt, keshar milk, A2 milk, organic dairy</p>
        </div>
      </div>
    </div>
  );
}