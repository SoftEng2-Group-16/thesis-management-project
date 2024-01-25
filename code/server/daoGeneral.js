const db = require('./db');
const dayjs = require('dayjs');
const customParseFormat = require("dayjs/plugin/customParseFormat");
var isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
const { Applications, Application, Student, ThesisProposal, Teacher } = require('./model');

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);


exports.getThesisProposalById = (thesisId) => {
  return new Promise((resolve, reject) => {
    const sql =  'SELECT * from thesis_proposals where id=? ';
    db.all(
      sql,
      [thesisId],
      (err, rows) => {
        if (err) {
          reject(err);
        } else if (rows.length === 0) {
          resolve(
            { error: `No thesis proposals found for id ${thesisId}` }
          );
        } else {
          const proposal = new ThesisProposal(
            rows[0].id,
            rows[0].title,
            rows[0].supervisor,
            rows[0].cosupervisors.split('-'),
            rows[0].keywords.split(','),
            rows[0].type,
            rows[0].groups.split(','),
            rows[0].description,
            rows[0].requirements,
            rows[0].notes,
            rows[0].expiration,
            rows[0].level,
            rows[0].cds.split(',')
          );

          resolve(proposal);
        }
      });
  });
};

exports.getProposalFromArchivedById = (thesisId) => {
  return new Promise((resolve, reject) => {
    const sql =  'SELECT * from archived_thesis_proposals where id=? ';
    db.get(
      sql,
      [thesisId],
      (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(
            { error: `No archived thesis proposals found for id ${thesisId}` }
          );
        } else {
          const proposal = new ThesisProposal(
            row.id,
            row.title,
            row.supervisor,
            row.cosupervisors.split('-'),
            row.keywords.split(','),
            row.type,
            row.groups.split(','),
            row.description,
            row.requirements,
            row.notes,
            row.expiration,
            row.level,
            row.cds.split(',')
          );
          resolve(proposal);
        }
      });
  });
};

exports.cancellPendingApplicationsForAThesis = (thesisId, teacherId) => {
  return new Promise((resolve, reject) => {
    const selectSql = `
      SELECT
        students.email,
        students.name AS student_name,
        thesis_proposals.title AS thesis_title
      FROM
        applications
      JOIN
        students ON applications.studentId = students.id
      JOIN
        thesis_proposals ON applications.thesisId = thesis_proposals.id
      WHERE
        applications.thesisid = ? AND
        applications.teacherId = ? AND
        applications.status = "pending"`;

    db.all(selectSql, [thesisId, teacherId], (selectErr, rows) => {
      if (selectErr) {
        reject(selectErr);
        return;
      }

      const emails = rows.map(row => row.email);
      const studentNames = rows.map(row => row.student_name);
      const thesisTitle = rows.length > 0 ? rows[0].thesis_title : null;

      const updateSql = `
        UPDATE
          applications
        SET
          status = "canceled"
        WHERE
          thesisid = ? AND
          teacherId = ? AND
          status = "pending"`;

      db.run(updateSql, [thesisId, teacherId], function (updateErr) {
        if (updateErr) {
          reject(updateErr);
        } else {
          resolve({
            changes: this.changes,
            canceledEmails: emails,
            canceledStudentNames: studentNames,
            canceledThesisName: thesisTitle
          });
        }
      });
    });
  });
};



exports.cancellPendingApplicationsOfAStudent = (studentId) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE applications SET status = "canceled" WHERE studentid = ? and status="pending"';

    db.run(
      sql,
      [studentId],
      function (err) {
        if (err) {
          reject(err);
        } else {
          /* const updatedApplication = {
            id: studentId,
            status: 'canceled',
          }; */
          resolve(this.changes);
        }
      }
    );
  });
};
