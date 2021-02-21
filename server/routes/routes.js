const router = require('express').Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const jwtGenerator = require('../utils/jwtGenerator');
const authorize =  require('../middleware/authorize');
const path = require('path');
const smtpTransport = require('nodemailer-smtp-transport');
const nodemailer = require('nodemailer')

require('dotenv').config();

const Task = require('../models/task.model');
const User = require('../models/user.model');

const { encryptPassword, matchPassword} = require('../utils/helpers');

let transporter = nodemailer.createTransport(smtpTransport({
  service:'gmail',
  host: 'smtp.gmail.com',
  auth: {
      user: 'tasksapp0@gmail.com',
      pass: 'tsapp0123'
  }

}));

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

//node mailer

router.post('/send', (req,res) => {
    let {email,subject,name, pass} = req.body;
/*
    var to = req.body.to,
    subject = req.body.subject,
    name = req.body.name;
    */
    contentHTML = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
        <div
          style="
            max-width: 625px;
            margin-top: 0;
            margin-left: auto;
            margin-bottom: 0;
            margin-right: auto;
          "
        >
          <table
            border="0"
            cellpadding="0"
            cellspacing="0"
            dir="ltr"
            id="m_-5660302303014568835m_22375324755315983container"
            style="
              border-collapse: collapse;
              border-bottom-style: none;
              border-right-style: none;
              border-top-style: none;
              border-left-style: none;
              color: #666666;
              font-family: Helvetica, Arial, sans-serif;
            "
            width="100%"
          >
            <tbody>
              <tr>
                <td
                  align="left"
                  id="m_-5660302303014568835m_22375324755315983preheaderRow"
                  style="
                    line-height: 1em;
                    text-align: left;
                    font-size: 12px;
                    padding-top: 0;
                    padding-right: 0;
                    padding-bottom: 12px;
                    padding-left: 0;
                  "
                ></td>
              </tr>
              <tr>
                <td
                  align="left"
                  id="m_-5660302303014568835m_22375324755315983logoRow"
                  style="
                    background-color: #f5f5f5;
                    line-height: 1em;
                    padding-bottom: 18px;
                    padding-left: 13px;
                    padding-right: 13px;
                    padding-top: 24px;
                    text-align: left;
                  "
                  valign="middle"
                >
                  <table
                    align="left"
                    cellpadding="0"
                    cellspacing="0"
                    id="m_-5660302303014568835m_22375324755315983logo"
                    style="
                      border-collapse: collapse;
                      border-bottom-style: none;
                      border-right-style: none;
                      border-top-style: none;
                      border-left-style: none;
                      color: #666666;
                      font-family: Helvetica, Arial, sans-serif;
                    "
                    width="200"
                  >
                    <tbody>
                      <tr>
                        <td
                          align="left"
                          style="line-height: 1em; text-align: left"
                          valign="middle"
                        >
                          <div
                            class="a6S"
                            dir="ltr"
                            style="opacity: 0.01; left: 165px; top: 200px"
                          >
                            <div
                              id=":28x"
                              class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q"
                              role="button"
                              tabindex="0"
                              aria-label="Descargar el archivo adjunto "
                              data-tooltip-class="a1V"
                              data-tooltip="Descargar"
                            >
                              <div class="akn">
                                <div class="aSK J-J5-Ji aYr"></div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table
                    align="right"
                    cellpadding="0"
                    cellspacing="0"
                    id="m_-5660302303014568835m_22375324755315983date"
                    style="
                      border-collapse: collapse;
                      color: #666666;
                      font-family: Helvetica, Arial, sans-serif;
                      font-size: 16px;
                      text-align: right !important;
                      border-top-style: none;
                      border-right-style: none;
                      border-bottom-style: none;
                      border-left-style: none;
                    "
                    width="289"
                  >
                    <tbody>
                      <tr>
                        <td
                          align="right"
                          id="m_-5660302303014568835m_22375324755315983Edition"
                          height="26"
                          style="
                            line-height: 1em;
                            text-align: right;
                            padding-top: 0;
                            padding-right: 30px;
                            padding-bottom: 0;
                            padding-left: 0;
                          "
                          valign="middle"
                        ></td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td
                  align="left"
                  id="m_-5660302303014568835m_-5652620174487763151m_22375324755315983contentRow"
                  style="
                    background-color: #f5f5f5;
                    line-height: 1em;
                    padding-bottom: 13px;
                    padding-left: 13px;
                    padding-right: 13px;
                    padding-top: 0;
                    text-align: left;
                    background: linear-gradient(
                      315deg,
                      rgba(2, 0, 36, 1) 0%,
                      rgba(9, 121, 71, 1) 35%,
                      rgba(0, 212, 255, 1) 100%
                    );
                  "
                >
                  <table
                    cellpadding="0"
                    cellspacing="0"
                    id="m_-5660302303014568835m_-5652620174487763151m_22375324755315983moduleContainer"
                    style="
                      border-collapse: collapse;
                      border-bottom-style: none;
                      border-right-style: none;
                      border-top-style: none;
                      border-left-style: none;
                      color: #666666;
                      font-family: Helvetica, Arial, sans-serif;
                    "
                    width="100%"
                  >
                    <tbody>
                      <tr>
                        <td
                          align="left"
                          style="
                            line-height: 1em;
                            text-align: left;
                            padding-bottom: 20px;
                          "
                        >
                          <table
                            cellpadding="0"
                            cellspacing="0"
                            style="
                              border-collapse: collapse;
                              color: #666666;
                              font-family: Helvetica, Arial, sans-serif;
                              border-top-color: #e9e9e9;
                              border-right-color: #e9e9e9;
                              border-bottom-color: #e9e9e9;
                              border-left-color: #e9e9e9;
                              border-top-style: solid;
                              border-right-style: solid;
                              border-bottom-style: solid;
                              border-left-style: solid;
                              border-top-width: 1px;
                              border-right-width: 1px;
                              border-bottom-width: 1px;
                              border-left-width: 1px;
                            "
                            width="100%"
                          >
                            <tbody>
                              <tr>
                                <td
                                  align="left"
                                  style="
                                    background-color: #ffffff;
                                    line-height: 1em;
                                    padding-bottom: 30px;
                                    padding-left: 31px;
                                    padding-right: 31px;
                                    padding-top: 30px;
                                    text-align: left;
                                  "
                                >
                                  <table
                                    cellpadding="0"
                                    cellspacing="0"
                                    style="
                                      border-collapse: collapse;
                                      border-bottom-style: none;
                                      border-right-style: none;
                                      border-top-style: none;
                                      border-left-style: none;
                                      color: #666666;
                                      font-family: Helvetica, Arial, sans-serif;
                                    "
                                    width="100%"
                                  >
                                    <tbody>
                                      <tr>
                                        <td
                                          align="left"
                                          id="m_-5660302303014568835m_-5652620174487763151m_22375324755315983IntroHeadline"
                                          style="
                                            line-height: 26px;
                                            text-align: left;
                                            font-size: 14px;
                                            font-weight: normal;
                                            padding-bottom: 10px;
                                          "
                                        >
                                          <span
                                            style="
                                              font-family: helvetica, arial,
                                                sans-serif;
                                              font-size: 14px;
                                            "
                                          >
                                            Hola, ${name} <br /><br />
                                            Gracias por registrarte en nuestra app.<br /><br />
                                            Nos complace que nos hayas elegido como apoyo
                                            para organizar tus actividades. <br /><br />
                                            Te enviamos tus credenciales de usuario, para que las
                                            memorices, si no lo necesitas elimina este correo.<br /><br />
                                            Datos:<br />
                                            email: ${email}<br />
                                            contraseña: ${pass}<br/><br/>
                                            Equipo de TasksApp</span
                                          ><br
                                            style="
                                              color: #666666;
                                              font-family: Verdana, Arial, Helvetica,
                                                sans-serif;
                                              font-size: 14px;
                                              font-style: normal;
                                              font-variant-ligatures: normal;
                                              font-variant-caps: normal;
                                              font-weight: normal;
                                              letter-spacing: normal;
                                              text-align: left;
                                              text-indent: 0px;
                                              text-transform: none;
                                              white-space: normal;
                                              word-spacing: 0px;
                                              background-color: #ffffff;
                                            "
                                          />
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td
                          align="left"
                          id="m_-5660302303014568835m_-5652620174487763151m_22375324755315983emailCopyright"
                          style="
                            line-height: 16px;
                            text-align: left;
                            padding-top: 0;
                            padding-right: 30px;
                            padding-bottom: 21px;
                            padding-left: 30px;
                          "
                        >
                          <a
                            style="color: white !important; text-decoration: none"
                            href="#m_-5660302303014568835_m_-5652620174487763151_m_22375324755315983_"
                            >© 2019 Indeportes Dirección..., CA 94043</a
                          >
                        </td>
                      </tr>
                      <tr>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="yj6qo"></div>
          <div class="adL"></div>
        </div>
      </body>
    </html>
  `;

  const mailOptions = {
      from: 'Tasks App',
      to: email,
      subject: subject,
      html: contentHTML
  };

  transporter.sendMail(mailOptions, (error, info) =>{
    if (error) {
      console.log(error);
      res.status(406).json({state:0, message:error});
    } else {
        console.log(`sent: ${info.message}`);
        res.json({state:1, message:'Correo enviado'})
    }
  })
})



// Tasks

router.post('/task', authorize, async (req,res) => {
    const { user_id } = req.body;
    const tasks = await Task.find({'user_id': user_id});
    res.json(tasks).status(200);
});

router.post('/task/add',authorize, /*upload.single('img'),*/ async(req,res) =>{
    const { name, priority, ven_date, user_id } = req.body;
    const img = '';
    const newTaskData = {
        name,
        img,
        priority,
        ven_date,
        user_id
    };

    const newTask = new Task(newTaskData);

    newTask.save()
    .then(() => res.json({msg: 'Task Added'}).status(200))
    .catch(err => {res.status(400).json(`Error: ${err}`); console.log(err);});
});

router.post('/task/edit/:id',authorize, async (req,res) => {
    const { name, priority, ven_date } = req.body;
    const { img } = await Task.findById(req.params.id);

    await Task.findByIdAndUpdate(req.params.id,{name,img,priority,ven_date});
    //const task = new Task({name,img,priority,ven_date});
    res.json({status: 'Task Saved'});
})

router.post('/task/delete/:id', authorize, async (req,res) => {
    await Task.findByIdAndRemove(req.params.id);
    res.json({status: 'Task Deleted'})
});

// User

router.post('/user',authorize, async (req,res) => {
    try {
      const { id } = req.body; 
        const user = await User.find({_id:id});
        res.json(user);
    } catch (err) {
        console.log(err.message);
    }
})

router.post('/auth/signup',async (req,res) => {
    try {
        const { email, name, pass } = req.body;
        //const db = await cnn();
        //const user = db.collection('users').find({"email": email});
        const user = await User.find({"email": email});

        if (user.length > 0) {
            return res.status(401).json({ msg: 'user already exists!'});
        }

        const password = await encryptPassword(pass);
/*
        let newUser = await db.collection('users').insertOne({
            name,
            email,
            password
        });
*/
        let newUser = await User.insertMany({
            name,
            email,
            password
        });
        
        const jwtToken = jwtGenerator(newUser._id);
        return res.json({ jwtToken, user_id: newUser._id }).status(200);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
});

router.post('/auth/login', async (req,res) => {
    try {
        const { email, pass} = req.body;

        const user = await User.find({"email": email});

        if(user.length === 0){
            return res.status(401).json({msg: 'Invalid Email'});
        }

        const validPassword = await matchPassword(pass, user[0].password);

        if (!validPassword) {
            return res.status(401).json({msg: 'Invalid Password'}); 
        }

        const jwtToken = jwtGenerator(user[0]._id);
        return res.json({ jwtToken, user_id: user[0]._id}).status(200);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
});

router.post('/auth/verify', authorize, (req,res) => {
    try {
        res.json({status:true})
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
})






module.exports = router;