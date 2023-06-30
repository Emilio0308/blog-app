//npm i express-validator express sequelize pg pg-hstore dotenv cors morgan, express-rate-limit helmet hpp, instalaciones pg pg-hstore son drivers para conectar sequelize con postman//
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
//limita las peticiones por ip para evitar ataques de fuerza//
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const sanitizer = require('perfect-express-sanitizer');
//para evitar ataques de scrip malicioso//
const hpp = require('hpp');

const userRouter = require('./routes/users.routes');
const authRouter = require('./routes/auth.routes');
const postRouter = require('./routes/posts.routes');
const commentRouter = require('./routes/comment.route')

const AppError = require('./utils/appError');
const globalErrorHandle = require('./controllers/error.controller');

const app = express();
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'too many renders from this api',
});
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(hpp());

app.use(
  sanitizer.clean({
    xss: true,
    noSql: true,
    sql: false,
  })
);


//morgan debe ir antes de las rutas//
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1', limiter);

//rutas//
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/comments', commentRouter);

app.all('*', (req, res, next) => {
  return next(
    new AppError(`Cant find ${req.originalUrl} on this server!`, 404)
  );
});

app.use(globalErrorHandle);

module.exports = app;
