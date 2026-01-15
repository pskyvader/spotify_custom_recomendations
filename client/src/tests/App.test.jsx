import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../pages/App';

test('renders app header', () => {
  render(<App />);
  const linkElement = screen.getByText(/Spotify custom playlists/i);
  expect(linkElement).toBeInTheDocument();
});
