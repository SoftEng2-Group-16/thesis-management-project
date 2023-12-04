const db = require('./db');
const dayjs = require('dayjs');
const customParseFormat = require("dayjs/plugin/customParseFormat");
var isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
const { Applications, Application, Student, ThesisProposal, Teacher } = require('./model');

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);


exports.getThesisProposalById = (thesisId, status = 'none') => {
  return new Promise((resolve, reject) => {
    let sql = '';
    if (status == 'accepted' || status == 'canceled' || status == 'expired' || status == 'rejected') { //means the thesis is archived, look in the right table
      sql = 'SELECT * from archived_thesis_proposals where id=?';
    } else {
      sql = 'SELECT * from thesis_proposals where id=? ';
    }

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

exports.cancellPendingApplicationsForAThesis = (thesisId, teacherId) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE applications SET status = "canceled" WHERE thesisid = ?  AND teacherId = ? and status="pending" ';
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
