import fs from 'node:fs';
import path from 'node:path';
import { URL } from 'url';
import { median } from './math';

// Load code as a string to eval in browser
const __dirname = new URL('.', import.meta.url).pathname;
const browserCodePath = path.resolve(__dirname, './browser-code.js');
const browserCode = fs.readFileSync(browserCodePath).toString('utf-8');

export default {
  apply,
};

/**
 * @param {Expect} expect
 */
function apply(expect) {
  expect.extend({
    /**
     * @typedef {object} Range
     * @property {number?} min
     * @property {number?} max
     *
     * @param {Locator} locator
     * @param {Range} range
     */
    async toHaveMedianLineLength(locator, range) {
      if (range == null) {
        throw new Error(`range is required`);
      }
      if (range.min == null && range.max == null) {
        throw new Error(`At least one of range.min and range.max must be specified`);
      }

      const min = range.min != null ? Math.max(range.min, 0) : 0;
      const max = range.max != null ? range.max : Number.POSITIVE_INFINITY;

      let elHandle = null;

      try {
        const page = locator.page();
        await page.evaluate(browserCode);

        elHandle = await locator.elementHandle();
        const lineLengths = await page.evaluate(element => elementLineLength(element), elHandle);

        if (lineLengths.length > 0) {
          const medianLength = median(lineLengths);

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
  });
}

function pass(message) {
  return result(message, true);
}

function fail(message) {
  return result(message, false);
}

function result(message, pass) {
  return {
    message: () => message,
    pass,
  };
}
