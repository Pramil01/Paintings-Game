const express = require("express");
const app = express();
const cors = require("cors");

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

const userRouter = require("./routes/Players");
app.use("/auth", userRouter);

const paintingRouter = require("./routes/Paintings");
app.use("/painting", paintingRouter);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
