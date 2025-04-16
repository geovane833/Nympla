class UserResopository {
    constructor(database) {
        this.database = database;
    }
    async getAllUsers() {
        try {
            const query = 'SELECT * FROM users';
            const reply = await this.database.query(query);

            return reply.rows;
        } catch (error) {
            return{error: error.message}
        }
    }

    async registerUser(user) {
        try {
            const data = [user.name, user.email, user.password, user.birth];
            const query = 
            "insert into users (name, email, password, birth, role)"+
            "values ($1, $2, $3, $4, 'user') returning *";
            const reply = await this.database.query(query, data);

            return reply.rows;
        } catch (error) {
            return{error: error.message};
        }
    }

    async getUserByEmail(email) {
        try {
            const query = 'SELECT * FROM users WHERE email = $1';
            const reply = await this.database.query(query, [email]);

            return reply.rows[0];
        } catch (error) {
            return{error: error.message};
        }
    }
}

module.exports = UserResopository;