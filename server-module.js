const express = await import('express').then(m=>m.default);
//const events = require('./routes/events');
const app = express();
const http = app.listen(3000);
const io =  await import('socket.io').then(m=>new m.Server(http));
import fetch from 'node-fetch';
export { express, app, http, io, fetch };