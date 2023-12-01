const moment = require('moment-timezone');
const {
    mapShiftsByEmployee,
    filterInvalidShifts,
    sortShiftsByWeekNumber,
    timeWorked,
    durationInHours,
    isShiftInWeek
} = require('./utils')

// set cst as default for moment objects as incoming timestamps will be utc by default
moment.tz.setDefault("America/Chicago");

const parser = (fileObj) => {
    const employeeShiftMap = mapShiftsByEmployee(fileObj); // employeeId: Array<shifts>

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

    return output;
}

module.exports = {
    parser,
};
