const Card = require('../models/card');

const INCORRECT_DATA_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const INTERNAL_SERVER_ERROR_CODE = 500;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(() => res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла внутренняя ошибка сервера!' }));
};

module.exports.createCard = (req, res) => {
  // req.user._id
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки!' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла внутренняя ошибка сервера!' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(() => {
      res.send({ message: 'Карточка была удалена!' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Карточка не найдена!' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла внутренняя ошибка сервера!' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки лайка!' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Передан несуществующий id карточки!' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла внутренняя ошибка сервера!' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные для снятия лайка!' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Передан несуществующий id карточки!' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла внутренняя ошибка сервера!' });
    });
};
