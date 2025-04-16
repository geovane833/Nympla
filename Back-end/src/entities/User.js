class User{
    constructor(name, email, password, birth){
        this.id = 0;
        this.name = name;
        this.email = email;
        this.password = password;
        this.birth = birth;
        this.role = "user";
    }
}

module.exports = User;