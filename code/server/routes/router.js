const express = require('express');
const auth = require('./auth/auth.js');
const student = require('./controller/student.js');
const professor = require('./controller/professor.js')
const general = require('./controller/general.js')

const router = express.Router();

/*session routes*/
router.post('/sessions', auth.login);
router.get('/sessions/current', auth.getCurrentSession);
router.delete('/sessions/current', auth.isLoggedIn, auth.logout);

/* general routes*/
router.get('/thesis', general.getThesisProposals); 

/*other routes down there, use the middleware isloggedin to protect the route (hopefully) */
router.post('/newapplication', student.insertNewApplication);
//router.get('/proposals/:degreeCode', student.getThesisProposals); 
router.get('/cosupervisors', professor.getPossibleCosupervisors);
router.get('/degrees', professor.getDegreesInfo);
router.post('/newproposal',auth.isLoggedIn, professor.insertNewProposal);

/*student routes*/


module.exports = router;