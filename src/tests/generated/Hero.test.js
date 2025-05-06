
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HandsOnDesign from '../../../src/components/HandsOnDesign'; 

// Mock the debug utility if it's used directly in the component for isDebug=true
// jest.mock('../tests/utils/testGenUtils', () => ({
//   ...jest.requireActual('../tests/utils/testGenUtils'),
//   getDebugBgClass: jest.fn().mockReturnValue('bg-gray-300'), 
// }));

// Test suite for the Hero layout frame
describe('Hero Layout Frame', () => {
  const testId = 'Hero'; 

  // Test case for isDebug = true (Layout Verification Mode)
  it('should render correctly with debug styles when isDebug is true', () => {
    render(<HandsOnDesign isDebug={true} />); 
    const layoutElement = screen.getByTestId(testId);

    // Verify CORE layout Tailwind classes (excluding background)
    expect(layoutElement).toHaveClass('flex', 'flex-row', 'justify-center', 'items-center', 'gap-[10px]', 'pt-[30px]', 'pb-[30px]', 'pl-[30px]', 'pr-[30px]', 'w-full');

    // Verify frame name is rendered inside for debug
    expect(layoutElement).toHaveTextContent('Hero');

    // Verify the ACTUAL background class is NOT applied in debug mode
    expect(layoutElement).not.toHaveClass('bg-[#ff00f6]');
  });

  // Test case for isDebug = false (Production/Final Styling Mode)
  it('should render correctly with final styles when isDebug is false or not provided', () => {
    render(<HandsOnDesign />); 
    const layoutElement = screen.getByTestId(testId);

    // Verify CORE layout Tailwind classes (excluding background)
    expect(layoutElement).toHaveClass('flex', 'flex-row', 'justify-center', 'items-center', 'gap-[10px]', 'pt-[30px]', 'pb-[30px]', 'pl-[30px]', 'pr-[30px]', 'w-full');

    // Verify the ACTUAL background class IS applied in final mode
    expect(layoutElement).toHaveClass('bg-[#ff00f6]');

    // Verify frame name is NOT rendered in final mode
    expect(layoutElement).not.toHaveTextContent('Hero');
  });
});
