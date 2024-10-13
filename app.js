var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var fs = require("fs");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use("/", indexRouter);
app.use("/users", usersRouter);

app.get("/fileCreation", (req, res) => {
  fs.writeFile(`./uploads/${req.query.filename}`, "", (err) => {
    if (err) res.send(err);
    else res.redirect("back");
  });
});

// to display all files on index page

app.get("/",(req,res)=>{
  fs.readdir("./uploads",{withFileTypes: true},(err,files)=>{
   res.render("index",{files:files});
  })
})

app.get("/files/:filename",(req,res)=>{
  fs.readdir("./uploads",{withFileTypes: true},(err,files)=>{
    fs.readFile(`./uploads/${req.params.filename}`,"utf8",(err,data)=>{
      res.render("Opened",{files:files,filename:req.params.filename,filedata:data});
    })
    
   })
 
})
// app.post("/fileChange/:filename",(req,res)=>{
// fs.writeFile(`./uploads/${req.params.filename}`,req.body.filedata,(err)=>{
//  res.redirect("back");
// })
// });

app.post("/fileChange/:filename", (req, res) => {
  fs.writeFile(`./uploads/${req.params.filename}`, req.body.filedata, (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return res.status(500).send("Error saving the file. Please try again.");
    }
    res.redirect("back");
  });
});


app.get("/folderCreation",(req,res)=>{
  fs.mkdir(`./uploads/${req.query.foldername}`,(err)=>{
    if(err) res.send(err);
    else res.redirect("back");
  })
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

// form get hoga to req.query se hoga
// form agar  post to req.body se hoga
