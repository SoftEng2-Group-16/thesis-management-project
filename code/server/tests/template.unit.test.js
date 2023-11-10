"use strict";


beforeAll(() => {
    jest.clearAllMocks();
});

describe("Unit Tests descibe", () => {
    test("sample test", () => {
        const req = {};
        const res = {
            status: jest.fn(),
            json: jest.fn()
        };

        expect(1+1).toEqual(2);
    });
});