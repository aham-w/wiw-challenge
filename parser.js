const moment = require('moment-timezone');
const fs = require('fs');

// set cst as default for moment objects as incoming timestamps will be utc by default
moment.tz.setDefault("America/Chicago");

if (process.argv.length !== 3 || !process.argv[2].length) {
    console.error('no file found');
}

const mapShiftsByEmployee = (shifts) => {
    const shiftsByEmployee = {};

    for (const aShift of shifts) {
        const key = aShift.EmployeeID;
        aShift.StartTime = moment(aShift.StartTime);
        aShift.EndTime = moment(aShift.EndTime);
        if (!shiftsByEmployee[key]) {
            shiftsByEmployee[key] = [aShift];
        } else {
            shiftsByEmployee[key].push(aShift);
        }
    }

    return shiftsByEmployee
};

const filterInvalidShifts = (shifts) => {
    // sort by start time
    shifts.sort((aShift, bShift) => aShift.StartTime.valueOf() - bShift.StartTime.valueOf());

    // compare start and end times of two shifts to see if they overlap
    const invalid = [];
    for (let i = 1; i < shifts.length; i++) {
        if (shifts[i - 1].EndTime.isAfter(shifts[i].StartTime)) {
            invalid.push(shifts[i - 1], shifts[i]);
            shifts.splice(i - 1, 2);
        }
    }

    return { shifts, invalid }
}

// sort shifts by week they occur in year
const sortShiftsByWeekNumber = (shifts) => {
    const shiftsByWeek = {};
    shifts.forEach((shift) => {
        const startWeekNumber = shift.StartTime.week();
        const endWeekNumber = shift.EndTime.week();

        if (!shiftsByWeek[startWeekNumber]) {
            shiftsByWeek[startWeekNumber] = [];
        }
        if (!shiftsByWeek[endWeekNumber]) {
            shiftsByWeek[endWeekNumber] = [];
        }

        // shift crosses two weeks, split into two shifts
        if (endWeekNumber !== startWeekNumber) {
            let endOfFirstWeek = shift.StartTime.clone().endOf('week')
            const firstPart = {
                ShiftID: shift.ShiftID,
                EmployeeID: shift.EmployeeID,
                StartTime: shift.StartTime,
                EndTime: endOfFirstWeek,
            };
            const secondPart = {
                ShiftID: shift.ShiftID,
                EmployeeID: shift.EmployeeID,
                StartTime: endOfFirstWeek,
                EndTime: shift.EndTime,
            }
            shiftsByWeek[startWeekNumber].push(firstPart);
            shiftsByWeek[endWeekNumber].push(secondPart);
        } else {
            shiftsByWeek[startWeekNumber].push(shift); // normal case
        }
    });
    return shiftsByWeek;
}

// calculate total time worked in ms from array of shifts
const timeWorked = (shifts) => shifts.reduce(
    (timeWorked, shift) => timeWorked + (shift.EndTime.valueOf() - shift.StartTime.valueOf()),
    0,
);

// convert number in ms to hours
const durationInHours = (duration) => Math.round(moment.duration(duration).asHours() * 100) / 100;

// given a timestamp, check if shift occurs in week
const isShiftInWeek = (shift, ts) => shift.StartTime.isSameOrAfter(ts.startOf('week')) && shift.EndTime.isSameOrBefore(ts.endOf('week'))

const file = require(process.argv[2]);
const employeeShiftMap = mapShiftsByEmployee(file); // employeeId: Array<shifts>

const invalidShifts = {}; // employeeId: Array<shifts>
for (const employeeId in employeeShiftMap) {
    const employeeShifts = employeeShiftMap[employeeId];
    const { shifts, invalid } = filterInvalidShifts(employeeShifts);
    employeeShiftMap[employeeId] = shifts;
    invalidShifts[employeeId] = invalid;
}

const output = [];
for (const EmployeeID in employeeShiftMap) {
    const employeeShiftsByWeek = sortShiftsByWeekNumber(employeeShiftMap[EmployeeID]) // weekNumber: Array<shifts>

    Object.values(employeeShiftsByWeek).forEach((shiftsByWeek) => {
        const RegularHours = durationInHours(timeWorked(shiftsByWeek));
        const ts = shiftsByWeek[0].StartTime;

        const mergedWeekRes = {
            EmployeeID,
            StartOfWeek: shiftsByWeek[0].EndTime.startOf('week'),
            RegularHours,
            OvertimeHours: 0,
            InvalidShifts: invalidShifts[EmployeeID].filter((shift) => isShiftInWeek(shift, ts)).map((shift) => shift.ShiftID),
        }

        if (mergedWeekRes.RegularHours > 40) {
            mergedWeekRes.OvertimeHours = mergedWeekRes.RegularHours - 40;
            mergedWeekRes.RegularHours = 40;
        }
        output.push(mergedWeekRes);
    })
}

// export results to json file
fs.writeFile(
    './result.json',
    JSON.stringify(output),
    'utf-8',
    (e) => {
        if (!e) console.log('successfully parsed shift data, exported to result.json')
    }
);
