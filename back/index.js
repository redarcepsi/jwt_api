import pool from './db.js'
import express from 'express'
import {v4 as uuidv4} from 'uuid';
import jwt from 'jsonwebtoken';

const app = express()
const port = 3000

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World! test')
})
app.post('/register', async (req, res) => {
    let id = uuidv4();
    const {email, password} = req.body;
    let emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (typeof(email)==="string" && typeof(password)==="string" && email.match(emailFormat)) {
        try {
            await pool.query('INSERT INTO Users VALUES ($1,$2,$3)', [id,email,password])
            res.status(201).json({message:"User created"});
        }catch (error) {
            if (error.message.includes("duplicate key value violates unique")){
                res.status(409).json({message:"Utilisateur déjà existant"})
            }else{
                res.status(400).json({message:"Bad request"});
            }
        }
    }else{
        res.status(400).json({message:"Bad request"});
    }
})
app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    let emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (typeof(email)==="string" && typeof(password)==="string" && email.match(emailFormat)) {
        const nb_user = await pool.query('SELECT email,id FROM Users WHERE email=$1 and password=$2', [email,password])
        if (nb_user.rowCount===1){
            const token = jwt.sign({"id":nb_user.rows[0].id,"email":nb_user.rows[0].email},"JWT_SECRET");
            res.status(200).json({"acces_token":token})
        }else {
            res.status(404).json({message:"User not found"})
        }
    }else{
        res.status(400).json({message:"Bad request"});
    }
})
app.get('/profile', async (req, res) => { // info de l'utilisateur
    let token = req.headers.authorization
    let verif 
    try {
        let shorttoken = token.substring(7)
        verif = jwt.verify(shorttoken,"JWT_SECRET")
        if (verif){
            let dbdata = await pool.query(`select id, email, password from Users where Users.id = $1 and Users.email = $2 limit 1`, [verif.id, verif.email])
            if (dbdata.rowCount <=0) {res.status(404).json({message:"not found"})}
            res.status(200).json({
                id: dbdata.rows[0].id,
                email: dbdata.rows[0].email,
                password: dbdata.rows[0].password
            });
        }
        else {
            res.status(401).json({message:"Unauthorized"})
        }
    } catch (error) {
        res.status(401).json({message:"Unauthorized"})
    }
    
    
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})