const moment = require('moment-timezone');

const mapShiftsByEmployee = (shifts) => {
    const shiftsByEmployee = {};

    if (!shifts || !Array.isArray(shifts) || shifts.length < 1) return shiftsByEmployee;

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

module.exports = {
    mapShiftsByEmployee,
    filterInvalidShifts,
    sortShiftsByWeekNumber,
    timeWorked,
    durationInHours,
    isShiftInWeek,
};
