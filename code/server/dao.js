const db = require('./db');

// STUDENT SECTION
exports.getThesisProposals = (degCode) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * from thesis_proposals'
    db.all(
      sql,
      [],
      (err,rows) => {
        if(err) {
          reject(err)
        } else if(rows.length == 0) {
          resolve({error: `No thesis proposals found for study course ${degCode}`});
        } else {
          console.log(rows);
          const proposals = rows
            .filter( r => r.cds.match(degCode) != null)
            .map( (row) => (
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