const event = require("../entities/Event");

class EventServices {
  constructor(eventResopository) {
    this.eventResopository = eventResopository;
  }
   async getAllEvents() {
      return await this.eventResopository.getAllEvents();
     // return await "Listando todos os eventos";
    }

    /* Função para criar um evento */
  async createEvent(eventData) {
    return await this.eventResopository.createEvent(eventData);
  }

  /* Função para excluir um evento */
  async deleteEvent(id) {
    return await this.eventResopository.deleteEvent(id);
  }
}

module.exports = EventServices;