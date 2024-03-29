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
            for (const p of expiredProposals) {
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
            for (const p of proposalsToRevive) { 
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


/* 
    Cron job function: in a real world scenario, this would be called every day at midnight to move expired proposals to the archive,
    using the real date as a timestamp to perform the check of expiration.
    In our case, since we have the virtual clock saved in the DB (so it's frozen to a specific date), we use the saved initial date
    as if it was the real date, and perform the cron job every 5 minutes.
    NEED TO BE CHANGED in real world usage!
*/

module.exports = {
    rearrangeProposals,
    getInitialDate,
}