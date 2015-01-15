var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    firstName : {
        type: String,
        required: [true, 'First name required']
    },
    lastName : {
        type: String,
        required: [true, 'Last name required']
    },
    city : {
        type: String
    },
    Country : {
        type: String
    },
    local : {
        email : {
            type: String,
            match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Invalid e-mail adress.']
        },
        password : String,
    },
    google : {
        id : String,
        token : String,
        email : String,
        name : String
    }
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);