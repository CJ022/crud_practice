const express = require('express');
const mysql=require("./conn").con;
const app=express();//func that refers to expre

app.set("view engine","hbs");
app.set("views", "./view");

app.use(express.urlencoded());//to handle func
app.use(express.json());

app.get("/",function(request,response){
    response.render("index");
});
app.use(express.static(__dirname+ "/public")); 
app.get("/add",function(request,response){
    response.render("add");
});

app.get("/search",function(request,response){
    response.render("search");
});

app.get("/update",function(request,response){
    response.render("update");
});

app.get("/delete",function(request,response){
    response.render("delete");
}); 

app.get("/view",function(request,response){
    // response.render("view");
    let q="select * from athlete";
    mysql.query(q, (er,results)=>{
        if(er){
            throw er;
        }else{
            response.render("view", {data:results});
        }
    });
});

app.get("/addinfo",(req,res)=>{
    //get input as json
    //res.send(req.query);
    //saved in a json
    const{athlete_id,name, email, phone, gender, sport}=req.query;
    let q="select * from athlete where email=? or phone=?";
    mysql.query(q, [email,phone], (er, results)=>{
        if(er)  throw(er);
        else{
            //get result of value inserted  res.send(results);
            if(results.length > 0){
                res.render("add", {checkmesg: true});
            }else{
                //insert 
                ins="insert into athlete values(?, ?, ?, ?, ?, ?)";
                mysql.query(ins, [athlete_id,name, email, phone, gender, sport], (er,results)=>{
                    //res.send(results);
                    if(results.affectedrows>0){
                    //can use value of mesg to add
                    //send rendered html to client
                        res.render("add", {mesg: true})
                    }
                        
                });
            }
        }
    })
});

//cant send res.send(query)
//need to app.use(exp.urlencoded())
//use(json()) then->
//res.send(req.body)

// app.post("/searchstudent",(req,res)=>{
//     res.send(req.body);
//    })


app.get("/searchstudent", (req,res)=>{
    const {phone}=req.query;

    let q="select * from athlete where phone=?";
    mysql.query(q, [phone], (er,results)=>{
        if(er)  throw(er);
        else{
            if(results.length>0){
                res.render("search", {mesg1:true, mesg2:false})
            }else{
                res.render("search", {mesg1:false, mesg:true});
            }
        }
    })

})

app.get("/updatesearch", (req,res)=>{
    const {phone}=req.query;

    let q="select * from athlete where phone=?";
    mysql.query(q, [phone], (er,results)=>{
        if(er)  throw(er);
        else{
            if(results.length>0){
                res.render("update", {mesg1:true, mesg2:false, data:results})
            }else{
                res.render("update", {mesg1:false, mesg2:true});
            }
        }
    });
});

app.get("/updatestudent", (req, res) => {
    // fetch data

    const { phone, name, gender, sport, email } = req.query;
    let q = "update athlete set phone=?, name=?, gender=?, sport=?, email=? ";

    mysql.query(q, [phone, name, gender, sport, email], (err, results) => {
        if (err) throw err
        else {
            if (results.affectedRows > 0) {
                res.render("update", { umesg: true })
            }
        }
    })

});

app.get("/removestudent", (req, res) => {

    // fetch data from the form
    const { phone } = req.query;

    let q = "delete from athlete where phone=?";
    mysql.query(q, [phone], (err, results) => {
        if (err) throw err
        else {
            if (results.affectedRows > 0) {
                res.render("delete", { mesg1: true, mesg2: false })
            } else {

                res.render("delete", { mesg1: false, mesg2: true })

            }

        }
    });
});
app.listen(3000,function(){
    console.log('server has started on port 3000');
});
