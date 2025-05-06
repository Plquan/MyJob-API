import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.APP_PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, TypeScript + Express!');
});


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
