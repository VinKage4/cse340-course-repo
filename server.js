import session from 'express-session';
import flash from './src/middleware/flash.js';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import { fileURLToPath } from 'url';

import { testConnection } from './src/models/db.js';
import router from './src/routes.js';

const NODE_ENV =
    process.env.NODE_ENV || 'development';

const app = express();

const PORT =
    process.env.PORT || 3000;

const SESSION_SECRET = process.env.SESSION_SECRET;

const __filename =
    fileURLToPath(import.meta.url);

const __dirname =
    path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'src', 'views'));

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 60 * 60 * 1000
  }
}));

app.use(flash);

// Middleware to log all incoming requests
app.use((req, res, next) => {
    if (NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
    }

    next();
});

// Middleware to make login status and user available to all templates
app.use((req, res, next) => {

    res.locals.isLoggedIn = false;

    if (
        req.session &&
        req.session.user
    ) {
        res.locals.isLoggedIn = true;
    }

    res.locals.user =
        req.session.user || null;

    res.locals.NODE_ENV = NODE_ENV;

    next();
});

// Use routes from src/routes.js
app.use('/', router);

// Catch-all route for 404 errors
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error occurred:', err.message);
    console.error('Stack trace:', err.stack);

    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';

    res.status(status).render(`errors/${template}`, {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        stack: err.stack
    });
});

app.listen(PORT, async () => {
    console.log(`Server is starting at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);

    const dbUrl = process.env.DB_URL || '';
    const isPlaceholder = !dbUrl || /(?:\.{3}|<|>)/.test(dbUrl);

    if (isPlaceholder) {
        console.warn('DB_URL is not set or looks like a placeholder; skipping database connection test.');
        return;
    }

    try {
        await testConnection();
        console.log('Database connection successful');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
});