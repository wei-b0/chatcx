// src/global.d.ts
export {};

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        close: () => void;
        // Add other WebApp methods if needed
      };
    };
  }
}
