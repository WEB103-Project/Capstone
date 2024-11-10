const passport = require('passport');
// Import required modules
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const pool = require('../db'); // Adjust path to your database connection file
require('dotenv').config();

//need to create a Users table

// Set up options for GitHub Strategy
const options = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: 'http://localhost:3002/auth/github/callback',
};

// The verify function to authenticate and add users to the database
const verify = async (accessToken, refreshToken, profile, callback) => {
  const {
    _json: { id, login, avatar_url },
  } = profile;

  // Extract user information into a new object
  const userData = {
    githubId: id,
    username: login,
    avatarUrl: avatar_url,
    accessToken,
  };

  try {
    // Check if the user already exists in the database
    const results = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [userData.username]
    );
    const user = results.rows[0];

    // If user is not found, insert a new one
    if (!user) {
      const insertResults = await pool.query(
        `INSERT INTO users (githubid, username, avatarurl, accesstoken)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [userData.githubId, userData.username, userData.avatarUrl, userData.accessToken]
      );

      const newUser = insertResults.rows[0];
      return callback(null, newUser);
    }

    // User exists, return the existing user
    return callback(null, user);
  } catch (error) {
    // Handle errors
    return callback(error);
  }
};

// Set up the GitHub Strategy with Passport
passport.use(new GitHubStrategy(options, verify));

// Serialize and deserialize user information for session management
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
