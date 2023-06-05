const express = require("express")
const bodyParser = require("body-parser")
const _ = require("lodash")
require("./db/db.js")
const note = require("./models/note")
const Register = require("./models/register")
const port = process.env.PORT || 3000

const app = express();

app.use(bodyParser.urlencoded({extended:true}))

app.set("view engine","ejs")
app.use(express.static("public"))

app.get("/",(req,res)=>{
    res.render("signup")
})
app.get("/login",(req,res)=>{
    res.render("login")
})

app.get("/:userID/index",async(req,res)=>{
    let posts=await user.item;
    res.render("index",{name:user.firstName ,
        userName:user.userName,
        posts:posts
    })
})

app.get("/:userID/compose",async(req,res)=>{
    
    res.render("compose",{userName:user.userName})
})

app.get("/:userID/account",(req,res)=>{
    res.render("account",{
        firstName:user.firstName,
        lastName:user.lastName,
        userName:user.userName,
        email:user.email
    })
})

app.get("/posts/:postID",(req,res)=>{
    let para=req.params.postID;
    para=_.lowerCase(para);
    let posts = user.item;
    posts.forEach(function(post){
        if(_.lowerCase(post.title) === para){
            userPost=post;
            console.log(userPost._id);
            res.render("post",{title:post.title,
                content:post.content,userName:user.userName})
            }
        })
    })

    app.get(`/posts/:postID/editpost`,(req,res)=>{
        
        res.render("editpost",{noteTitle:userPost.title,
            noteBody:userPost.content,userName:userPost.userName})
            
        })

app.get("/:userID/delete",(req,res)=>{
    res.render("delete");
})

app.get("/invalid",(req,res)=>{
    res.render("invalid")
})

app.get("/exist",(req,res)=>{
    res.render("exist")
})

app.get("/about",(req,res)=>{
    res.render("about",{userName:user.userName})
})
app.get("/contact",(req,res)=>{
    res.render("contact",{userName:user.userName})
})

app.get("/passconfirm",(req,res)=>{
    res.render("passconfirm")
})
        let user;
        let userPost; 
        let bgColor = ["green","orange","pink","yellow"];
        let cardRotate = [["rotate10","hoverrotate10"],["rotate-10","hoverrotate-10"]]
    

app.post("/signup",async(req,res)=>{
    try {
        if(req.body.password === req.body.cpassword){
        if(!((await Register.findOne({userName : req.body.userName}) || await Register.findOne({email : req.body.email}) ))||await Register.findOne({_id:"647af47846da6315943f585c"})){
        const register = new Register({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            email: req.body.email,
            password: req.body.password,
            cpassword: req.body.cpassword,
        })
        user = await register.save();
        // console.log(user);
        res.redirect(`/${user.userName}/index`)
    }else{
        res.redirect("/exist")
    }
}
else{
        res.redirect("/passconfirm")
    }
        
    } catch (error) {
     console.log(error);   
    }

})

app.post("/login",async(req,res)=>{
    try {       
        if(await Register.findOne({email:req.body.email})){
            user=await Register.findOne({email:req.body.email})
            if(user.password===req.body.password){
                // console.log(user);
                res.redirect(`/${user.userName}/index`)
            }
            else{
                res.redirect("/invalid");
            }
        }else{
            res.redirect("/invalid");
        }
    } catch (error) {
        console.log(error);
    }
})
app.post("/compose",async(req,res)=>{
    // if(req.body.noteTitle===await note.Note.find({title:userPost.title}))
    if(req.body.noteTitle &&req.body.noteBody){
        let a= Math.floor(Math.random() * 4);
        let bcolor=bgColor[a]
        let b= Math.floor(Math.random() * 2);
        let rt =cardRotate[b][0]
        let hrt =cardRotate[b][1]
    const notes = new note.Note({
        userName:user.userName,
        title:req.body.noteTitle,
        content:req.body.noteBody,
        bg:bcolor,
        rotate:rt,
        hoverRotate:hrt
    })
    const currentData=await notes.save()
    // console.log(currentData);
    
    const noteData= await note.Note.find({userName:currentData.userName})
    // console.log(noteData);
    
    await Register.findOneAndUpdate({userName:currentData.userName},{$set:{
        item:noteData
    }}) 
    user=await Register.findOneAndUpdate({userName:currentData.userName},{$set:{
        item:noteData
    }}) 
    
    // console.log(user);
    res.redirect(`/${currentData.userName}/index`)
}
else{
    res.redirect(`/${user.userName}/compose`)
}
})

app.post("/account",async(req,res)=>{
    await Register.findOneAndUpdate({userName:user.userName},{$set:
    {
        firstName:req.body.firstName,
        lastName:req.body.lastName
    }})
    user=await Register.findOneAndUpdate({userName:user.userName},{$set:
    {
        firstName:req.body.firstName,
        lastName:req.body.lastName
    }})
    res.redirect(`/${user.userName}/account`)
})

app.post("/deleteacc",async(req,res)=>{
    if(user.password===req.body.password){
        
        await Register.deleteOne({userName:user.userName})
        await note.Note.deleteMany({userName:user.userName})
        res.redirect("/");
    }else{
        res.redirect("/user.userName/account")
    }
})

app.post("/deleteNote",async(req,res)=>{
    await note.Note.deleteOne({_id:userPost._id})
    const noteData= await note.Note.find({userName:userPost.userName})
    // console.log(noteData);
    
    await Register.findOneAndUpdate({userName:userPost.userName},{$set:{
        item:noteData
    }}) 
    user=await Register.findOneAndUpdate({userName:userPost.userName},{$set:{
        item:noteData
    }}) 
    console.log(userPost._id);
    res.redirect(`/${userPost.userName}/index`)
})

app.post("/editcompose",async(req,res)=>{
    await note.Note.findOneAndUpdate({_id:userPost._id},{
        title:req.body.noteTitle,
        content:req.body.noteBody,
        bg:req.body.cardColor
    })
    userPost = await note.Note.findOneAndUpdate({_id:userPost._id},{
        title:req.body.noteTitle,
        content:req.body.noteBody,
        bg:req.body.cardColor
    })
    const noteData= await note.Note.find({userName:user.userName})
    console.log(userPost);
    
    await Register.findOneAndUpdate({userName:user.userName},{$set:{
        item:noteData
    }}) 
    user=await Register.findOneAndUpdate({userName:user.userName},{$set:{
        item:noteData
    }})
    res.redirect(`/${user.userName}/index`)
})


app.listen(port,()=>{
    console.log(`Connected in port ${port}`);
})
