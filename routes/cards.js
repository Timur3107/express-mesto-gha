const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const {
  createCardValidate,
  idCardValidate,
} = require('../middlewares/celebrateValidators');

router.get('/cards', auth, getCards);
router.post('/cards', createCardValidate, auth, createCard);
router.delete('/cards/:cardId', idCardValidate, auth, deleteCard);
router.put('/cards/:cardId/likes', idCardValidate, auth, likeCard);
router.delete('/cards/:cardId/likes', idCardValidate, auth, dislikeCard);

module.exports = router;
