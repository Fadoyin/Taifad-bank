"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// dependency list
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_handlebars_1 = require("express-handlebars");
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const request_ip_1 = __importDefault(require("request-ip"));
const axios_1 = __importDefault(require("axios"));
// configuring dotenv
dotenv_1.default.config();
// component dependency
const dbConnect_1 = __importDefault(require("./config/dbConnect"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
// initiating app
const app = (0, express_1.default)();
/* middle wares */
const corsOptions = {
    origin: "*",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
};
/* set static files location */
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.get('/ip', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ip = req.clientIp;
    try {
        // Replace with your preferred IP geolocation API
        const response = yield axios_1.default.get(`http://ip-api.com/json/${ip}`);
        const location = response.data;
        res.json({
            location
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch location' });
    }
}));
// Middleware to get IP
app.use(request_ip_1.default.mw());
/* view engine setting */
app.engine("hbs", (0, express_handlebars_1.engine)({
    extname: '.hbs'
}));
// setting up engine
app.set("view engine", "hbs");
app.set("views", path_1.default.join(__dirname, "views"));
//Middleware
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
// setting up the port 
const PORT = process.env.PORT || 9000;
// limts the number of api call from a giving browser 
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
});
app.use(limiter);
// Routes
app.use("/api/v1/user", userRoutes_1.default);
/* for home route */
app.get("/test", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("server running");
}));
app.use((req, res, next) => {
    res.status(404).json({
        message: "route not found"
    });
});
/* handling all errors */
app.use((err, req, res, next) => {
    const errorMessage = err.message;
    const stack = err.stack;
    res.status(500).json({
        message: errorMessage,
        stack
    });
});
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, dbConnect_1.default)();
        console.log("DB connect and server running on port " + PORT);
    }
    catch (error) {
        console.log("Failed to start server " + error.message);
        process.exit();
    }
}));
