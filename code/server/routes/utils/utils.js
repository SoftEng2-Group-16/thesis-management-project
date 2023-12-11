const daoTeacher = require('../../daoTeacher');
const daoUtils= require('../../daoUtils');
const models = require('../../model');
const dayjs = require('dayjs');
const customParseFormat = require("dayjs/plugin/customParseFormat")
const it = require('dayjs/locale/it')

dayjs.extend(customParseFormat);

const rearrangeProposals = async (req,res) => {
    const selectedTimestamp = req.body.selectedTimestamp;
    try {
        let counterMovedProposals = 0;
        const expiredProposals = await daoUtils.getExpiredProposals(selectedTimestamp);
        const proposalsToRevive = await daoUtils.getProposalsToRevive(selectedTimestamp);
        const acceptedProposalsIds = await daoUtils.getAcceptedApplicationsIds(); //either array of ids or empty
 
        if(expiredProposals.length > 0 && !expiredProposals.error) {
            for (p of expiredProposals) {
                await daoTeacher.archiveProposal(new models.ThesisProposal(
                    p.id,
                    p.title,
                    p.supervisor,
                    p.cosupervisors.join('-'),
                    p.keywords,
                    p.type,
                    p.groups.join('-'),
                    p.description,
                    p.requirements,
                    p.notes,
                    p.expiration,
                    p.level,
                    p.cds.join(',')
                ))
                    .then(() => {
                        daoUtils.updateApplicationsForExpiredProposals(p.id, p.supervisor.slice(0,6))
                            .then(daoTeacher.deleteProposal(p.id));
                        counterMovedProposals++;
                    })
                    .catch( (e) => {
                        return res.status(500).json(e.message);
                    });
            }
        }
        
        if(proposalsToRevive.length > 0 && !proposalsToRevive.error) {
            for (p of proposalsToRevive) { 
                if(!acceptedProposalsIds.includes(p.id)) {
                    await daoTeacher.saveNewProposal(new models.ThesisProposal(
                        p.id,
                        p.title,
                        p.supervisor,
                        p.cosupervisors.join('-'),
                        p.keywords,
                        p.type,
                        p.groups.join('-'),
                        p.description,
                        p.requirements,
                        p.notes,
                        p.expiration,
                        p.level,
                        p.cds.join(',')
                    ))
                        .then(() => {
                            daoUtils.reviveExpiredApplications(p.id)
                                .then(daoUtils.deleteProposalFromArchived(p.id));
                            counterMovedProposals++;
                        })
                        .catch ( (e) => {
                            return res.status(500).json(e.message);
                        });
                }
            }
        }

        //update the date in the db
        const updated = await daoUtils.updateVirtualClockDate(selectedTimestamp);
        if(updated != 1){
            console.log(updated);
            return res.status(500).json({error: 'Problem while updating the date'});
        }
        
        //if we get here, all went well
        return res.status(200).json(counterMovedProposals);
    } catch(e) {
        return res.status(500).json(e.message);
    }
}

const getInitialDate = async (req,res) => {
    try {
        const date = await daoUtils.getVirtualClockDate();
        return res.status(200).json(date);
    } catch(e) {
        return res.status(500).json(e.message);
    }
}

module.exports = {
    rearrangeProposals,
    getInitialDate
}