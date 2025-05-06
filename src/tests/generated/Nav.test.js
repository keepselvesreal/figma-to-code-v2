
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HandsOnDesign from '../../../src/components/HandsOnDesign'; 

// Mock the debug utility if it's used directly in the component for isDebug=true
// jest.mock('../tests/utils/testGenUtils', () => ({
//   ...jest.requireActual('../tests/utils/testGenUtils'),
//   getDebugBgClass: jest.fn().mockReturnValue('bg-gray-300'), 
// }));

// Test suite for the Nav layout frame
describe('Nav Layout Frame', () => {
  const testId = 'Nav'; 

  // Test case for isDebug = true (Layout Verification Mode)
  it('should render correctly with debug styles when isDebug is true', () => {
    render(<HandsOnDesign isDebug={true} />); 
    const layoutElement = screen.getByTestId(testId);

    // Verify CORE layout Tailwind classes (excluding background)
    expect(layoutElement).toHaveClass('flex', 'flex-col', 'justify-center', 'items-center', 'gap-[10px]', 'pt-[25px]', 'pb-[25px]', 'pl-[25px]', 'pr-[25px]', 'w-full', 'overflow-hidden');

    // Verify frame name is rendered inside for debug
    expect(layoutElement).toHaveTextContent('Nav');

    // Verify the ACTUAL background class is NOT applied in debug mode
    expect(layoutElement).not.toHaveClass('bg-[#ffe100]');
  });

  // Test case for isDebug = false (Production/Final Styling Mode)
  it('should render correctly with final styles when isDebug is false or not provided', () => {
    render(<HandsOnDesign />); 
    const layoutElement = screen.getByTestId(testId);

    // Verify CORE layout Tailwind classes (excluding background)
    expect(layoutElement).toHaveClass('flex', 'flex-col', 'justify-center', 'items-center', 'gap-[10px]', 'pt-[25px]', 'pb-[25px]', 'pl-[25px]', 'pr-[25px]', 'w-full', 'overflow-hidden');

    // Verify the ACTUAL background class IS applied in final mode
    expect(layoutElement).toHaveClass('bg-[#ffe100]');

    // Verify frame name is NOT rendered in final mode
    expect(layoutElement).not.toHaveTextContent('Nav');
  });
});
