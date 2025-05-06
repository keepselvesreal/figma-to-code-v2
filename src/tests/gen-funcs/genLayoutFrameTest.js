// src/tests/gen-funcs/genLayoutFrameTest.js

const fs = require('fs');
const path = require('path');
const { getNameFromTokenKey } = require('../../utils/tokenUtils');
const {
    kebabToPascalCase,
    extractStylesFromTokens
} = require('../utils/testGenUtils');

/**
 * Generates Jest test code for a specific layout frame component based on design tokens.
 * Reads tokens from a JSON file and targets a specific frame key.
 * @param {string} designTokensPath - Path to the design tokens JSON file.
 * @param {string} frameKey - The specific key for the layout frame (e.g., "hands-on-design/Nav").
 * @param {string} rootComponentName - The name of the root component to render (e.g., 'HandsOnDesign').
 * @param {string} rootComponentPath - The relative path to the root component from the generated test file.
 * @returns {string} - The generated test code as a string.
 */
function genLayoutFrameTest(designTokensPath, frameKey, rootComponentName, rootComponentPath) { 
  try {
    // Read and parse the design tokens JSON file
    const designTokensRaw = fs.readFileSync(designTokensPath, 'utf8');
    const designTokens = JSON.parse(designTokensRaw);

    const frameData = designTokens[frameKey];
    if (!frameData) {
      throw new Error(`Frame key '${frameKey}' not found in design tokens.`);
    }

    // Get component name using the utility from tokenUtils
    const kebabComponentName = getNameFromTokenKey(frameKey);
    const pascalComponentName = kebabToPascalCase(kebabComponentName);

    // Extract styles: get core layout classes (no bg) and the actual bg class separately
    const { classList: coreLayoutClasses, actualBgClass } = extractStylesFromTokens(frameData, { isRoot: false, includeBackground: false });
    const formattedCoreClasses = coreLayoutClasses.map(cls => `'${cls}'`).join(', ');
    const testId = kebabComponentName; 
    
    // Construct the correct component import path
    const componentImportPath = path.join(rootComponentPath, rootComponentName).replace(/\\/g, '/');

    // Generate the test code string with two test cases
    const testCode = `
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ${rootComponentName} from '${componentImportPath}'; 

// Mock the debug utility if it's used directly in the component for isDebug=true
// jest.mock('../tests/utils/testGenUtils', () => ({
//   ...jest.requireActual('../tests/utils/testGenUtils'),
//   getDebugBgClass: jest.fn().mockReturnValue('bg-gray-300'), 
// }));

// Test suite for the ${pascalComponentName} layout frame
describe('${pascalComponentName} Layout Frame', () => {
  const testId = '${testId}'; 

  // Test case for isDebug = true (Layout Verification Mode)
  it('should render correctly with debug styles when isDebug is true', () => {
    render(<${rootComponentName} isDebug={true} />); 
    const layoutElement = screen.getByTestId(testId);

    // Verify CORE layout Tailwind classes (excluding background)
    expect(layoutElement).toHaveClass(${formattedCoreClasses});

    // Verify frame name is rendered inside for debug
    expect(layoutElement).toHaveTextContent('${pascalComponentName}');

    // Verify the ACTUAL background class is NOT applied in debug mode
    ${actualBgClass ? `expect(layoutElement).not.toHaveClass('${actualBgClass}');` : '// No actual background class defined'}
  });

  // Test case for isDebug = false (Production/Final Styling Mode)
  it('should render correctly with final styles when isDebug is false or not provided', () => {
    render(<${rootComponentName} />); 
    const layoutElement = screen.getByTestId(testId);

    // Verify CORE layout Tailwind classes (excluding background)
    expect(layoutElement).toHaveClass(${formattedCoreClasses});

    // Verify the ACTUAL background class IS applied in final mode
    ${actualBgClass ? `expect(layoutElement).toHaveClass('${actualBgClass}');` : '// No actual background class defined'}

    // Verify frame name is NOT rendered in final mode
    expect(layoutElement).not.toHaveTextContent('${pascalComponentName}');
  });
});
`;

    return testCode;

  } catch (error) {
    throw error; 
  }
}

// Example Usage (modified to dynamically find frames)
if (require.main === module) {
  const tokensPath = path.join(__dirname, '..', '..', 'data', 'design-tokens.json');

  try {
    const designTokensRaw = fs.readFileSync(tokensPath, 'utf8');
    const designTokens = JSON.parse(designTokensRaw);

    const rootFrameKey = Object.keys(designTokens).find(key => !key.includes('/'));
    if (!rootFrameKey) {
      throw new Error('Could not find the root frame key in the design tokens.');
    }

    const layoutFrameKeys = Object.keys(designTokens).filter(key => {
        const parts = key.split('/');
        return key.startsWith(rootFrameKey + '/') && parts.length === 2;
    });

    if (layoutFrameKeys.length === 0) {
        console.warn('No layout frame keys found (e.g., root/child). Ensure your design tokens follow this structure.');
        process.exit(0);
    }

    console.log(`Found layout frames: ${layoutFrameKeys.join(', ')}`);

    layoutFrameKeys.forEach(frameKey => {
        try {
            const kebabName = getNameFromTokenKey(frameKey); 
            const outputFileName = `${kebabName}.test.js`;
            const outputPath = path.join(__dirname, '..', outputFileName); 

            const generatedCode = genLayoutFrameTest(tokensPath, frameKey, 'HandsOnDesign', '../components/HandsOnDesign'); 
            fs.writeFileSync(outputPath, generatedCode);
            console.log(`Layout frame test file generated successfully for ${frameKey}: ${outputPath}`);
        } catch (generationError) {
            console.error(`Failed to generate test file for ${frameKey}: ${generationError.message}`);
        }
    });

  } catch (error) {
    console.error(`Failed to process design tokens or generate layout frame tests: ${error.message}`);
    process.exit(1);
  }
}

module.exports = genLayoutFrameTest;
