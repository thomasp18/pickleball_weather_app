-- players table
CREATE TABLE players (
	id SERIAL,
	pname VARCHAR(64) NOT NULL,
	PRIMARY KEY (id)
);

-- matches table
CREATE TABLE matches (
	id SERIAL,
	mdate DATE NOT NULL, 
	ascore INT NOT NULL,
	bscore INT NOT NULL,
	PRIMARY KEY (id)
);

-- matches-players-rel
CREATE TABLE matches_players_rel (
	id SERIAL,
	match_id INT NOT NULL,
	player_id INT NOT NULL,
	team VARCHAR(64) NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (match_id) REFERENCES matches(id),
	FOREIGN KEY (player_id) REFERENCES players(id)
);

-- schedule
CREATE TABLE schedule (
	id SERIAL,
	sdate DATE NOT NULL,
	PRIMARY KEY (id)
);


-- example data
INSERT INTO PLAYERS (id, pname)
VALUES
(1, 'Alex'),
(2, 'Jo'),
(3, 'Jonah'),
(4, 'Kevin'),
(5, 'Thomas');

INSERT INTO MATCHES (id, mdate, ascore, bscore)
VALUES
(1, '2024-10-31', 11, 0),
(2, '2024-11-01', 11, 9),
(3, '2024-11-02', 5, 11),
(4, '2024-11-03', 10, 12);

INSERT INTO MATCHES_PLAYERS_REL (match_id, player_id, team)
VALUES
(1, 1, 'a'),
(1, 2, 'a'),
(1, 3, 'b'),
(1, 4, 'b'),
(2, 5, 'a'),
(2, 1, 'a'),
(2, 2, 'b'),
(2, 3, 'b'),
(3, 4, 'a'),
(3, 5, 'b'),
(4, 2, 'a'),
(4, 1, 'a'),
(4, 5, 'b'),
(4, 3, 'b');

INSERT INTO SCHEDULE (sdate)
VALUES 
('2024-10-29'),
('2024-10-31'),
('2024-11-02'),
('2024-11-05'),
('2024-11-06');