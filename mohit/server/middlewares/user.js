import { verify } from 'jsonwebtoken';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if(authHeader && authHeader.split(' ')[0]!="Bearer"){
    return res.sendStatus(401)
  }
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); 
    req.user = user; 
    next();
  });
}

export default authenticateToken;