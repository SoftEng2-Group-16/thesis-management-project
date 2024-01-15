const daoTeacher = require('../daoTeacher');
const daoUtils = require('../daoUtils');
const { rearrangeProposals, getInitialDate } = require('../routes/utils/utils.js'); // Replace 'yourFileName' with the actual file name

jest.mock('../daoTeacher');
jest.mock('../daoUtils');



describe('rearrangeProposals', () => {
    test('should rearrange proposals successfully', async () => {
      // Set up mock data and behavior for daoUtils and daoTeacher
      daoUtils.getExpiredProposals.mockResolvedValue([
        // mock data for expired proposals
      ]);
      daoUtils.getProposalsToRevive.mockResolvedValue([
        // mock data for proposals to revive
      ]);
      daoUtils.getAcceptedApplicationsIds.mockResolvedValue([
        // mock data for accepted proposals ids
      ]);
  
      daoTeacher.archiveProposal.mockImplementationOnce(() => Promise.resolve());
      daoTeacher.saveNewProposal.mockImplementationOnce(() => Promise.resolve());
      daoUtils.updateApplicationsForExpiredProposals.mockImplementationOnce(() => Promise.resolve());
      daoUtils.reviveExpiredApplications.mockImplementationOnce(() => Promise.resolve());
      daoUtils.deleteProposalFromArchived.mockImplementationOnce(() => Promise.resolve());
      daoUtils.updateVirtualClockDate.mockResolvedValue(1);
  
      const req = {
        body: {
          selectedTimestamp: 'yourSelectedTimestamp',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      await rearrangeProposals(req, res);
  
      // Expectations
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

describe('getInitialDate', () => {
  test('should get initial date successfully', async () => {
    // Mock DAO function
    daoUtils.getVirtualClockDate.mockResolvedValue('2022-01-01');

    // Mock request and response objects
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    // Call the function and wait for it to complete
    await getInitialDate(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith('2022-01-01'); // Change the expected value based on your logic
  });

  // Add more test cases for error scenarios if needed
});
