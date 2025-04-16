class EventResopository {
    constructor(database) {
        this.database = database;
    }
    async getAllEvents() {
        try {
            const query = 'SELECT * FROM events';
            const reply = await this.database.query(query);

            return reply.rows;
        } catch (error) {
            return{error: error.message}
        }
    }

      /* Função para criar um evento */
      async createEvent(eventData) {
        const { title, description, date, image_url } = eventData;

        try {
            const query = 'INSERT INTO events (title, description, date, image_url) VALUES ($1, $2, $3, $4) RETURNING *';
            const values = [title, description, date, image_url];
            const reply = await this.database.query(query, values);

            return reply.rows[0]; // Retorna o evento criado
        } catch (error) {
            return { error: error.message };
        }
    }

    /* Função para excluir um evento */
    async deleteEvent(id) {
        try {
            const query = 'DELETE FROM events WHERE id = $1 RETURNING *';
            const values = [id];
            const reply = await this.database.query(query, values);

            if (reply.rowCount === 0) {
                return null; // Nenhum evento encontrado para deletar
            }

            return reply.rows[0]; // Retorna o evento excluído
        } catch (error) {
            return { error: error.message };
        }
    }

}

module.exports = EventResopository;