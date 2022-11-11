const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getUsers, getUser, createUser, updateUser, updateAvatar, login,
} = require('../controllers/users');

router.get('/users', auth, getUsers);
router.get('/users/:userId', auth, getUser);
router.patch('/users/me', auth, updateUser);
router.patch('/users/me/avatar', auth, updateAvatar);

router.post('/signin', login);
router.post('/signup', createUser);

module.exports = router;
