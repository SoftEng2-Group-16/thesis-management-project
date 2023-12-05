const db = require('./db');
const dayjs = require('dayjs');
const customParseFormat = require("dayjs/plugin/customParseFormat");
var isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
const { Applications, Application, Student, ThesisProposal, Teacher } = require('./model');
const { getThesisProposalById } = require('./daoGeneral');

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);

exports.getOwnProposals = (teacherId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM thesis_proposals'
        db.all(
            sql,
            [],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else if (rows.length === 0) {
                    resolve({ error: `No thesis proposals found for teacher ${teacherId}` });
                } else {
                    const proposals = rows
                        .filter(r => r.supervisor.match(teacherId) !== null)
                        .map((row) => ({
                            id: row.id,
                            title: row.title,
                            supervisor: row.supervisor,
                            cosupervisors: row.cosupervisors.split('-'),
                            keywords: row.keywords.split(','),
                            type: row.type,
                            groups: row.groups.split(','),
                            description: row.description,
                            requirements: row.requirements,
                            notes: row.notes,
                            expiration: row.expiration,
                            level: row.level,
                            cds: row.cds.split(','),
                        }
                        ));

                    if (proposals.length == 0) {
                        resolve({ error: `No thesis proposals found for teacher ${teacherId}` });
                    } else {
                        resolve(proposals);
                    }
                }
            }
        )
    });
}

exports.getProfessors = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id, name, surname, department_code FROM teachers'
        db.all(
            sql,
            [],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else if (rows.length == 0) {
                    resolve({ error: 'Problems while retrieving possible internal cosupervisors' });
                } else {
                    const internals = rows.map(row => ({
                        id: row.id,
                        name: row.name,
                        surname: row.surname,
                        department_code: row.department_code
                    }));
                    resolve(internals);
                }
            }
        );
    });
}

exports.getGroupForTeacherById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT group_code FROM teachers WHERE id=?'
        db.get(
            sql,
            [id],
            (err, row) => {
                if (err) {
                    reject(err);
                } else if (row == null) {
                    resolve({ error: `Prolem while retrieving group info for teacher ${id}` });
                } else {
                    resolve(row.group_code);
                }
            }
        )
    });
}

exports.acceptApplication = (thesisId, teacherId, studentId) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE applications SET status = "accepted" WHERE thesisid = ?  AND teacherId = ? AND studentid=? and status="pending"';

        db.run(
            sql,
            [thesisId, teacherId, studentId],
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    // return application updated
                    const updatedApplication = {
                        id: thesisId,
                        status: 'accepted',
                    };
                    resolve(updatedApplication);
                }
            }
        );
    });
};


exports.rejectApplication = (thesisId, teacherId, studentId) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE applications SET status = "rejected" WHERE thesisid = ?  AND teacherId = ? AND studentid=? and status="pending"';

        db.run(
            sql,
            [thesisId, teacherId, studentId],
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    const updatedApplication = {
                        id: thesisId,
                        status: 'rejected',
                    };
                    resolve(updatedApplication);
                }
            }
        );
    });
};

exports.getAllApplicationsByProf = (idProfessor) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM applications where teacherid=?'
        db.all(
            sql,
            [idProfessor],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else if (rows.length == 0) {
                    resolve({ status: 404, error: 'No Applications found for professor ' + idProfessor });
                } else {
                    const applications = rows.map(row => (
                        new Application(row.thesisid, row.studentid, row.timestamp, row.status, row.teacherid)
                    ));
                    resolve(applications);
                }
            }
        );
    });
}

exports.getTeacherById = (teacherId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * from teachers where id=? ';
        db.all(
            sql,
            [teacherId],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else if (rows.length === 0) {
                    resolve(
                        { error: `No teacher found for id ${teacherId}` }
                    );
                } else {
                    const teacher = new Teacher(
                        rows[0].id,
                        rows[0].surname,
                        rows[0].name,
                        rows[0].email,
                        rows[0].group_code,
                        rows[0].department_code
                    );
                    resolve(teacher);
                }
            });
    });
};


exports.getExternals = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT name, surname, company FROM external_cosupervisors'
        db.all(
            sql,
            [],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else if (rows.length == 0) {
                    resolve({ error: 'Problems while retrieving possible external cosupervisors' });
                } else {
                    const externals = rows.map(row => ({
                        name: row.name,
                        surname: row.surname,
                        company: row.company
                    }));
                    resolve(externals);
                }
            }
        );
    });
}

exports.saveNewProposal = (proposal) => {
    return new Promise((resolve, reject) => {
        let sql = '';
        let parameters = [];
        if (proposal.id == -1) {
            sql = "INSERT INTO thesis_proposals (title, supervisor, cosupervisors, keywords, " +
                "type, groups, description, requirements, notes, expiration, level, cds) " +
                "values (?,?,?,?,?,?,?,?,?,?,?,?)";
            parameters = [proposal.title, proposal.supervisor, proposal.cosupervisors, proposal.keywords, proposal.type, proposal.groups, proposal.description, proposal.requirements, proposal.notes, proposal.expiration, proposal.level, proposal.cds];
        } else {
            sql = "INSERT INTO thesis_proposals (id,title, supervisor, cosupervisors, keywords, " +
                "type, groups, description, requirements, notes, expiration, level, cds) " +
                "values (?,?,?,?,?,?,?,?,?,?,?,?,?)";
            parameters = [proposal.id, proposal.title, proposal.supervisor, proposal.cosupervisors, proposal.keywords, proposal.type, proposal.groups, proposal.description, proposal.requirements, proposal.notes, proposal.expiration, proposal.level, proposal.cds];
        }

        db.run(
            sql,
            [...parameters],
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            }
        );
    });
}

exports.getDegrees = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT degree_code, degree_title FROM degrees';
        db.all(
            sql,
            [],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else if (rows.length == 0) {
                    resolve({ error: 'Problems while retrieving degrees info' });
                } else {
                    const degrees = rows.map((row) => (`${row.degree_code}  ${row.degree_title}`));
                    resolve(degrees);
                }
            }
        );
    });
}


exports.archiveProposal = (proposal) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO archived_thesis_proposals (id, title, supervisor, cosupervisors, keywords, " +
            "type, groups, description, requirements, notes, expiration, level, cds) " +
            "values (?,?,?,?,?,?,?,?,?,?,?,?,?)"
        db.run(
            sql,
            [proposal.id, proposal.title, proposal.supervisor, proposal.cosupervisors, proposal.keywords, proposal.type, proposal.groups, proposal.description, proposal.requirements, proposal.notes, proposal.expiration, proposal.level, proposal.cds],
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            }
        );
    });
}


exports.deleteProposal = (proposalId) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM thesis_proposals WHERE id=?'
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


exports.updateThesisProposal = (thesisId, proposal) => {
    return new Promise((resolve, reject) => {
        console.log(thesisId);
        const sql = 'UPDATE thesis_proposals SET title = ?, supervisor = ?, cosupervisors = ?, keywords = ?, type = ?, groups = ?, description = ?, requirements = ?, notes = ?, expiration = ?, level = ?, cds = ? WHERE id = ?';
        db.run(sql, [proposal.title, proposal.supervisor, proposal.cosupervisors, proposal.keywords, proposal.type, proposal.groups, proposal.description, proposal.requirements, proposal.notes, proposal.expiration, proposal.level, proposal.cds,thesisId], function (err) {
            if (err) {
                reject(err);
            }
            if (this.changes !== 1) {
                resolve({ error: 'thesis not found.' });
            } else {
                resolve(getThesisProposalById(thesisId));
            }
        });
    });
};
