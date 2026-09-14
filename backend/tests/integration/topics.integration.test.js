import request from 'supertest';
import jwt from 'jsonwebtoken';
import { pool } from '../../src/db.js';
import app from '../../src/app.js';

const makeToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

describe('GET /topics - Integration Tests', () => {
    let teacherToken;
    let studentToken;

    beforeAll(async () => {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS topics (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL UNIQUE,
                subject VARCHAR(255) NOT NULL
            );
        `);

        await pool.query("DELETE FROM topics WHERE title LIKE 'Test Topic%'");
        await pool.query(`
            INSERT INTO topics (title, subject) VALUES
                ('Test Topic - Algebra Basics', 'Math'),
                ('Test Topic - Cell Biology', 'Biology'),
                ('Test Topic - World War II', 'History')
        `);

        teacherToken = makeToken({ id: 1, role: 'teacher' });
        studentToken = makeToken({ id: 2, role: 'student' });
    });

    afterAll(async () => {
        await pool.query("DELETE FROM topics WHERE title LIKE 'Test Topic%'");
        await pool.end();
    });

    test('returns 403 when the role is student', async () => {
        const response = await request(app)
            .get('/topics')
            .set('Authorization', `Bearer ${studentToken}`);

        expect(response.status).toBe(403);
    });

    test('returns 401 when no token is provided', async () => {
        const response = await request(app).get('/topics');

        expect(response.status).toBe(401);
    });

    test('returns all topics when the role is teacher', async () => {
        const response = await request(app)
            .get('/topics')
            .set('Authorization', `Bearer ${teacherToken}`);

        expect(response.status).toBe(200);
        const titles = response.body.map((topic) => topic.title);
        expect(titles).toEqual(expect.arrayContaining([
            'Test Topic - Algebra Basics',
            'Test Topic - Cell Biology',
            'Test Topic - World War II',
        ]));
    });

    test('returns only filtered topics when ?search= is provided', async () => {
        const response = await request(app)
            .get('/topics')
            .query({ search: 'biology' })
            .set('Authorization', `Bearer ${teacherToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].title).toBe('Test Topic - Cell Biology');
    });
});
