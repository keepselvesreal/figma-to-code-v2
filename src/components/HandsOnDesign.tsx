// src/components/HandsOnDesign.tsx
import React from 'react';

interface Props {
  children?: React.ReactNode;
}

// RGB(58, 222, 99) -> #3ADE63
const HandsOnDesign: React.FC<Props> = ({ children }) => {
  return (
    <div
      className="flex flex-col justify-between items-center gap-[10px] pt-[10px] pb-[10px] pl-[10px] pr-[10px] w-[393px] h-[808px] overflow-hidden bg-[#3ade63]"
      data-testid="hands-on-design"
    >
      {/* Child components will go here */}
      {children}
    </div>
  );
};

export default HandsOnDesign;
