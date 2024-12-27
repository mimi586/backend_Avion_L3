import express from 'express';
import connection from '../Connection.js';

const getSelectRoute = express.Router();

getSelectRoute.get('/:userId/image', async (req, res) => {
    const userId = req.params.userId;
    try {
        const query = 'SELECT * FROM User WHERE Id = ?';
        connection.query(query, [userId], (err, result) => {
            if (err) {
                console.error('Error fetching user image:', err);
                return res.status(500).json({ message: 'Error fetching user image' });
            }
            if (result.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
            const imageUrl = result[0].Image;

            // Construct the image URL
            const baseUrl = 'http://localhost:8081'; // Replace with the base URL of your server
            const imageURL = baseUrl + "/" + imageUrl;
            return res.status(200).json({ imageUrl: imageURL });
        });
    } catch (error) {
        console.error('Error fetching user image:', error);
        return res.status(500).json({ message: 'Error fetching user image' });
    }
});


export { getSelectRoute };
