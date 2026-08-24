'use client';

import React, { useState, useRef, useCallback } from 'react';

interface TiltCardProps {
  children: (props: { pointerX: number; pointerY: number; isHovered: boolean }) => React.ReactNode;
  enabled?: boolean;
  maxAngle?: number;
  className?: string;
  cardRef?: React.RefObject<HTMLDivElement>;
}

export function TiltCard({
  children,
  enabled = true,
  maxAngle = 14,
  className = '',
  cardRef: externalRef,
}: TiltCardProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [pointerX, setPointerX] = useState(50);
  const [pointerY, setPointerY] = useState(50);
  const [isHovered, setIsHovered] = useState(false);

  const internalRef = useRef<HTMLDivElement>(null);
  const containerRef = externalRef || internalRef;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const px = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const py = Math.max(0, Math.min(100, (y / rect.height) * 100));

    setPointerX(px);
    setPointerY(py);

    const rY = ((px - 50) / 50) * maxAngle;
    const rX = -((py - 50) / 50) * maxAngle;

    setRotateX(rX);
    setRotateY(rY);
    setIsHovered(true);
  }, [enabled, maxAngle, containerRef]);

  const handleMouseLeave = useCallback(() => {
    setRotateX(0);
    setRotateY(0);
    setPointerX(50);
    setPointerY(50);
    setIsHovered(false);
  }, []);

  return (
    <div
      style={{ perspective: 1200 }}
      className={`inline-block select-none ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={containerRef}
        style={{
          transform: enabled && isHovered
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
          transformStyle: 'preserve-3d',
        }}
        className="relative shadow-2xl rounded-[20px]"
      >
        {children({ pointerX, pointerY, isHovered })}
      </div>
    </div>
  );
}
