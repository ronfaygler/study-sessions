import request from 'supertest';
import { jest } from '@jest/globals';

// Mock the database pool
const mockQuery = jest.fn();
jest.unstable_mockModule('../../src/db.js', () => ({
  pool: {
    query: mockQuery,
  },
}));

// Mock bcrypt
jest.unstable_mockModule('bcrypt', () => ({
  default: {
    hashSync: jest.fn((password, salt) => 'hashed_password'),
    compare: jest.fn(),
  },
}));

// Mock JWT
jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    sign: jest.fn(() => 'mock_jwt_token'),
  },
}));

const app = (await import('../../src/app.js')).default;

describe('POST /auth/register', () => {
  beforeEach(() => {
    mockQuery.mockClear();
  });

  describe('Validation tests', () => {
    test('should return 400 if name is missing', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Test123!',
          role: 'student',
        });

      expect(response.status).toBe(400);
      expect(response.text).toBe('Missing required fields');
    });

    test('should return 400 if email is missing', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'John',
          password: 'Test123!',
          role: 'student',
        });

      expect(response.status).toBe(400);
      expect(response.text).toBe('Missing required fields');
    });

    test('should return 400 if password is missing', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'John',
          email: 'test@example.com',
          role: 'student',
        });

      expect(response.status).toBe(400);
      expect(response.text).toBe('Missing required fields');
    });

    test('should return 400 if role is invalid', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'John',
          email: 'test@example.com',
          password: 'Test123!',
          role: 'admin',
        });

      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid role');
    });

    test('should return 400 if name is less than 3 characters', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'Jo',
          email: 'test@example.com',
          password: 'Test123!',
          role: 'student',
        });

      expect(response.status).toBe(400);
      expect(response.text).toBe('Name must be at least 3 characters long');
    });

    test('should return 400 if email format is invalid', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'John',
          email: 'invalid-email',
          password: 'Test123!',
          role: 'student',
        });

      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid email format');
    });

    test('should return 400 if password is less than 6 characters', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'John',
          email: 'test@example.com',
          password: 'Test1',
          role: 'student',
        });

      expect(response.status).toBe(400);
      expect(response.text).toBe('Password must be at least 6 characters long');
    });

    test('should return 400 if password contains spaces', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'John',
          email: 'test@example.com',
          password: 'Test 123!',
          role: 'student',
        });

      expect(response.status).toBe(400);
      expect(response.text).toBe('Password cannot contain spaces');
    });

    test('should return 400 if password has no uppercase letter', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'John',
          email: 'test@example.com',
          password: 'test123!',
          role: 'student',
        });

      expect(response.status).toBe(400);
      expect(response.text).toBe('Password must contain at least one uppercase letter');
    });

    test('should return 400 if password has no lowercase letter', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'John',
          email: 'test@example.com',
          password: 'TEST123!',
          role: 'student',
        });

      expect(response.status).toBe(400);
      expect(response.text).toBe('Password must contain at least one lowercase letter');
    });

    test('should return 400 if password has no number', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'John',
          email: 'test@example.com',
          password: 'TestTest!',
          role: 'student',
        });

      expect(response.status).toBe(400);
      expect(response.text).toBe('Password must contain at least one number');
    });

    test('should return 400 if password has no special character', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'John',
          email: 'test@example.com',
          password: 'Test1234',
          role: 'student',
        });

      expect(response.status).toBe(400);
      expect(response.text).toBe('Password must contain at least one special character');
    });

    test('should return 400 if password is more than 20 characters', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'John',
          email: 'test@example.com',
          password: 'Test123!Test123!Test123!',
          role: 'student',
        });

      expect(response.status).toBe(400);
      expect(response.text).toBe('Password must be at most 20 characters long');
    });
  });

  describe('Database tests', () => {
    test('should return 400 if email already exists', async () => {
      mockQuery.mockRejectedValue({ code: '23505' });

      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'John',
          email: 'test@example.com',
          password: 'Test123!',
          role: 'student',
        });

      expect(response.status).toBe(400);
      expect(response.text).toBe('Email already exists');
    });

    test('should return 500 on database error', async () => {
      mockQuery.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'John',
          email: 'test@example.com',
          password: 'Test123!',
          role: 'student',
        });

      expect(response.status).toBe(500);
      expect(response.text).toBe('Internal Server Error');
    });

    test('should return 201 on successful registration', async () => {
      const mockUser = {
        id: 1,
        name: 'John',
        email: 'test@example.com',
        role: 'student',
      };
      mockQuery.mockResolvedValue({ rows: [mockUser] });

      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'John',
          email: 'test@example.com',
          password: 'Test123!',
          role: 'student',
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockUser);
      expect(response.body).not.toHaveProperty('password');
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        expect.arrayContaining([
          'John',
          'test@example.com',
          expect.any(String),
          'student',
        ])
      );
    });
  });
});

describe('POST /auth/login', () => {
  beforeEach(() => {
    mockQuery.mockClear();
  });

  describe('Validation tests', () => {
    test('should return 400 if email is missing', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          password: 'Test123!',
        });

      expect(response.status).toBe(400);
      expect(response.text).toBe('Email and password are required');
    });

    test('should return 400 if password is missing', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
        });

      expect(response.status).toBe(400);
      expect(response.text).toBe('Email and password are required');
    });

    test('should return 400 if both email and password are missing', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.text).toBe('Email and password are required');
    });
  });

  describe('Authentication tests', () => {
    test('should return 401 if user not found', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Test123!',
        });

      expect(response.status).toBe(401);
      expect(response.text).toBe('Invalid email or password');
    });

    test('should return 401 if password is invalid', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed_password',
        role: 'student',
      };
      mockQuery.mockResolvedValue({ rows: [mockUser] });
      
      const bcrypt = await import('bcrypt');
      bcrypt.default.compare.mockResolvedValue(false);

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword!',
        });

      expect(response.status).toBe(401);
      expect(response.text).toBe('Invalid email or password');
    });

    test('should return 200 with token on successful login', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed_password',
        role: 'student',
      };
      mockQuery.mockResolvedValue({ rows: [mockUser] });
      
      const bcrypt = await import('bcrypt');
      bcrypt.default.compare.mockResolvedValue(true);

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Test123!',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.token).toBe('mock_jwt_token');
    });
  });

  describe('Database error handling', () => {
    test('should return 500 on database error', async () => {
      mockQuery.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Test123!',
        });

      expect(response.status).toBe(500);
      expect(response.text).toBe('Internal Server Error');
    });
  });
});
