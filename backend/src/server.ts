import express from "express";
import type { Express } from "express";
const app: Express = express()

app.use(express.json());


app.get("/", (req, res) => {
    res.send("Backend OK");
});

app.get("/api/testing",(req,res)=>{
  const data={
    "hello":"hi"
  };
  res.status(200).json(data);
})



export { app };
