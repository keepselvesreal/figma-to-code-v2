// src/tests/utils/testGenUtils.js

// Figma RGB (0-1) 값을 CSS hex 또는 rgb 문자열로 변환하는 헬퍼 함수
export function figmaColorToCss(color) {
  if (!color) return 'transparent'; // 색상 값이 없을 경우 처리
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  // 단색일 경우 hex를 선호, alpha 값이 1 또는 undefined가 아니면 rgba로 대체
  if (color.a === undefined || color.a === 1) {
    const toHex = (c) => c.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  } else {
    return `rgba(${r}, ${g}, ${b}, ${color.a})`;
  }
}

// 배경에 대한 Tailwind 임의 값 생성을 돕는 헬퍼
/**
 * Figma fill 속성으로부터 Tailwind 배경 클래스 문자열을 생성합니다.
 * 단색을 처리하며, Figma RGB를 CSS hex로 변환합니다.
 * 투명 배경 또는 빈 fill의 경우 'bg-transparent'를 반환합니다.
 * @param {Object} color - Figma 노드 속성의 색상 객체.
 * @returns {string} - Tailwind 배경 클래스 문자열 (예: 'bg-[#RRGGBB]' 또는 'bg-transparent').
 */
export function getBgClass(color) {
    if (!color) {
        return 'bg-transparent'; // 색상이 없으면 투명으로 기본 설정
    }
    if (color.a === 0) {
        return 'bg-transparent'; // 투명 색상을 명시적으로 처리
    }
    const cssColor = figmaColorToCss(color);
    // 정확한 hex 색상에 임의 값 구문 사용
    return `bg-[${cssColor}]`;
}

// kebab-case를 PascalCase로 변환하는 헬퍼 함수
export function kebabToPascalCase(str) {
  if (!str) return '';
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

/**
 * 특정 프레임에 대한 디자인 토큰에서 필요한 스타일을 추출합니다.
 * 
 * @param {Object} frameData - 특정 프레임의 디자인 토큰 데이터 객체.
 * @param {Object} options - 선택적 구성 플래그.
 * @param {boolean} [options.isRoot=false] - 루트 특정 스타일(예: w-screen) 적용 여부.
 * @param {boolean} [options.includeBackground=true] - 배경 클래스 포함 여부.
 * @returns {Object} - Tailwind 클래스 목록과 실제 배경 클래스를 포함하는 객체.
 */
export function extractStylesFromTokens(frameData, options = {}) {
    // 기본 옵션
    const { isRoot = false, includeBackground = true } = options;

    if (!frameData) {
        // 호출자가 frameData 존재를 보장한다면 이 확인은 불필요할 수 있지만, 안전을 위해 유지
        throw new Error('extractStylesFromTokens 함수에는 frameData가 제공되어야 합니다.');
    }

    const visuals = frameData.visuals || {};
    const layout = frameData.layout || {};
    const boundingBox = layout.absoluteBoundingBox || {};

    // 레이아웃 크기 조정 모드 추출
    const layoutSizingHorizontal = layout.layoutSizingHorizontal;
    const layoutSizingVertical = layout.layoutSizingVertical;

    // 값 추출 및 변환
    const backgroundColor = visuals.backgroundColor || (visuals.fills && visuals.fills[0]?.type === 'SOLID' ? visuals.fills[0].color : undefined);
    const paddingTop = layout.paddingTop ?? 0;
    const paddingBottom = layout.paddingBottom ?? 0;
    const paddingLeft = layout.paddingLeft ?? 0;
    const paddingRight = layout.paddingRight ?? 0;
    const itemSpacing = layout.itemSpacing ?? 0;
    const layoutMode = layout.layoutMode;
    const primaryAxisAlignItems = layout.primaryAxisAlignItems;
    const counterAxisAlignItems = layout.counterAxisAlignItems;
    const clipsContent = visuals.clipsContent ?? false;
    const width = boundingBox.width;
    const height = boundingBox.height;

    // --- 토큰에서 실제 배경 클래스 계산 --- 
    const actualBgClass = getBgClass(backgroundColor);

    // Figma 레이아웃 속성을 Tailwind 클래스로 매핑
    const flexOrDisplay = layoutMode ? 'flex' : '';
    const flexDir = layoutMode === 'VERTICAL' ? 'flex-col' : (layoutMode === 'HORIZONTAL' ? 'flex-row' : '');
    const justifyContent = {
        'MIN': 'justify-start',
        'CENTER': 'justify-center',
        'MAX': 'justify-end',
        'SPACE_BETWEEN': 'justify-between',
    }[primaryAxisAlignItems] || '';
    const alignItems = {
        'MIN': 'items-start',
        'CENTER': 'items-center',
        'MAX': 'items-end',
        'BASELINE': 'items-baseline',
    }[counterAxisAlignItems] || '';

    const overflow = clipsContent ? 'overflow-hidden' : '';

    // 크기, 패딩, 간격에 임의 값 사용
    const ptClass = paddingTop > 0 ? `pt-[${paddingTop}px]` : '';
    const pbClass = paddingBottom > 0 ? `pb-[${paddingBottom}px]` : '';
    const plClass = paddingLeft > 0 ? `pl-[${paddingLeft}px]` : '';
    const prClass = paddingRight > 0 ? `pr-[${paddingRight}px]` : '';
    const gapClass = itemSpacing > 0 ? `gap-[${itemSpacing}px]` : '';

    // layoutSizingHorizontal에 따른 너비 클래스 결정
    let widthClass = '';
    if (isRoot) {
      widthClass = 'w-screen'; // 루트는 항상 전체 화면 너비를 가짐
    } else if (layoutSizingHorizontal === 'FILL') {
      widthClass = 'w-full';
    } else if (layoutSizingHorizontal === 'FIXED' && width !== undefined) {
      widthClass = `w-[${width}px]`;
    } // 'HUG'는 특정 너비 클래스를 추가하지 않음

    // layoutSizingVertical에 따른 높이 클래스 결정
    let heightClass = '';
    if (isRoot) {
      heightClass = 'h-screen'; // 루트는 항상 전체 화면 높이를 가짐
    } else if (layoutSizingVertical === 'FILL') {
      heightClass = 'h-full';
    } else if (layoutSizingVertical === 'FIXED' && height !== undefined) {
      heightClass = `h-[${height}px]`;
    } // 'HUG'는 특정 높이 클래스를 추가하지 않음

    // 옵션이 true인 경우에만 기본 목록에 배경 클래스 포함
    const bgClass = includeBackground ? actualBgClass : '';

    // 기본 목록을 위한 모든 클래스 결합
    let classList = [
        flexOrDisplay, flexDir,
        justifyContent, alignItems,
        gapClass,
        ptClass, pbClass, plClass, prClass,
        widthClass, heightClass,
        overflow,
        bgClass
    ];

    // 해당되는 경우 루트 특정 클래스 추가
    if (isRoot) {
        // 중복 추가 방지 (이미 width/heightClass에서 처리됨)
        // classList.push('w-screen', 'h-screen');
    }

    // 빈 문자열 필터링
    classList = classList.filter(Boolean);

    // 클래스와 실제 배경 클래스를 별도로 반환
    return { classList, actualBgClass };
}

/**
 * 디버깅 목적으로 시각적으로 구별되는 Tailwind 배경 클래스를 반환합니다.
 * 프레임 이름에 따라 색상을 할당합니다.
 * @param {string} frameName - 레이아웃 프레임의 이름 (예: 'Nav', 'Hero').
 * @returns {string} - Tailwind 배경색 클래스 (예: 'bg-red-200').
 */
export function getDebugBgClass(frameName) {
  // 알려진 프레임에 대한 간단한 매핑. 필요에 따라 추가하세요.
  const name = frameName.toLowerCase();
  switch (name) {
    case 'nav':
      return 'bg-red-200';
    case 'hero':
      return 'bg-blue-200';
    case 'main':
      return 'bg-green-200';
    case 'footer':
      return 'bg-yellow-200';
    default:
      // 예상치 못한 프레임 이름에 대한 대체 처리
      return 'bg-gray-200';
  }
}

// RGB 값을 Hex로 변환하는 함수 (figmaColorToCss와 기능 중복 가능성 있음, 통합 고려)
export function convertRgbToHex(r, g, b) {
  const toHex = (c) => {
    const num = Math.round(c * 255);
    const hex = num.toString(16).toUpperCase();
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// 부모 요소 내에서 testId로 요소를 찾는 헬퍼 (testing-library/dom 필요)
// import { within } from '@testing-library/dom'; // 사용 시 필요
export function getElementByTestId(parentElement, testId) {
  return within(parentElement).getByTestId(testId); // `within` import 필요
}
