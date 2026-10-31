import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';
import cookieParser from 'cookie-parser';
const app: Application = express();

//* parser
app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(cookieParser());

// application routes
app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Portfolio app server is running!');
});

// use global error handler middleware
app.use(globalErrorHandler);

// Not found middleware,
app.use(notFound);

export default app;
