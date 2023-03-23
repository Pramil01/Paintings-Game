const express = require("express");
const app = express();
const cors = require("cors");

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: "https://painting-game.netlify.app",
  })
);

const userRouter = require("./routes/Players");
app.use("/auth", userRouter);

const paintingRouter = require("./routes/Paintings");
app.use("/painting", paintingRouter);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

//https://painting-game.netlify.app/?id=2sq3fw5
