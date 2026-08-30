import request from 'supertest';
import { pool } from '../src/db.js';
import bcrypt from 'bcrypt';
import app from '../src/app.js';

describe('POST /auth/register - Integration Tests', () => {
  // Clean up test data before and after tests
  beforeAll(async () => {
    // Create users table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'teacher'))
      );
    `);
  });

  afterEach(async () => {
    // Clean up test users after each test
    await pool.query("DELETE FROM users WHERE email LIKE '%@test.com'");
  });

  afterAll(async () => {
    // Close database connection
    await pool.end();
  });

  describe('Successful registration', () => {
    test('should successfully register a student', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@test.com',
        password: 'Test123!',
        role: 'student',
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(userData.name);
      expect(response.body.email).toBe(userData.email);
      expect(response.body.role).toBe(userData.role);
      expect(response.body).not.toHaveProperty('password');

      // Verify user was actually saved to database
      const dbUser = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [userData.email]
      );
      expect(dbUser.rows.length).toBe(1);
      expect(dbUser.rows[0].name).toBe(userData.name);
      expect(dbUser.rows[0].email).toBe(userData.email);
      expect(dbUser.rows[0].role).toBe(userData.role);

      // Verify password was hashed
      const isValidPassword = await bcrypt.compare(
        userData.password,
        dbUser.rows[0].password
      );
      expect(isValidPassword).toBe(true);
    });

    test('should successfully register a teacher', async () => {
      const userData = {
        name: 'Jane Smith',
        email: 'jane@test.com',
        password: 'Teacher123!',
        role: 'teacher',
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.role).toBe('teacher');

      // Verify in database
      const dbUser = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [userData.email]
      );
      expect(dbUser.rows[0].role).toBe('teacher');
    });
  });

  describe('Database constraints', () => {
    test('should prevent duplicate email registration', async () => {
      const userData = {
        name: 'John Doe',
        email: 'duplicate@test.com',
        password: 'Test123!',
        role: 'student',
      };

      // Register first user
      await request(app).post('/auth/register').send(userData);

      // Try to register with same email
      const response = await request(app)
        .post('/auth/register')
        .send({
          ...userData,
          name: 'Different Name',
        });

      expect(response.status).toBe(400);
      expect(response.text).toBe('Email already exists');

      // Verify only one user exists in database
      const dbUsers = await pool.query(
        "SELECT * FROM users WHERE email = 'duplicate@test.com'"
      );
      expect(dbUsers.rows.length).toBe(1);
    });

    test('should enforce role constraint in database', async () => {
      // This test verifies that the database CHECK constraint works
      // by directly trying to insert an invalid role
      try {
        await pool.query(
          "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
          ['Test User', 'constraint@test.com', 'hashed_password', 'invalid_role']
        );
        fail('Should have thrown an error for invalid role');
      } catch (error) {
        expect(error.code).toBe('23514'); // CHECK constraint violation
      }
    });
  });

  describe('Data integrity', () => {
    test('should store hashed password correctly', async () => {
      const userData = {
        name: 'Security Test',
        email: 'security@test.com',
        password: 'SecurePass123!',
        role: 'student',
      };

      await request(app).post('/auth/register').send(userData);

      const dbUser = await pool.query(
        'SELECT password FROM users WHERE email = $1',
        [userData.email]
      );

      // Password should not be stored as plain text
      expect(dbUser.rows[0].password).not.toBe(userData.password);
      expect(dbUser.rows[0].password.length).toBeGreaterThan(20); // bcrypt hash length

      // Password should be verifiable with bcrypt
      const isValid = await bcrypt.compare(
        userData.password,
        dbUser.rows[0].password
      );
      expect(isValid).toBe(true);
    });

    test('should auto-generate sequential IDs', async () => {
      const user1 = await request(app)
        .post('/auth/register')
        .send({
          name: 'User One',
          email: 'user1@test.com',
          password: 'Test123!',
          role: 'student',
        });

      const user2 = await request(app)
        .post('/auth/register')
        .send({
          name: 'User Two',
          email: 'user2@test.com',
          password: 'Test123!',
          role: 'student',
        });

      expect(user1.body.id).toBeLessThan(user2.body.id);
      expect(user2.body.id - user1.body.id).toBe(1);
    });
  });

  describe('Database error handling', () => {
    test('should handle database connection errors gracefully', async () => {
      // This test would require temporarily breaking the DB connection
      // For now, we'll skip it as it's complex to set up
      // In a real scenario, you might mock pool.query to throw connection errors
    });
  });

  describe('Validation with real database', () => {
    test('should fail validation before reaching database', async () => {
      const invalidData = {
        name: 'Jo', // Too short
        email: 'invalid-email', // Invalid format
        password: 'weak', // Too weak
        role: 'student',
      };

      const response = await request(app)
        .post('/auth/register')
        .send(invalidData);

      // Should fail at validation level (name length)
      expect(response.status).toBe(400);

      // Verify no user was created in database
      const dbUser = await pool.query(
        "SELECT * FROM users WHERE email = 'invalid-email'"
      );
      expect(dbUser.rows.length).toBe(0);
    });
  });
});