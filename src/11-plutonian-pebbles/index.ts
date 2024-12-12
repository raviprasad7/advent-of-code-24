// stone with 0 is replaced by stone with 1
// stone with number with even number of digits is replaced by two stones. for example 123456 is replaced by 123 and 456 without extra leading zeros
// other stones are replaced by number * 2024

import * as fs from 'fs';

const input = fs.readFileSync('input.txt', 'utf8');

function solveForPartOne() {
  const noOfBlinks = 25;
  let stones = input.split(' ').map(Number);

  for (let i = 0; i < noOfBlinks; i++) {
    const newStones = [];
    for (const stone of stones) {
      const stoneNoLength = String(stone).length;
      if (stone === 0) {
        newStones.push(1);
      } else if (stoneNoLength % 2 === 0) {
        const [firstHalf, secondHalf] = [String(stone).slice(0, stoneNoLength / 2), String(stone).slice(stoneNoLength / 2)];
        newStones.push(Number(firstHalf), Number(secondHalf));
      } else {
        newStones.push(stone * 2024);
      }
    }
    stones = newStones;
  }

  return stones.length;
}

function solveForPartTwo() {
  const noOfBlinks = 75;
  const stones = input.split(' ').map(Number);
  let map = new Map<number, number>();

  for (let stone of stones) {
    map.set(stone, (map.get(stone) || 0) + 1);
  }

  for (let i = 0; i < noOfBlinks; i++) {
    const newMap = new Map<number, number>();
    for (let [stone, count] of map.entries()) {
      if (stone === 0) {
        newMap.set(1, (newMap.get(1) || 0) + count);
      } else if (String(stone).length % 2 === 0) {
        const index = String(stone).length / 2;
        const left = parseInt(String(stone).substring(0, index), 10);
        const right = parseInt(String(stone).substring(index), 10);

        newMap.set(left, (newMap.get(left) || 0) + count);
        newMap.set(right, (newMap.get(right) || 0) + count);
      } else {
        newMap.set(stone * 2024, (newMap.get(stone * 2024) || 0) + count);
      }
    }
    map = newMap;
  }

  let sum = 0;
  for (let [, count] of map.entries()) {
    sum += count;
  }

  return sum;
}

console.log(solveForPartOne());
console.log(solveForPartTwo());

