// src/tests/gen-funcs/genRootFrameTest.test.js

const fs = require('fs');
const path = require('path');
const genRootFrameTest = require('./genRootFrameTest'); // 테스트 대상 함수
const tokenUtils = require('../../utils/tokenUtils');
const testGenUtils = require('../utils/testGenUtils');

// 의존성 모킹
jest.mock('fs');
jest.mock('../../utils/tokenUtils');
jest.mock('../utils/testGenUtils');

// 가짜 디자인 토큰 데이터
const MOCK_DESIGN_TOKENS = {
  'my-app-root': {
    type: 'FRAME',
    layoutMode: 'VERTICAL',
    paddingLeft: 16,
    paddingRight: 16,
    itemSpacing: 8,
    fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1, a: 1 } }], // white background
  },
  'my-app-root/header': {
    type: 'FRAME',
  },
};

// 가짜 유틸리티 함수 반환값 설정
tokenUtils.findRootFrameKey.mockReturnValue('my-app-root');
tokenUtils.getNameFromTokenKey.mockReturnValue('my-app-root');
testGenUtils.kebabToPascalCase.mockReturnValue('MyAppRoot');
testGenUtils.extractStylesFromTokens.mockReturnValue({
  classList: ['flex', 'flex-col', 'p-4', 'gap-2', 'bg-white'], // Use classList key
  inlineStyles: {},
});

describe('genRootFrameTest', () => {
  const mockTokensPath = '/fake/path/to/tokens.json';
  const mockOutputDir = '/fake/output/tests'; // 절대 경로 가정
  const mockComponentDirRelative = '../components'; // outputDir 기준 상대 경로

  beforeEach(() => {
    // 각 테스트 전에 모킹 초기화
    jest.clearAllMocks();
    // 기본 모킹 재설정
    tokenUtils.findRootFrameKey.mockReturnValue('my-app-root');
    tokenUtils.getNameFromTokenKey.mockReturnValue('my-app-root');
    testGenUtils.kebabToPascalCase.mockReturnValue('MyAppRoot');
    testGenUtils.extractStylesFromTokens.mockReturnValue({
      classList: ['flex', 'flex-col', 'p-4', 'gap-2', 'bg-white'], // Use classList key
      inlineStyles: {}
    });
    fs.readFileSync.mockReturnValue(JSON.stringify(MOCK_DESIGN_TOKENS));
  });

  test('주어진 설정으로 올바른 테스트 코드 문자열(import 경로 포함)을 생성해야 합니다', () => {
    // 수정된 함수 호출 방식 사용
    const generatedCode = genRootFrameTest(mockTokensPath, mockOutputDir, mockComponentDirRelative);

    // 생성된 코드의 import 경로 확인 (mockComponentDirRelative 반영)
    // path.join 결과가 POSIX 스타일(/)로 변환되었는지 확인
    const expectedImportPath = path.join(mockComponentDirRelative, 'MyAppRoot').replace(/\\/g, '/');
    expect(generatedCode).toContain(`import MyAppRoot from '${expectedImportPath}';`);

    // 다른 주요 내용 확인
    expect(generatedCode).toContain("describe('MyAppRoot Component', () => {");
    expect(generatedCode).toContain("screen.getByTestId('my-app-root')");
    expect(generatedCode).toContain("toHaveClass('flex', 'flex-col', 'p-4', 'gap-2', 'bg-white')");
  });

  test('루트 프레임 키를 찾을 수 없으면 에러를 던져야 합니다', () => {
    tokenUtils.findRootFrameKey.mockReturnValue(undefined);
    // 함수 호출 시 outputDir, componentDirRelative 인자 추가
    expect(() => genRootFrameTest(mockTokensPath, mockOutputDir, mockComponentDirRelative))
      .toThrow('디자인 토큰에서 루트 프레임 키를 찾을 수 없습니다.');
  });

  test('디자인 토큰 파일 읽기 실패 시 에러를 던져야 합니다', () => {
    const readError = new Error('File read error');
    fs.readFileSync.mockImplementation(() => { throw readError; });
    // 함수 호출 시 outputDir, componentDirRelative 인자 추가
    expect(() => genRootFrameTest(mockTokensPath, mockOutputDir, mockComponentDirRelative)).toThrow(readError);
  });

  test('JSON 파싱 실패 시 에러를 던져야 합니다', () => {
    fs.readFileSync.mockReturnValue('invalid json');
    // 함수 호출 시 outputDir, componentDirRelative 인자 추가
    expect(() => genRootFrameTest(mockTokensPath, mockOutputDir, mockComponentDirRelative)).toThrow();
  });

  // --- Refactoring 목표 테스트 (이제 통과해야 함) ---
  test('outputDir과 componentDirRelative 인자를 사용하여 올바른 import 경로를 생성해야 합니다', () => {
    // genRootFrameTest가 수정되어 새 인자를 받음
    const generatedCode = genRootFrameTest(mockTokensPath, mockOutputDir, mockComponentDirRelative);
    const expectedImportPath = path.join(mockComponentDirRelative, 'MyAppRoot').replace(/\\/g, '/');
    // 생성된 코드에 올바른 import문이 포함되어 있는지 확인
    expect(generatedCode).toContain(`import MyAppRoot from '${expectedImportPath}';`);
  });
});
