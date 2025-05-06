// src/components/HandsOnDesign.tsx
import React from 'react';

interface Props {
  children?: React.ReactNode;
}

// RGB(58, 222, 99) -> #3ADE63
const HandsOnDesign: React.FC<Props> = ({ children }) => {
  return (
    <div
      className="flex flex-col justify-between items-center gap-[10px] pt-[10px] pb-[10px] pl-[10px] pr-[10px] w-screen h-screen overflow-hidden bg-[#3ade63]"
      data-testid="hands-on-design"
    >
      {/* Nav layout frame */}
      <div
        className="flex flex-col justify-center items-center gap-[10px] pt-[25px] pb-[25px] pl-[25px] pr-[25px] w-[373px] h-[166px] overflow-hidden bg-[#ffe100]"
        data-testid="Nav"
      >
        {/* Content for Nav frame goes here */}
      </div>

      {/* Hero layout frame */}
      <div
        className="flex flex-row justify-center items-center gap-[10px] pt-[30px] pb-[30px] pl-[30px] pr-[30px] w-[373px] h-[242px] bg-[#ff00f6]"
        data-testid="Hero"
      >
        {/* Content for Hero frame goes here */}
      </div>

      {/* Main layout frame */}
      <div
        className="flex flex-row items-center gap-[10px] w-[164px] h-[182px] bg-transparent"
        data-testid="Main"
      >
        {/* Content for Main frame goes here */}
      </div>

      {/* Footer layout frame */}
      <div
        className="flex flex-row items-center gap-[10px] w-[164px] h-[182px] bg-transparent"
        data-testid="Footer"
      >
        {/* Content for Footer frame goes here */}
      </div>

      {/* Child components will go here */}
      {children}
    </div>
  );
};

export default HandsOnDesign;
