  create table
  public.teams (
    id bigint generated by default as identity,
    created_at timestamp with time zone not null default now(),
    name text not null,
    abbrv text not null,
    conference text not null,
    division text not null,
    logo_url text null,
    constraint teams_pkey primary key (id),
    constraint teams_name_key unique (name)
  ) tablespace pg_default;

  create table
  public.positions (
    id bigint generated by default as identity,
    created_at timestamp with time zone not null default now(),
    name text not null,
    side text not null,
    constraint positions_pkey primary key (id)
  ) tablespace pg_default;


create table
  public.players (
    id bigint generated by default as identity,
    created_at timestamp with time zone not null default now(),
    name text not null,
    team bigint null,
    position bigint null,
    dob date not null,
    sleeper_search_rank bigint null,
    sleeper_id bigint null,
    constraint players_pkey primary key (id),
    constraint players_team_fkey foreign key (team) references teams (id),
    constraint players_position_fkey foreign key ("position") references positions (id)
  ) tablespace pg_default;

create table
  public.potd (
    id bigint generated by default as identity,
    created_at timestamp with time zone not null default now(),
    player_id bigint not null,
    date date not null,
    constraint potd_pkey primary key (id),
    constraint potd_player_id_fkey foreign key (player_id) references players (id)
  ) tablespace pg_default;

--only exists to provide a format for the return value of below postgres function
  create table
  public.response (
    player_id bigint not null,
    name text not null,
    team_name text not null,
    conference text not null,
    division text not null,
    position_name text not null,
    position_side text not null,
    age text not null,
    team_answer text null,
    age_answer text null,
    position_answer text null
  ) tablespace pg_default;


create or replace function checkguess(guess_id int) returns SETOF response 
as $$
begin

drop table if exists guessedplayer;
drop table if exists potdtemp;

CREATE TEMP TABLE guessedplayer as
select
  p.*,
 DATE_PART('YEAR', now()::DATE) - DATE_PART('YEAR', p.dob::DATE ) as age,
  t.name team_name,
  t.conference,
  t.division,
  po.name position_name,
  po.side,
  ROW_NUMBER() over (
    partition by
      p.id
  ) 
from
  players p
  join teams t on p.team = t.id
  join positions po on p.position = po.id
where
  p.id = guess_id;


CREATE TEMP TABLE potdtemp as
select
  t.id potd_team_id,
  t.name potd_team_name,
  t.conference potd_team_conference,
  t.division potd_team_division,
  po.id potd_position_id,
  po.name potd_position_name,
  po.side potd_position_side,
   DATE_PART('YEAR', now()::DATE) - DATE_PART('YEAR', p.dob::DATE ) as  potd_age,
  ROW_NUMBER() over (
    partition by
      p.id
  )
from
  players p
  join teams t on p.team = t.id
  join positions po on p.position = po.id
where
  p.id = (
    select
      player_id
    from
      potd
    order by
      date desc
    limit
      1
  );

return query select
gp.id player_id,
  gp.name,
  gp.team_name,
  gp.conference,
  gp.division,
  gp.position_name,
  gp.side position_side,
  gp.age::text age,
  case
    when gp.team = pt.potd_team_id THEN 'correct'
    when gp.conference = pt.potd_team_conference
    AND gp.division = pt.potd_team_division THEN 'very close'
    WHEN gp.conference = pt.potd_team_conference THEN 'close'
    else 'miss'
  END team_answer,
  case when gp.age < pt.potd_age THEN 'under' WHEN gp.age > pt.potd_age THEN 'over' ELSE 'correct' END age_answer,
  case when gp.position = pt.potd_position_id then 'correct' when gp.side = pt.potd_position_side then 'close' else 'miss'
  end position_answer
from
  guessedplayer gp
  join potdtemp pt on gp.row_number = pt.row_number;


end;
$$ language plpgsql;