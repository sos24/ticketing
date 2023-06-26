import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import cookieSession from 'cookie-session';
import { errorHandler, currentUser } from '@tickets-sosghazaryan/common';

import { indexOrderRouter } from './routes/index';
import { deleteOrderRouter } from './routes/delete';
import { createOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';

const app = express();
app.set('trust proxy', true)

app.use(json());
app.use(cookieSession({
    signed: false,
    // secure: process.env.NODE_ENV !== 'test' ? true : false,
    secure: false,
}))

app.use(currentUser);

app.use(indexOrderRouter);
app.use(deleteOrderRouter);
app.use(showOrderRouter);
app.use(createOrderRouter);

app.use(errorHandler);

export { app } ;

