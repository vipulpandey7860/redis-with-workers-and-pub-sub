import { createClient } from "redis";
const client = createClient();

async function startWorker() {
  try {
    await client.connect();
    console.log("Worker connected to Redis.");

      while (true) {
        const task = await client.brPop("task", 0);
          const problemDetail = JSON.parse(task.element);
          const pid = problemDetail.problemId;
          client.publish("problem_done", JSON.stringify({ pid, status: "done" }));

        console.log("received task", problemDetail);
        //   delay of 1 sec to see how workers will pick and process task
        new Promise((res) => setTimeout(res, 1000));
        console.log(
          `Finished processing submission for problemId ${pid}`
        );
      }
  } catch (error) {
    console.log("failed to connect to client", error);
  }
}

startWorker();
