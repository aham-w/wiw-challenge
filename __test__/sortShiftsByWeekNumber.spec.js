const { describe, expect, it } = require('@jest/globals');
const { sortShiftsByWeekNumber } = require('../utils')
const moment = require('moment-timezone');

describe('sortShiftsByWeekNumber', () => {
    it('should sort shifts - normal case', () => {
        const shifts = [
            {
                ShiftID: 1,
                StartTime: moment('2021-08-27T00:00:00.000Z'),
                EndTime: moment('2021-08-28T00:00:00.000Z'),
            },
            {
                ShiftID: 2,
                StartTime: moment('2021-08-10T00:00:00.000Z'),
                EndTime: moment('2021-08-11T00:00:00.000Z'),
            },
            {
                ShiftID: 3,
                StartTime: moment('2021-08-26T00:00:00.000Z'),
                EndTime: moment('2021-08-27T00:00:00.000Z'),
            },
            {
                ShiftID: 4,
                StartTime: moment('2021-08-11T00:00:00.000Z'),
                EndTime: moment('2021-08-12T00:00:00.000Z'),
            },
        ];
        const shiftsByWeek = sortShiftsByWeekNumber(shifts);
        expect(Object.keys(shiftsByWeek).length).toBe(2);
        expect(shiftsByWeek['33']).toEqual([shifts[1], shifts[3]]);
        expect(shiftsByWeek['35']).toEqual([shifts[0], shifts[2]]);
    });

    it('should sort shifts - split case', () => {
        const shifts = [
            {
                ShiftID: 1,
                StartTime: moment('2021-08-21T21:00:00.000Z'),
                EndTime: moment('2021-08-22T06:00:00.000Z'),
            },
        ];
        const shiftsByWeek = sortShiftsByWeekNumber(shifts);
        expect(Object.keys(shiftsByWeek).length).toBe(2);
        expect(shiftsByWeek['34'].EndTime).toEqual(shiftsByWeek['35'].StartTime);
    });

    it('should handle strange input', () => {
        expect(sortShiftsByWeekNumber('')).toEqual({});
        expect(sortShiftsByWeekNumber(null)).toEqual({});
        expect(sortShiftsByWeekNumber([])).toEqual({});
        expect(sortShiftsByWeekNumber({})).toEqual({});
        expect(sortShiftsByWeekNumber(1)).toEqual({});
    });
});
