import '@testing-library/jest-dom';

// Mock matchMedia without using jest.fn()
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

globalThis.fetch = () => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({}),
});