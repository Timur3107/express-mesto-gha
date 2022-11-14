const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getUsers, getUserById, createUser, updateUser, updateAvatar, login, getUserMe,
} = require('../controllers/users');

router.get('/users/me', auth, getUserMe);
router.get('/users', auth, getUsers);
router.get('/users/:userId', auth, getUserById);

router.patch('/users/me', auth, updateUser);
router.patch('/users/me/avatar', auth, updateAvatar);

router.post('/signin', login);
router.post('/signup', createUser);

module.exports = router;
