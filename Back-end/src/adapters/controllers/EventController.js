const { Events } = require("pg");
const database = require("../../frameworks/pgDatabase");
const EventServices = require("../../services/EventServices");
const EventResopository = require("../repositories/EventRepository");

const eventResopository = new EventResopository(database);

/*Retrieve all users from the Database*/    
async function getAllEvents(request, reply) {

    const service = new EventServices(eventResopository);
    const replyService = await service.getAllEvents();

    if(replyService.error) {
        return reply.status(500).json({error: replyService.error});
    }
    reply.status(200).json({Events: replyService});
}


/* Função para criar um novo evento */
async function createEvent(request, reply) {
    const { title, description, date, image } = request.body;

    if (!title || !description || !date) {
        return reply.status(400).json({ error: "Campos obrigatórios estão faltando." });
    }

    let image_url = null;

    if (image) {
        if (image.startsWith("http://") || image.startsWith("https://")) {
            image_url = image;
        } else {
            return reply.status(400).json({ error: "Imagem inválida. Envie uma URL válida." });
        }
    }

    const service = new EventServices(eventResopository);
    const newEvent = await service.createEvent({ title, description, date, image_url });

    if (newEvent.error) {
        return reply.status(500).json({ error: newEvent.error });
    }

    return reply.status(201).json({ message: "Evento cadastrado com sucesso!", event: newEvent });
}

/* Função para excluir um evento */
async function deleteEvent(request, reply) {
    const { id } = request.params;

    const service = new EventServices(eventResopository);
    const deleted = await service.deleteEvent(id);

    if (deleted.error) {
        return reply.status(500).json({ error: deleted.error });
    }

    if (!deleted) {
        return reply.status(404).json({ error: "Evento não encontrado." });
    }

    return reply.status(200).json({ message: "Evento excluído com sucesso!" });
}

module.exports = { getAllEvents, createEvent, deleteEvent };