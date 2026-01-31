const express = require("express");
const blogController = require("../controllers/blogController");
const AdminAuthCheck=require("../middleware/adminAuthCheck")
const productImageUpload = require("../helper/productimage");
const AuthCheckEjs = require("../middleware/authCheck");
const router=express.Router();

// create productpage route
router.get("/blog-page",AuthCheckEjs,AdminAuthCheck,blogController.blogPage)
// router.get("/edit-page",productController.editPage)





router.post("/createBlog",AuthCheckEjs,AdminAuthCheck,productImageUpload.array("image",5),blogController.createBlog);
router.get("/getAllBlogs",AuthCheckEjs,AdminAuthCheck,blogController.getAllBlogs);
router.get("/singleBlog/:id",AuthCheckEjs,AdminAuthCheck,blogController.singleBlog);
router.get("/editBlog/:id",AuthCheckEjs,AdminAuthCheck,blogController.editBlog);
router.post("/updateBlog/:id",productImageUpload.array("image",5),AuthCheckEjs,AdminAuthCheck,blogController.updateBlog);
router.get("/deleteBlog/:id",AuthCheckEjs,AdminAuthCheck,AdminAuthCheck,blogController.deleteBlog);

module.exports=router;