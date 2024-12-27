import express from 'express';
import bodyParser from 'body-parser';
import connection from '../Connection.js';

const User_UpdateRoute = express.Router();
User_UpdateRoute.use(bodyParser.json());

User_UpdateRoute.put('/update_user/:id',  (req, res) => {

    const {   Username, Email, Name, FirstName, Address, Phone } = req.body;
    const id = req.params.id;

    const query = 'UPDATE User SET Username = ?, Email = ?, Name = ?, FirstName = ?, Address = ?, Phone = ? WHERE Id = ?';
    connection.query(query, [Username, Email, Name, FirstName, Address, Phone, id], (err, result) => {
        if (err) {
            console.error('Error updating user information:', err);
            return res.status(500).json({ message: 'Error updating user information' });
        }
    });
});

export { User_UpdateRoute };