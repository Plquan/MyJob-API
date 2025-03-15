import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); // Load biến môi trường từ .env

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Định nghĩa route đơn giản
app.get('/', (req, res) => {
  res.send('Hello, TypeScript + Express!');
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
