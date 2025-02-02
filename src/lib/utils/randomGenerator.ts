function seededRandom(seed: number): () => number {
  return function() {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
}

/**
 * 
 * @param seed Seed for random number generator -- also is the first number in the returned array
 * @param length Length of the array to return
 * @param max Maximum value for each number in the array
 * @returns An array of random numbers between 0 and max
 */
export function getRandomNumArr(seed: number, length: number, max: number): number[] {
  const random = seededRandom(seed);
  const result: number[] = [];
  for (let i = 0; i < length; i++) {
    result.push(Math.floor(random() * (max + 1)));
  }
  return result;
}
