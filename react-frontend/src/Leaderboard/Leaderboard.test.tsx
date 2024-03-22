import React from 'react';
import { render, screen } from '@testing-library/react';
import LeaderBoard from './Leaderboard';

test('renders learn react link', () => {
  render(<LeaderBoard />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});