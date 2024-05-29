import app from "./app.js"
import { connectToDatabase } from "./db/index.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectToDatabase()
});
