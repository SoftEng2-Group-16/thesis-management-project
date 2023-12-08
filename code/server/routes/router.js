const express = require('express');
const auth = require('./auth/auth.js');
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
router.get('/thesis/student/', auth.isLoggedIn, student.getThesisProposals);
router.get('/thesis/teacher/', auth.isLoggedIn, professor.getOwnProposals);


/*other routes down there, use the middleware isloggedin to protect the route (hopefully) */
router.post('/newapplication', auth.isLoggedIn, student.insertNewApplication);

// remove the :studentId param when api is protected, it will be taken from req.user
// REMEMBER to update documentation
router.get('/student/applications', auth.isLoggedIn, student.getApplicationsForStudent);

//router.get('/proposals/:degreeCode', student.getThesisProposals); 
router.get('/cosupervisors', professor.getPossibleCosupervisors);
router.get('/degrees', professor.getDegreesInfo);
router.post('/newproposal', auth.isLoggedIn, professor.insertNewProposal);
router.put('/teacher/proposal/:thesisid',auth.isLoggedIn, professor.updateThesisProposal);

router.put('/teacher/applications/:thesisid', auth.isLoggedIn, professor.decideApplication);
router.get('/teacher/applications', auth.isLoggedIn, professor.getAllApplicationsByProf);

/*student routes*/


router.put('/clockchanged', utils.rearrangeProposals)

module.exports = router;