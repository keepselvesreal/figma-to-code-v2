// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Next.js 앱의 경로를 제공하여 테스트 환경에서 next.config.js 및 .env 파일을 로드합니다.
  dir: './',
});

// Jest에 전달할 사용자 지정 구성 추가
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Next.js 구성에 모듈 별칭이 있는 경우 처리합니다.
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/app/(.*)$': '<rootDir>/src/app/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
};

// createJestConfig는 next/jest가 비동기적으로 Next.js 구성 파일을 로드할 수 있도록 이 방식으로 내보내집니다.
module.exports = createJestConfig(customJestConfig);
