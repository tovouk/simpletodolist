var express = require("express");
var app = express();
var ejs = require("ejs");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

app.use(bodyParser.urlencoded({extended : true}));
// mongoose.connect("mongodb://localhost/list");
//change the parameter to whatever variable you name the url to for security reasons
mongoose.connect(process.env.DATABASEURL);

app.use(express.static("assets"));
app.set("view engine", "ejs");

//schema setup
var taskSchema = new mongoose.Schema({
   task: String
});

var Task = mongoose.model("Task",taskSchema);


app.get("/",function(req,res){
    res.render("index");
});



app.get("/list",function(req,res){
   Task.find({},function(err,alltasks){
        if(err){
            console.log(err);
        }else{
            res.render("home",{tasks:alltasks});
        }
    });
});

app.post("/list",function(req,res){
     var task = (req.body.task);
     var newTask = {task : task};
     Task.create(newTask,function(err,newlycreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/list");
        }
    });
});

app.get( '/destroy/:id',function ( req, res ){
  Task.findById( req.params.id, function ( err, todo ){
      if(err){
          console.log(err);
      }else{
    todo.remove( function ( err, todo ){
        if(err){
            console.log(err);
        }else{
            res.redirect( '/list' );
        }
      });
    }
  });
}); 

app.get("/info",function(req,res){
   
    res.render("info");
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server has started");
});