'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface RatingProps {
  count: number;
  value: number;
  onValueChange?: (value: number) => void;
  size?: number;
  className?: string;
  readOnly?: boolean;
}

export function Rating({ count, value, onValueChange, size = 20, className, readOnly = false }: RatingProps) {
  const [hoverValue, setHoverValue] = useState<number | undefined>(undefined);
  const stars = Array.from({ length: count }, (_, i) => i + 1);

  const handleClick = (val: number) => {
    if (readOnly || !onValueChange) return;
    onValueChange(val);
  };

  const handleMouseEnter = (val: number) => {
    if (readOnly) return;
    setHoverValue(val);
  };
  
  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverValue(undefined);
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {stars.map((starValue) => (
        <Star
          key={starValue}
          size={size}
          className={cn(
            "transition-colors",
            !readOnly && "cursor-pointer",
            (hoverValue || value) >= starValue ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          )}
          onClick={() => handleClick(starValue)}
          onMouseEnter={() => handleMouseEnter(starValue)}
          onMouseLeave={handleMouseLeave}
        />
      ))}
    </div>
  );
}
