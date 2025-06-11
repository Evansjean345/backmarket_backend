const express = require('express');
const { registerUser, loginUser, updateUser,getAllUsers,getUser,deleteUser, updatePassword, searchUser} = require('../controllers/userController');
const router = express.Router();

router.get('/searchUser', searchUser)
router.get('/getUser',getUser);
router.get('/getAllUsers',getAllUsers);
router.put('/updateUser/:id',updateUser);
router.post('/registerUser', registerUser);
router.post('/loginUser', loginUser);
router.delete('/deleteUser/:id', deleteUser);
router.put('/:id/password/update', updatePassword);

module.exports = router;
