// src/components/HandsOnDesign.tsx
import React from 'react';
// Import the debug utility (consider removing after layout verification)
import { getDebugBgClass } from '../tests/utils/testGenUtils';

interface Props {
  children?: React.ReactNode;
}

// RGB(58, 222, 99) -> #3ADE63
const HandsOnDesign: React.FC<Props> = ({ children }) => {
  // Define frame names for clarity
  const navName = 'Nav';
  const heroName = 'Hero';
  const mainName = 'Main';
  const footerName = 'Footer';

  return (
    <div
      className="flex flex-col justify-between items-center gap-[10px] pt-[10px] pb-[10px] pl-[10px] pr-[10px] w-screen h-screen overflow-hidden bg-[#3ade63]"
      data-testid="hands-on-design"
    >
      {/* Nav layout frame (Apply debug BG and add name) */}
      <div
        // Replace w-[373px] with w-full based on design token layoutSizingHorizontal: FILL
        className={`flex flex-col justify-center items-center gap-[10px] pt-[25px] pb-[25px] pl-[25px] pr-[25px] w-full h-[166px] overflow-hidden ${getDebugBgClass(navName)}`}
        data-testid={navName}
      >
        {navName} {/* Add frame name */}
      </div>

      {/* Hero layout frame (Apply debug BG and add name) */}
      <div
        // Replace w-[373px] with w-full based on design token layoutSizingHorizontal: FILL
        className={`flex flex-row justify-center items-center gap-[10px] pt-[30px] pb-[30px] pl-[30px] pr-[30px] w-full h-[242px] ${getDebugBgClass(heroName)}`}
        data-testid={heroName}
      >
         {heroName} {/* Add frame name */}
      </div>

      {/* Main layout frame (Apply debug BG and add name) */}
      <div
        className={`flex flex-row items-center gap-[10px] w-[164px] h-[182px] ${getDebugBgClass(mainName)}`}
        data-testid={mainName}
      >
        {mainName} {/* Add frame name */}
      </div>

      {/* Footer layout frame (Apply debug BG and add name) */}
      <div
        className={`flex flex-row items-center gap-[10px] w-[164px] h-[182px] ${getDebugBgClass(footerName)}`}
        data-testid={footerName}
      >
         {footerName} {/* Add frame name */}
      </div>

      {/* Child components will go here */}
      {children}
    </div>
  );
};

export default HandsOnDesign;
