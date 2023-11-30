const { describe, expect, it } = require('@jest/globals');
const { mapShiftsByEmployee } = require('../utils')

describe('mapShiftsByEmployee', () => {
    it('should sort shifts by employee id', () => {
        const shiftMap = mapShiftsByEmployee([
            {
                EmployeeID: 1,
            },
            {
                EmployeeID: 2,
            },
            {
                EmployeeID: 2,
            },
            {
                EmployeeID: 3,
            },
            {
                EmployeeID: 3,
            },
            {
                EmployeeID: 3,
            }
        ]);

        expect(Object.keys(shiftMap).length).toBe(3);
        expect(shiftMap[1].length).toBe(1);
        expect(shiftMap[2].length).toBe(2);
        expect(shiftMap[3].length).toBe(3);
        expect(shiftMap[4]).toBe(undefined);
    });

    it('should handle strange input', () => {
        expect(mapShiftsByEmployee('')).toEqual({});
        expect(mapShiftsByEmployee(null)).toEqual({});
        expect(mapShiftsByEmployee([])).toEqual({});
        expect(mapShiftsByEmployee({})).toEqual({});
        expect(mapShiftsByEmployee(1)).toEqual({});
    });
});
