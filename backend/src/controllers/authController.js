import bcrypt from 'bcrypt';
import { pool } from '../db.js';
import jwt from 'jsonwebtoken';
import { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from '../../../constants.js';

export const register = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).send('Missing required fields');
    }
    if (role !== 'teacher' && role !== 'student') {
        return res.status(400).send('Invalid role');
    }
    // username length
    if (name.length < 3) {
        return res.status(400).send('Name must be at least 3 characters long');
    }
    // email format ?
   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
     return res.status(400).send('Invalid email format');
   }    
   if (password.length < MIN_PASSWORD_LENGTH) {
        return res.status(400).send(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
    }
    if (password.includes(' ')) {
        return res.status(400).send('Password cannot contain spaces');
    }
    if (password === password.toLowerCase()) {
        return res.status(400).send('Password must contain at least one uppercase letter');
    }
    if (password === password.toUpperCase()) {
        return res.status(400).send('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
        return res.status(400).send('Password must contain at least one number');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        return res.status(400).send('Password must contain at least one special character');
    }
    if (password.length > MAX_PASSWORD_LENGTH) {
        return res.status(400).send(`Password must be at most ${MAX_PASSWORD_LENGTH} characters long`);
    }

    //encrypt password
    const hashedPassword = bcrypt.hashSync(password, 10);
    //save user to database
    try {
        const newUser = await pool.query(
            'INSERT INTO users (name, email, password, role) \
            VALUES ($1, $2, $3, $4) RETURNING id, name, email, role', 
            [name, email, hashedPassword, role]
        );

        return res.status(201).json(newUser.rows[0]);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).send('Email already exists');
        }
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }
    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (!user.rows.length) {
            return res.status(401).send('Invalid email or password');
        }
        const isPasswordValid = await bcrypt.compare(password, user.rows[0].password);
        if (!isPasswordValid) {
            return res.status(401).send('Invalid email or password');
        }
        const token = jwt.sign({id: user.rows[0].id, role: user.rows[0].role}, process.env.JWT_SECRET, {expiresIn: '1h'});
        return res.status(200).json({token});
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
}


