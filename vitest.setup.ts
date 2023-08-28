/* eslint-disable @typescript-eslint/no-require-imports,unicorn/prefer-module,import/no-unassigned-import,@typescript-eslint/no-unsafe-return */
import '@testing-library/jest-dom';
import {cleanup} from '@testing-library/react';

beforeAll(() => {
	vi.mock('next/router', () => require('next-router-mock'));
});

afterEach(() => {
	cleanup();
});
