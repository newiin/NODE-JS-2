const mongoose = require('mongoose');
require('dotenv-extended').load();
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://' + process.env.MONGO_HOST + '/' + process.env.MONGO_DATABASE,{ useNewUrlParser: true },function(err,db){
if (err) {
    console.log("we can not connect to the database"+ err);
    
}else{
    console.log('connected to the database');
    // db.close();
}
})
