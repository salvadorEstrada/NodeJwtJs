const express = require('express'); 
const jwt = require('jsonwebtoken');  

const app = express(); 


app.listen(3000, function (){
    console.log("nodejs app  running!!");
}); 

app.get("/api",(req, res)=> {
    res.json({Status:'Nodejs and jwt'});
}); 

app.post("/api/login", (req, res)=>{
   const user = {id: 1, name:"Salvador",eamil:"salv@gmail.com" }; 
   //Cuando el usuario se logge debe de generar un token para identificarlo
   jwt.sign({user},'secretkey', {expiresIn:'32s'},(err, token)=> {
        res.json({token});//Genera el token con datos del usuario
   });//Le paso el objeto user
});
//Para acceder a esta ruta es necesario el token, llamar en este método la función verifyToken
app.post("/api/posts", verifyToken, (req, res)=>{
    //const user = {id: 1, name:"Salvador",eamil:"salv@gmail.com" }; 
    //res.json({mensaje:"Post fue creado"}); 
    jwt.verify(req.token,'secretkey', (err, authData)=>{
        if(err)
        {
           res.sendStatus(403); 
        }
        else
        {
           res.json({mensaje:'Post fue creado', authData });
           
        }
    });
 }); 
 
 //Authorization: Bearer <token>
 function verifyToken(req, res,next)
 {
    const bearerHeader= req.headers['authorization']; 
    // verify if user is sending a token
    if(typeof bearerHeader !=='undefined' ) //tiene un valor 
    {
        const bearerToken=bearerHeader.split(" ")[1]; //almacenar a partir de la posición 1 "Bearer <token>" de aquí (<token>) 
        req.token=bearerToken;  
        //si se obtuvo el token correcto
        next();
    }else{
        //res.json({Status:'Ocurrio erro con jwt'}); //access forbiden 
        //res.status(403).send('Forbidden') 
        res.sendStatus(403);
    }
 }
