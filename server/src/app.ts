import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import router from './app/routes';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';
import config from './app/config';
import {
  apiLimiter,
  requireCsrfHeader,
  sanitizeBody,
} from './app/middleware/security';

const app: Application = express();

// Behind Vercel / the Next.js proxy: trust the first hop for client IPs (rate limiting).
app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Same-origin and server-to-server requests have no Origin header.
      if (!origin || config.client_urls.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());
app.use(sanitizeBody);

// application routes
app.use('/api', apiLimiter, requireCsrfHeader, router);

app.get('/', (req: Request, res: Response) => {
  res.send('Portfolio app server is running!');
});

// use global error handler middleware
app.use(globalErrorHandler);

// Not found middleware,
app.use(notFound);

export default app;
