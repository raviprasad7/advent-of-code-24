import * as fs from 'fs';

const N4: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1]];

function readGridFromFile(filePath: string): string[][] {
    const input = fs.readFileSync(filePath, 'utf8');
    return input.split('\n').map((row) => row.split(''));
}

function* regions(grid: string[][]): Generator<Set<[number, number]>> {
    const rows = grid.length;
    const cols = grid[0].length;
    const seen: boolean[][] = Array(rows).fill(false).map(() => Array(cols).fill(false));

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (!seen[r][c]) {
                seen[r][c] = true;
                const region = new Set<[number, number]>();
                region.add([r, c]);
                const stack: [number, number][] = [[r, c]];

                while (stack.length > 0) {
                    const [rr, cc] = stack.pop()!;
                    for (const [dr, dc] of N4) {
                        const rn = rr + dr;
                        const cn = cc + dc;
                        if (
                            rn >= 0 && rn < rows &&
                            cn >= 0 && cn < cols &&
                            grid[rn][cn] === grid[rr][cc] &&
                            !seen[rn][cn]
                        ) {
                            seen[rn][cn] = true;
                            region.add([rn, cn]);
                            stack.push([rn, cn]);
                        }
                    }
                }
                yield region;
            }
        }
    }
}

function area(region: Set<[number, number]>): number {
    return region.size;
}

function perimeter1(region: Set<[number, number]>): number {
    let p = 0;
    for (const [r, c] of region) {
        for (const [dr, dc] of N4) {
            const rn = r + dr;
            const cn = c + dc;
            if (!Array.from(region).some(([r2, c2]) => r2 === rn && c2 === cn)) {
                p += 1;
            }
        }
    }
    return p;
}

function perimeter2(region: Set<[number, number]>): number {
    let p = 0;
    for (const [r, c] of region) {
        for (const [dr, dc] of N4) {
            const rn = r + dr;
            const cn = c + dc;
            if (!Array.from(region).some(([r2, c2]) => r2 === rn && c2 === cn)) {
                if (r === rn && (
                    Array.from(region).some(([r2, c2]) => r2 === r - 1 && c2 === cn) ||
                    !Array.from(region).some(([r2, c2]) => r2 === r - 1 && c2 === c)
                )) {
                    p += 1;
                }
                if (c === cn && (
                    Array.from(region).some(([r2, c2]) => r2 === rn && c2 === c - 1) ||
                    !Array.from(region).some(([r2, c2]) => r2 === r && c2 === c - 1)
                )) {
                    p += 1;
                }
            }
        }
    }
    return p;
}

function main() {
    const startTime = Date.now();
    const grid = readGridFromFile("./input.txt");

    let ans1 = 0;
    let ans2 = 0;

    for (const region of regions(grid)) {
        ans1 += area(region) * perimeter1(region);
        ans2 += area(region) * perimeter2(region);
    }

    const elapsedTime = (Date.now() - startTime) / 1000;
    console.log(`part 1: ${ans1}  (${elapsedTime.toFixed(3)}s)`);
    console.log(`part 2: ${ans2}  (${elapsedTime.toFixed(3)}s)`);
}

main();