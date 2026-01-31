const mongoose=require("mongoose")

const BlogSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    isDeleted: {
        type: Boolean,
        default: false   // soft delete
    },
   
    image:{
        type:[String],  // for multiple images
        default:[]

        // default:""     this was for single image
    },
    imageIds:{             // to store cloudinary public ids of images
        type:[String],
        default:[]
    }
},{
    timestamps:true,
    versionKey:false
})
const BlogModel=mongoose.model("blog",BlogSchema)
module.exports=BlogModel