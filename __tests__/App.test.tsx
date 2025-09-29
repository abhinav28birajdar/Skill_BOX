import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../components/App';

test('renders the app component', () => {
	render(<App />);
	const linkElement = screen.getByText(/welcome to the app/i);
	expect(linkElement).toBeInTheDocument();
});

test('checks if a button is present', () => {
	render(<App />);
	const buttonElement = screen.getByRole('button', { name: /click me/i });
	expect(buttonElement).toBeInTheDocument();
});