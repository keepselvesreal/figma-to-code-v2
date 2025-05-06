// src/components/HandsOnDesign.tsx
import React from 'react';
// Import the debug utility only needed when isDebug is true
import { getDebugBgClass } from '../tests/utils/testGenUtils';

interface Props {
  children?: React.ReactNode;
  isDebug?: boolean; // Add isDebug prop
}

// RGB(58, 222, 99) -> #3ADE63
const HandsOnDesign: React.FC<Props> = ({ children, isDebug = false }) => {
  // Define frame names for clarity
  const navName = 'Nav';
  const heroName = 'Hero';
  const mainName = 'Main';
  const footerName = 'Footer';

  // Define actual background classes based on design tokens
  const navActualBg = 'bg-[#ffe100]'; // From Nav token backgroundColor
  const heroActualBg = 'bg-[#ff00f6]'; // From Hero token backgroundColor
  const mainActualBg = 'bg-transparent'; // Main has transparent background in tokens
  const footerActualBg = 'bg-transparent'; // Footer has transparent background in tokens

  return (
    <div
      className="flex flex-col justify-between items-center gap-[10px] pt-[10px] pb-[10px] pl-[10px] pr-[10px] w-screen h-screen overflow-hidden bg-[#3ade63]"
      data-testid="hands-on-design"
    >
      {/* Nav layout frame */}
      <div
        // Conditionally apply background and keep core layout classes
        className={`flex flex-col justify-center items-center gap-[10px] pt-[25px] pb-[25px] pl-[25px] pr-[25px] w-full h-[166px] overflow-hidden ${isDebug ? getDebugBgClass(navName) : navActualBg}`}
        data-testid={navName}
      >
        {isDebug && navName} {/* Conditionally render name */}
      </div>

      {/* Hero layout frame */}
      <div
        // Conditionally apply background and keep core layout classes
        className={`flex flex-row justify-center items-center gap-[10px] pt-[30px] pb-[30px] pl-[30px] pr-[30px] w-full h-[242px] ${isDebug ? getDebugBgClass(heroName) : heroActualBg}`}
        data-testid={heroName}
      >
         {isDebug && heroName} {/* Conditionally render name */}
      </div>

      {/* Main layout frame */}
      <div
        // Conditionally apply background and keep core layout classes
        className={`flex flex-row items-center gap-[10px] w-[164px] h-[182px] ${isDebug ? getDebugBgClass(mainName) : mainActualBg}`}
        data-testid={mainName}
      >
        {isDebug && mainName} {/* Conditionally render name */}
      </div>

      {/* Footer layout frame */}
      <div
        // Conditionally apply background and keep core layout classes
        className={`flex flex-row items-center gap-[10px] w-[164px] h-[182px] ${isDebug ? getDebugBgClass(footerName) : footerActualBg}`}
        data-testid={footerName}
      >
         {isDebug && footerName} {/* Conditionally render name */}
      </div>

      {/* Child components will go here */}
      {children}
    </div>
  );
};

export default HandsOnDesign;
