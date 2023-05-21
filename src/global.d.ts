export {};

declare global {
 namespace PlaywrightTest {
    interface Matchers<R, T> {
      toHaveMedianLineLength(range: {min?: number, max?: number}): R;
    }
  }
}
