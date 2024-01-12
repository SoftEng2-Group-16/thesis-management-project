const db = require('./db');
const dayjs = require('dayjs');
const customParseFormat = require("dayjs/plugin/customParseFormat");
var isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
const { Applications, Application, Student, ThesisProposal, Teacher, Exam } = require('./model');

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);

exports.addApplicationForThesis = (thesisId, studentId, timestamp, status, teacherId,idCV) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO applications (thesisid, studentid, timestamp, status,teacherid,cv_id) VALUES (?,?,?,?,?,?)';
        db.run(
            sql,
            [thesisId, studentId, timestamp, status, teacherId,idCV],
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            }
        );
    });
}

exports.getStudentById = (studentId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * from students where id=? ';
        db.all(
            sql,
            [studentId],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else if (rows.length === 0) {
                    resolve(
                        { error: `No student found for id ${studentId}` }
                    );
                } else {
                    const student = new Student(
                        rows[0].id,
                        rows[0].surname,
                        rows[0].name,
                        rows[0].gender,
                        rows[0].nationality,
                        rows[0].email,
                        rows[0].degree_code,
                        rows[0].enrollment_year
                    );
                    resolve(student);
                }
            });
    });
};

exports.getApplicationsForStudent = (studentId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM applications WHERE studentid=?';
        db.all(
            sql,
            [studentId],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    if (rows.length == 0 || rows == null || rows == undefined) {
                        resolve({ status: 404, error: `No applications found for student ${studentId}` });
                    } else {
                        const applications = rows.map(row => (
                            new Application(row.thesisid, row.studentid, row.timestamp, row.status, row.teacherid)
                        ));
                        resolve(applications);
                    }
                }
            });
    });
}

exports.getThesisProposalsByDegree = (degCode) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * from thesis_proposals'
        db.all(
            sql,
            [],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else if (rows.length === 0) {
                    resolve({ error: `No thesis proposals found for study course ${degCode}` });
                } else {
                    const proposals = rows
                        .filter(r => r.cds.match(degCode) !== null)
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
                        resolve({ error: `No thesis proposals found for study course ${degCode}` });
                    } else {
                        resolve(proposals);
                    }
                }
            }
        )
    });
}

//**get the thesis proposals for which an application has been accepted by a professor */
exports.getMyThesisAccepted = (studentId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT thesisid FROM applications WHERE studentid=? AND status="accepted"';
        db.all(
            sql,
            [studentId],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else if (rows.length > 1) {
                    resolve({ error: "a student cannot have more than one application accepted" })
                } else {
                    const thesisId = rows;
                    resolve(thesisId);
                }
            }
        );
    });
}

exports.getExamsByStudentId = (studentId) => {
    console.log("studentId ", studentId);
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * from careers where student_id=? ';
        db.all(
            sql,
            [studentId],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else if (rows.length === 0) {
                    resolve(
                        { error: `No exams found for student id ${studentId}` }
                    );
                } else {
                    const exams = rows.map(row => (
                        new Exam(row.student_id, row.course_code, row.course_title, row.cfu, row.grade, row.date_registered)
                    ));
                    resolve(exams);
                }
            });
    });
};


exports.insertApplicationData = (fileName,fileContent,exams) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO cv_application (list_exams, file_name, file_content) VALUES (?,?,?)';
        db.run(
            sql,
            [exams,fileName,fileContent],
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