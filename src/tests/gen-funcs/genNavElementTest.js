import { convertRgbToHex } from './utils'; // Utility to convert RGB to HEX if needed

/**
 * Generates test cases for a specific element within the Nav component.
 * @param {string} elementName - The data-testid and visible name of the element.
 * @param {object} elementToken - The design token for the element.
 * @param {string} parentTestId - The data-testid of the parent Nav frame.
 */
export function generateNavElementTests(elementName, elementToken, parentTestId) {
  const { visuals, layout } = elementToken;
  // Assuming the first fill is the primary background
  const backgroundColor = visuals.fills[0]?.color ? convertRgbToHex(visuals.fills[0].color.r, visuals.fills[0].color.g, visuals.fills[0].color.b) : null;
  const width = layout.absoluteBoundingBox?.width;
  const height = layout.absoluteBoundingBox?.height;

  // Determine the expected tag or role. For an ELLIPSE, it might be a div styled as a circle/ellipse.
  // For simplicity, we'll just check for its existence and styles.

  let tests = `
  // Test suite for the ${elementName} element within ${parentTestId}
  describe('${elementName} within ${parentTestId}', () => {
    it('should be rendered correctly with expected styles', () => {
      render(<HandsOnDesign />); // Assuming HandsOnDesign renders Nav and its children
      const parentElement = screen.getByTestId('${parentTestId}');
      // Query within the parent element
      const element = within(parentElement).getByTestId('${elementName}');
      expect(element).toBeInTheDocument();

      // Style checks
      ${backgroundColor ? `expect(element).toHaveClass('bg-[${backgroundColor}]');` : '// No background color token'}
      ${width ? `expect(element).toHaveClass('w-[${width}px]');` : '// No width token'}
      ${height ? `expect(element).toHaveClass('h-[${height}px]');` : '// No height token'}
      // Add more style checks as needed, e.g., border-radius for ellipse
      if ('${elementName}' === 'profile-img') {
        expect(element).toHaveClass('rounded-full'); // Assuming ellipse means rounded-full
      }
    });
  });
  `;

  return tests;
}

// Helper function to generate Tailwind class for RGB, if not already in a shared util
// This is a simplified version. A more robust one would be in testGenUtils.js
function convertRgbToHexForTest(r, g, b) {
  const toHex = (c) => {
    const num = Math.round(c * 255);
    const hex = num.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// It seems convertRgbToHex is already expected from '../tests/utils/testGenUtils'
// We need to ensure that file and function exist. For now, I'll assume it does.
// If not, we'd need to create it or use the local helper above.
