
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

// Test suite for the Footer layout frame
describe('Footer Layout Frame', () => {
  const testId = 'Footer'; // Use kebab-case name

  // Test case for isDebug = true (Layout Verification Mode)
  it('should render correctly with debug styles when isDebug is true', () => {
    // Render the parent component passing isDebug={true}
    // We assume the target frame is identifiable within HandsOnDesign via testId
    render(<HandsOnDesign isDebug={true} />); 
    const layoutElement = screen.getByTestId(testId);

    // Verify CORE layout Tailwind classes (excluding background)
    expect(layoutElement).toHaveClass('flex', 'flex-row', 'items-center', 'gap-[10px]');

    // Verify frame name is rendered inside for debug
    expect(layoutElement).toHaveTextContent('Footer');

    // Verify the ACTUAL background class is NOT applied in debug mode
    expect(layoutElement).not.toHaveClass('bg-transparent');
  });

  // Test case for isDebug = false (Production/Final Styling Mode)
  it('should render correctly with final styles when isDebug is false or not provided', () => {
    // Render the parent component without isDebug or isDebug={false}
    render(<HandsOnDesign />); 
    const layoutElement = screen.getByTestId(testId);

    // Verify CORE layout Tailwind classes (excluding background)
    expect(layoutElement).toHaveClass('flex', 'flex-row', 'items-center', 'gap-[10px]');

    // Verify the ACTUAL background class IS applied in final mode
    expect(layoutElement).toHaveClass('bg-transparent');

    // Verify frame name is NOT rendered in final mode
    expect(layoutElement).not.toHaveTextContent('Footer');
  });
});
