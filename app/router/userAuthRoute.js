const express =require("express")
const userController=require("../controllers/UserAuthController")
// const apiAuthController=require("../controllers/ApiAuthController")
const productImageUpload = require("../helper/productimage");

const AuthCheckEjs=require("../middleware/authCheck");
const UserAuthCheck = require("../middleware/userAuthCheck");
const router=express.Router()

// user auth routes

// user post routes
router.get("/userDashboard",AuthCheckEjs,UserAuthCheck,userController.userDashboard)

router.get("/userBlogPage",AuthCheckEjs,UserAuthCheck,userController.UserBlogPage)

router.post("/createUserBlog",AuthCheckEjs,UserAuthCheck,productImageUpload.array("image",5),userController.userCreateBlog)
router.get("/getAllUserBlogsPage",AuthCheckEjs,UserAuthCheck,userController.getUserBlogs)
router.get("/singleUserBlog/:id",AuthCheckEjs,UserAuthCheck,userController.singleUserBlog)
router.get("/editUserBlog/:id",AuthCheckEjs,UserAuthCheck,userController.editUserBlog)
router.post("/updateUserBlog/:id",AuthCheckEjs,UserAuthCheck,productImageUpload.array("image",5),userController.updateUserBlog)
router.get("/deleteUserBlog/:id",AuthCheckEjs,UserAuthCheck,userController.deleteUserBlog)


module.exports=router