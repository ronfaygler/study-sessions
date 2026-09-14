import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import topicRoutes from './routes/topicRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use(topicRoutes);

export default app;