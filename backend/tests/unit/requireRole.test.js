import { jest } from '@jest/globals';
import { requireRole } from '../../src/middleware/requireRole.js';

describe('requireRole middleware', () => {
    const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    test('returns 403 when the user role does not match the required role', () => {
        const req = { user: { id: 1, role: 'student' } };
        const res = mockResponse();
        const next = jest.fn();

        requireRole('teacher')(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden' });
        expect(next).not.toHaveBeenCalled();
    });

    test('calls next when the user role matches the required role', () => {
        const req = { user: { id: 1, role: 'teacher' } };
        const res = mockResponse();
        const next = jest.fn();

        requireRole('teacher')(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });
});
