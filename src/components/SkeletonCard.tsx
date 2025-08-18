"use client";

interface SkeletonCardProps {
  variant?: 'default' | 'featured' | 'compact' | 'list';
}

export default function SkeletonCard({ variant = 'default' }: SkeletonCardProps) {
  const getCardClasses = () => {
    const baseClasses = "card bg-base-100 shadow-lg animate-pulse";
    const variantClasses = {
      default: "",
      featured: "lg:col-span-2",
      compact: "card-compact",
      list: "card-list"
    };
    return `${baseClasses} ${variantClasses[variant]}`;
  };
  
  const getFigureHeight = () => {
    const heights = {
      default: "h-56",
      featured: "h-72",
      compact: "h-32", 
      list: "h-32"
    };
    return heights[variant];
  };

  return (
    <div className={getCardClasses()}>
      <figure className={`relative ${getFigureHeight()} overflow-hidden bg-base-300`}>
        {/* Image placeholder */}
        <div className="w-full h-full bg-base-300"></div>
        
        {/* Badge placeholders */}
        {variant === 'featured' && (
          <div className="absolute top-4 left-4">
            <div className="h-6 w-20 bg-base-200 rounded-full"></div>
          </div>
        )}
        
        <div className="absolute top-3 right-3">
          <div className="h-5 w-14 bg-base-200 rounded-full"></div>
        </div>
      </figure>
      
      <div className={`card-body ${variant === 'compact' ? 'p-4' : 'p-6'}`}>
        <div className="flex-1 space-y-3">
          {/* Category badge */}
          <div className="h-5 w-16 bg-base-300 rounded-full"></div>
          
          {/* Title */}
          <div className="space-y-2">
            <div className="h-6 bg-base-300 rounded w-full"></div>
            {variant === 'featured' && (
              <div className="h-6 bg-base-300 rounded w-3/4"></div>
            )}
          </div>
          
          {/* Excerpt */}
          <div className="space-y-2">
            <div className="h-4 bg-base-300 rounded w-full"></div>
            <div className="h-4 bg-base-300 rounded w-5/6"></div>
            {!['compact', 'list'].includes(variant) && (
              <div className="h-4 bg-base-300 rounded w-4/5"></div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="card-actions justify-between items-center pt-4 border-t border-base-300">
          <div className="h-4 w-24 bg-base-300 rounded"></div>
          <div className="h-4 w-16 bg-base-300 rounded"></div>
        </div>
      </div>
    </div>
  );
}