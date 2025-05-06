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
 * @returns {string} - The generated test code as a string.
 */
function genLayoutFrameTest(designTokensPath, frameKey) {
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
    const { classList: coreLayoutClasses, actualBgClass } = extractStylesFromTokens(frameData, { includeBackground: false });
    const formattedCoreClasses = coreLayoutClasses.map(cls => `'${cls}'`).join(', ');

    // Generate the test code string with two test cases
    const testCode = `
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
// Assuming HandsOnDesign is the component containing these frames
// Adjust the import path if necessary
import HandsOnDesign from '../components/HandsOnDesign'; 

// Mock the debug utility if it's used directly in the component for isDebug=true
// jest.mock('../tests/utils/testGenUtils', () => ({
//   ...jest.requireActual('../tests/utils/testGenUtils'),
//   getDebugBgClass: jest.fn().mockReturnValue('bg-gray-300'), // Mock return value
// }));

// Test suite for the ${pascalComponentName} layout frame
describe('${pascalComponentName} Layout Frame', () => {
  const testId = '${getNameFromTokenKey(frameKey)}'; // Use kebab-case name

  // Test case for isDebug = true (Layout Verification Mode)
  it('should render correctly with debug styles when isDebug is true', () => {
    // Render the parent component passing isDebug={true}
    // We assume the target frame is identifiable within HandsOnDesign via testId
    render(<HandsOnDesign isDebug={true} />); 
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
    // Render the parent component without isDebug or isDebug={false}
    render(<HandsOnDesign />); 
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
    console.error(`Error generating test code for ${frameKey}:`, error);
    throw error; // Re-throw the error to indicate failure
  }
}

// Example Usage (modified to dynamically find frames)
if (require.main === module) {
  const tokensPath = path.join(__dirname, '..', '..', 'data', 'design-tokens.json');

  try {
    const designTokensRaw = fs.readFileSync(tokensPath, 'utf8');
    const designTokens = JSON.parse(designTokensRaw);

    // Find the root frame key (assuming it has no '/')
    const rootFrameKey = Object.keys(designTokens).find(key => !key.includes('/'));
    if (!rootFrameKey) {
      throw new Error('Could not find the root frame key in the design tokens.');
    }

    // Find all direct child frames (keys with exactly one '/')
    const layoutFrameKeys = Object.keys(designTokens).filter(key => {
        const parts = key.split('/');
        // Check if it starts with the root key and has exactly one '/' separator
        return key.startsWith(rootFrameKey + '/') && parts.length === 2;
    });

    if (layoutFrameKeys.length === 0) {
        console.warn('No layout frame keys found (e.g., root/child). Ensure your design tokens follow this structure.');
        process.exit(0);
    }

    console.log(`Found layout frames: ${layoutFrameKeys.join(', ')}`);

    layoutFrameKeys.forEach(frameKey => {
        try {
            const kebabName = getNameFromTokenKey(frameKey); // Gets the part after the last '/'
            const outputFileName = `${kebabName}.test.js`;
            const outputPath = path.join(__dirname, '..', outputFileName); // Output to src/tests/

            const generatedCode = genLayoutFrameTest(tokensPath, frameKey);
            fs.writeFileSync(outputPath, generatedCode);
            console.log(`Layout frame test file generated successfully for ${frameKey}: ${outputPath}`);
        } catch (generationError) {
            console.error(`Failed to generate test file for ${frameKey}: ${generationError.message}`);
            // Continue to the next key even if one fails
        }
    });

  } catch (error) {
    console.error(`Failed to process design tokens or generate layout frame tests: ${error.message}`);
    process.exit(1);
  }
}

module.exports = genLayoutFrameTest;
