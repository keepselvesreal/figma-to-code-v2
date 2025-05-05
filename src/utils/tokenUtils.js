// src/utils/tokenUtils.js

/**
 * 디자인 토큰 키에서 컴포넌트 또는 요소 이름을 추출합니다.
 * 예: "hands-on-design/Nav/profile-img" -> "profile-img"
 * 예: "hands-on-design" -> "hands-on-design"
 * @param {string} tokenKey - 디자인 토큰의 키 문자열입니다.
 * @returns {string} 추출된 컴포넌트 또는 요소 이름입니다.
 */
function getNameFromTokenKey(tokenKey) {
  const parts = tokenKey.split('/');
  return parts[parts.length - 1];
}

/**
 * 주어진 디자인 토큰 객체에서 루트 프레임의 키를 찾습니다.
 * 루트 프레임은 일반적으로 슬래시가 없고, 다른 모든 키의 접두사가 되는 키입니다.
 * (단순화를 위해 슬래시가 없는 첫 번째 키를 루트로 가정합니다.)
 * @param {object} designTokens - 전체 디자인 토큰 객체입니다.
 * @returns {string | undefined} 루트 프레임의 키 또는 찾지 못한 경우 undefined를 반환합니다.
 */
function findRootFrameKey(designTokens) {
  for (const key in designTokens) {
    if (designTokens.hasOwnProperty(key) && key.indexOf('/') === -1) {
      // 슬래시가 없는 첫 번째 키를 루트로 가정
      return key;
    }
  }
  // 슬래시가 없는 키가 없는 경우 (비정상적인 경우)
  const keys = Object.keys(designTokens);
    if (keys.length > 0) {
        // 가장 짧은 키를 루트로 가정할 수도 있으나, 여기서는 슬래시 없는 키를 우선
        console.warn("No token key found without a slash. Assuming the first key as root.");
        return keys[0];
    }
  return undefined;
}

module.exports = {
  getNameFromTokenKey,
  findRootFrameKey
};