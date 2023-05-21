import fs from 'node:fs';
import path from 'node:path';
import { URL } from 'url';
import { median } from './math';
import { elementLineLength as elementLineLengthFn } from "element-line-length";
import { Locator } from "@playwright/test";

declare var elementLineLength: typeof elementLineLengthFn;

declare global {
  namespace PlaywrightTest {
     interface Matchers<R, T> {
      toHaveMedianLineLength(range: {min?: number, max?: number}): R;
    }
 }
}

// Load code as a string to eval in browser
const __dirname = new URL('.', import.meta.url).pathname;
const browserCodePath = path.resolve(__dirname, './browser-code.js');
const browserCode = fs.readFileSync(browserCodePath).toString('utf-8');

export type Range = {
  min?: number;
  max?: number;
};

export const lineLengthAssertions = {
  async toHaveMedianLineLength(locator: Locator, range: Range) {
    if (range == null) {
      throw new Error(`range is required`);
    }
    if (range.min == null && range.max == null) {
      throw new Error('At least one of range.min and range.max must be specified');
    }
    if (range.min != null && range.max != null && range.min > range.max) {
      throw new Error(`range.min (${range.min}) cannot be > range.max (${range.max})`);
    }

    const min = range.min != null ? Math.max(range.min, 0) : 0;
    const max = range.max != null ? range.max : Number.POSITIVE_INFINITY;

    let elHandle = null;

    try {
      const page = locator.page();
      await page.evaluate(browserCode);

      elHandle = await locator.elementHandle();
      const lineLengths = await page.evaluate(element =>
        element instanceof HTMLElement ? elementLineLength(element) : [],
        elHandle
      );

      const medianLength = median(lineLengths);
      if (medianLength != null) {
        if (medianLength < min) {
          return fail(`Median line length is ${medianLength} but must be >= ${min}`);
        }

        if (medianLength > max) {
          return fail(`Median line length is ${medianLength} but must be <= ${max}`);
        }

        return pass('passed');
      } else {
        return fail('No lines found');
      }
    } finally {
      if (elHandle) {
        await elHandle.dispose();
      }
    }
  }
};

function pass(message: string) {
  return result(message, true);
}

function fail(message: string) {
  return result(message, false);
}

function result(message: string, pass: boolean) {
  return {
    message: () => message,
    pass,
  };
}
