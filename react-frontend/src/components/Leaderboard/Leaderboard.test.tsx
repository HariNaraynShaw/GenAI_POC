import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Leaderboard from './Leaderboard';

describe('Leaderboard', () => {
    it('renders without crashing', () => {
        render(<Leaderboard />);
    });
});
