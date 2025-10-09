import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { logger, logLevels } from './config/logger.js';
import morgan from 'morgan';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectDB from './config/db.js';
import 'dotenv/config';

const app = express();
const saltRounds = 10;
const productionEnv = process.env.NODE_ENV === 'production';
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};
const morganFormat = productionEnv
  ? ':remote-addr :method :url :status :res[content-length] - :response-time ms ":user-agent"'
  : ':method :url :status :res[content-length] - :response-time ms ":user-agent"';

const taskRateLimiter = rateLimit({
  windowMs: productionEnv ? 15 * 60 * 1000 : 1 * 60 * 1000, // 15 mins / 1 min
  max: productionEnv ? 10 : 500, // limit each user to 10 request per minute
  message: 'Too many requests, please try again later.',
});

const initApp = async () => {
  const db = await connectDB();

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else {
    app.use(
      morgan(morganFormat, {
        stream: { write: (msg) => logger.info(msg.trim()) },
      })
    );
  }

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );
  app.use(passport.initialize());

  passport.use(
    new JwtStrategy(opts, async (jwt_payload, cb) => {
      try {
        const result = await db.query('SELECT * FROM users WHERE id = $1', [
          jwt_payload.id,
        ]);
        const user = result.rows[0];

        if (!user) return cb(null, false, { message: 'User not found' });
        logger.info(`[auth] User ${user.user_uuid} authenticated successfully`);
        return cb(null, user);
      } catch (err) {
        logger.error('Auth error:', err);
        return cb(err);
      }
    })
  );

  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, cb) => {
        try {
          const result = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
          );

          if (result.rows.length === 0) {
            return cb(null, false, { message: 'User not found' });
          }

          const user = result.rows[0];
          const storedHashedPassword = user.password_hash;

          const isMatch = await bcrypt.compare(password, storedHashedPassword);

          if (!isMatch) {
            return cb(null, false, { message: 'Incorrect password' });
          }

          logger.info(
            `[auth] User ${user.user_uuid} authenticated successfully`
          );
          return cb(null, user);
        } catch (err) {
          logger.error(err);
          return cb(err);
        }
      }
    )
  );

  app.get(
    '/api/tasks',
    taskRateLimiter,
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        const result = await db.query(
          `SELECT
            tasks.task_uuid AS task_id,
            tasks.title,
            tasks.category,
            tasks.timeframe,
            tasks.previous_duration,
            tasks.duration,
            tasks.created_at
          FROM
	          tasks
          WHERE user_id = $1
          ORDER BY tasks.id, tasks.created_at DESC`,
          [req.user.id]
        );

        logger.info(`User ${req.user.user_uuid} requested all tasks`);
        res.status(200).json(result.rows);
      } catch (err) {
        logger.error(err);
        res.status(500).send('Internal Server Error');
      }
    }
  );

  app.get(
    '/api/me',
    taskRateLimiter,
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      const { id, email, first_name: fname, last_name: lname } = req.user;

      res.status(200).json({ id, email, fname, lname });
    }
  );

  app.post(
    '/api/tasks',
    taskRateLimiter,
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      const { category, title, duration, timeframe } = req.body;
      try {
        const result = await db.query(
          'INSERT INTO tasks (user_id, title, category, duration, timeframe) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [req.user.id, title, category, duration, timeframe]
        );

        const task = result.rows[0];

        logger.info(
          `User ${req.user.user_uuid} created task "${task.title}" - task_id: ${task.task_uuid}`
        );
        res.status(200).send({ message: 'Task added successfully!' });
      } catch (err) {
        logger.error('Post failed:', err);
        res.status(500).send('Internal Server Error');
      }
    }
  );

  app.post('/api/auth/register', taskRateLimiter, async (req, res) => {
    const { email, password, fname, lname } = req.body;

    try {
      const existingUser = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        return res.send('Email already exists. Try logging in');
      }
      // hash the password
      const hash = await bcrypt.hash(password, saltRounds);

      const result = await db.query(
        'INSERT INTO users (email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *',
        [email, hash, fname, lname]
      );

      const [user] = result.rows;
      const username = `${user.first_name} ${user.last_name}`;

      const payload = { id: user.id, email: user.email };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        algorithm: 'HS256',
        expiresIn: '1h',
      });

      logger.info(`User ${user.user_uuid} registered}`);
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.user_uuid,
          email: user.email,
          username,
        },
        token,
      });
    } catch (err) {
      logger.error('Registration Error:', err);
      res.status(500).send('Internal Server Error');
    }
  });

  app.post('/api/auth/login', taskRateLimiter, async (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err) {
        logger.error('Auth error:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      if (!user) {
        return res
          .status(401)
          .json({ message: info?.message || 'Login failed' });
      }

      const username = `${user.first_name} ${user.last_name}`;

      const payload = { id: user.id, email: user.email };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        algorithm: 'HS256',
        expiresIn: '1h',
      });

      logger.info(`User ${user.user_uuid} logged in`);
      res.status(200).json({
        message: 'OK',
        user: {
          id: user.user_uuid,
          email: user.email,
          username,
        },
        token,
      });
    })(req, res, next);
  });

  app.post(
    '/api/logs',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      const { level, msg, component, ...meta } = req.body;
      let logMethod = null;

      if (level in logLevels) {
        logMethod = logger[level];
      } else {
        logger.warn(
          `[FrontEnd]: Invalid logger level '${level}' used. Defaulting to 'warn'.`
        );
        logMethod = logger['warn'];
      }

      if (Object.keys(meta).length > 0) {
        let data = '';
        for (const item in meta) {
          data += `\'${item}: ${meta[item]}\', `;
        }
        logMethod(`[FrontEnd]:[${component}] - ${msg} | Details: ${data}`);
      } else {
        logMethod(`[FrontEnd]:[${component}] - ${msg}`);
      }

      res.sendStatus(200);
    }
  );

  app.put(
    '/api/tasks/:taskId',
    taskRateLimiter,
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      const { taskId } = req.params;
      const { category, title, duration, timeframe } = req.body;

      try {
        const upd = await db.query(
          `UPDATE 
              tasks 
            SET 
              title = $1, category = $2, timeframe = $3, duration = $4
            WHERE task_uuid = $5 AND (title IS DISTINCT FROM $1 OR
                      category IS DISTINCT FROM $2 OR timeframe IS DISTINCT FROM $3 OR duration IS DISTINCT FROM $4)
            RETURNING title, task_uuid`,
          [title, category, timeframe, duration, taskId]
        );

        if (upd.rowCount === 0) {
          const exists = await db.query(
            `SELECT 1 FROM tasks WHERE user_id = $1 AND task_uuid = $2::uuid`,
            [req.user.id, taskId]
          );

          if (exists.rowCount !== 1) {
            throw new Error('Expected exactly one matching task.');
          }

          return res
            .status(404)
            .json({ message: 'Task not found or not authorized.' });
        }

        const updTask = upd.rows[0];
        logger.info(
          `User ${req.user.user_uuid} Updated task "${updTask.title}" - task_id: ${updTask.task_uuid}`
        );
        res.status(200).send({ message: 'Task Updated Successfully!' });
      } catch (err) {
        logger.error(err);
        res.status(500).send({ message: 'Internal Server Error' });
      }
    }
  );

  app.delete(
    '/api/tasks/:id',
    taskRateLimiter,
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        const result = await db.query(
          'DELETE FROM tasks WHERE task_uuid = $1 RETURNING *',
          [req.params.id]
        );

        if (result.rows === 0) {
          return res.status(404).send({ message: 'Task Not Found' });
        }

        const task = result.rows[0];

        logger.info(`User ${req.user.user_uuid} Deleted task ${task.title}`);
        res.status(200).send({
          status: '200 OK',
          message: 'Task Deleted!',
        });
      } catch (err) {
        logger.error(err);
        res.status(500).send('Internal Server Error');
      }
    }
  );

  return app;
};

export default initApp;
