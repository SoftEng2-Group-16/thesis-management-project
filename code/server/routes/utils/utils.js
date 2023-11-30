const dao = require('../../dao');
const dayjs = require('dayjs');;
const customParseFormat = require("dayjs/plugin/customParseFormat")
const models = require('../../model');

dayjs.extend(customParseFormat);

const rearrangeProposals = async (req,res) => {
    const selectedTimestamp = req.body.selectedTimestamp;
    try {
        let counterMovedProposals = 0;
        let expiredProposals = await dao.getExpiredProposals(selectedTimestamp);
        let proposalsToRevive = await dao.getProposalsToRevive(selectedTimestamp);
        const acceptedProposalsIds = await dao.getAcceptedProposalsIds()
            .then(ids => {
                if(ids.error){
                    return [];
                } else {
                    return ids;
                }
            });
        
        if(expiredProposals.length > 0 && !expiredProposals.error) {
            for (p of expiredProposals) { 
                //archive expired proposals (insert into archived_thesis_proposals, delete from thesis proposals)
                //also mark as expired all applications for expired proposals
                await dao.archiveProposal(new models.ThesisProposal(
                    p.id, //can be whatever, DB handles autoincrement id
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
                        dao.deleteProposal(p.id);
                        dao.updateApplicationsForExpiredProposals(p.id, p.supervisor.slice(0,6));
                        counterMovedProposals++;
                    })
                    .catch( (e) => {
                        return res.status(500).json(e.message);
                    });
    
            }
        }
        
        if(proposalsToRevive.length > 0 && !proposalsToRevive.error) {
            for (p of proposalsToRevive) { 
                //revive expired proposals (insert into thesis_proposals, delete from archived_thesis_proposals)
                //put related applications statuses back to pending, but should also update proposal id since it's been
                //inserted back as a new row in the table
                //NOTE: revive a proposal only if there isn't already an accepted application for that proposal, otherwise
                //ignore it
                if(!acceptedProposalsIds.includes(p.id)) {
                    await dao.saveNewProposal(new models.ThesisProposal(
                        p.id, //can be whatever, DB handles autoincrement id
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
                        .then((newId) => {
                            dao.reviveExpiredApplications(p.id, newId)
                                .then(dao.deleteProposalFromArchived(p.id))
                            counterMovedProposals++;
                        })
                        .catch ( (e) => {
                            return res.status(500).json(e.message);
                        });
                }
            }
        }

        //clean up eventual applications that need to be put back as canceled
        await dao.cancelApplicationsAfterClockChange();
        
        //if we get here, all went well
        return res.status(200).json(counterMovedProposals);
    } catch(e) {
        return res.status(500).json(e.message);
    }
}

module.exports = {
    rearrangeProposals
}