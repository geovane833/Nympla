const { request } = require("express");

function Authorize(roleAccess){
    return (request, reply, nextStage) => {
        if(request.user.userRole !== roleAccess) {
            return reply.status(403).json({error: "Access denied"});
        }
        nextStage();
    };
}

module.exports = Authorize;