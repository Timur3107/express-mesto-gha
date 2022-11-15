const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getUsers, getUserById, createUser, updateUser, updateAvatar, login, getUserMe,
} = require('../controllers/users');

const {
  createUserValidate,
  loginValidate,
  getUserByIdValidate,
  updateUserValidate,
  updateAvatarValidate,
} = require('../utils/celebrateValidators');

router.get('/users/me', auth, getUserMe);
router.get('/users', auth, getUsers);
router.get('/users/:userId', getUserByIdValidate, auth, getUserById);

router.patch('/users/me', auth, updateUserValidate, updateUser);
router.patch('/users/me/avatar', auth, updateAvatarValidate, updateAvatar);

router.post('/signin', loginValidate, login);
router.post('/signup', createUserValidate, createUser);

module.exports = router;
