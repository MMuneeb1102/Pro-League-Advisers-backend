import pkg from 'jsonwebtoken';
import dotenv from 'dotenv';
const { verify } = pkg
dotenv.config();

const fetchuser = (req, res, next) =>{
    try {
        const token = req.header('auth-token');
        if(!token){
            return res.status(401).send({error: "Please authenticate using a valid token"})
        }
        const data = verify(token, process.env.MY_SECRET_KEY);
        req.user = data.user;
        next();
    } catch (error) {
        return res.status(401).send({error: "Please authenticate using a valid token"});
    }
}

export default fetchuser;