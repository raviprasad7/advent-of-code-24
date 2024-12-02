import * as fs from 'fs';

const data = fs.readFileSync('./input.txt', 'utf8');

const firstList = [];
const secondList = [];
let sum = 0;

for (const line of data.split('\n')) {
  const [first, second] = line.split(/\s+/);
  firstList.push(+first);
  secondList.push(+second);
}

firstList.sort((a, b) => a - b);
secondList.sort((a, b) => a - b);

for (let i = 0; i < firstList.length; i++) {
  sum += Math.abs(firstList[i] - secondList[i]);
}

console.log(sum);

// Part 2
const frequencyMap = new Map<number, number>();
let similarityScore = 0;

for (const num of secondList) {
  frequencyMap.set(num, (frequencyMap.get(num) ?? 0) + 1);
}

for (const num of firstList) {
  if (frequencyMap.has(num)) {
    similarityScore += num * frequencyMap.get(num)!;
  }
}

console.log(similarityScore);
