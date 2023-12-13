const express = require('express');
const auth = require('./auth/auth.js');
const student = require('./controller/student.js');
const professor = require('./controller/professor.js')
const general = require('./controller/general.js')
const utils = require('./utils/utils.js');

const router = express.Router();

/*use the middleware isloggedin to protect the route (hopefully) */

/*session routes*/
router.get('/sessions/current', auth.getCurrentSession);
router.post('/sessions', auth.login);
router.delete('/sessions/current', auth.isLoggedIn, auth.logout);


/* general routes*/
router.post('/notify', general.sendEmail)
router.put('/clockchanged', utils.rearrangeProposals)
router.get('/initialdate', utils.getInitialDate);


/*student routes*/
// REMEMBER to update documentation
// remove the :studentId param when api is protected, it will be taken from req.user

router.get('/thesis/student/', auth.isLoggedIn, student.getThesisProposals);
router.get('/student/applications', auth.isLoggedIn, student.getApplicationsForStudent);

router.post('/newapplication', auth.isLoggedIn, student.insertNewApplication);
router.get('/thesis/teacher/', auth.isLoggedIn, professor.getOwnProposals);
router.get('/cosupervisors', professor.getPossibleCosupervisors);
router.get('/degrees', professor.getDegreesInfo);
router.get('/teacher/applications', auth.isLoggedIn, professor.getAllApplicationsByProf);

router.post('/newproposal', auth.isLoggedIn, professor.insertNewProposal);
router.put('/teacher/proposal/:thesisid', auth.isLoggedIn, professor.updateThesisProposal);
router.delete('/deleteproposal/:proposalid', auth.isLoggedIn, professor.deleteProposal);

router.put('/teacher/applications/:thesisid', auth.isLoggedIn, professor.decideApplication);
router.put('/teacher/archiveproposal', auth.isLoggedIn, professor.archiveProposal);
router.delete('/teacher/deleteproposal/:proposalid', auth.isLoggedIn, professor.deleteProposal);


module.exports = router;