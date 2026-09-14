import { jest } from '@jest/globals';
import request from 'supertest';

// Mock JWT
const mockVerify = jest.fn();
jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    verify: mockVerify,
  },
}));

let authMiddleware;

describe('Auth Middleware', () => {
    beforeAll(async () => {
        const module = await import('../../src/middleware/authMiddleware.js');
        authMiddleware = module.authMiddleware;
    });

    const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    test('should return 401 if authorization header is missing', () => {
        const req = {headers: {}};
        const res = mockResponse();
        const next = jest.fn();
        
        authMiddleware(req, res, next);
        
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Authorization header required' });
        expect(next).not.toHaveBeenCalled();
    });

    test('should return 401 if authorization header does not start with Bearer', () => {
        const req = {headers: {authorization: 'Basic test'}};
        const res = mockResponse();
        const next = jest.fn();

        authMiddleware(req, res, next);
            
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid authorization format' });
        expect(next).not.toHaveBeenCalled();
    });

    test('should return 401 if token is invalid', () => {
        mockVerify.mockImplementation(() => {
            throw new Error('Invalid token');
        });

        const req = {headers: {authorization: 'Bearer invalid_token'}};
        const res = mockResponse();
        const next = jest.fn();

        authMiddleware(req, res, next);
        
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
        expect(next).not.toHaveBeenCalled();
    });

    test('should call next if token is valid', () => {
        mockVerify.mockReturnValue({ id: 1, role: 'student' });

        const req = {headers: {authorization: 'Bearer valid_token'}};
        const res = mockResponse();
        const next = jest.fn();

        authMiddleware(req, res, next);
        
        expect(next).toHaveBeenCalled();
        expect(req.user).toBeDefined();
        expect(req.user).toMatchObject({ id: 1, role: 'student' });
        expect(res.status).not.toHaveBeenCalled();
    });
});