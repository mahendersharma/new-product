const express = require('express');
const Blog = require('../models/blog');
const router = express();
const Review = require('../models/review')
const {isLogin} = require('../middleware')


router.get('/admin-blog',isLogin, async(req,res)=>{
   
 const blogs = await  Blog.find({});
    res.render('admin/index',{blogs});
})

router.get('/admin-blog/new',isLogin,async(req,res)=>{
   
    res.render('admin/create');
})
// create new blogs
router.post('/blogs',isLogin,async(req,res)=>{
    try{
       
        await Blog.create(req.body.blog)
        req.flash('success','Blog Create Successfully !! ✔✔❤')
        res.redirect('/admin-blog')
    }catch(e){
        console.log(e.message)
        req.flash('error','Can,t Blog Create  !! 👀👀')
        res.render()
    }
   
})
// show post
router.get('/admin/blog/:id',isLogin,async(req,res)=>{
    try{
        const blog = await Blog.findById(req.params.id);
        res.render('admin/show',{blog})
    }
    catch(e){
        console.log(e.message)
        res.render()
    }

})
// edit post
router.get('/admin/blog/:id/edit',isLogin,async(req,res)=>{
try{
    const blog = await Blog.findById(req.params.id)
    res.render('admin/edit',{blog})
}
catch(e){
    console.log(e.message)
        res.render() 
}

})
// edit post
router.patch('/blogs/:id',isLogin,async(req,res)=>{
  
await Blog.findByIdAndUpdate(req.params.id, req.body.blog);
try
{
    req.flash('success','update Sucessfully✔✔✔✔🎉')
    res.redirect(`/admin/blog/${req.params.id}`)
}catch(e)
{
console.log("Something Went Problem");

}

})
// delete 
router.delete('/admin/blog/:id',isLogin,async(req,res)=>{
    try{
        await Blog.findByIdAndDelete(req.params.id);
        res.redirect('/admin-blog')
    }
    catch(e){
        res.send("Something Went Problem");
    }
 
})


router.get('/blog/:id',async(req,res)=>{
    try{
        const blog = await Blog.findById(req.params.id).populate('reviews');
        console.log(blog);
        res.render('blog/shows',{blog})
    }
    catch(e){
        res.send("Something Went Problem");
    }
    
    })
router.get('/',async(req,res)=>{
    try{
        const blogs = await  Blog.find({});
        res.render('blog/index',{blogs});
    }
    catch(e){
        res.send("Something Went Problem");
    }
  
   })


// create a new Reviwe
router.post('/blog/:id/review',isLogin,async(req,res)=>{
    try{
        const blog = await Blog.findById(req.params.id);
        // const review = new Review(req.body);
        const review = new Review({
            user:req.user.username,
            ...req.body
        });
        console.log(review);
        blog.reviews.push(review);
       await review.save();
       await blog.save();
       res.redirect(`/blog/${req.params.id}`)
    }
    catch(e){

    }
})

module.exports = router;