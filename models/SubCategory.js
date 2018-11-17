const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const SubCategorySchema=new Schema({
    category:{
        type:Schema.Types.ObjectId,
        ref:'categories'
    },
    name:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true 
       
     }
    
    
   

});

const SubCategory=module.exports=mongoose.model('subcategories',SubCategorySchema);