const { describe, expect, test } = require('@jest/globals');
const { parser } = require('../parser');
const dataset = require('../__test__/data/dataset.json')

describe('parser', () => {
    test('parse dataset', () => {
        const output = parser(dataset);
        expect(output).toMatchSnapshot();
    });

    test('invalid json formats', () => {
        const ts = '2021-01-03T00:00:00.000Z';

        expect(parser({})).toBe(null);
        expect(parser([{ ShiftID: 1, EmployeeID: 1, StartTime: ts }])).toBe(null);
        expect(parser([{ ShiftID: 1, EmployeeID: 1, EndTime: ts }])).toBe(null);
        expect(parser([{ ShiftID: '', EmployeeID: 1, EndTime: ts, StartTime: ts }])).toBe(null);
        expect(parser([{ ShiftID: 1, EmployeeID: true, EndTime: ts, StartTime: ts }])).toBe(null);
    });
});
