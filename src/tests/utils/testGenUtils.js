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

// Function to extract necessary styles from design tokens for a specific frame
// Accepts a flag for root-specific styles (like w-screen, h-screen)
function extractStylesFromTokens(tokens, frameKey, isRoot = false) {
    const frameData = tokens[frameKey];
    if (!frameData) {
        throw new Error(`Frame key '${frameKey}' not found in design tokens.`);
    }

    const visuals = frameData.visuals || {};
    const layout = frameData.layout || {};
    const boundingBox = layout.absoluteBoundingBox || {};

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
    const bgClass = getBgClass(backgroundColor);
    const widthClass = width !== undefined && !isRoot ? `w-[${width}px]` : '';
    const heightClass = height !== undefined && !isRoot ? `h-[${height}px]` : '';

    // Combine all classes
    let tailwindClasses = [
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
        tailwindClasses.push('w-screen', 'h-screen');
    }

    // Filter out empty strings
    tailwindClasses = tailwindClasses.filter(Boolean);

    // Return only the classes; component name should be handled separately
    return { tailwindClasses };
}

module.exports = {
    figmaColorToCss,
    getBgClass,
    kebabToPascalCase,
    extractStylesFromTokens,
};
