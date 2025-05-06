// src/tests/utils/testGenUtils.js

// Helper function to convert Figma RGB (0-1) to CSS hex or rgb string
function figmaColorToCss(color) {
  if (!color) return 'transparent'; // Handle missing color
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  // Prefer hex for solid colors, fallback to rgba if alpha is not 1 or undefined
  if (color.a === undefined || color.a === 1) {
    const toHex = (c) => c.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  } else {
    return `rgba(${r}, ${g}, ${b}, ${color.a})`;
  }
}

// Helper to generate Tailwind arbitrary value for background
/**
 * Generates a Tailwind background class string from Figma fill properties.
 * Handles solid colors, converting Figma RGB to CSS hex.
 * Returns 'bg-transparent' for transparent backgrounds or empty fills.
 * @param {Object} color - The color object from Figma node properties.
 * @returns {string} - The Tailwind background class string (e.g., 'bg-[#RRGGBB]' or 'bg-transparent').
 */
function getBgClass(color) {
    if (!color) {
        return 'bg-transparent'; // Default to transparent if no color
    }
    if (color.a === 0) {
        return 'bg-transparent'; // Explicitly handle transparent color
    }
    const cssColor = figmaColorToCss(color);
    // Use arbitrary value syntax for exact hex colors
    return `bg-[${cssColor}]`;
}

// Helper function to convert kebab-case to PascalCase
function kebabToPascalCase(str) {
  if (!str) return '';
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

/**
 * Extracts necessary styles from design tokens for a specific frame.
 * 
 * @param {Object} frameData - The design token data object for the specific frame.
 * @param {Object} options - Optional configuration flags.
 * @param {boolean} [options.isRoot=false] - Whether to apply root-specific styles (e.g., w-screen).
 * @param {boolean} [options.includeBackground=true] - Whether to include the background class.
 * @returns {Object} - An object containing the list of Tailwind classes and the actual background class.
 */
function extractStylesFromTokens(frameData, options = {}) {
    // Default options
    const { isRoot = false, includeBackground = true } = options;

    if (!frameData) {
        // This check might be redundant if caller ensures frameData exists, but good for safety
        throw new Error('frameData must be provided to extractStylesFromTokens.');
    }

    const visuals = frameData.visuals || {};
    const layout = frameData.layout || {};
    const boundingBox = layout.absoluteBoundingBox || {};

    // Extract layout sizing modes
    const layoutSizingHorizontal = layout.layoutSizingHorizontal;
    const layoutSizingVertical = layout.layoutSizingVertical;

    // Extract and convert values
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

    // --- Calculate actual background class from tokens ---
    const actualBgClass = getBgClass(backgroundColor);

    // Map Figma layout props to Tailwind classes
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

    // Use arbitrary values for dimensions, padding, and gap
    const ptClass = paddingTop > 0 ? `pt-[${paddingTop}px]` : '';
    const pbClass = paddingBottom > 0 ? `pb-[${paddingBottom}px]` : '';
    const plClass = paddingLeft > 0 ? `pl-[${paddingLeft}px]` : '';
    const prClass = paddingRight > 0 ? `pr-[${paddingRight}px]` : '';
    const gapClass = itemSpacing > 0 ? `gap-[${itemSpacing}px]` : '';

    // Determine width class based on layoutSizingHorizontal
    let widthClass = '';
    if (isRoot) {
      widthClass = 'w-screen'; // Root always takes full screen width
    } else if (layoutSizingHorizontal === 'FILL') {
      widthClass = 'w-full';
    } else if (layoutSizingHorizontal === 'FIXED' && width !== undefined) {
      widthClass = `w-[${width}px]`;
    } // 'HUG' doesn't add a specific width class

    // Determine height class based on layoutSizingVertical
    let heightClass = '';
    if (isRoot) {
      heightClass = 'h-screen'; // Root always takes full screen height
    } else if (layoutSizingVertical === 'FILL') {
      heightClass = 'h-full';
    } else if (layoutSizingVertical === 'FIXED' && height !== undefined) {
      heightClass = `h-[${height}px]`;
    } // 'HUG' doesn't add a specific height class

    // Include background class in main list ONLY if the option is true
    const bgClass = includeBackground ? actualBgClass : '';

    // Combine all classes for the main list
    let classList = [
        flexOrDisplay, flexDir,
        justifyContent, alignItems,
        gapClass,
        ptClass, pbClass, plClass, prClass,
        widthClass, heightClass,
        overflow,
        bgClass
    ];

    // Add root-specific classes if applicable
    if (isRoot) {
        classList.push('w-screen', 'h-screen');
    }

    // Filter out empty strings
    classList = classList.filter(Boolean);

    // Return classes and the actual background class separately
    return { classList, actualBgClass };
}

/**
 * Returns a visually distinct Tailwind background class for debugging purposes.
 * Assigns colors based on the frame name.
 * @param {string} frameName - The name of the layout frame (e.g., 'Nav', 'Hero').
 * @returns {string} - A Tailwind background color class (e.g., 'bg-red-200').
 */
function getDebugBgClass(frameName) {
  // Simple mapping for known frames. Add more as needed.
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
      // Fallback for unexpected frame names
      return 'bg-gray-200';
  }
}

module.exports = {
  figmaColorToCss,
  getBgClass,
  kebabToPascalCase,
  extractStylesFromTokens,
  getDebugBgClass
};
