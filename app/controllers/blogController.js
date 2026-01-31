const Blog=require("../models/blogModel")
const cloudinary=require("../config/cloudinaryConfig")
const fs=require("fs");
const { rejects } = require("assert");
const { resolve } = require("path");


class blogController{

    // product page
    async blogPage(req,res){
        try{
            // res.send("Product created successfully");
            res.render("blog",{
                title:"Blog Page",
                user:req.user
            })
        }catch(err){
            console.log("Error in creating blog", err);
        }
    }
    // ------------------------------------------------

    async createBlog(req, res) {
    try {
        const { name, category, description } = req.body;

        const blog = new Blog({
            name,
            category,
            description,
        });

        // Cloudinary multiple image upload
        if (req.files && req.files.length > 0) {
            const uploadResults = await Promise.all(
                req.files.map((file) => {
                    return new Promise((resolve, reject) => {
                        cloudinary.uploader.upload_stream(
                            { folder: "blogs" },
                            (error, result) => {
                                if (error) reject(error);
                                else resolve(result);
                            }
                        ).end(file.buffer);
                    });
                })
            );

            blog.image = uploadResults.map(r => r.secure_url);
            blog.imageIds = uploadResults.map(r => r.public_id);
        }

        const data = await blog.save();
        if (data) {
            res.redirect("/getAllBlogs");
        }

    } catch (error) {
        console.log("error in creating blog", error);
    }
}


    // all product----------------------------------------
    async getAllBlogs(req,res){
        try{
            const blogs= await Blog.find()
            res.render("bloglist",{
                title:"blog List Page",
                data:blogs,
                user:req.user
            })

        }catch(error){
            console.log("error in getting blog",error);
        }
    }
    // single product-----------------------------------------
    async singleBlog(req,res){
        try{
            const id=req.params.id;
            const blog= await Blog.findById(id)
            res.render("singleBlog",{
                title:"Single blog Page",
                data:blog,
                user:req.user
            })
        }catch(error){
            console.log("error in getting single blog",error);
        }
    }
    
    async editBlog(req,res){
        try{
            const id=req.params.id;
            const blog= await Blog.findById(id)
            res.render("editBlog",{
                title:"Edit blog Page",
                data:blog,
                user:req.user
            })
        }catch(error){
            console.log("error in getting edit blog",error);
        }
    }

    async updateBlog(req,res){
        try{
            const id=req.params.id;
            const{name,category, description}=req.body;
            const updatedData={
                name,
                category,
                description,
               
            }
            if(req.files && req.files.length>0){
                const oldProduct=await Blog.findById(id);

                if(oldProduct.imageIds && oldProduct.imageIds.length>0){
                    await cloudinary.api.delete_resources(oldProduct.imageIds)
                    console.log("old images deleted from cloudinary");
                }
                
                const uploadResults=await Promise.all(
                    req.files.map((file)=>{
                        return new Promise((resolve,rejects)=>{
                            cloudinary.uploader.upload_stream(
                                {folder:"blogs"},
                                (error,result)=>{
                                    if(error){
                                        rejects(error)
                                    }else{
                                        resolve(result)
                                    }
                                }
                            ).end(file.buffer)
                        })
                    })
                )

                updatedData.image=uploadResults.map(r=>r.secure_url)
                updatedData.imageIds=uploadResults.map(r=>r.public_id)
            }
            await Blog.findByIdAndUpdate(id,updatedData);
            res.redirect("/getAllBlogs");

        }catch(error){
            console.log("error in updating blog",error);
        }
    }

    // delete product-----------------------------------------
    async deleteBlog(req,res){
        try{
            const id=req.params.id;
            const product=await Blog.findById(id);

            if(product.imageIds && product.imageIds.length>0){
                await cloudinary.api.delete_resources(product.imageIds)
            }

            await Blog.findByIdAndDelete(id);
            res.redirect("/getAllBlogs");

        }catch(error){
            console.log("error in deleting blog",error);
        }
    }

   

}



module.exports= new blogController()