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
                        .map((row) => (
                            {
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
                        .map((row) => (
                            {
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

exports.getAcceptedProposalsIds = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT thesisid FROM applications WHERE status=?';
        db.all(
            sql,
            ["accepted"],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else if (!rows || rows.length == 0) {
                    resolve({ error: "No accepted applications, can revive all proposals" });
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

exports.cancelApplicationsAfterClockChange = () => { //used to put back as canceled applications that have been revived wrongly
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE applications SET status=? WHERE status=? AND studentid IN  ( SELECT studentid FROM applications WHERE status=? )'
        db.run(
            sql,
            ["canceled", "pending", "accepted"],
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

exports.reviveExpiredApplications = (thesisId) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE applications SET status=? WHERE thesisid=? AND (status=? OR status=?)'
        db.run(
            sql,
            ["pending", thesisId, "expired", "canceled"],
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
