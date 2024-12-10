import * as fs from 'fs';

const input = fs.readFileSync('input.txt', 'utf8');
const inputData = input.split('\n\n');
const orderingRules = inputData[0]
  .split('\n')
  .map((line) => line.split('|'))
  .map(([first, second]) => [Number(first), Number(second)]);
const printQueues = inputData[1]
  .split('\n')
  .map((line) => line.split(',').map(Number));
const correctOrderQueues: number[][] = [];
const incorrectOrderQueues: number[][] = [];
const computeSum = (arr: number[][]): number => arr.reduce((acc, x) => acc + x[Math.floor(x.length / 2)], 0);

type DependencyGraph = Map<number, { before: number[], after: number[] }>;

const dependencyGraph: DependencyGraph = new Map();

for (const [first, second] of orderingRules) {
  if (!dependencyGraph.has(first)) {
    dependencyGraph.set(first, { before: [], after: [] });
  }

  if (!dependencyGraph.has(second)) {
    dependencyGraph.set(second, { before: [], after: [] });
  }

  dependencyGraph.get(first)!.after.push(second);
  dependencyGraph.get(second)!.before.push(first);
}

for (const elements of printQueues) {
  let isValidQueue = true;

  for (let i = 0; i < elements.length; i++) {
    for (let j = 0; j < i - 1; j++) {
      if (dependencyGraph.get(elements[j])?.before.includes(elements[i])) {
        isValidQueue = false;
        incorrectOrderQueues.push(elements);
        break;
      }
    }
    if (!isValidQueue) break;

    for (let j = i + 1; j < elements.length; j++) {
      if (dependencyGraph.get(elements[j])?.after.includes(elements[i])) {
        isValidQueue = false;
        incorrectOrderQueues.push(elements);
        break;
      }
    }
  }

  if (isValidQueue) {
    correctOrderQueues.push(elements);
  }
}
console.log(computeSum(correctOrderQueues));

// Part 2
for (const elements of incorrectOrderQueues) {
  for (let i = 0; i < elements.length; i++) {
    for (let j = 0; j < i - 1; j++) {
      if (dependencyGraph.get(elements[j])?.before.includes(elements[i])) {
        let temp = elements[i];
        elements[i] = elements[j];
        elements[j] = temp;
      }
    }
    for (let j = i + 1; j < elements.length; j++) {
      if (dependencyGraph.get(elements[j])?.after.includes(elements[i])) {
        let temp = elements[i];
        elements[i] = elements[j];
        elements[j] = temp;
      }
    }
  }
}
console.log(computeSum(incorrectOrderQueues));
