DROP DATABASE IF EXISTS WebWizMonitor;
CREATE DATABASE WebWizMonitor;
USE WebWizMonitor;

CREATE TABLE users (
    Id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    profile_picture VARCHAR(255),
    name VARCHAR(64) NOT NULL,
    password VARCHAR(128) NOT NULL,
    email VARCHAR(128) NOT NULL,
    status INT NOT NULL
);

CREATE TABLE apps (
    Id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    name VARCHAR(64) NOT NULL,
    app_picture VARCHAR(255),
    status INT NOT NULL,
    uptime DOUBLE NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(Id)
);

CREATE TABLE endpoints (
    Id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    url VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    request_interval INT NOT NULL,
    status INT NOT NULL,
    uptime DOUBLE NOT NULL,
    app_id INT NOT NULL,
    FOREIGN KEY (app_id) REFERENCES apps(Id)
);

CREATE TABLE bugs (
    Id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    description VARCHAR(512),
    app_id INT NOT NULL,
    status INT NOT NULL, -- 0 not rezolved , 1 rezolved
    FOREIGN KEY (app_id) REFERENCES apps(Id)
);

-- -- tracks bad requests
-- CREATE TABLE App_status (
--     Id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
--     time DATETIME NOT NULL,
--     app_id INT NOT NULL,
--     FOREIGN KEY (app_id) REFERENCES apps(Id)
-- )