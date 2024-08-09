import pkgCrypt from "bcryptjs";
import pkg from "jsonwebtoken";
import { validationResult } from "express-validator";
import Player from '../models/Player.js';
const { genSalt, hash, compare } = pkgCrypt; 
const { sign } = pkg;

const createUser = async (req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    try {
        let user = await Player.findOne({email: req.body.email.toLowerCase()});
        if(user){
            return res.status(400).json({ error: "Sorry, this user already exists!!" });
        }

        let userName = await Player.findOne({userName: req.body.userName});
        if(userName){
          return res.status(400).json({ error: "Sorry, this username has already taken!!" });
        }

        const salt = await genSalt(10);
        const securePass = await hash(req.body.password, salt);

        user = await Player.create({
            fullName: req.body.fullName,
            userName: req.body.userName,
            email: req.body.email.toLowerCase(),
            password: securePass,
          });
    
          const data = {
            user: {
              id: user.id,
            },
          };

          const token = sign(data, process.env.MY_SECRET_KEY);
          console.log(token);
          res.json({success: true, authtoken: token});

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal error occured");
    }
}

const loginUser = async (req, res) =>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  try{
    const { email, password } = req.body;

    const user = await Player.findOne({email: email.toLowerCase()});

    if(!user){
      return res.status(400).json({ error: "please enter correct details" });
    }

    const passwordCompare = await compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({ error: "please enter correct details" });
    }

    const data = {
      user: {
        id: user.id,
      },
    };

    const token = sign(data, process.env.MY_SECRET_KEY);
    console.log(token);
    res.json({ success: true, authtoken: token });

  } catch(error){
      console.log(error.message);
      res.status(500).send("Internal error occured");
  }
}

// const getUser = async (req, res) =>{
//   try {
//     const { user } = req;

//       if(!user){
//           return res.status(401).json({ success: false, message: 'User not authenticated' });
//       }

//       const player = await Player.findOne({})


//   } catch (error) {

//   }
// }

export default {createUser, loginUser};