const SocketIO = require('socket.io');
const express = require('express');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');

const indexRouter = require('./routes');
const roomsMiddleware = require('./middleware/rooms.js');
const ingameMiddleware = require('./ingame');

const app = express();
app.set('port',  process.env.PORT || 8005);
// app.set('view engine', 'html');
// nunjucks.configure('views', {
//     express: app,
//     watch: true,
// });

app.use(morgan('dev'));
app.use(express.json());


// app.use('/', indexRouter);

// app.use((req, res, next) => {
//     const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
//     error.status = 404;
//     next(error);
// });

// app.use((err, req, res, next) => {
//     res.locals.message = err.message;
//     res.locals.error =  process.env.NODE_ENV !== 'production' ? err : {};
//     res.status(err.status || 500);
//     res.render('error');
// });

const server = app.listen(app.get('port'), () => {
    console.log(app.get('port'),'번 포트에서 대기중');
});

const io = SocketIO(server, { path: '/socket.io'});
app.set('io',io);
const ingame = io.of('/ingame');
const rooms = io.of('/rooms');

ingameMiddleware(ingame);
roomsMiddleware(rooms);
