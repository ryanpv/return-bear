// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';


// src/setupTests
import { server } from './mocks/server';

// Start mock server before all tetsts
beforeAll(() => { 
  server.listen()
});

// Reset req handlers to not affect other tests
afterEach(() => server.resetHandlers());

// Clean up after tests complete
afterAll(() => server.close());