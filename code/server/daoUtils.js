const db = require('./db');
const dayjs = require('dayjs');
const customParseFormat = require("dayjs/plugin/customParseFormat");
var isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
const { Applications, Application, Student, ThesisProposal, Teacher } = require('./model');

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);

exports.getExpiredProposals = (selectedTimestamp) => {
    const ts = dayjs(selectedTimestamp, "DD-MM-YYYY");
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * from thesis_proposals'
        db.all(
            sql,
            [],
            (err, rows) => {
                if (err) {
                    reject(err)
                } else if (rows.length == 0) {
                    resolve({ error: `No thesis proposals found while changing time` });
                } else {
                    const proposals = rows
                        .filter(r => {
                            const pts = dayjs(r.expiration, "DD-MM-YYYY");
                            if (pts.isBefore(ts))
                                return r;
                        })
                        .map((row) => ({
                                id: row.id,
                                title: row.title,
                                supervisor: row.supervisor,
                                cosupervisors: row.cosupervisors.split('-'),
                                keywords: row.keywords,
                                type: row.type,
                                groups: row.groups.split('-'),
                                description: row.description,
                                requirements: row.requirements,
                                notes: row.notes,
                                expiration: row.expiration,
                                level: row.level,
                                cds: row.cds.split(','),
                            }
                        ));
                    resolve(proposals);
                }
            }
        )
    });
}

exports.getProposalsToRevive = (selectedTimestamp) => {
    const ts = dayjs(selectedTimestamp, "DD-MM-YYYY");
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * from archived_thesis_proposals'
        db.all(
            sql,
            [],
            (err, rows) => {
                if (err) {
                    reject(err)
                } else if (rows.length == 0) {
                    resolve({ error: `No archived thesis proposals found while changing time` });
                } else {
                    const proposals = rows
                        .filter(r => {
                            const pts = dayjs(r.expiration, "DD-MM-YYYY");
                            if (pts.isSameOrAfter(ts))
                                return r;
                        })
                        .map((row) => ({
                                id: row.id,
                                title: row.title,
                                supervisor: row.supervisor,
                                cosupervisors: row.cosupervisors.split('-'),
                                keywords: row.keywords,
                                type: row.type,
                                groups: row.groups.split('-'),
                                description: row.description,
                                requirements: row.requirements,
                                notes: row.notes,
                                expiration: row.expiration,
                                level: row.level,
                                cds: row.cds.split(','),
                            }
                        ));
                    resolve(proposals);
                }
            }
        )
    });
}

exports.getAcceptedApplicationsIds = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT thesisid FROM applications WHERE status=?';
        db.all(
            sql,
            ["accepted"],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else if (rows.length == 0) {
                    resolve([]); //no accepted applications found
                } else {
                    const ids = rows.map(row => row.thesisid);
                    resolve(ids);
                }
            }
        )
    });
}


exports.updateApplicationsForExpiredProposals = (thesisId, teacherId) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE applications SET status = "expired" WHERE thesisid = ?  AND teacherId = ? AND status="pending"';
        db.run(
            sql,
            [thesisId, teacherId],
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    /* const updatedApplication = {
                      id: thesisId,
                      status: 'canceled',
                    }; */
                    resolve(this.changes);
                }
            }
        );
    });
};

exports.reviveExpiredApplications = (thesisId) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE applications SET status=? WHERE thesisid=? AND status=?'
        db.run(
            sql,
            ["pending", thesisId, "expired"],
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    //this.cancelApplicationsAfterClockChange();
                    resolve(this.changes);
                }
            }
        )
    })
}

exports.deleteProposalFromArchived = (proposalId) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM archived_thesis_proposals WHERE id=?'
        db.run(
            sql,
            [proposalId],
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            }
        )
    });
}

exports.getVirtualClockDate = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT date FROM vc_date WHERE id=?';
        db.all(
            sql,
            [0],
            (err,rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows[0].date);
                }
            }
        );
    });
}

exports.updateVirtualClockDate = (date) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE vc_date SET date=? WHERE id=?'
        db.run(
            sql,
            [date,0],
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    //this.cancelApplicationsAfterClockChange();
                    resolve(this.changes);
                }
            }
        )
    })
}