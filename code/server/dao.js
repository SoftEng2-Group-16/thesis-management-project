const db = require('./db');

//STUDENT SECTION
exports.addApplicationForThesis = (thesisId, studentId, timestamp, status) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO applications (thesisid, studentid, timestamp, status) VALUES (?,?,?,?)';
    db.run(
      sql,
      [thesisId, studentId, timestamp, status],
      function(err) {
        if(err){
          reject(err);
        } else {
          resolve(this.changes);
        }
      }
    );
  });
}