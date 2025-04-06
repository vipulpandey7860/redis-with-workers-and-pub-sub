import express from "express";
import { createClient } from "redis";
const app = express();
app.use(express.json());

const client = createClient();

client.on("error", (err) => {
  return console.log("Redis Client Error", err);
});

app.post("/submit", async (req, res) => {
  try {

  const problemId = req.body.problemId;
  const problemName = req.body.problemName;

    if (!problemId || !problemName) {
        res.status(302).send("inputs missing")
    }

    await client.lPush("task", JSON.stringify({ problemId, problemName }));
    res.status(200).send("received and stored.");
  } catch (error) {
    console.error("Redis error:", error);
    res.status(500).send("Failed to store.");
  }
});

async function init() {
  try {
    await client.connect();
    console.log("connected to redis");
    app.listen(3000, () => {
      console.log("server started on 8080");
    });
  } catch (error) {
    console.error("Failed to connect to Redis", error);
  }
}

init();
