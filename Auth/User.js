// userRoute.js
import express from 'express';
import bodyParser from 'body-parser';
import connection from '../Connection.js';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const userRoute = express.Router();
userRoute.use(bodyParser.json());

// Configuration for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = './public/images';
    fs.mkdirSync(uploadDir, { recursive: true }); // Create directory if it doesn't exist
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Generate a unique filename
  }
});
const upload = multer({ storage: storage }).single('Image');

// Middleware for image upload
userRoute.post('/', upload, async (req, res) => {
    const { Username, Email, Password, Confirm, Name, FirstName, Address, Phone } = req.body;
    const role = 'user';

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(Password, 10);
        const hashedConfirm = await bcrypt.hash(Confirm, 10);

        // Get the path of the uploaded image
        const imagePath = req.file.path;

        const query = 'INSERT INTO User (Username, Email, Password, Confirm, Role, Image, Name, FirstName, Address, Phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        connection.query(query, [Username, Email, hashedPassword, hashedConfirm, role, imagePath, Name, FirstName, Address, Phone ], (err, result) => {
            if (err) {
                console.error('Error creating user:', err);
                return res.status(500).json({ message: 'Error creating user' });
            }
            console.log('User created successfully');

            // Construct the image URL
            const baseUrl = 'http://localhost:8081'; // Replace with the base URL of your server
            const imageUrl = baseUrl + '/images/' + req.file.filename;

            return res.status(201).json({ message: '', imageUrl });
        });
    } catch (error) {
        console.error('Error hashing password:', error);
        return res.status(500).json({ message: 'Error hashing password' });
    }
});

export { userRoute };
