const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcryptjs = require("bcryptjs");

AUTH = "auth";
SALT = process.env.JWT_SECRET;

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 4,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [
    {
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ]
});

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email'])
}

UserSchema.methods.removeToken = function  (token) {
  const user = this;

  return user.update({
    $pull:{
      tokens: {
        token
      }
    }
  })
};

UserSchema.methods.generateAuthToken = function () {
  const user = this;
  const access = AUTH;
  const token = jwt.sign({_id: user.id.toHexString(), access}, SALT).toString();

  user.tokens.push({access, token});

  return user.save().then(()=> {
    return token;
  })
}

UserSchema.statics.findByToken = function (token) {
  let User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, SALT);
  } catch (e) {
    return new Promise((resolve, reject) => reject())
  }

  return User.findOne({
    _id: decoded._id,
    "tokens.token": token,
    "tokens.access": AUTH
  });
};

UserSchema.statics.findByCredentials = function (username, password) {
  const User = this;
  return User.findOne({ username }).then((user) => {
    if (!user) return Promise.reject()
    return new Promise((resolve, reject) => {
      bcryptjs.compare(password, user.password, (err, isMatch) => {
        if (isMatch) {
          return resolve(user)
        } else {
          return reject()
        };
      });
    });
  });

}

UserSchema.pre('save', function (next) {
  const user = this;

  if (user.isModified('password')) {
    bcryptjs.genSalt(10, (err, salt) => {
      bcryptjs.hash(user.password, salt, (error, hash) => {
        user.password = hash;
        next();
      });
    });
  }
  else {
    next();
  };
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };