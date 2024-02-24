const {Router} = require('express');
const profileControllers = require('../controllers/profileControllers');

const router = Router();

router.get('/getProfile', profileControllers.profile_get);
router.put('/updateProfile', profileControllers.updateProfile_put);
router.put('/addEvents', profileControllers.addEvents_put);
router.put('/unregister', profileControllers.unRegisterEvents_put);

module.exports = router;