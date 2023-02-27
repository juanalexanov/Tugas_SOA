const express = require('express');
const {
    addUser,cekLogin,editUser,addFriend,getFriend,deleteFriend,addMessage,getMessage
} = require('../controller/controller.js');
const router = express.Router();


router.post('/user/', addUser);
router.post('/login/', cekLogin);
router.put('/user/:username', editUser);

router.post('/friend/', addFriend);
router.get('/friend/:username', getFriend);
router.delete('/friend/', deleteFriend);

router.post('/message',addMessage);
router.get('/message/:username',getMessage);

module.exports = router;