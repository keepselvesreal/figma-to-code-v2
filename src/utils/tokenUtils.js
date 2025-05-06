// src/utils/tokenUtils.js

/**
 * 디자인 토큰 키에서 마지막 세그먼트(이름)를 추출합니다.
 * 슬래시('/')를 구분자로 사용합니다.
 * 예: "root/nav/item" -> "item"
 * 예: "root/nav" -> "nav"
 * 예: "root" -> "root"
 * @param {string | number | null | undefined} tokenKey - 처리할 디자인 토큰 키. 문자열 외 타입은 안전하게 처리됩니다.
 * @returns {string} 추출된 이름. 유효하지 않은 입력 시 빈 문자열을 반환합니다.
 */
function getNameFromTokenKey(tokenKey) {
  // 입력값이 문자열이 아니면 안전하게 처리
  if (typeof tokenKey !== 'string') {
    // 숫자는 문자열로 변환
    if (typeof tokenKey === 'number') {
        tokenKey = String(tokenKey);
    } else {
        // null, undefined 등 다른 타입은 빈 문자열 반환
        return '';
    }
  }

  const parts = tokenKey.split('/');
  return parts[parts.length - 1];
}

/**
 * 주어진 디자인 토큰 객체에서 루트 프레임의 키를 찾습니다.
 * 루트 프레임 키는 일반적으로 슬래시('/')를 포함하지 않습니다.
 * @param {object | null | undefined} designTokens - 전체 디자인 토큰 객체.
 * @returns {string | undefined} 찾은 루트 프레임의 키. 찾지 못하거나 입력이 유효하지 않으면 undefined를 반환합니다.
 */
function findRootFrameKey(designTokens) {
  // designTokens가 유효한 객체(null 아니고 배열 아닌 일반 객체)가 아니면 undefined 반환
  if (!designTokens || typeof designTokens !== 'object' || Array.isArray(designTokens)) {
    return undefined;
  }

  // 슬래시가 없는 첫 번째 키를 루트 프레임 키로 간주
  for (const key in designTokens) {
    // 객체 자체의 속성인지 확인하고, 키에 슬래시가 없는지 확인
    if (designTokens.hasOwnProperty(key) && key.indexOf('/') === -1) {
      return key;
    }
  }

  // 슬래시 없는 키를 찾지 못한 경우:
  // 현재 로직은 객체의 첫 번째 키를 반환하고 경고를 출력합니다.
  // 이는 디자인 토큰 구조가 항상 슬래시 없는 루트 키를 가질 것이라는
  // 암묵적인 가정에 기반한 폴백(fallback) 동작입니다.
  // 요구사항에 따라 이 부분을 에러 처리 또는 다른 방식으로 수정할 수 있습니다.
  const keys = Object.keys(designTokens);
    if (keys.length > 0) {
        console.warn("슬래시('/')가 없는 토큰 키를 찾을 수 없습니다. 첫 번째 키를 루트로 가정합니다.");
        return keys[0]; // 첫 번째 키 반환 (폴백)
    }

  // 객체가 비어있는 경우
  return undefined;
}

module.exports = {
  getNameFromTokenKey,
  findRootFrameKey
};