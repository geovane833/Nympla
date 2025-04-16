const SubscriptionServices = require("../../services/SubscriptionServices");
const SubscriptionRepository = require("../repositories/subscriptionRepository");
const database = require("../../frameworks/pgDatabase");

const subscriptionRepository = new SubscriptionRepository(database);
const subscriptionServices = new SubscriptionServices(subscriptionRepository);

async function subscriptionEvent(request, reply) {
    const { user_id, event_id } = request.body;

    if (!user_id || !event_id) {
        return reply.status(400).json({ error: "user_id e event_id são obrigatórios." });
    }

    const replyService = await subscriptionServices.subscriptionEvent({ user_id, event_id });

    if (replyService.error) {
        return reply.status(400).json({ error: replyService.error });
    }

    reply.status(201).json({ subscription: replyService });
}

// Função para recuperar as inscrições de um usuário
async function getUserSubscriptions(request, reply) {
    const { user_id } = request.params;  // user_id é passado como parâmetro da URL

    if (!user_id) {
        return reply.status(400).json({ error: "user_id é obrigatório." });
    }

    const replyService = await subscriptionServices.getUserSubscriptions(user_id);

    if (replyService.error) {
        return reply.status(400).json({ error: replyService.error });
    }

    reply.status(200).json({ subscriptions: replyService });
}

// Função para cancelar a inscrição de um usuário em um evento
async function cancelSubscriptionEvent(request, reply) {
    const { subscription_id } = request.params;  // subscription_id é passado na URL

    if (!subscription_id) {
        return reply.status(400).json({ error: "subscription_id é obrigatório." });
    }

    // Chama o serviço para cancelar a inscrição
    const replyService = await subscriptionServices.cancelSubscription(subscription_id);

    if (replyService.error) {
        return reply.status(400).json({ error: replyService.error });
    }

    reply.status(200).json({ message: replyService.message });
}




// Função para recuperar todas as inscrições
async function getAllSubscriptions(request, reply) {
    const replyService = await subscriptionServices.getAllSubscriptions();

    if (replyService.error) {
        return reply.status(400).json({ error: replyService.error });
    }

    reply.status(200).json({ subscriptions: replyService });
}

// Novo método no SubscriptionController para recuperar as inscrições e eventos
async function getSubscriptionsAndEvents(request, reply) {
    const { user_id } = request.params; 
    if (!user_id) {
        return reply.status(400).json({ error: "user_id é obrigatório." });
    }

    const replyService = await subscriptionServices.getSubscriptionsAndEvents(user_id);

    if (replyService.error) {
        return reply.status(400).json({ error: replyService.error });
    }

    reply.status(200).json({ subscriptions: replyService });
}

// Função para buscar uma inscrição pelo subscription_id (ex: via QR Code)
async function getSubscriptionById(request, reply) {
    const { subscription_id } = request.params;

    if (!subscription_id) {
        return reply.status(400).json({ error: "subscription_id é obrigatório." });
    }

    const replyService = await subscriptionServices.getSubscriptionById(subscription_id);

    if (replyService?.error) {
        return reply.status(404).json({ error: replyService.error });
    }

    reply.status(200).json({ subscription: replyService });
}


async function checkInSubscription(request, reply) {
    const { subscription_id } = request.params;

    if (!subscription_id) {
        return reply.status(400).json({ error: "subscription_id é obrigatório." });
    }

    const replyService = await subscriptionServices.checkInSubscription(subscription_id);

    if (replyService.error) {
        return reply.status(400).json({ error: replyService.error });
    }

    reply.status(200).json({ message: "Check-in realizado com sucesso!", subscription: replyService });
}

// Inscrições pendentes (sem check-in)
async function getPendingSubscriptions(request, reply) {
    const replyService = await subscriptionServices.getPendingSubscriptions(); // Chama o serviço para pegar inscrições pendentes

    if (replyService.error) {
        console.error('Erro ao recuperar as inscrições pendentes:', replyService.error);  // Log de erro
        return reply.status(400).json({ error: replyService.error });
    }

    console.log('Inscrições pendentes:', replyService);  // Log das inscrições pendentes
    reply.status(200).json({ subscriptions: replyService });
}



// Inscrições com check-in realizado
async function getDoneSubscriptions(request, reply) {
    // Chama o serviço para pegar inscrições com check-in "done"
    const replyService = await subscriptionServices.getDoneSubscriptions();

    // Verifica se houve erro no serviço
    if (replyService.error) {
        console.error('Erro ao recuperar as inscrições com check-in "done":', replyService.error);  // Log de erro
        return reply.status(400).json({ error: replyService.error });
    }

    // Log das inscrições "done" para verificar os dados retornados
    console.log('Inscrições com check-in "done":', replyService);

    // Retorna as inscrições com check-in "done" para o frontend
    reply.status(200).json({ subscriptions: replyService });
}


module.exports = { 
    subscriptionEvent, 
    getUserSubscriptions, 
    cancelSubscriptionEvent, 
    getAllSubscriptions, 
    getSubscriptionsAndEvents, 
    getSubscriptionById,
    checkInSubscription,
    getPendingSubscriptions,
    getDoneSubscriptions
};
