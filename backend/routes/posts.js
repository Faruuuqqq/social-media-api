const express = require('express');
const router = express.Router();
const db = require('../connection');

// Get all posts
router.get('/', async (req, res) => {
    try {
        const [results] = await db.promise().query('SELECT * FROM posts');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a post by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [results] = await db.promise().query('SELECT * FROM posts WHERE post_id = ?', [id]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new post
router.post('/', async (req, res) => {
    const { user_id, content, image_url } = req.body;
    try {
        const [result] = await db.promise().query(
            'INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)',
            [user_id, content, image_url]
        );
        res.status(201).json({ message: 'Post created!', postId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a post
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { content, image_url } = req.body;
    try {
        const [result] = await db.promise().query(
            'UPDATE posts SET content = ?, image_url = ? WHERE post_id = ?',
            [content, image_url, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json({ message: 'Post updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a post
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.promise().query('DELETE FROM posts WHERE post_id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
