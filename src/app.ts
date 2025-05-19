
// dependency list
import express, { Response, Request, NextFunction } from "express"
import rateLimit from "express-rate-limit"
import { engine } from "express-handlebars"
import path from "path"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import cors from "cors"

import requestIp from "request-ip"
import axios from "axios"


// configuring dotenv
dotenv.config()

// component dependency
import dbConnectFunc from "./config/dbConnect";
import userRouter from "./routes/userRoutes";


// initiating app
const app = express()


/* middle wares */
const corsOptions = {
    origin:"*",
    methods: ["GET","HEAD","PUT","PATCH","POST","DELETE"],
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
}

 /* set static files location */
app.use(express.static(path.join(__dirname,"public")))


app.get('/ip', async (req, res) => {
    const ip = req.clientIp;
  
    try {
      // Replace with your preferred IP geolocation API
      const response = await axios.get(`http://ip-api.com/json/${ip}`);
      const location = response.data;
  
      res.json({
        location
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch location' });
    }
  });


// Middleware to get IP
app.use(requestIp.mw())

/* view engine setting */
app.engine("hbs", engine({
    extname: '.hbs',
     defaultLayout: false
}))  


// setting up engine
app.set("view engine", "hbs") 
 
app.set("views", path.join(__dirname, "views"))


//Middleware
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())


// setting up the port 
const PORT = process.env.PORT || 9000;

// limts the number of api call from a giving browser 
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, 
});
  
  app.use(limiter);
  
// Routes
app.use("/api/v1/user", userRouter)

/* for home route */


app.get("/test", async (req, res) => { 
    res.send("server running")
})

app.use((req: Request, res:Response, next:NextFunction) => {
    res.status(404).json({
        message:"route not found"
    })
})

/* handling all errors */
app.use((err: any, req:Request, res:Response, next:NextFunction) => {
    const errorMessage = err.message
    const stack = err.stack
res.status(500).json({
    message: errorMessage,
    stack
})

})


app.listen(PORT, async() => { 
    try {
       await dbConnectFunc()
        console.log("DB connect and server running on port "+ PORT)
    } catch (error: any) {
        console.log("Failed to start server " + error.message)
        process.exit()
    }
})