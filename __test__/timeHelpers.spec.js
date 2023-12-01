const { describe, expect, test } = require('@jest/globals');
const { timeWorked, durationInHours, isShiftInWeek } = require('../utils')
const moment = require('moment-timezone');

describe('time helpers', () => {
    test('timeWorked', () => {
        const shifts = [
            {
                StartTime: moment("2021-08-30T12:30:00.000000Z"),
                EndTime: moment("2021-08-30T21:00:00.000000Z")
            },
            {
                StartTime: moment("2021-08-27T13:00:00.000000Z"),
                EndTime: moment("2021-08-28T01:30:00.000000Z")
            },
            {
                StartTime: moment("2021-08-27T13:00:00.000000Z"),
                EndTime: moment("2021-08-28T01:30:00.000000Z")
            },
        ];
        const duration = timeWorked(shifts);
        expect(duration).toBe(120600000);
    });

    test('durationInHours', () => {
        expect(durationInHours(120600000)).toBe(33.5);
        expect(durationInHours(27000000)).toBe(7.5);
        expect(durationInHours(-13000000)).toBe(-3.61);
    });

    test('isShiftInWeek', () => {
        const ts = moment("2021-08-23T00:00:00.000000Z");
        const shiftInWeek = {
            StartTime: moment('2021-08-27T00:00:00.000Z'),
            EndTime: moment('2021-08-28T00:00:00.000Z'),
        }
        const notInWeek = {
            StartTime: moment('2021-09-27T00:00:00.000Z'),
            EndTime: moment('2021-09-28T00:00:00.000Z'),
        }
        expect(isShiftInWeek(shiftInWeek, ts)).toBe(true);
        expect(isShiftInWeek(notInWeek, ts)).toBe(false);
    });
});
