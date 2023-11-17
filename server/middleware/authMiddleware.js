import jwt from "jsonwebtoken";


// Check if the Access Token is valid
const verifyToken = (req, res, next) => {
    
    const token = req.header('Authorization');
    
    //console.log("Verifying token: ", token);
    if (!token) {
        return res.status(401).json({ error: 'No token, authorization denied'});
    }

    // Check if bearer is undefined
    if (typeof token !== 'undefined') {
    // Split at the space
    const bearer = token.split(' ');
    
    // Get token from array
    const bearerToken = bearer[1];
    
    // Verify the token
    jwt.verify(bearerToken, process.env.ACCESS_TOKEN_SECRET, (err, authData) => {
      
      if(err) {
        // Unauthorized
        res.status(401).json({ error: 'Token is not valid'});
      } else {
        // Save authData to request for later use in route handler
        req.authData = authData;
        //console.log(authData)
        // Next middleware
        next();
      }
    });
  } else {
    // Unauthorized
    res.status(401).json({ error: 'Token verification failed'});
  }
    
}


// Check if user is authorized to access
const checkRole = (allowedRoles) => (req, res, next) => {
  const { role } = req.authData;

  if (!allowedRoles.includes(role)) {
    // Forbidden
    return res.status(403).json({ error: 'Forbidden: Insufficient role permission'});
  }

  next();

}


export { verifyToken, checkRole }