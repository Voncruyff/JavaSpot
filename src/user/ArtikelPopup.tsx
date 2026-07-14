import React from 'react';
import { User, X, Calendar } from 'lucide-react';

interface ArtikelPopupProps {
  article: any | null;
  onClose: () => void;
}

export default function ArtikelPopup({ article, onClose }: ArtikelPopupProps) {
  if (!article) return null;

  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] bg-neutral-900/80 backdrop-blur-sm flex items-center justify-center p-0 md:p-6"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full h-full md:max-w-6xl md:h-[95vh] md:rounded-[32px] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Header with Close Button */}
        <div className="absolute top-0 left-0 w-full p-4 flex justify-end z-20 pointer-events-none">
          <button 
            onClick={onClose}
            className="pointer-events-auto bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-md transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {/* Header Image */}
          <div className="w-full h-[40vh] md:h-[50vh] relative shrink-0">
            <img 
              src={article.thumbnail_url || article.image} 
              alt={article.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Subtle gradient to ensure close button visibility if we didn't use absolute fixed above, but good for aesthetics */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent"></div>
          </div>

          {/* Article Header (Title & Meta) */}
          <div className="max-w-4xl mx-auto px-6 pt-10 md:pt-16 pb-8 md:pb-12 text-center">
            <h1 className="text-3xl md:text-5xl font-black font-display text-neutral-900 leading-tight mb-6">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm font-semibold text-neutral-500 uppercase tracking-wider">
              <span className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-amber-600" />
                </div>
                {article.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(article.created_at || article.date)}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="max-w-3xl mx-auto w-full h-px bg-neutral-100 mb-10"></div>

          {/* Article Content */}
          <div className="max-w-4xl mx-auto px-6 md:px-12 pb-20">
            {article.content && article.content.includes('<') ? (
              <div 
                className="prose prose-lg prose-neutral max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-[#2c5340] hover:prose-a:text-[#1e3c2e] prose-img:rounded-2xl prose-img:shadow-sm leading-relaxed text-neutral-800 text-justify break-words" 
                dangerouslySetInnerHTML={{ __html: article.content }} 
              />
            ) : (
              <div className="prose prose-lg max-w-none text-neutral-800 leading-relaxed space-y-6 text-justify break-words">
                {(article.content || article.description)?.split('\n').map((paragraph: string, idx: number) => {
                  if (!paragraph.trim()) return null;
                  return <p key={idx}>{paragraph}</p>;
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
