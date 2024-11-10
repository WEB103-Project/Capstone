import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { GitHub } from './config/auth.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import carRouter from '../routes/carRoutes.js';
import path from 'path';

const app = express();
const port = 3002;

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation',
    },
  },
  apis: ['./routes/*.js', './webpack/swagger-config.yaml'], // Path to API docs
};

// Swagger setup
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/apidoc', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,POST,PUT,DELETE,PATCH',
  credentials: true,
}));

// Set up express-session middleware
app.use(session({
  secret: 'codepath', // Secret key for session
  resave: false, // Don't save session if unmodified
  saveUninitialized: true, // Save uninitialized sessions
}));

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// Use the GitHub strategy
passport.use(GitHub);

// Serialize user to session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Routes
app.use('/api/cars', carRouter);

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the API!' });
});

// GitHub authentication route
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub callback route
app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

// Route to log out
app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
