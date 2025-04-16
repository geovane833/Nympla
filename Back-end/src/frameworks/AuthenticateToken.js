const jwt = require("jsonwebtoken");

function Authenticate(request, reply, nextStage) {
    const token = request.headers.authorization?.split(" ")[1];

    console.log("token: " + token);

    if(!token) {
        return reply.status(404).json({error: "Token not found"});
    }

    try{
        
        const decoder = jwt.verify(token, process.env.SECRET_KEY);
        console.log(decoder); 

        request.user = decoder;

        nextStage();
    } catch (error) {
        return reply.status(401).json({error: "Invalid token"});
    }

   
}

module.exports = Authenticate;