import { jest } from '@jest/globals';

const mockQuery = jest.fn();
jest.unstable_mockModule('../../src/db.js', () => ({
    pool: { query: mockQuery },
}));

let getTopics;

describe('getTopics controller', () => {
    beforeAll(async () => {
        const module = await import('../../src/controllers/topicsController.js');
        getTopics = module.getTopics;
    });

    beforeEach(() => {
        mockQuery.mockReset();
    });

    const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    test('returns all topics when no search query is provided', async () => {
        const topics = [
            { id: 1, title: 'Algebra Basics', subject: 'Math' },
            { id: 2, title: 'Cell Biology', subject: 'Biology' },
        ];
        mockQuery.mockResolvedValue({ rows: topics });

        const req = { query: {}, user: { id: 1, role: 'teacher' } };
        const res = mockResponse();

        await getTopics(req, res);

        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(topics);
    });

    test('returns only filtered topics when a search query is provided', async () => {
        const filtered = [{ id: 2, title: 'Cell Biology', subject: 'Biology' }];
        mockQuery.mockResolvedValue({ rows: filtered });

        const req = { query: { search: 'biology' }, user: { id: 1, role: 'teacher' } };
        const res = mockResponse();

        await getTopics(req, res);

        expect(mockQuery).toHaveBeenCalledTimes(1);
        const [, params] = mockQuery.mock.calls[0];
        expect(params).toEqual(expect.arrayContaining([expect.stringContaining('biology')]));
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(filtered);
    });

    test('returns 500 when the database query fails', async () => {
        mockQuery.mockRejectedValue(new Error('DB error'));

        const req = { query: {}, user: { id: 1, role: 'teacher' } };
        const res = mockResponse();

        await getTopics(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});
