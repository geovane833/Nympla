class Event{
    constructor(title, date, description, image_url){
        this.id = 0;
        this.title = title;
        this.date = date;
        this.description = description;
        this.image_url = image_url;
    }
}

module.exports = Event;