// src/tests/gen-funcs/genRootFrameTest.js

const fs = require('fs');
const path = require('path');
const { findRootFrameKey, getNameFromTokenKey } = require('../../utils/tokenUtils');

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
function getBgClass(color) {
  const cssColor = figmaColorToCss(color);
  return cssColor !== 'transparent' ? `bg-[${cssColor}]` : '';
}

// Helper function to convert kebab-case to PascalCase
function kebabToPascalCase(str) {
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

// Function to extract necessary styles from design tokens
function extractStylesFromTokens(tokens, rootFrameKey) {
    const rootFrame = tokens[rootFrameKey];
    if (!rootFrame) {
        throw new Error(`Root frame key '${rootFrameKey}' not found in design tokens.`);
    }

    const visuals = rootFrame.visuals || {};
    const layout = rootFrame.layout || {};
    // Dimensions are inside layout.absoluteBoundingBox
    const boundingBox = layout.absoluteBoundingBox || {};

    // Extract and convert values, providing defaults or checks
    const backgroundColor = visuals.backgroundColor || (visuals.fills && visuals.fills[0]?.type === 'SOLID' ? visuals.fills[0].color : undefined);
    const paddingTop = layout.paddingTop ?? 0;
    const paddingBottom = layout.paddingBottom ?? 0;
    const paddingLeft = layout.paddingLeft ?? 0;
    const paddingRight = layout.paddingRight ?? 0;
    const itemSpacing = layout.itemSpacing ?? 0; // Corresponds to 'gap' in flex/grid
    const layoutMode = layout.layoutMode; // 'VERTICAL' or 'HORIZONTAL'
    const primaryAxisAlignItems = layout.primaryAxisAlignItems;
    const counterAxisAlignItems = layout.counterAxisAlignItems;
    const clipsContent = visuals.clipsContent ?? false;

    // Extract width and height from boundingBox
    const width = boundingBox.width ? `w-[${boundingBox.width}px]` : '';
    const height = boundingBox.height ? `h-[${boundingBox.height}px]` : '';

    // Map Figma layout props to Tailwind classes
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

    // Combine all classes, filtering out empty strings
    const tailwindClasses = [
        'flex', flexDir,
        justifyContent, alignItems,
        gapClass,
        ptClass, pbClass, plClass, prClass,
        width,
        height,
        overflow,
        bgClass
    ].filter(Boolean); // filter(Boolean) removes empty strings

    return {
      tailwindClasses,
      componentName: getNameFromTokenKey(rootFrameKey) // Keep original name here for potential use (e.g., testId)
    };
}


/**
 * Generates Jest test code for the root frame component based on design tokens.
 * Reads tokens from a JSON file.
 * @param {string} designTokensPath - Path to the design tokens JSON file.
 * @returns {string} - The generated test code as a string.
 */
function genRootFrameTest(designTokensPath) {
  try {
    // Read and parse the design tokens JSON file
    const designTokensRaw = fs.readFileSync(designTokensPath, 'utf8');
    const designTokens = JSON.parse(designTokensRaw);

    // Find the root frame key (e.g., "hands-on-design")
    const rootFrameKey = findRootFrameKey(designTokens);
    if (!rootFrameKey) {
      throw new Error('Could not find the root frame key in the design tokens.');
    }

    // Extract component name (kebab-case) and Tailwind classes
    const { tailwindClasses, componentName: kebabComponentName } = extractStylesFromTokens(designTokens, rootFrameKey);
    const testId = kebabComponentName; // Use kebab-case name for test ID
    const pascalComponentName = kebabToPascalCase(kebabComponentName); // Convert to PascalCase for import/JSX

    // Format Tailwind classes for the test assertion
    const formattedClasses = tailwindClasses.map(cls => `'${cls}'`).join(', ');

    // Generate the test file content
    const testCode = `// ${kebabComponentName}.test.js
// Auto-generated by genRootFrameTest.js based on ${path.basename(designTokensPath)}
// Do not edit manually, regenerate if design tokens change.

import { render, screen } from '@testing-library/react';
import ${pascalComponentName} from '../components/${pascalComponentName}';

describe('${pascalComponentName} Component', () => {
  it('should have the correct Tailwind classes based on design tokens', () => {
    render(<${pascalComponentName} />);
    const rootElement = screen.getByTestId('${testId}');

    expect(rootElement).toBeInTheDocument();

    // Verify Tailwind classes using arbitrary values
    expect(rootElement).toHaveClass(${formattedClasses});

    // Optionally, add tests for children structure or specific attributes if needed
  });
});
`;

    return testCode;

  } catch (error) {
    console.error("Error generating test code:", error);
    throw error; // Re-throw the error to indicate failure
  }
}

// Example Usage (if run directly):
if (require.main === module) {
  const tokensPath = path.join(__dirname, '..', '..', 'data', 'design-tokens.json');
  // Determine the output file name based on the original kebab-case name
  const rootKey = findRootFrameKey(JSON.parse(fs.readFileSync(tokensPath, 'utf8')));
  const kebabName = getNameFromTokenKey(rootKey);
  const outputFileName = `${kebabName}.test.js`;
  const outputPath = path.join(__dirname, '..', outputFileName);

  try {
    const generatedCode = genRootFrameTest(tokensPath);
    fs.writeFileSync(outputPath, generatedCode);
    console.log(`Test file generated successfully: ${outputPath}`);
  } catch (error) {
    console.error(`Failed to generate test file: ${error.message}`);
    process.exit(1);
  }
}

module.exports = genRootFrameTest; // Keep CommonJS export for potential external use