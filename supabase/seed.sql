insert into teams (name, conference, division, logo_url)
values ('Cincinatti Bengals', 'AFC', 'North', 'bengals.png'), ('Baltimore Ravens', 'AFC', 'North', 'ravens.png'), ('Pittsburgh Steelers', 'AFC', 'North', 'steelers.png'), ('Cleveland Browns', 'AFC', 'North', 'browns.png');

insert into positions (side, name)
values ('Offense', 'QB'), ('Offense', 'WR'), 
('Offense', 'RB'), ('Offense', 'TE'), ('Offense', 'OL'), ('Defense', 'S'), ('Defense', 'LB'), ('Defense', 'CB'), ('Defense', 'DL');


insert into players (name, team, position, dob)
values ('Joe Burrow', 1, 1, '1/1/1995'), ('Ja''Marr Chase', 1, 2, '1/1/1996'), ('Joe Mixon', 1, 3, '1/1/1993'), ('Tyler Linderbaum', 2, 5, '1/1/1994'), ('Amari Cooper', 4, 2, '1/1/1989');

insert into potd (date, player_id)
values ('2024-02-19', 5)