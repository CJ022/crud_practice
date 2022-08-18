const mysql=require('mysql');
const con=mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "crud",
    port: 3307

});

con.connect((er)=>{
    if(er){
        throw(er);
    }
    console.log("Connection Created...");
});

module.exports.con=con;