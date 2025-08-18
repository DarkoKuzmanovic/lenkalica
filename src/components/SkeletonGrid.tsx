"use client";

interface SkeletonGridProps {
  count?: number;
  columns?: 2 | 3 | 4;
  type?: 'cards' | 'images' | 'mixed';
}

export default function SkeletonGrid({ 
  count = 6, 
  columns = 3,
  type = 'cards'
}: SkeletonGridProps) {
  
  const getGridClasses = () => {
    const columnClasses = {
      2: 'md:grid-cols-2',
      3: 'md:grid-cols-2 lg:grid-cols-3', 
      4: 'md:grid-cols-2 lg:grid-cols-4'
    };
    return `grid gap-6 ${columnClasses[columns]}`;
  };

  const renderSkeleton = (index: number) => {
    if (type === 'images') {
      return (
        <div key={index} className="animate-pulse">
          <div className="aspect-square bg-base-300 rounded-lg mb-3"></div>
          <div className="h-4 bg-base-300 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-base-300 rounded w-1/2"></div>
        </div>
      );
    }

    if (type === 'mixed') {
      return (
        <div key={index} className="animate-pulse space-y-4">
          <div className="h-48 bg-base-300 rounded-lg"></div>
          <div className="space-y-2">
            <div className="h-4 bg-base-300 rounded w-full"></div>
            <div className="h-4 bg-base-300 rounded w-3/4"></div>
          </div>
        </div>
      );
    }

    // Default cards
    return (
      <div key={index} className="card bg-base-100 shadow-lg animate-pulse">
        <div className="h-48 bg-base-300 rounded-t-lg"></div>
        <div className="card-body p-6">
          <div className="space-y-3">
            <div className="h-5 w-16 bg-base-300 rounded-full"></div>
            <div className="h-6 bg-base-300 rounded w-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-base-300 rounded w-full"></div>
              <div className="h-4 bg-base-300 rounded w-5/6"></div>
              <div className="h-4 bg-base-300 rounded w-4/5"></div>
            </div>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-base-300 mt-6">
            <div className="h-4 w-24 bg-base-300 rounded"></div>
            <div className="h-4 w-16 bg-base-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={getGridClasses()}>
      {Array.from({ length: count }).map((_, index) => renderSkeleton(index))}
    </div>
  );
}