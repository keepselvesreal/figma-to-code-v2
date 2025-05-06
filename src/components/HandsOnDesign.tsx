// src/components/HandsOnDesign.tsx
import React from 'react';
// 디버그 유틸리티는 isDebug가 true일 때만 필요합니다
import { getDebugBgClass } from '../tests/utils/testGenUtils';

interface Props {
  children?: React.ReactNode;
  isDebug?: boolean; // isDebug 속성 추가
}

// RGB(58, 222, 99) -> #3ADE63
const HandsOnDesign: React.FC<Props> = ({ children, isDebug = false }) => {
  // 프레임 이름을 명확하게 정의
  const navName = 'Nav';
  const heroName = 'Hero';
  const mainName = 'Main';
  const footerName = 'Footer';

  // 디자인 토큰에 기반한 실제 배경 클래스 정의
  const navActualBg = 'bg-[#ffe100]'; // Nav 토큰 backgroundColor에서 가져옴
  const heroActualBg = 'bg-[#ff00f6]'; // Hero 토큰 backgroundColor에서 가져옴
  const mainActualBg = 'bg-transparent'; // 메인은 토큰에서 투명 배경
  const footerActualBg = 'bg-transparent'; // 푸터는 토큰에서 투명 배경

  return (
    <div
      className="flex flex-col justify-between items-center gap-[10px] pt-[10px] pb-[10px] pl-[10px] pr-[10px] w-screen h-screen overflow-hidden bg-[#3ade63]"
      data-testid="hands-on-design"
    >
      {/* 네비게이션 레이아웃 프레임 */}
      <div
        // 조건부로 배경을 적용하고 핵심 레이아웃 클래스 유지
        className={`flex flex-col justify-center items-center gap-[10px] pt-[25px] pb-[25px] pl-[25px] pr-[25px] w-full h-[166px] overflow-hidden ${isDebug ? getDebugBgClass(navName) : navActualBg}`}
        data-testid={navName}
      >
        {isDebug ? (
          navName
        ) : (
          <>
            <div
              data-testid="profile-img"
              className="bg-[#009DFF] w-[63px] h-[76px] rounded-full"
            ></div>
            <p data-testid="user-name" className="text-[#000000]">
              User Name
            </p>
          </>
        )}
      </div>

      {/* 히어로 레이아웃 프레임 */}
      <div
        // 조건부로 배경을 적용하고 핵심 레이아웃 클래스 유지
        className={`flex flex-row justify-center items-center gap-[10px] pt-[30px] pb-[30px] pl-[30px] pr-[30px] w-full h-[242px] ${isDebug ? getDebugBgClass(heroName) : heroActualBg}`}
        data-testid={heroName}
      >
        {isDebug && heroName} {/* 조건부로 이름 렌더링 */}
      </div>

      {/* 메인 레이아웃 프레임 */}
      <div
        // 조건부로 배경을 적용하고 핵심 레이아웃 클래스 유지
        className={`flex flex-row items-center gap-[10px] w-[164px] h-[182px] ${isDebug ? getDebugBgClass(mainName) : mainActualBg}`}
        data-testid={mainName}
      >
        {isDebug && mainName} {/* 조건부로 이름 렌더링 */}
      </div>

      {/* 푸터 레이아웃 프레임 */}
      <div
        // 조건부로 배경을 적용하고 핵심 레이아웃 클래스 유지
        className={`flex flex-row items-center gap-[10px] w-[164px] h-[182 cName) : footerActualBg}`}
        data-testid={footerName}
      >
        {isDebug && footerName} {/* 조건부로 이름 렌더링 */}
      </div>

      {/* 자식 컴포넌트가 여기 들어갈 것입니다 */}
      {children}
    </div>
  );
};

export default HandsOnDesign;