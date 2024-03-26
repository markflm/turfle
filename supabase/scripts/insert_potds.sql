insert into potd (player_id, date)
select id as player_id, potd_date from (select *,  ROW_NUMBER() OVER () as prow from (select * from (select * from (select p.id from players p join positions po on p.position = po.id where side = 'Defense' order by "sleeper_search_rank" asc limit 50) as x

UNION 
select * from (select p.id from players p join positions po on p.position = po.id where side = 'Offense' order by "sleeper_search_rank" asc limit 350) as y) as n order by random()) as out) as out2
join (select *, ROW_NUMBER () OVER (order by potd_date) potdrow from
generate_series('2024-03-18', '2024-06-10', interval '1 day') as gs(potd_date)) z on prow = z.potdrow