class SubscriptionServices {
    constructor(subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }

    // Método para inscrever usuário no evento
    async subscriptionEvent({ user_id, event_id }) {
        try {
            const existingSubscription = await this.subscriptionRepository.findByUserAndEvent(user_id, event_id);
            if (existingSubscription) {
                return { error: "Usuário já inscrito neste evento." };
            }

            const subscription = await this.subscriptionRepository.create({ user_id, event_id });
            return subscription;
        } catch (error) {
            return { error: error.message };
        }
    }

    // Novo método para recuperar todas as inscrições de um usuário
    async getUserSubscriptions(user_id) {
        try {
            const subscriptions = await this.subscriptionRepository.findByUser(user_id);
            if (subscriptions.length === 0) {
                return { error: "Nenhuma inscrição encontrada para este usuário." };
            }
            return subscriptions;
        } catch (error) {
            return { error: error.message };
        }
    }

    // Método para cancelar inscrição
    async cancelSubscription(subscription_id) {
        try {
            const result = await this.subscriptionRepository.cancelSubscription(subscription_id);

            if (!result) {
                return { error: "Inscrição não encontrada." };
            }

            return { message: "Inscrição cancelada com sucesso!" };
        } catch (error) {
            return { error: error.message };
        }
    }
    
    // Método para recuperar todas as inscrições
    async getAllSubscriptions() {
        const subscriptions = await this.subscriptionRepository.getAll();
        
        if (!subscriptions || subscriptions.length === 0) {
            return { error: "Nenhuma inscrição encontrada." };
        }
    
        return subscriptions;
    }

    // Método para recuperar todas as inscrições e eventos de um usuário
    async getSubscriptionsAndEvents(user_id) {
        try {
            const subscriptions = await this.subscriptionRepository.findByUser(user_id);
            if (subscriptions.length === 0) {
                return { error: "Nenhuma inscrição encontrada para este usuário." };
            }
            return subscriptions; 
        } catch (error) {
            return { error: error.message };
        }
    }

    async getSubscriptionById(subscription_id) {
        try {
            const subscription = await this.subscriptionRepository.findById(subscription_id);
    
            if (!subscription) {
                return { error: "Inscrição não encontrada." };
            }
    
            return subscription;
        } catch (error) {
            return { error: "Erro ao buscar inscrição." };
        }
    }

    async checkInSubscription(subscription_id) {
        const result = await this.subscriptionRepository.updateCheckIn(subscription_id);
        if (!result) {
            return { error: "Inscrição não encontrada ou já com check-in." };
        }
        return result;
    }

    // Método para buscar check-ins pendentes (sem check-in)
    async getPendingSubscriptions() {
        try {
            const result = await this.subscriptionRepository.getPendingSubscriptions();  // Usando `this` para acessar o repositório
            console.log('Resultado das inscrições pendentes:', result);  // Verifique o que está sendo retornado
            return result;
        } catch (error) {
            console.error('Erro ao recuperar as inscrições pendentes:', error);  // Log de erro
            return { error: "Erro ao recuperar as inscrições pendentes." };
        }
    }
    
    // Método para buscar check-ins done
    async getDoneSubscriptions() {
        try {
            // Chama o método do repositório para buscar as inscrições com status 'done'
            const result = await this.subscriptionRepository.getDoneSubscriptions();  
            
            // Verifica se o resultado está vazio
            if (!result || result.length === 0) {
                console.log('Nenhuma inscrição com check-in "done" encontrada.');
                return { message: 'Nenhuma inscrição com check-in confirmado.' };
            }
            
            console.log('Resultado das inscrições "done":', result);  // Verifica o que está sendo retornado
            return result;
        } catch (error) {
            // Log detalhado de erro
            console.error('Erro ao recuperar as inscrições "done":', error);
            
            // Retorna um erro customizado para a aplicação
            return { error: "Erro ao recuperar as inscrições com check-in 'done'." };
        }
    }
    
}

module.exports = SubscriptionServices;
