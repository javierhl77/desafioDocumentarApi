//** 3ra pre entrega */
// alumno : JAVIER LEZCANO 
// comision: 50045

const express = require("express");
const app = express();
const productsRouter = require("./routes/product.router.js");
const cartsRouter = require ("./routes/carts.router.js");
const userRouter = require("./routes/user.router.js");
const viewsRouter = require("./routes/views.router");
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");
const cookieParser = require("cookie-parser");
require("./database.js");

const nodemailer = require("nodemailer");

const socket = require("socket.io");

const PUERTO = 8080;
 const exphbs = require ("express-handlebars");

 //configurar handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//passport
app.use(passport.initialize());
initializePassport();
app.use(cookieParser());

/* //AuthMiddleware
const authMiddleware = require("./middleware/authmiddleware.js");
app.use(authMiddleware); */


//middleware

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("./src/public"));

//routing


app.use("/api/products/", productsRouter )
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/", viewsRouter);



//instalar nodemailer: npm install nodemailer
//crear transporte para envio de mail:
const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: "tupackatari1977@gmail.com",
        pass: "neog ispu mdlr ddan"
    }

})

//ruta para enviar mail:
app.get("/mail", async(req,res) => {
    try {
        await transport.sendMail({
            from: " Coder <tupackatari1977@gmail.com>",
            to: "lezcano_javier1977@hotmail.com",
            subject: "Prueba de envio de mail",
            html: `<h1> CORREO DE PRUEBA</h1>`,
            //para enviar un archivo adjunto:
            //attachments: [{
              //  filename: "AMINGA.jpg",
                //path:"./AMINGA.jpg"
            //}] 
            })
            res.send({message: "mail enviado"})
     
        
    } catch (error) {
        res.status(500).send("error al enviar el mail")
    }
})


app.get("/contacto", (req,res) => {
    res.render("contacto")
   
})
//enviamos mensaje desde la vista "contacto":
app.post("/enviarmensaje", async(req,res) => {
    const {email, mensaje} = req.body;
    try {
        await transport.sendMail({
            from: "Coder <tupackatari1977@gmail.com>",
            to: email,
            subject: "Mensaje de contacto",
            text: mensaje
        })
        res.send({message:"email enviado correctamente"})
    } catch (error) {
        res.status(500).send("error al enviar el mail")
    }
})


// ruta para registrar usuario
app.get("/register", (req,res) => {
    res.render("register");
})

app.get("/login", (req,res) => {
    res.render("login");
})


//guardar una referencia de express 
const httpServer = app.listen(PUERTO, () => {
    console.log(`escuchando en el puerto : ${PUERTO}` );
})

////////////////////////////////////////////////////////////
//desafio Swagger Documentar Api
//import swaggerJSDoc from "swagger-jsdoc";
//import swaggerUiExpress from "swagger-ui-express";
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUiExpress = require("swagger-ui-express");

//crear objeto de configuracion : swaggerOptions

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Api de productos",
            description: "Api para gestionar productos"
        }
    },
    apis: ["./docs/**/*.yaml"]
}
//conectamos Swagger con el servidor express:
const specs = swaggerJSDoc(swaggerOptions);

app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

//pasos para trabajar con sockets.io
// 1) instalar socket.io : npm install socket.io
//2) importamos el modulo:  const socket = require("socket.io")
//configuramos:
//const io = socket(httpServer);

//chat

const MessageModel = require("./models/message.model.js");
const io = new socket.Server(httpServer);

io.on("connection",  (socket) => {
    console.log("Nuevo usuario conectado");

    socket.on("message", async data => {

        //Guardo el mensaje en MongoDB: 
        await MessageModel.create(data);

        //Obtengo los mensajes de MongoDB y se los paso al cliente: 
        const messages = await MessageModel.find();
        console.log(messages);
        io.sockets.emit("message", messages);

    })
})

