import React from 'react';
import { render } from '@testing-library/react';
import ThemedText from '../ThemedText';

describe('ThemedText', () => {
	test('renders with default theme', () => {
		const { getByText } = render(<ThemedText>Hello World</ThemedText>);
		expect(getByText('Hello World')).toBeInTheDocument();
	});

	test('renders with dark theme', () => {
		const { getByText } = render(<ThemedText theme="dark">Hello World</ThemedText>);
		expect(getByText('Hello World')).toHaveClass('dark-theme');
	});

	test('renders with light theme', () => {
		const { getByText } = render(<ThemedText theme="light">Hello World</ThemedText>);
		expect(getByText('Hello World')).toHaveClass('light-theme');
	});
});