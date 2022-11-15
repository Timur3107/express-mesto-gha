const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
const IncrorrectDataError = require('../errors/IncorrectDataError');
const ConflictError = require('../errors/ConflictError');

// const INCORRECT_DATA_ERROR_CODE = 400;
// const NOT_FOUND_ERROR_CODE = 404;
// const INTERNAL_SERVER_ERROR_CODE = 500;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
        return;
      }
      throw new NotFoundError('Пользователь не найден!');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new IncrorrectDataError('Переданы некорректные данные!'));
      }
      return next(err);
    });
};

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send({ data: user });
        return;
      }
      throw new NotFoundError('Пользователь не найден!');
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => (
      User.create({
        name, about, avatar, email, password: hash,
      })
    ))
    .then((user) => {
      res.send({
        data: {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
          _id: user._id,
        },
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Такой пользователь уже существует!'));
      }
      if (err.name === 'ValidationError') {
        return next(new IncrorrectDataError('Переданы некорректные данные при создании пользователя!'));
      }
      return next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
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
        return next(new IncrorrectDataError('Переданы некорректные данные при обновлении профиля!'));
      }
      if (err.name === 'CastError') {
        return next(new NotFoundError('Пользователь не найден!'));
      }
      return next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
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
        return next(new IncrorrectDataError('Переданы некорректные данные при обновлении аватара!'));
      }
      if (err.name === 'CastError') {
        return next(new NotFoundError('Пользователь не найден!'));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res.send({ token });
    })

    .catch(next);
};
