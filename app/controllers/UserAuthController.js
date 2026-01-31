const User=require("../models/user")
const Blog=require("../models/blogModel")
const cloudinary=require("../config/cloudinaryConfig")

class userController{

    async userDashboard(req,res){
        try{
            res.render("User/userDashboard",{   
                title:"User Dashboard",
                user:req.user
            })
        }catch(error){
            console.log("error in user dashboard",error);
        }   
    }

    async UserBlogPage(req,res){
        try{
            res.render("User/userBlog",{   
                title:"User Blog Page",
                user:req.user
            })
        }catch(error){
            console.log("error in user blog page",error);
        }
    }

    async userCreateBlog(req,res){
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
            res.redirect("/getAllUserBlogsPage");
        }

    } catch (error) {
        console.log("error in creating blog", error);
    }
    }

    async getUserBlogs(req,res){
        try{
            const blogs= await Blog.find({ isDeleted: false })
            res.render("User/userBlogList",{
                title:"User blog List Page",
                data:blogs,
                user:req.user
            })
        }catch(err){
            console.log("Error in fetching user blogs", err);
        }
    }

    async singleUserBlog(req,res){
        try{
            const blogId=req.params.id  
            const blog= await Blog.findById(blogId)
            res.render("User/userSingleBlogPage",{
                title:"Single User Blog Page",
                data:blog,
                user:req.user
            })
        }catch(err){
            console.log("Error in fetching single user blog", err);
        }
    }

    async editUserBlog(req,res){
        try{
            const id=req.params.id  
            const blog= await Blog.findById(id)
            res.render("User/userEditBlogPage",{
                title:"Edit User Blog Page",
                data:blog,
                user:req.user
            })
        }catch(err){
            console.log("Error in fetching user blog for edit", err);
        }
    }

    async updateUserBlog(req,res){
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

    async deleteUserBlog(req,res){
        try{
            const id=req.params.id;

            await Blog.findByIdAndUpdate(id,{isDeleted:true});
            res.redirect("/getAllUserBlogsPage");

        }catch(error){
            console.log("error in deleting blog",error);
        }
    }

   



   

}
module.exports=new userController();