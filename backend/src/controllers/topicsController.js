import { pool } from '../db.js';

export const getTopics = async (req,res) => {
    try{
        const { search } = req.query;
        let result;
        if (!search ){
            result = await pool.query("SELECT * FROM TOPICS")
        }
        else{
            result = await pool.query("SELECT * FROM TOPICS WHERE title ILIKE $1 ", ["%"+search+"%"])
        }
        return res.status(200).json(result.rows)
    }
    catch(err){
        return res.status(500).json({ message: "Server error"})
    }
}