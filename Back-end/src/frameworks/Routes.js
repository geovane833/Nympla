const { Router } = require("express");
const UserController  = require("../adapters/controllers/UserController");
const EventController  = require("../adapters/controllers/EventController");
const SubscriptionController  = require("../adapters/controllers/SubscriptionController");
const Authenticate = require("./AuthenticateToken");
const Authorize = require("./AuthorizeUser");

const routes = Router();

/* usuários */
routes.get("/user/all", UserController.getAllUsers);
routes.post("/user/register", UserController.registerUser);
routes.post("/user/login", UserController.loginUser);

/* Authenticate Routes */
routes.post("/auth/profile", Authenticate, Authorize("user"), UserController.profileUser);
routes.post("/auth/admin", Authenticate, Authorize("admin"), UserController.adminUser);

/* eventos */
routes.get("/event/all", EventController.getAllEvents);
routes.post("/event/create", Authenticate, Authorize("admin"), EventController.createEvent); // Rota para cadastrar evento
routes.delete("/event/delete/:id", Authenticate, Authorize("admin"), EventController.deleteEvent); // Rota para excluir evento

/* inscrições */
routes.post("/event/Subscription", SubscriptionController.subscriptionEvent);

// Nova rota para recuperar as inscrições de um usuário
routes.get("/user/:user_id/subscriptions", Authenticate, Authorize("user"), SubscriptionController.getUserSubscriptions);

// Rota para cancelar a inscrição
routes.delete("/subscription/:subscription_id", Authenticate, Authorize("user"), SubscriptionController.cancelSubscriptionEvent);



// Nova rota para buscar todas as inscrições
routes.get("/subscription/all", SubscriptionController.getAllSubscriptions);

// Nova rota para recuperar as inscrições e os eventos de um usuário
routes.get("/subscription/user/:user_id", SubscriptionController.getSubscriptionsAndEvents);

// Rota para buscar uma inscrição pelo subscription_id (ex: via QR Code)
routes.get("/subscription/:subscription_id", SubscriptionController.getSubscriptionById);

routes.put("/subscription/:subscription_id/checkin", SubscriptionController.checkInSubscription);

// Rotas para check-ins pendentes e realizados
routes.get("/subscriptions/pending", SubscriptionController.getPendingSubscriptions);
routes.get("/subscriptions/done", SubscriptionController.getDoneSubscriptions);



module.exports = routes;
