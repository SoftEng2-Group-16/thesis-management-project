const db = require('./db');

// STUDENT SECTION
exports.getThesisProposals = (degCode) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * from thesis_proposals WHERE cds=?' //a student can get thesis proposals only from his study course
    db.all(
      sql,
      [degCode],
      (err,rows) => {
        if(err) {
          reject(err)
        } else if(rows.length == 0) {
          resolve({error: `No thesis proposals found for study course ${degCode}`});
        } else {
          const proposals = rows.map( (row) => (
            {
              id: row.id,
              title: row.title,
              supervisor: row.supervisor,
              cosupervisors: row.cosupervisors,
              keywords: row.keywords,
              type: row.type,
              groups: row.groups,
              description: row.description,
              requirements: row.requirements,
              notes: row.notes,
              expiration: row.expiration,
              level: row.level,
              cds: row.cds
            }
          ));
          resolve(proposals);
        }
      }
    )
  });
}