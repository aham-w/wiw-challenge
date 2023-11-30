const { describe, expect, it } = require('@jest/globals');
const { filterInvalidShifts } = require('../utils')
const moment = require('moment-timezone');

describe('filterInvalidShifts', () => {
    it('should sort shifts in ascending order by start date', () => {
        const allShifts = [
            {
                testId: 1,
                StartTime: moment('2021-01-05T00:00:00.000Z'),
                EndTime: moment('2021-01-06T00:00:00.000Z'),
            },
            {
                testId: 2,
                StartTime: moment('2021-01-03T00:00:00.000Z'),
                EndTime: moment('2021-01-04T00:00:00.000Z'),
            },
            {
                testId: 3,
                StartTime: moment('2021-01-01T00:00:00.000Z'),
                EndTime: moment('2021-01-02T00:00:00.000Z'),
            },
        ];
        const { shifts, invalid } = filterInvalidShifts(allShifts);
        expect(invalid).toEqual([]);

        expect(shifts).toEqual(allShifts.reverse());
    });

    it('should find overlapping shifts', () => {
        const allShifts = [
            {
                testId: 1,
                StartTime: moment('2021-01-05T00:00:00.000Z'),
                EndTime: moment('2021-01-06T00:00:00.000Z'),
            },
            {
                testId: 2,
                StartTime: moment('2021-01-01T00:00:00.000Z'),
                EndTime: moment('2021-01-04T00:00:00.000Z'),
            },
            {
                testId: 3,
                StartTime: moment('2021-01-01T00:00:00.000Z'),
                EndTime: moment('2021-01-02T00:00:00.000Z'),
            },
        ];
        const { shifts, invalid } = filterInvalidShifts(allShifts);
        expect(invalid.map(i => i.testId)).toEqual([2, 3]);
        expect(shifts).toEqual([allShifts[0]]);
    })

    it('should handle strange input', () => {
        expect(filterInvalidShifts('')).toEqual({ shifts: '', invalid: [] });
        expect(filterInvalidShifts(null)).toEqual({ shifts: null, invalid: [] });
        expect(filterInvalidShifts([])).toEqual({ shifts: [], invalid: [] });
        expect(filterInvalidShifts({})).toEqual({ shifts: {}, invalid: [] });
        expect(filterInvalidShifts(1)).toEqual({ shifts: 1, invalid: [] });
    });
});
