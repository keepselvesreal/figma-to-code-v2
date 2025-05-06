const { getNameFromTokenKey, findRootFrameKey } = require('../../utils/tokenUtils');

describe('tokenUtils', () => {
  describe('getNameFromTokenKey', () => {
    test('토큰 키에서 마지막 부분을 이름으로 추출해야 합니다 (예: "a/b/c" -> "c")', () => {
      expect(getNameFromTokenKey('hands-on-design/nav/profile-img')).toBe('profile-img');
    });

    test('슬래시가 하나 있는 토큰 키에서 마지막 부분을 이름으로 추출해야 합니다 (예: "a/b" -> "b")', () => {
      expect(getNameFromTokenKey('hands-on-design/nav')).toBe('nav');
    });

    test('슬래시가 없는 토큰 키는 전체 키를 이름으로 반환해야 합니다 (예: "a" -> "a")', () => {
      expect(getNameFromTokenKey('hands-on-design')).toBe('hands-on-design');
    });

    test('빈 문자열을 입력하면 빈 문자열을 반환해야 합니다', () => {
      expect(getNameFromTokenKey('')).toBe('');
    });

    test('null을 입력하면 빈 문자열을 반환해야 합니다 (실패 예상)', () => {
      expect(getNameFromTokenKey(null)).toBe(''); // 또는 TypeError를 기대할 수 있음
    });

    test('숫자를 입력하면 문자열로 변환된 숫자를 반환해야 합니다 (실패 예상)', () => {
      expect(getNameFromTokenKey(123)).toBe('123'); // 또는 TypeError를 기대할 수 있음
    });
  });

  describe('findRootFrameKey', () => {
    test('디자인 토큰 객체에서 슬래시가 없는 루트 프레임 키를 찾아야 합니다', () => {
      const designTokens = {
        'root-frame': { type: 'FRAME' },
        'root-frame/child1': { type: 'RECTANGLE' },
        'another-root': { type: 'FRAME' },
        'another-root/childA': { type: 'TEXT' },
      };
      expect(findRootFrameKey(designTokens)).toBe('root-frame');
    });

    test('루트 프레임 키가 여러 개일 경우, 처음 발견된 키를 반환해야 합니다', () => {
        const designTokens = {
          'first-root': { type: 'FRAME' },
          'second-root': { type: 'FRAME' },
          'first-root/child': { type: 'TEXT' }
        };
        expect(findRootFrameKey(designTokens)).toBe('first-root');
      });

    test('모든 키에 슬래시가 포함된 경우, 첫 번째 키를 반환해야 합니다 (현재 로직 기반)', () => {
      const designTokens = {
        'parent/child1': { type: 'RECTANGLE' },
        'parent/child2': { type: 'TEXT' },
      };
      // 현재 구현은 콘솔 경고 후 첫 번째 키를 반환합니다. 이 동작을 테스트합니다.
      // 더 나은 처리가 필요할 수 있지만, 현재 동작을 기준으로 테스트합니다.
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      expect(findRootFrameKey(designTokens)).toBe('parent/child1');
      expect(consoleSpy).toHaveBeenCalledWith("슬래시('/')가 없는 토큰 키를 찾을 수 없습니다. 첫 번째 키를 루트로 가정합니다.");
      consoleSpy.mockRestore();
    });

    test('빈 디자인 토큰 객체를 입력하면 undefined를 반환해야 합니다', () => {
      expect(findRootFrameKey({})).toBeUndefined();
    });

    test('designTokens가 null일 경우 undefined를 반환해야 합니다 (실패 예상)', () => {
      expect(findRootFrameKey(null)).toBeUndefined(); // 또는 TypeError를 기대할 수 있음
    });

    test('designTokens가 배열일 경우 undefined를 반환해야 합니다 (실패 예상)', () => {
      expect(findRootFrameKey([])).toBeUndefined(); // 또는 TypeError를 기대할 수 있음
    });
  });
});
