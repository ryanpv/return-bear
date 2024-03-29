import express, { Request, Response} from "express";
import cors from 'cors';
import "dotenv/config.js";

// CONTROLLER
import returnBear from './controllers/return-bear.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3003'
  ]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  // const 
  console.log('received request')
  res.status(200).json({ message: "Received test request" });
})

app.post('/phone/data', returnBear);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server listening on port: ${ PORT }...`);
  });
}

export default app;