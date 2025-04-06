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
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const client = (0, redis_1.createClient)();
client.on("error", (err) => {
    return console.log("Redis Client Error", err);
});
app.post("/submit", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const problemId = req.body.problemId;
        const problemName = req.body.problemName;
        if (!problemId || !problemName) {
            res.status(302).send("inputs missing");
        }
        yield client.lPush("task", JSON.stringify({ problemId, problemName }));
        res.status(200).send("received and stored.");
    }
    catch (error) {
        console.error("Redis error:", error);
        res.status(500).send("Failed to store.");
    }
}));
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            console.log("connected to redis");
            app.listen(3000, () => {
                console.log("server started on 8080");
            });
        }
        catch (error) {
            console.error("Failed to connect to Redis", error);
        }
    });
}
init();
