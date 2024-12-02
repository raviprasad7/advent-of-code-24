import * as fs from 'fs';

enum NatureOfDifference {
  INCREASING = 'INCREASING',
  DECREASING = 'DECREASING'
}

const data = fs.readFileSync('./input.txt', 'utf8');
const reports = data.split('\n').map(line => line.split(' ').map(Number));

function validateReports(reports: number[][], accountForErrors: boolean = false): number {
  let safetyReports = 0;

  const isLevelSafe = (
    natureOfDifference: NatureOfDifference,
    diff: number
  ): boolean =>
    natureOfDifference === NatureOfDifference.INCREASING
      ? diff >= 1 && diff <= 3
      : diff <= -1 && diff >= -3;

  const isReportSafe = (report: number[], accountForErrors: boolean = false) => {
    let isSafe = true;
    
    if (report.length > 1) {
      const natureOfDifference =
        report[report.length - 1] - report[0] > 0
            ? NatureOfDifference.INCREASING
            : NatureOfDifference.DECREASING;
    
      for (let i = 0; i < report.length - 1; i++) {
        const diff = report[i + 1] - report[i];
        if (!isLevelSafe(natureOfDifference, diff)) {
          isSafe = false;
          if (accountForErrors) {
            isSafe = isReportSafe([...report.slice(0, i), ...report.slice(i + 1)]) || isReportSafe([...report.slice(0, i + 1), ...report.slice(i + 2)]);
          }
          if (!isSafe) {
            break;
          }
        }
      }
    
      if (isSafe) {
        return true;
      }
    }
  
    return false;
  };
  
  for (const report of reports) {
    if (isReportSafe(report, accountForErrors)) {
      safetyReports++;
    }
  }

  return safetyReports;
}


// console.log(validateReports(reports));

// Part 2
console.log(validateReports(reports, true));