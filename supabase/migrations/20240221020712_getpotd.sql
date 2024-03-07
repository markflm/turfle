create or replace function getpotd(potd_date text)
   returns setof response 
   language plpgsql
  as
$$
declare 
begin
return query select p.id player_id, p.name, t.name team_name, t.conference, t.division, po.name position_name, po.side position_side,  (DATE_PART('YEAR', now()::DATE) - DATE_PART('YEAR', p.dob::DATE ))::text age, 'correct' team_answer, 'correct' age_answer, 'correct' position_answer from players p join teams t on p.team = t.id join positions po on p.position = po.id
join potd on potd.player_id = p.id
where potd.date::text = potd_date;

end;
$$