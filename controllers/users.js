const User = require('../models/user');

const INCORRECT_DATA_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const INTERNAL_SERVER_ERROR_CODE = 500;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(() => res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла внутренняя ошибка сервера!' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
        return;
      }
      res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь не найден!' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные!' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла внутренняя ошибка сервера!' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя!' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла внутренняя ошибка сервера!' });
    });
};

module.exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля!' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь не найден!' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла внутренняя ошибка сервера!' });
    });
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара!' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь не найден!' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: err.message });
    });
};
