const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  id : {type: String},
  name : {type: String, required: true},
  username : {type: String, required: true},
  passwordHash: {type: String}
});

userSchema.methods.setPassword = function(password) {
  this.passwordHash = bcrypt.hashSync(password, 8);
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

userSchema.statics.authenticate = function(username, password) {
  return (
    User.findOne({ username: username })
      .then(user => {
        if (user && user.validatePassword(password)) {
          console.log('User and Password valid');
          return user;
        } else {
          return null;
        }
      })
  );
};

const User = mongoose.model('users', userSchema);

module.exports = User;
