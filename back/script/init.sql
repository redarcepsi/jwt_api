Create table Users
(
    id varchar(150) PRIMARY KEY not null,
    email varchar(50) unique,
    password varchar(255)
)