const database = require("../../frameworks/pgDatabase");
const UserServices = require("../../services/UserServices");
const UserResopository = require("../repositories/UserRepository");
const jwt = require("jsonwebtoken");

const userResopository = new UserResopository(database);

/*Retrieve all users from the Database*/    
async function getAllUsers(request, reply) {

    const service = new UserServices(userResopository);
    const replyService = await service.getAllUsers();

    if(replyService.error) {
        return reply.status(500).json({error: replyService.error});
    }
    reply.status(200).json({users: replyService});
}

/*Resgister user in the Database*/
async function registerUser(request, reply) {

    const data = request.body;
    const service = new UserServices(userResopository);
    const replyService = await service.registerUser(data);

    if(replyService.error) {
        return reply.status(500).json({error: replyService.error});
    }

    reply.status(201).json({status: replyService});

}

/*Login user in the Database*/
async function loginUser(request, reply) {
    const dataLogin = request.body;
    const service = new UserServices(userResopository);
    const replyService = await service.autenticateUser(dataLogin);

    if(replyService.error) 
        return reply.status(replyService.code).json({error: replyService.error});

    const payload = {
        userId: replyService.user.id,
        userRole: replyService.user.role,
        name: replyService.user.name,
    };
    
    const token = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: "5m"});

    //TODO: redirecionar o usuario
    let redirect = "";
    if(replyService.user.role === "admin"){
        redirect = "admin.html";
    } else {
        redirect = "profile.html";
    }

    reply.status(200).json({token, redirect});
}

async function profileUser(request, reply){
    const user = request.user; // esse 'user' vem do token

    reply.json({
        id: user.userId,
        role: user.userRole,
        name: user.name,
    });
}



async function adminUser(request, reply){
    const user = request.user; // esse 'user' vem do token

    reply.json({
        id: user.userId,
        role: user.userRole,
        name: user.name,
    });
}

module.exports = { getAllUsers, registerUser, loginUser, profileUser, adminUser };