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
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const client = (0, redis_1.createClient)();
function startWorker() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            console.log("Worker connected to Redis.");
            while (true) {
                const task = yield client.brPop("task", 0);
                const problemDetail = JSON.parse(task.element);
                const pid = problemDetail.problemId;
                client.publish("problem_done", JSON.stringify({ pid, status: "done" }));
                console.log("received task", problemDetail);
                //   delay of 1 sec to see how workers will pick and process task
                new Promise((res) => setTimeout(res, 1000));
                console.log(`Finished processing submission for problemId ${pid}`);
            }
        }
        catch (error) {
            console.log("failed to connect to client", error);
        }
    });
}
startWorker();
