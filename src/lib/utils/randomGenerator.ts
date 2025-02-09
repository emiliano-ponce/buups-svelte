function seededRandom(seed: number): () => number {
  return function () {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
}

export function getRandomizedArrayCopy<T>(arr: T[], seed: number, length: number): T[] {
  const random = seededRandom(seed);
  const result: T[] = [];
  for (let i = 0; i < length; i++) {
    result.push(arr[Math.floor(random() * arr.length)]);  
  }
  console.log(result);
  return result;
}
