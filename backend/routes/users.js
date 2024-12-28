const express = require ('express');
const router = express.Router();
const db = require('../connection');

// Get all users
router.get('/', async (req, res) => {
    try {
        const results = db.promise().query('SELECT * FROM users');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a user by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [results] = await db.promise().query('SELECT * FROM users WHERE id ?', [id]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found'});
        }
        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new user
router.post('/', async (req, res) => {
    const { username, email, password_hash, bio } = req.body;
    try { 
        const [results] = await db.promise().query(
            'INSERT INTO users (username, email, password_hash, bio) VALUES (?, ?, ?, ?)',
            [username, email, password_hash, bio]
        );
        res.status(201).json({ message: 'User created!', userId: result.insertId});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// update user information
router.put('/:id', async(req, res) => {
    const { id } = req.params;
    const { username, email, bio } = req.body;
    try {
        const [results] = await db.promise().query(
            'UPDATE users SET username = ?, email = ?, bio = ? WHERE user_id = ?',
            [username, email, bio, id]
        );
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User updated succesfully'});
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
});

// Delete a user
router.delete('/:id', async (req, res) => { 
    const { id } = req.params;
    try {
        const [result] = await db.promise().query('DELETE FROM users WHERE user_id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully'});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
/*router.get('/', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) 
            return(500).json({ error : err.message });
            res.json(results);
    });
});

router.post('/', (req, res) => {
    const { username, email, password_hash, bio} = req.body;
    db.query(
        'INSERT INTO users (username, email, password_hash, bio) VALUES (?, ?, ?, ?)' [username, email, password_hash, bio],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message});
            res.status(201).json({ message: 'User created!', userId : result.insertId});
        }
    );
});
*/