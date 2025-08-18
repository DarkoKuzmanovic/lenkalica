"use client";

export default function ShortsSkeleton() {
  return (
    <div className="card bg-base-100 shadow-lg animate-pulse">
      {/* Image placeholder */}
      <figure className="relative h-56 overflow-hidden bg-base-300">
        <div className="w-full h-full bg-base-300"></div>
      </figure>
      
      <div className="card-body p-6">
        <div className="flex-1 space-y-3">
          {/* Title placeholder */}
          <div className="space-y-2">
            <div className="h-6 bg-base-300 rounded w-full"></div>
            <div className="h-6 bg-base-300 rounded w-3/4"></div>
          </div>
        </div>
        
        {/* Footer with date */}
        <div className="card-actions justify-between items-center pt-4 border-t border-base-300">
          <div className="h-4 w-32 bg-base-300 rounded"></div>
        </div>
      </div>
    </div>
  );
}