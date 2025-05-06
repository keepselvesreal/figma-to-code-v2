import React from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
// Assuming HandsOnDesign is the component containing these frames
// Adjust the import path if necessary
import HandsOnDesign from '../components/HandsOnDesign'; 

// Mock the debug utility if it's used directly in the component for isDebug=true
// jest.mock('../tests/utils/testGenUtils', () => ({
//   ...jest.requireActual('../tests/utils/testGenUtils'),
//   getDebugBgClass: jest.fn().mockReturnValue('bg-gray-300'), // Mock return value
// }));

// Test suite for the Nav layout frame
describe('Nav Layout Frame', () => {
  const testId = 'Nav'; // Use kebab-case name

  // Test case for isDebug = true (Layout Verification Mode)
  it('should render correctly with debug styles when isDebug is true', () => {
    // Render the parent component passing isDebug={true}
    // We assume the target frame is identifiable within HandsOnDesign via testId
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
    // Render the parent component without isDebug or isDebug={false}
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

// Test suite for the profile-img element within Nav
describe('profile-img within Nav', () => {
  const parentTestId = 'Nav';
  const elementName = 'profile-img';

  it('should be rendered correctly with expected styles', () => {
    render(<HandsOnDesign />); 
    const parentElement = screen.getByTestId(parentTestId);
    const element = within(parentElement).getByTestId(elementName);
    expect(element).toBeInTheDocument();

    // Style checks based on 'hands-on-design/Nav/profile-img' token
    expect(element).toHaveClass('bg-[#009DFF]'); // r:0, g:0.616..., b:1 -> #009DFF
    expect(element).toHaveClass('w-[63px]');
    expect(element).toHaveClass('h-[76px]');
    expect(element).toHaveClass('rounded-full'); // ELLIPSE type suggests rounded-full
  });
});

// Test suite for the user-name element within Nav
describe('user-name within Nav', () => {
  const parentTestId = 'Nav';
  const elementName = 'user-name';
  const expectedTextContent = 'User Name'; // Placeholder as token doesn't specify text

  it('should be rendered correctly with expected styles and content', () => {
    render(<HandsOnDesign />); 
    const parentElement = screen.getByTestId(parentTestId);
    const element = within(parentElement).getByTestId(elementName);
    expect(element).toBeInTheDocument();

    // Style checks based on 'hands-on-design/Nav/user-name' token
    // visuals.fills[0].color: {r: 0, g: 0, b: 0, a: 1} -> #000000 (text color for TEXT type)
    expect(element).toHaveClass('text-[#000000]');
    // layout.absoluteBoundingBox for text might be container size, not directly testable on text style itself easily.
    // For now, focusing on text content and color.
    expect(element).toHaveTextContent(expectedTextContent);
  });
});
