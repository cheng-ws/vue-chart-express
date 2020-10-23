const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
let SALT_FACTOR = 10;
const userSchema = mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    createAt: {
        type: String,
        default: Date.now(),
    },
    displayName: String,
    bio: String,
});
userSchema.methods.name = function () {
    return this.displayName || this.username;
};

const noop = function() {};
//保存操作之前的回调函数
userSchema.pre("save",function (done) {
    let user = this;
    if(!user.isModified("password")) {
        return done();
    }
    bcrypt.genSalt(SALT_FACTOR,function (err,salt) {
        if(err) {
            return done(err);
        }
        bcrypt.hash(user.password,salt,noop,function (err,hashedPassword) {
            if(err) {
                return done(err);
            }
            user.password = hashedPassword;
            done();
        });
    });
});
userSchema.methods.checksPassword = function (guess,done) {
   bcrypt.compare(guess,this.password,function (err,isMatch) {
       done(err,isMatch);
   });
};
const User = mongoose.model("User",userSchema);
module.exports = User;