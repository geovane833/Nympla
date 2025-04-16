const bcryptjs = require("bcryptjs");
const User = require("../entities/User");

class UserServices {
  constructor(userResopository) {
    this.userResopository = userResopository;
  }
   async getAllUsers() {
      return await this.userResopository.getAllUsers();
     // return await "Listando todos os usuários";
    }

  async registerUser(data) {
    console.log(data);

    const cryptPassword = await bcryptjs.hash(data.password, 10);

    const user = new User( data.name, data.email, cryptPassword, data.birth );

   return await this.userResopository.registerUser(user);
   // return await user;
  }

  async autenticateUser(dataLogin) {
    const user = await this.userResopository.getUserByEmail(dataLogin.email);

    if(!user) {
      return {error: "User not found", code: 404};
    }

    const CorrectPassword = await bcryptjs.compare(dataLogin.password, user.password);

    if(!CorrectPassword){
       return {error: "Invalid Credentials", code: 401};
    }


    return { user };
  }

}

module.exports = UserServices;