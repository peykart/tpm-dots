import React, { useState, useEffect, useRef } from 'react';

const InteractiveDots = () => {
  const [dots, setDots] = useState([]);
  const containerRef = useRef(null);

  // Specific words and styles for special dots
  const specialDots = [
    { 
      word: 'Serendipity', 
      color: 'text-blue-600',
      description: 'The art of finding something beautiful by chance'
    },
    { 
      word: 'Harmony', 
      color: 'text-green-600',
      description: 'A state of perfect balance and agreement'
    },
    { 
      word: 'Radiance', 
      color: 'text-purple-600',
      description: 'An inner glow that illuminates from within'
    },
    { 
      word: 'Cascade', 
      color: 'text-red-600',
      description: 'A flowing sequence of continuous movement'
    }
  ];

  // Generate initial scattered dots
  useEffect(() => {
    const generateDots = () => {
      const newDots = [];
      const circleRadius = 150;
      const centerX = 250;
      const centerY = 250;

      // Create 50 dots
      for (let i = 0; i < 50; i++) {
        const scatterFactor = Math.random() * 300;
        const angle = Math.random() * Math.PI * 2;
        
        // Select special dots - every 12th dot
        const isSpecial = i % 12 === 0;
        
        newDots.push({
          id: i,
          x: centerX + Math.cos(angle) * scatterFactor,
          y: centerY + Math.sin(angle) * scatterFactor,
          targetX: centerX + Math.cos((i / 50) * Math.PI * 2) * circleRadius,
          targetY: centerY + Math.sin((i / 50) * Math.PI * 2) * circleRadius,
          isSpecial: isSpecial,
          specialInfo: isSpecial ? specialDots[i % 4] : null
        });
      }

      return newDots;
    };

    const initialDots = generateDots();
    setDots(initialDots);

    // Smooth transition to circle formation
    const animationFrames = 120;
    let frame = 0;

    const animateToCircle = () => {
      if (frame < animationFrames) {
        const updatedDots = initialDots.map(dot => ({
          ...dot,
          x: dot.x + (dot.targetX - dot.x) * (frame / animationFrames),
          y: dot.y + (dot.targetY - dot.y) * (frame / animationFrames)
        }));

        setDots(updatedDots);
        frame++;
        requestAnimationFrame(animateToCircle);
      }
    };

    const animationTimer = setTimeout(animateToCircle, 1000);

    return () => clearTimeout(animationTimer);
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const updatedDots = dots.map(dot => {
      // Calculate distance between mouse and dot
      const distance = Math.sqrt(
        Math.pow(mouseX - dot.x, 2) + Math.pow(mouseY - dot.y, 2)
      );

      // Proximity-based scaling
      const maxDistance = 100;
      const baseScale = 1;
      const maxScale = 1.5;
      
      let scale = baseScale;
      if (distance < maxDistance) {
        scale = maxScale - (distance / maxDistance) * (maxScale - baseScale);
      }

      return {
        ...dot,
        scale: scale,
        isHovered: distance < 30 && dot.isSpecial
      };
    });

    setDots(updatedDots);
  };

  const handleMouseLeave = () => {
    // Reset all dots to original state
    const resetDots = dots.map(dot => ({
      ...dot,
      scale: 1,
      isHovered: false
    }));
    setDots(resetDots);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-[500px] h-[500px] bg-white"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {dots.map((dot) => (
        <div 
          key={dot.id}
          className={`absolute transition-all duration-200 ease-out ${
            dot.isSpecial && !dot.isHovered
              ? 'animate-pulse' 
              : ''
          }`}
          style={{
            left: `${dot.x}px`,
            top: `${dot.y}px`,
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: dot.isSpecial 
              ? (dot.isHovered ? 'blue' : 'black') 
              : 'black',
            transform: `scale(${dot.scale || 1})`,
          }}
        >
          {dot.isSpecial && dot.isHovered && dot.specialInfo && (
            <div 
              className={`absolute left-full top-0 ml-4 bg-gray-100 border border-gray-300 p-3 rounded shadow-lg transition-all duration-300 ${dot.specialInfo.color}`}
              style={{
                opacity: 1,
                transform: 'translateX(0)'
              }}
            >
              <div className="font-bold">{dot.specialInfo.word}</div>
              <div className="text-sm mt-1">{dot.specialInfo.description}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default InteractiveDots;
