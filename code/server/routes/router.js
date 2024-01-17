const express = require('express');
const auth = require('./auth/auth.js');
const multer=require('./multer/multer.js');
const student = require('./controller/student.js');
const professor = require('./controller/professor.js')
const general = require('./controller/general.js')
const utils = require('./utils/utils.js');
const router = express.Router();

/*session routes*/
router.post('/sessions', auth.login);
router.get('/sessions/current', auth.getCurrentSession);
router.delete('/sessions/current', auth.isLoggedIn, auth.logout);

/* general routes*/
router.post('/notify', general.sendEmail)

/* student routes */
router.get('/thesis/student', auth.isLoggedIn, student.getThesisProposals);
router.get('/student/:id/exams',auth.isLoggedIn,student.getAllExams);
router.post('/uploadCV', multer.upload.single('file'),auth.isLoggedIn, student.insertApplicationWithCV);
router.post('/newapplication', auth.isLoggedIn, student.insertNewApplication);
router.post('/newstartrequest', auth.isLoggedIn, student.insertNewStartRequest);
router.get('/student/applications', auth.isLoggedIn, student.getApplicationsForStudent);

/* professor routes */
router.get('/thesis/teacher', auth.isLoggedIn, professor.getOwnProposals);
router.get('/archive/thesis', auth.isLoggedIn, professor.getOwnArchivedProposals);
router.get('/cv/:id/download', auth.isLoggedIn, professor.getCVFile);
router.get('/cosupervisors', professor.getPossibleCosupervisors);
router.get('/degrees', professor.getDegreesInfo);
router.post('/newproposal', auth.isLoggedIn, professor.insertNewProposal);
router.put('/teacher/proposal/:thesisid', auth.isLoggedIn, professor.updateThesisProposal);
router.delete('/deleteproposal/:proposalid', auth.isLoggedIn, professor.deleteProposal);
router.put('/teacher/applications/:thesisid', auth.isLoggedIn, professor.decideApplication);
router.get('/teacher/applications', auth.isLoggedIn, professor.getAllApplicationsByProf);
router.put('/teacher/archiveproposal', auth.isLoggedIn, professor.archiveProposal);

/* utility routes */
/** NOTE: virtual clock methods don't have auth enabled, they are called also in the cron job,
 * so if we put authentication to them we will have problems with the automatic archiviation
 * of expired proposals
 */
router.put('/clockchanged', utils.rearrangeProposals)
router.get('/initialdate', utils.getInitialDate);





module.exports = router;