/**
 * @param {Array<number>} values
 * @return {number | null}
 */
export function median(values) {
  if (values.length > 0) {
    const sortedValues = values.slice().sort((a, b) => a - b);
    const middleIndex = Math.floor(sortedValues.length / 2);

    return sortedValues.length % 2 === 0
      ? (sortedValues[middleIndex - 1] + sortedValues[middleIndex]) / 2
      : sortedValues[middleIndex];
  } else {
    return null;
  }
}
