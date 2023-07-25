import { parse, differenceInDays } from 'date-fns';

const ResultTable = ({ values }) => {

    function parseDate(dateString) {
        if (dateString === 'NULL') {
            return new Date(); // Return today's date for "NULL"
        }

        // Define possible date formats (excluding the "NULL" case)
        const possibleFormats = [
            'd.M.yyyy', // 1.11.2013
            'd.M.yyyy', // 16.5.2012
            'd.M.yyyy', // 1.1.2009
            'd.M.yyyy', // 20.8.2015
            'd.M.yyyy', // 15.6.2013
            'd.M.yyyy', // 1.3.2010
            'd.M.yyyy', // 10.12.2014
        ];

        for (const formatStr of possibleFormats) {
            const parsedDate = parse(dateString, formatStr, new Date());
            if (parsedDate && !isNaN(parsedDate.getTime())) {
                return parsedDate;
            }
        }

        return null; // Return null if the date couldn't be parsed with any format
    }

    function calculateOverlap(dateFrom1, dateTo1, dateFrom2, dateTo2) {
        const start1 = parseDate(dateFrom1);
        const end1 = parseDate(dateTo1);
        const start2 = parseDate(dateFrom2);
        const end2 = parseDate(dateTo2);

        if (!start1 || !end1 || !start2 || !end2) {
            return 0; // Unable to parse dates, return 0
        }

        if (start1 > end2 || start2 > end1) {
            return 0; // No overlap, return 0
        }

        const overlapStart = start1 < start2 ? start2 : start1;
        const overlapEnd = end1 < end2 ? end1 : end2;
        const overlapDays = differenceInDays(overlapEnd, overlapStart) + 1; // Adding 1 to include the last day
        return overlapDays;
    }

    function findLongestWorkTogetherPair(data) {
        let longestOverlap = 0;
        let longestPair = [];
      
        for (let i = 0; i < data.length; i++) {
          for (let j = i + 1; j < data.length; j++) {
            if (data[i][0] !== data[j][0]) {
              const overlap = calculateOverlap(data[i][2], data[i][3], data[j][2], data[j][3]);
              if (overlap > longestOverlap) {
                longestOverlap = overlap;
                longestPair = [data[i][0], data[j][0]];
              }
            }
          }
        }
      
        return longestPair;
      }

      function findCommonProjects(data, employeeId1, employeeId2) {
        const commonProjects = [];
        for (const work1 of data) {
          for (const work2 of data) {
            if (
              work1[0] === employeeId1 &&
              work2[0] === employeeId2 &&
              work1[1] === work2[1]
            ) {
              const overlapDays = calculateOverlap(work1[2], work1[3], work2[2], work2[3]);
              if (overlapDays > 0) {
                commonProjects.push({
                  employeeId1,
                  employeeId2,
                  projectId: work1[1],
                  daysWorked: overlapDays,
                });
              }
            }
          }
        }
        return commonProjects;
      }

    const longestWorkTogetherPair = findLongestWorkTogetherPair(values);
    const commonProjects = findCommonProjects(
        values,
        longestWorkTogetherPair[0],
        longestWorkTogetherPair[1]
      );

    return (
        <div>
            <table>
        <thead>
          <tr>
            <th>Employee ID #1</th>
            <th>Employee ID #2</th>
            <th>Project ID</th>
            <th>Days worked</th>
          </tr>
        </thead>
        <tbody>
          {commonProjects.map((project, index) => (
            <tr key={index}>
              <td>{project.employeeId1}</td>
              <td>{project.employeeId2}</td>
              <td>{project.projectId}</td>
              <td>{project.daysWorked}</td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>
    );
}

export default ResultTable;