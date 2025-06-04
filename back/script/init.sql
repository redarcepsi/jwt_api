Create table Users
(
    id varchar(150) PRIMARY KEY not null,
    email varchar(50) unique,
    password varchar(255)
);
Create table Articles
(
    id varchar(150) PRIMARY KEY not null,
    auteur varchar(150),
    titre varchar(255),
    contenu varchar(255),
    datePubli date
);