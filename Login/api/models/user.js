var mongoose = require('mongoose');

var usersSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstname:{type: String, required:true},
    lastname:{type: String, required:true},
    email:{type: String, required:true},
    username: {type: String, required:true},
    password: {type:String, required:true}
});



module.exports = mongoose.model('User', usersSchema);