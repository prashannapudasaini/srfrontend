import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';
// Import the same data array used in BlogPage (or move to a separate config file)
import { BLOG_POSTS } from './BlogPage'; 

export default function BlogPostDetail() {
  const { id } = useParams();
  const post = BLOG_POSTS.find(p => p.id === parseInt(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!post) return <div className="py-40 text-center font-black">Article Not Found</div>;

  return (
    <div className="bg-[#FDF8E7] min-h-screen pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <Link to="/blog" className="inline-flex items-center gap-2 text-[#9e111a] font-black text-xs uppercase tracking-widest mb-8 hover:-translate-x-2 transition-transform">
          <ArrowLeft size={16} /> Back to Blog
        </Link>
        
        <img src={post.image} alt={post.title} className="w-full h-[500px] object-cover rounded-[3rem] shadow-2xl mb-12" />
        
        <div className="flex items-center gap-4 text-gray-400 text-xs font-black uppercase tracking-widest mb-6">
          <span className="bg-[#9e111a] text-white px-3 py-1 rounded-lg">{post.category}</span>
          <span><Calendar size={14} className="inline mr-1"/> {post.date}</span>
          <span><User size={14} className="inline mr-1"/> By Sita Ram Admin</span>
        </div>

        <h1 className="text-4xl lg:text-6xl font-serif font-black text-[#1A1A1A] leading-tight mb-8">
          {post.title}
        </h1>

        <div className="prose prose-lg max-w-none text-gray-600 font-medium leading-relaxed space-y-6">
          {/* We use the expanded content here */}
          <p className="text-xl text-[#1A1A1A] font-bold leading-relaxed">{post.excerpt}</p>
          <div dangerouslySetInnerHTML={{ __html: post.fullContent }} />
        </div>

        <div className="mt-16 pt-10 border-t border-gray-200 flex justify-between items-center">
           <div className="flex gap-2">
             {post.keywords.map(kw => <span key={kw} className="text-[10px] bg-white border border-gray-200 px-3 py-1 rounded-full text-gray-400 font-bold">#{kw.replace(/\s+/g, '')}</span>)}
           </div>
           <button className="p-3 bg-white rounded-full shadow-md text-[#9e111a] hover:bg-[#9e111a] hover:text-white transition-all">
             <Share2 size={20} />
           </button>
        </div>
      </div>
    </div>
  );
}
