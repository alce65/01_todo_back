import express from 'express';
import morgan from 'morgan';
import * as dotenv from 'dotenv';
dotenv.config();

export const app = express();
const port = process.env.PORT;

// const usersRouter = require('./routes/tasks.js');
import tasksRouter from './routes/tasks.routes.js';

app.use(express.json());
app.use(morgan('dev'));

app.use('/tasks', tasksRouter);

export const server = app.listen(port, () => {
    console.log(`Server listening in http://localhost:${port}`);
});
