// src/tests/gen-funcs/genLayoutFrameTest.test.js

const fs = require('fs');
const path = require('path');
const genLayoutFrameTest = require('./genLayoutFrameTest'); // 테스트 대상 함수
const tokenUtils = require('../../utils/tokenUtils');
const testGenUtils = require('../utils/testGenUtils');

// 의존성 모킹
jest.mock('fs');
jest.mock('../../utils/tokenUtils');
jest.mock('../utils/testGenUtils');

// 가짜 디자인 토큰 데이터 (루트 및 자식 프레임 포함)
const MOCK_DESIGN_TOKENS = {
  'app-root': { type: 'FRAME', /* ... */ },
  'app-root/nav': {
    type: 'FRAME',
    visuals: {
      fills: [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1, a: 1 } }], // Dark background
    },
    layout: {
      layoutMode: 'HORIZONTAL',
      paddingLeft: 16,
      paddingRight: 16,
      itemSpacing: 10,
      primaryAxisAlignItems: 'SPACE_BETWEEN',
      counterAxisAlignItems: 'CENTER',
      absoluteBoundingBox: { height: 60 },
      layoutSizingHorizontal: 'FILL',
      layoutSizingVertical: 'FIXED',
    },
  },
  'app-root/main-content': {
      type: 'FRAME',
      // ... 다른 스타일
  }
};

// 가짜 유틸리티 함수 반환값 설정
tokenUtils.getNameFromTokenKey.mockImplementation((key) => key.split('/').pop());
testGenUtils.kebabToPascalCase.mockImplementation((str) => str.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(''));
// extractStylesFromTokens 모킹 (실제 로직 대신 단순화된 반환값)
testGenUtils.extractStylesFromTokens.mockImplementation((frameData, options = {}) => {
    const coreClasses = ['flex', 'w-full', 'h-[60px]', 'px-4', 'gap-[10px]', 'justify-between', 'items-center'];
    const bgClass = 'bg-[#1a1a1a]'; // 예시 배경색
    return {
        classList: options.includeBackground === false ? coreClasses : [...coreClasses, bgClass],
        actualBgClass: bgClass
    };
});

describe('genLayoutFrameTest', () => {
  const mockTokensPath = '/fake/path/tokens.json';
  const mockFrameKey = 'app-root/nav';
  const mockRootComponentName = 'AppRoot'; // 렌더링 대상 루트 컴포넌트
  const mockRootComponentPath = '../components'; // 테스트 파일 기준 상대 경로 (컴포넌트 이름 제외)

  beforeEach(() => {
    jest.clearAllMocks();
    fs.readFileSync.mockReturnValue(JSON.stringify(MOCK_DESIGN_TOKENS));
    // 모킹 재설정
    tokenUtils.getNameFromTokenKey.mockImplementation((key) => key.split('/').pop());
    testGenUtils.kebabToPascalCase.mockImplementation((str) => str.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(''));
    testGenUtils.extractStylesFromTokens.mockImplementation((frameData, options = {}) => {
        const coreClasses = ['flex', 'w-full', 'h-[60px]', 'px-4', 'gap-[10px]', 'justify-between', 'items-center'];
        const bgClass = 'bg-[#1a1a1a]';
        return {
            classList: options.includeBackground === false ? coreClasses : [...coreClasses, bgClass],
            actualBgClass: bgClass
        };
    });
  });

  test('주어진 프레임 키와 루트 컴포넌트 정보로 올바른 테스트 코드를 생성해야 합니다', () => {
    const generatedCode = genLayoutFrameTest(mockTokensPath, mockFrameKey, mockRootComponentName, mockRootComponentPath);

    // 0. 기본적인 문자열 포함 여부 확인 (오류 없이 생성되었는지)
    expect(generatedCode).toContain('import React from \'react\'');
    expect(generatedCode).toContain('@testing-library/react');
    expect(generatedCode).toContain('@testing-library/jest-dom');

    // 1. 동적 Import 확인 (수정된 경로 예상)
    const expectedImportPath = '../components/AppRoot'; // genLayoutFrameTest의 path.join 결과
    expect(generatedCode).toContain(`import ${mockRootComponentName} from '${expectedImportPath}';`);

    // 2. describe 블록 이름 확인
    expect(generatedCode).toContain("describe('Nav Layout Frame', () => {");

    // 3. isDebug=true 테스트 확인
    expect(generatedCode).toContain("it('should render correctly with debug styles when isDebug is true', () => {");
    expect(generatedCode).toContain(`render(<${mockRootComponentName} isDebug={true} />);`);
    expect(generatedCode).toContain("screen.getByTestId(testId)");

    // --- 코어 클래스 검증 로직 개선 --- //
    const expectedCoreClasses = ['flex', 'w-full', 'h-[60px]', 'px-4', 'gap-[10px]', 'justify-between', 'items-center'];
    // 생성된 코드에서 'toHaveClass' 호출 부분 찾기 (isDebug=true 블록 내)
    const isDebugTrueBlockMatch = generatedCode.match(/it\('should render correctly with debug styles when isDebug is true',[\s\S]*?\}\);/);
    expect(isDebugTrueBlockMatch).toBeTruthy(); // isDebug=true 블록이 있는지 확인
    const isDebugTrueBlock = isDebugTrueBlockMatch[0];
    const hasClassMatch = isDebugTrueBlock.match(/expect\(layoutElement\)\.toHaveClass\(([^)]+)\);/);
    expect(hasClassMatch).toBeTruthy(); // toHaveClass 호출이 있는지 확인

    // 호출된 클래스 문자열 추출 및 파싱 ('class1', 'class2' -> ['class1', 'class2'])
    const actualClassesString = hasClassMatch[1];
    const actualClasses = actualClassesString.split(',').map(cls => cls.trim().replace(/^'|'$/g, ''));

    // 예상 클래스와 실제 클래스 비교 (순서 무관)
    expect(actualClasses).toEqual(expect.arrayContaining(expectedCoreClasses));
    expect(actualClasses.length).toBe(expectedCoreClasses.length);
    // --- 검증 로직 개선 끝 --- //

    expect(generatedCode).toContain("expect(layoutElement).toHaveTextContent('Nav');");
    expect(generatedCode).toContain("expect(layoutElement).not.toHaveClass('bg-[#1a1a1a]');");

    // 4. isDebug=false 테스트 확인 (toHaveClass는 위에서 검증되었으므로 다른 부분만 확인)
    expect(generatedCode).toContain("it('should render correctly with final styles when isDebug is false or not provided', () => {");
    expect(generatedCode).toContain(`render(<${mockRootComponentName} />);`);
    // isDebug=false 에서 실제 배경 클래스가 적용되는지 확인
    expect(generatedCode).toContain("expect(layoutElement).toHaveClass('bg-[#1a1a1a]');");
    expect(generatedCode).toContain("expect(layoutElement).not.toHaveTextContent('Nav');");
    expect(generatedCode).toContain("screen.getByTestId(testId)");

  });

  test('프레임 키를 찾을 수 없으면 에러를 던져야 합니다', () => {
    const invalidFrameKey = 'app-root/nonexistent';
    expect(() => genLayoutFrameTest(mockTokensPath, invalidFrameKey, mockRootComponentName, mockRootComponentPath))
      .toThrow(`Frame key '${invalidFrameKey}' not found in design tokens.`);
  });

  test('JSON 파싱 실패 시 에러를 던져야 합니다', () => {
    fs.readFileSync.mockReturnValue('invalid json');
    expect(() => genLayoutFrameTest(mockTokensPath, mockFrameKey, mockRootComponentName, mockRootComponentPath))
      .toThrow(); // JSON 파싱 에러
  });
});
