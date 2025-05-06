const fs = require('fs');
const path = require('path');
const genRootFrameTest = require('../src/tests/gen-funcs/genRootFrameTest');
const genLayoutFrameTest = require('../src/tests/gen-funcs/genLayoutFrameTest');
const { getNameFromTokenKey } = require('../src/utils/tokenUtils');

// --- 설정값 ---
const tokensPath = path.resolve(__dirname, '../src/data/design-tokens.json');
const rootComponentName = 'HandsOnDesign';
const rootComponentRelativePath = '../../../src/components'; // 생성될 테스트 파일 기준 상대 경로
const outputDir = path.resolve(__dirname, '../src/tests/generated');

// --- 유틸리티 함수 ---
/**
 * 레이아웃 프레임 테스트 파일을 생성하고 저장합니다.
 * @param {string} frameKey - 테스트를 생성할 프레임의 키.
 */
function generateAndWriteLayoutTest(frameKey) {
  const testFileName = `${getNameFromTokenKey(frameKey)}.test.js`;
  console.log(`'${frameKey}' 레이아웃 프레임 테스트 생성 중...`);
  try {
    // genLayoutFrameTest 호출 (tokensPath, frameKey, rootComponentName, rootComponentRelativePath)
    const testCode = genLayoutFrameTest(tokensPath, frameKey, rootComponentName, rootComponentRelativePath);
    const outputPath = path.join(outputDir, testFileName);

    // 출력 디렉토리 확인 및 생성 (이미 생성되었을 수 있지만 안전하게 확인)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, testCode);
    console.log(`레이아웃 테스트 파일 생성 성공: ${outputPath}`);
  } catch (error) {
    console.error(`오류: '${frameKey}' 레이아웃 프레임 테스트 생성 실패 - ${error.message}`);
  }
}

// --- 메인 로직 ---
try {
  console.log('테스트 생성 스크립트 시작...');
  console.log(`토큰 파일 경로: ${tokensPath}`);
  console.log(`출력 디렉토리: ${outputDir}`);

  // 출력 디렉토리 확인 및 생성 (미리 수행)
  if (!fs.existsSync(outputDir)){
      console.log('출력 디렉토리 생성 중...');
      fs.mkdirSync(outputDir, { recursive: true });
  }

  // 토큰 파일 읽기
  const designTokensRaw = fs.readFileSync(tokensPath, 'utf8');
  const designTokens = JSON.parse(designTokensRaw);

  // 루트 프레임 키 찾기 (슬래시 없는 첫 번째 키)
  const rootFrameKey = Object.keys(designTokens).find(key => !key.includes('/'));
  if (!rootFrameKey) {
    throw new Error('디자인 토큰에서 루트 프레임 키를 찾을 수 없습니다.');
  }
  console.log(`루트 프레임 키 발견: ${rootFrameKey}`);

  // 루트 프레임 테스트 생성
  const rootTestFileName = `${getNameFromTokenKey(rootFrameKey)}.test.js`;
  console.log(`'${rootFrameKey}' 루트 프레임 테스트 생성 중...`);
  try {
    // genRootFrameTest 호출 (designTokensPath, outputDir, componentDirRelative)
    const rootTestCode = genRootFrameTest(tokensPath, outputDir, rootComponentRelativePath);
    const rootOutputPath = path.join(outputDir, rootTestFileName);
    fs.writeFileSync(rootOutputPath, rootTestCode);
    console.log(`루트 테스트 파일 생성 성공: ${rootOutputPath}`);
  } catch (error) {
    console.error(`오류: '${rootFrameKey}' 루트 프레임 테스트 생성 실패 - ${error.message}`);
  }


  // 주요 레이아웃 프레임 키 찾기 (루트의 직계 자식 프레임)
  const layoutFrameKeys = Object.keys(designTokens).filter(key => {
    return key.startsWith(rootFrameKey + '/') && key.split('/').length === 2;
  });

  if (layoutFrameKeys.length === 0) {
     console.warn(`주요 레이아웃 프레임 키(${rootFrameKey}/<child>)를 찾을 수 없습니다.`);
  } else {
     console.log(`주요 레이아웃 프레임 키 발견: ${layoutFrameKeys.join(', ')}`);
     // 각 레이아웃 프레임에 대한 테스트 생성
     layoutFrameKeys.forEach(generateAndWriteLayoutTest);
  }

} catch (error) {
  console.error('테스트 생성 스크립트 실행 중 오류 발생:', error);
  process.exit(1);
}

console.log('\n테스트 생성 완료.');
