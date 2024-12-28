const express = require('express');
const router = express.Router();
const db = require('../connection');

// Get all comments
router.get('/', async (req, res) => {
    try {
        const [results] = await db.promise().query('SELECT * FROM comments');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get comments by post ID
router.get('/post/:postId', async (req, res) => {
    const { postId } = req.params;
    try {
        const [results] = await db.promise().query('SELECT * FROM comments WHERE post_id = ?', [postId]);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new comment
router.post('/', async (req, res) => {
    const { post_id, user_id, content } = req.body;
    try {
        const [result] = await db.promise().query(
            'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
            [post_id, user_id, content]
        );
        res.status(201).json({ message: 'Comment created!', commentId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a comment
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.promise().query('DELETE FROM comments WHERE comment_id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.json({ message: 'Comment deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
