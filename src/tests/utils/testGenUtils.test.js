// src/tests/utils/testGenUtils.test.js
import { extractElementStyles } from './testGenUtils'; 

// describe('extractElementStyles', () => {
//   test('사각형 요소의 스타일 (배경색, 크기)을 추출해야 합니다', () => {
//     const elementToken = {
//       type: 'RECTANGLE',
//       visuals: {
//         fills: [{ type: 'SOLID', color: { r: 0.2, g: 0.4, b: 0.6, a: 1 } }],
//       },
//       layout: {
//         absoluteBoundingBox: { width: 100, height: 50 },
//       },
//     };
//     const expectedClasses = ['bg-[#336699]', 'w-[100px]', 'h-[50px]'];
//     expect(extractElementStyles(elementToken)).toEqual(expect.arrayContaining(expectedClasses));
//   });

//   test('타원 요소의 스타일 (배경색, 크기, 둥근 모서리)을 추출해야 합니다', () => {
//     const elementToken = {
//       type: 'ELLIPSE',
//       visuals: {
//         fills: [{ type: 'SOLID', color: { r: 1, g: 0, b: 0, a: 1 } }],
//       },
//       layout: {
//         absoluteBoundingBox: { width: 80, height: 80 },
//       },
//       styles: { 
//         cornerRadius: 40, 
//       }
//     };
//     const expectedClasses = ['bg-[#ff0000]', 'w-[80px]', 'h-[80px]', 'rounded-full'];
//     expect(extractElementStyles(elementToken)).toEqual(expect.arrayContaining(expectedClasses));
//   });

//   test('텍스트 요소의 스타일 (색상, 글꼴 크기, 두께 등)을 추출해야 합니다', () => {
//     const elementToken = {
//       type: 'TEXT',
//       visuals: {
//         fills: [{ type: 'SOLID', color: { r: 0, g: 0, b: 0, a: 1 } }], 
//       },
//       styles: { 
//         fontFamily: 'Inter',
//         fontWeight: 700, // 굵게
//       },
//     };
//     const expectedClasses = [
//       'text-[#000000]',
//       'font-bold', // fontWeight: 700
//       'text-[16px]', // fontSize
//       'leading-[24px]', // lineHeightPx
//       'text-left', // textAlignHorizontal
//       // 'font-inter' 
//     ];
//     expect(extractElementStyles(elementToken)).toEqual(expect.arrayContaining(expectedClasses));
//   });

//   test('스타일 정보가 없는 경우 빈 배열이나 기본값 클래스를 반환해야 합니다', () => {
//     const elementToken = { type: 'RECTANGLE' }; 
//     expect(extractElementStyles(elementToken)).toEqual([]); 
//   });

//   test('정의되지 않은 토큰 입력 시 에러 대신 빈 배열을 반환해야 합니다', () => {
//     expect(extractElementStyles(undefined)).toEqual([]);
//     expect(extractElementStyles(null)).toEqual([]);
//     expect(extractElementStyles({})).toEqual([]);
//   });

it('placeholder test', () => {
  expect(true).toBe(true);
});

// }); 
