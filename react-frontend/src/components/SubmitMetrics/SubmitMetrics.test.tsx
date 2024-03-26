import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SubmitMetrics from './SubmitMetrics';

describe('SubmitMetrics', () => {
  it('renders without crashing', () => {
    render(<SubmitMetrics onSuccess={() => { } }  />);
  });
});