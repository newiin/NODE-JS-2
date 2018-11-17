const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const WriterSchema = mongoose.Schema({

    local: {
        email: {
            type: String,
            unique: true,

        },
        password: String,
        name: {
            type: String,
            unique: true,
        }
    },
    facebook: {
        id: String,
        token: String,
        name: String,
        email: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    role: {
        type: String,

    },
    isActive: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    image: {
        type: String,
    }

});

const Writer = module.exports = mongoose.model('writers', WriterSchema);
module.exports.createWriter = function (newWriter, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newWriter.local.password, salt, function (err, hash) {
            newWriter.local.password = hash;
            newWriter.save(callback);
        });
    });

}
module.exports.getWriterByEmail = function (email, callback) {
    var query = {
        'local.email': email
    };
    Writer.findOne(query, callback);
}


module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
}