const router = require('express').Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const jwtGenerator = require('../utils/jwtGenerator');
const authorize =  require('../middleware/authorize');
const cnn = require('../db');
const path = require('path');

const Task = require('../models/task.model');

const { encryptPassword, matchPassword} = require('../utils/helpers');

const {ObjectID} = require('mongodb');

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, 'images');
    },
    filename: function(req,file,cb){
        cb(null, `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req,file,cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

let upload = multer({storage, fileFilter});

router.post('/task/add', upload.single('img'), async(req,res) =>{
    const { img, name, priority, ven_date } = req.body;

    const newTaskData = {
        name,
        img,
        priority,
        ven_date
    };

    const newTask = new Task(newTaskData);

    newTask.save()
    .then(() => res.json('User Added'))
    .catch(err => res.status(400).json(`Error: ${err}`));
})

router.post('/auth/signup',async (req,res) => {
    try {
        const { email, name, pass } = req.body;
        const db = await cnn();
        const user = db.collection('users').find({"email": email});

        if (user.rows.length > 0) {
            return res.status(401).json("User already exist!");
        }

        const password = await encryptPassword(pass);

        let newUser = await db.collection('users').insertOne({
            name,
            email,
            password
        });

        const jwtToken = jwtGenerator(newUser.insertedId);

        return res.json({ jwtToken });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
});

router.post('/auth/login', async (req,res) => {
    const { email, name, pass} = req.body;
})






module.exports = router;