const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const {
  createCardValidate,
  deleteCardValidate,
  likeCardValidate,
  dislikeCardValidate,
} = require('../utils/celebrateValidators');

router.get('/cards', auth, getCards);
router.post('/cards', createCardValidate, auth, createCard);
router.delete('/cards/:cardId', deleteCardValidate, auth, deleteCard);
router.put('/cards/:cardId/likes', likeCardValidate, auth, likeCard);
router.delete('/cards/:cardId/likes', dislikeCardValidate, auth, dislikeCard);

module.exports = router;
