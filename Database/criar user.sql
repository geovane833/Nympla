create table users (
	id serial primary key,
	name varchar,
	email varchar unique,
	password varchar not null,
	birth date,
	role varchar
)

insert into users (name, email, password, birth, role)
values('Geovane', '190geo@gmail.com', '123', '16-12-1994', 'user');
insert into users (name, email, password, birth, role)
values('Geovane2', '2190@gmail.com', '123', '16-12-1994', 'user');
insert into users (name, email, password, birth, role)
values('Geovane3', '3190geo@gmail.com', '123', '16-12-1994', 'user');

select * from users

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    date TIMESTAMP NOT NULL,
    description TEXT,
    image_url VARCHAR
);

insert into events (title, date, description, image_url)
values('Symplifique Google: Tecnologia & Eventos', '2025-04-08 08:00:00', 'Evento presencial em Alterdata Matriz, Teresópolis - RJ', 'https://images.sympla.com.br/64bffb349a0e7-xs.jpg');
insert into events (title, date, description, image_url)
values('Show Campo - vitrine Tecnológica', '2025-04-13 08:00:00', 'Evento presencial em paraí, Paraí - RS', 'https://images.sympla.com.br/678ab777d0b5c-xs.jpg');

select * from events

create EXTENSION if NOT EXISTS "uuid-ossp";

create table subscriptions(
	id uuid primary key default uuid_generate_v4(),
	user_id int not null,
	event_id int not null,
	check_in varchar default 'pending',
	FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
	FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE,
	Unique(user_id, event_id)
)

insert into subscriptions (user_id)
