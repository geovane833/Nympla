class SubscriptionRepository 
{
        constructor(database) {
            this.database = database;
        }

        async create({ user_id, event_id }) {
            try {
                const query = `
                    INSERT INTO subscriptions (user_id, event_id)
                    VALUES ($1, $2)
                    RETURNING *;
                `;
                const values = [user_id, event_id];
                const reply = await this.database.query(query, values);

                return reply.rows[0];
            } catch (error) {
                return { error: error.message };
            }
        }

        async findByUserAndEvent(user_id, event_id) {
            try {
                const query = `
                    SELECT * FROM subscriptions
                    WHERE user_id = $1 AND event_id = $2;
                `;
                const values = [user_id, event_id];
                const reply = await this.database.query(query, values);

                return reply.rows[0];
            } catch (error) {
                return { error: error.message };
            }
        }

        // Novo método para buscar todas as inscrições de um usuário
        async findByUser(user_id) {
            try {
                const query = `
                    SELECT 
                        s.id AS subscription_id, 
                        s.check_in, 
                        e.id AS event_id,
                        e.title,
                        e.date,
                        e.description,
                        e.image_url,
                        u.name AS user_name
                    FROM subscriptions s
                    JOIN events e ON s.event_id = e.id
                    JOIN users u ON s.user_id = u.id 
                    WHERE s.user_id = $1;
                `;
                const values = [user_id];
                const reply = await this.database.query(query, values);
        
                return reply.rows;  // Retorna todas as inscrições com dados do evento e nome do usuário
            } catch (error) {
                return { error: error.message };
            }
        }    

        // Método para cancelar inscrição
        async cancelSubscription(subscription_id) {
            try {
                const query = 'DELETE FROM subscriptions WHERE id = $1 RETURNING *';
                const values = [subscription_id];
                const result = await this.database.query(query, values);

                // Retorna o registro excluído se for encontrado
                return result.rowCount > 0 ? result.rows[0] : null;
            } catch (error) {
                console.error("Erro ao excluir inscrição:", error);
                throw error;
            }
        }

        // Novo método para buscar todas as inscrições
        async getAll() {
            try {
                const query = `
                    SELECT 
                        s.id AS subscription_id, 
                        s.check_in, 
                        e.id AS event_id,
                        e.title,
                        e.date,
                        e.description,
                        e.image_url,
                        u.id AS user_id,
                        u.name AS user_name
                    FROM subscriptions s
                    JOIN events e ON s.event_id = e.id
                    JOIN users u ON s.user_id = u.id;
                `;
                const reply = await this.database.query(query);
                
                return reply.rows;
            } catch (error) {
                return { error: error.message };
            }
        }

        // Novo método para buscar inscrições e eventos de um usuário
        async findByUser2(user_id) {
            try {
                const query = `
                    SELECT 
                        s.id AS subscription_id, 
                        e.id AS event_id,  
                        e.title AS event_name  
                    FROM subscriptions s
                    JOIN events e ON s.event_id = e.id 
                    WHERE s.user_id = $1; 
                `;
                const values = [user_id];
                const reply = await this.database.query(query, values);
        
                return reply.rows;  // Retorna a inscrição e o nome do evento
            } catch (error) {
                return { error: error.message };
            }
        }
    
        // Buscar inscrição pelo subscription_id
        async findById(subscription_id) {
            try {
                const query = `
                    SELECT 
                        s.id AS subscription_id,
                        s.check_in,
                        e.id AS event_id,
                        e.title,
                        e.date,
                        e.description,
                        e.image_url,
                        u.id AS user_id,
                        u.name AS user_name
                    FROM subscriptions s
                    JOIN events e ON s.event_id = e.id
                    JOIN users u ON s.user_id = u.id
                    WHERE s.id = $1;
                `;
                const values = [subscription_id];
                const reply = await this.database.query(query, values);
    
                return reply.rows[0];  // Retorna um único resultado
            } catch (error) {
                return { error: error.message };
            }
        }
    
        // Atualiza o check-in para 'done' se ainda estiver como 'pending'
async updateCheckIn(subscription_id) {
    try {
        const query = `
            UPDATE subscriptions
            SET check_in = 'done'
            WHERE id = $1 AND check_in != 'done'
            RETURNING *;
        `;
        const values = [subscription_id];
        const result = await this.database.query(query, values);

        return result.rowCount > 0 ? result.rows[0] : null;
    } catch (error) {
        return { error: error.message };
    }
}

// Método para buscar check-ins pendentes
async getPendingSubscriptions() {
    try {
        const query = `
            SELECT 
                s.id AS subscription_id, 
                s.check_in, 
                u.name AS user_name, 
                u.email, 
                e.title AS event_title, 
                e.date AS event_date,
                e.description AS event_description,  -- Adicionando a descrição
                e.image_url AS event_image_url       -- Adicionando a imagem
            FROM subscriptions s
            JOIN users u ON s.user_id = u.id
            JOIN events e ON s.event_id = e.id
            WHERE s.check_in = 'pending';
        `;
        const { rows } = await this.database.query(query);
        return rows;  // Retorna as inscrições pendentes
    } catch (error) {
        console.error('Erro ao consultar inscrições pendentes:', error);
        throw error;
    }
}

// Método para buscar check-ins done
async getDoneSubscriptions() {
    try {
        const query = `
            SELECT 
                s.id AS subscription_id, 
                s.check_in, 
                u.name AS user_name, 
                u.email, 
                e.title AS event_title, 
                e.date AS event_date,
                e.description AS event_description,  
                e.image_url AS event_image_url     
            FROM subscriptions s
            JOIN users u ON s.user_id = u.id
            JOIN events e ON s.event_id = e.id
            WHERE s.check_in = 'done';
        `;

        const { rows } = await this.database.query(query);
        
        // Verificando se a consulta retornou resultados
        if (rows.length === 0) {
            console.log('Nenhuma inscrição com check-in confirmado.');
        }
        
        return rows;  // Retorna as inscrições com check-in 'done'
    } catch (error) {
        console.error('Erro ao consultar inscrições com check-in "done":', error);
        throw error;
    }
}

    
}

module.exports = SubscriptionRepository;
