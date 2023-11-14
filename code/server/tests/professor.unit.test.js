"use strict";

const professorApi = require("../routes/controller/professor")

beforeEach(() => {
    jest.clearAllMocks();
});


// Mock delle implementazioni specifiche per professorAPI

const mockGetPossibleCosupervisors = jest.fn(() => Promise.resolve({ internals: ["Nome Cognome, ID, Cod", "Nome2 Cognome2, ID2, Cod2", "Nome3 Cognome3, ID3, Cod3"], externals: ["Nome4 Cognome4, ID4, Cod4", "Nome5 Cognome5, ID5, Cod5"] }));
const mockGetDegreesInfo = jest.fn(() => Promise.resolve(["LM adha", "LT ucx", "LT asasd"]));

jest.mock('../../client/src/apis/professorAPI.js', () => ({
    getPossibleCosupervisors: mockGetPossibleCosupervisors,
    getDegreesInfo: mockGetDegreesInfo,
}));

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Unit Tests descibe", () => {
    test("insert proposal test", async () => {
        const req = {
            body: {
                title: "Sample Title",
                supervisor: "123, John Doe",
                cosupervisors: ["Nome Cognome, ID, Cod"],
                keywords: "Sample, Keywords",
                type: "Sample Type",
                groups: [""],
                description: "Sample Description",
                requirements: "Sample Requirements",
                notes: "Sample Notes",
                expiration: "01-01-2024", // Assuming date format is dd-mm-yyyy
                level: "master",
                cds: ["LM adha"],
            }

        };
        const res = {
            status: jest.fn(),
            json: jest.fn()
        };
        const result = await professorApi.insertNewProposal(req, res)

        expect(result).toBeDefined();
        console.log(result);



    });
});