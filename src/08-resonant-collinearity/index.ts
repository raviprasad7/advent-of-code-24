import fs from 'fs';

const input = fs.readFileSync('input.txt', 'utf8');

const inputArray = input.split('\n').map((line) => line.split(''));

const frequencyMap = new Map<string, number[][]>();
const isOutOfBounds = ([i, j]: number[]) =>
  i < 0 || i >= inputArray.length || j < 0 || j >= inputArray[i].length;

for (let i = 0; i < inputArray.length; i++) {
  for (let j = 0; j < inputArray[i].length; j++) {
    const char = inputArray[i][j];
    if (char !== '.') {
      frequencyMap.set(char, [...(frequencyMap.get(char) || []), [i, j]]);
    }
  }
}

function solve(useUpdatedModel = false) {
  const antinodeLocations = new Set<string>();

  for (const [, positions] of frequencyMap) {
    for (let i = 0; i < positions.length - 1; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const xDiff = positions[i][0] - positions[j][0];
        const yDiff = positions[i][1] - positions[j][1];

        if (useUpdatedModel) {
          let multiplier = 1;
          antinodeLocations.add(positions[i].join('-'));
          antinodeLocations.add(positions[j].join('-'));

          while (true) {
            const antiNode = [
              positions[i][0] + (xDiff * multiplier),
              positions[i][1] + (yDiff * multiplier),
            ];
            if (isOutOfBounds(antiNode)) {
              break;
            }
            antinodeLocations.add(antiNode.join('-'));
            multiplier++;
          }
          multiplier = 1;
          while (true) {
            const antiNode = [
              positions[j][0] - (xDiff * multiplier),
              positions[j][1] - (yDiff * multiplier),
            ];
            if (isOutOfBounds(antiNode)) {
              break;
            }
            antinodeLocations.add(antiNode.join('-'));
            multiplier++;
          }
        } else {
          const antiNode1 = [positions[i][0] + xDiff, positions[i][1] + yDiff];
          const antiNode2 = [positions[j][0] - xDiff, positions[j][1] - yDiff];
          if (!isOutOfBounds(antiNode1)) {
            antinodeLocations.add(antiNode1.join('-'));
          }
          if (!isOutOfBounds(antiNode2)) {
            antinodeLocations.add(antiNode2.join('-'));
          }
        }
      }
    }
  }
  return antinodeLocations.size;
}

// Part 1
console.log(solve());

// Part 2
console.log(solve(true));
