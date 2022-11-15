const Card = require('../models/card');

const NotFoundError = require('../errors/NotFoundError');
const IncrorrectDataError = require('../errors/IncorrectDataError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new IncrorrectDataError('Переданы некорректные данные при создании карточки!'));
      }
      return next(err);
    });
};

// if (req.user._id === card.owner.toString()) {
//   return card.remove().then(() => {
//     res.send({ message: 'Карточка была удалена!' });
//   });
// }

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена!');
      }
      if (req.user._id !== card.owner.toString()) {
        throw new ForbiddenError('Вы не можете удалить чужую карточку!');
      }
      return card.remove();
    })
    .then(() => {
      res.send({ message: 'Карточка была удалена!' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new IncrorrectDataError('Переданы некорректные данные при удалении карточки!'));
      }
      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send(card);
        return;
      }
      throw new NotFoundError('Передан несуществующий id карточки!');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new IncrorrectDataError('Переданы некорректные данные для постановки лайка!'));
      }
      return next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send(card);
        return;
      }
      throw new NotFoundError('Передан несуществующий id карточки!');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new IncrorrectDataError('Переданы некорректные данные для снятия лайка!'));
      }
      return next(err);
    });
};
