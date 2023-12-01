const { describe, expect, it } = require('@jest/globals');
const { parser } = require('../parser');
const dataset = require('../__test__/data/dataset.json')

describe('parser', () => {
    it('parse dataset', () => {
        const output = parser(dataset);
        expect(output).toMatchSnapshot();
    })
})
