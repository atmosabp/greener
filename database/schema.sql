drop table minute_data; 
-- create database greener_db;
create table if not exists users(
	id serial primary key,
	name varchar(100),
	email varchar(150) unique,
	password varchar(255),
	is_adm bool
);

create table if not exists services(
	id varchar(100) primary key,
	name varchar(100),
	max_emitted float,
	min_emitted float
);

create table if not exists minute_data(
	id serial primary key,
	co2e float,
	kwh float,
	date_pull timestamp with time zone default current_timestamp,
	cpu_percentage float,
	memory_gb float,
	disk_gb float,
	network_gb float,
	renewable_percent integer,
	service_id varchar(100),
	foreign key(service_id) references services(id)
);

create table if not exists hour_data(
-- decidir entre serial e guid
	id serial primary key, 
	co2e float,
	date_pull timestamp with time zone default current_timestamp,
	kwh float,
	cpu_percentage float,
	memory_gb float,
	disk_gb float,
	network_gb float,
	renewable_percent integer,
	service_id varchar(100),
	foreign key(service_id) references services(id)
);

create table if not exists day_data(
-- decidir entre serial e guid
	id serial primary key, 
	co2e float,
	date_pull timestamp with time zone default current_timestamp,
	kwh float,
	cpu_percentage float,
	memory_gb float,
	disk_gb float,
	network_gb float,
	renewable_percent integer,
	service_id varchar(100),
	foreign key(service_id) references services(id)
);

create table if not exists month_data(
	id serial primary key,
	co2e float,
	kwh float,
	date_pull timestamp with time zone default current_timestamp,
	cpu_percentage float,
	memory_gb float,
	disk_gb float,
	network_gb float,
	renewable_percent integer,
	service_id varchar(100),
	foreign key(service_id) references services(id)
);

create index idx_hour_data_services_dt on hour_data (service_id, date_pull);
create index idx_minute_data_services_dt on minute_data (service_id, date_pull);
create index idx_month_data_services_dt on month_data (service_id, date_pull);

insert into services (id, name, max_emitted, min_emitted)
values
('billing-api', 'Billing API', 34.2, 2.8),
('checkout-worker', 'Checkout Worker', 4.1, 0.3),
('recommendation-ai', 'Recommendation AI', 34.2, 2.8),
('inventory-sync', 'Inventory Sync', 34.2, 2.8),
('audit-stream', 'Audit Stream', 105.6, 2.8),
('email-dispatcher', 'Email Dispatcher', 34.2, 2.8),
('fraud-detector', 'Fraud Detector', 34.2, 2.8),
('reporting-batch', 'Reporting Batch', 34.2, 2.8);


insert into hour_data (co2e,kwh,cpu_percentage,memory_gb,disk_gb,network_gb,renewable_percent,service_id, date_pull)
values 
(0.0059,0.0023,45.368, 2.971539999999999,18.89856,0.70974,84,'billing-api','2026-10-23 17:00:00');

select * from hour_data;

select date_pull :: timestamp - interval '120 minutes' from minute_data;

CREATE OR REPLACE FUNCTION minutes_to_hours_func()
	RETURNS trigger
	LANGUAGE 'plpgsql'
	COST 100
	VOLATILE NOT LEAKPROOF
AS $BODY$
begin
	IF EXISTS (select * from minute_data where service_id = new.service_id and date_pull = new.date_pull :: timestamp - interval '120 minutes') THEN
		insert into hour_data (co2e,kwh,cpu_percentage,memory_gb,disk_gb,network_gb,renewable_percent,service_id,date_pull) 
		values
		(	
			(select AVG(co2e) from minute_data 
			where service_id = new.service_id and date_pull between new.date_pull :: timestamp - interval '120 minutes' and new.date_pull :: timestamp - interval '60 minutes'),
			(select AVG(kwh) from minute_data 
			where service_id = new.service_id and date_pull between new.date_pull :: timestamp - interval '120 minutes' and new.date_pull :: timestamp - interval '60 minutes'),
			(select AVG(cpu_percentage) from minute_data 
			where service_id = new.service_id and date_pull between new.date_pull :: timestamp - interval '120 minutes' and new.date_pull :: timestamp - interval '60 minutes'),
			(select AVG(memory_gb) from minute_data 
			where service_id = new.service_id and date_pull between new.date_pull :: timestamp - interval '120 minutes' and new.date_pull :: timestamp - interval '60 minutes'),
			(select AVG(disk_gb) from minute_data 
			where service_id = new.service_id and date_pull between new.date_pull :: timestamp - interval '120 minutes' and new.date_pull :: timestamp - interval '60 minutes'),
			(select AVG(network_gb) from minute_data 
			where service_id = new.service_id and date_pull between new.date_pull :: timestamp - interval '120 minutes' and new.date_pull :: timestamp - interval '60 minutes'),
			(select AVG(renewable_percent) from minute_data 
			where service_id = new.service_id and date_pull between new.date_pull :: timestamp - interval '120 minutes' and new.date_pull :: timestamp - interval '60 minutes'),
			new.service_id,
			new.date_pull :: timestamp - interval '120 minutes'
		);
		delete from minute_data 
		where service_id = new.service_id
		and date_pull <= new.date_pull :: timestamp - interval '60 minutes';
	END IF;
return new;
end;
$BODY$;

CREATE OR REPLACE FUNCTION hours_to_days_func()
	RETURNS trigger
	LANGUAGE 'plpgsql'
	COST 100
	VOLATILE NOT LEAKPROOF
AS $BODY$
begin
	IF EXISTS (select * from hour_data where service_id = new.service_id and date_pull = new.date_pull :: timestamp - interval '2 days') THEN
		insert into hour_data (co2e,kwh,cpu_percentage,memory_gb,disk_gb,network_gb,renewable_percent,service_id,date_pull) 
		values
		(	
			(select AVG(co2e) from hour_data 
			where service_id = new.service_id and date_pull between new.date_pull :: timestamp - interval '2 days' and new.date_pull :: timestamp - interval '1 day'),
			(select AVG(kwh) from hour_data 
			where service_id = new.service_id and date_pull between new.date_pull :: timestamp - interval '2 days' and new.date_pull :: timestamp - interval '1 day'),
			(select AVG(cpu_percentage) from hour_data 
			where service_id = new.service_id and date_pull between new.date_pull :: timestamp - interval '2 days' and new.date_pull :: timestamp - interval '1 day'),
			(select AVG(memory_gb) from hour_data 
			where service_id = new.service_id and date_pull between new.date_pull :: timestamp - interval '2 days' and new.date_pull :: timestamp - interval '1 day'),
			(select AVG(disk_gb) from hour_data 
			where service_id = new.service_id and date_pull between new.date_pull :: timestamp - interval '2 days' and new.date_pull :: timestamp - interval '1 day'),
			(select AVG(network_gb) from hour_data 
			where service_id = new.service_id and date_pull between new.date_pull :: timestamp - interval '2 days' and new.date_pull :: timestamp - interval '1 day'),
			(select AVG(renewable_percent) from hour_data 
			where service_id = new.service_id and date_pull between new.date_pull :: timestamp - interval '2 days' and new.date_pull :: timestamp - interval '1 day'),
			new.service_id,
			new.date_pull :: timestamp - interval '2 days'
		);
		delete from hour_data 
		where service_id = new.service_id
		and date_pull <= new.date_pull :: timestamp - interval '1 day';
	END IF;
return new;
end;
$BODY$;

CREATE OR REPLACE FUNCTION days_to_months_func()
	RETURNS trigger
	LANGUAGE 'plpgsql'
	COST 100
	VOLATILE NOT LEAKPROOF
AS $BODY$
begin
	IF EXISTS (select * from day_data where service_id = new.service_id and date_pull = new.date_pull :: timestamp - interval '2 months') THEN
		insert into hour_data (co2e,kwh,cpu_percentage,memory_gb,disk_gb,network_gb,renewable_percent,service_id,date_pull) 
		values
		(	
			(select AVG(co2e) from day_data 
			where service_id = new.service_id and date_pull between new.date_pull :: timestamp - interval '2 months' and new.date_pull :: timestamp - interval '1 month'),
			(select AVG(kwh) from day_data 
			where service_id = new.service_id and date_pull between new.date_pull :: timestamp - interval '2 months' and new.date_pull :: timestamp - interval '1 month'),
			(select AVG(cpu_percentage) from day_data 
			where service_id = new.service_id and date_pull between new.date_pull :: timestamp - interval '2 months' and new.date_pull :: timestamp - interval '1 month'),
			(select AVG(memory_gb) from day_data 
			where service_id = new.service_id and date_pull between new.date_pull :: timestamp - interval '2 months' and new.date_pull :: timestamp - interval '1 month'),
			(select AVG(disk_gb) from day_data 
			where service_id = new.service_id and date_pull between new.date_pull :: timestamp - interval '2 months' and new.date_pull :: timestamp - interval '1 month'),
			(select AVG(network_gb) from day_data 
			where service_id = new.service_id and date_pull between new.date_pull :: timestamp - interval '2 months' and new.date_pull :: timestamp - interval '1 month'),
			(select AVG(renewable_percent) from day_data 
			where service_id = new.service_id and date_pull between new.date_pull :: timestamp - interval '2 months' and new.date_pull :: timestamp - interval '1 month'),
			new.service_id,
			new.date_pull :: timestamp - interval '2 months'
		);
		delete from day_data 
		where service_id = new.service_id
		and date_pull <= new.date_pull :: timestamp - interval '1 month';
	END IF;
return new;
end;
$BODY$;

CREATE TRIGGER minutes_to_hours
	AFTER INSERT 
	ON minute_data
	FOR EACH ROW
	EXECUTE FUNCTION minutes_to_hours_func();

CREATE TRIGGER hours_to_days
	AFTER INSERT 
	ON hour_data
	FOR EACH ROW
	EXECUTE FUNCTION hours_to_days_func();

CREATE TRIGGER days_to_months
	AFTER INSERT 
	ON day_data
	FOR EACH ROW
	EXECUTE FUNCTION days_to_months_func();

insert into hour_data (co2e,kwh,cpu_percentage,memory_gb,disk_gb,network_gb,renewable_percent,service_id) 
values
(
	(select AVG(co2e) from minute_data 
	where service_id = 'billing-api' and date_pull between current_timestamp :: timestamp - interval '120 minutes' and current_timestamp :: timestamp - interval '60 minutes'),
	(select AVG(kwh) from minute_data 
	where service_id = 'billing-api' and date_pull between current_timestamp :: timestamp - interval '120 minutes' and current_timestamp :: timestamp - interval '60 minutes'),
	(select AVG(cpu_percentage) from minute_data 
	where service_id = 'billing-api' and date_pull between current_timestamp :: timestamp - interval '120 minutes' and current_timestamp :: timestamp - interval '60 minutes'),
	(select AVG(memory_gb) from minute_data 
	where service_id = 'billing-api' and date_pull between current_timestamp :: timestamp - interval '120 minutes' and current_timestamp :: timestamp - interval '60 minutes'),
	(select AVG(disk_gb) from minute_data 
	where service_id = 'billing-api' and date_pull between current_timestamp :: timestamp - interval '120 minutes' and current_timestamp :: timestamp - interval '60 minutes'),
	(select AVG(network_gb) from minute_data 
	where service_id = 'billing-api' and date_pull between current_timestamp :: timestamp - interval '120 minutes' and current_timestamp :: timestamp - interval '60 minutes'),
	(select AVG(renewable_percent) from minute_data 
	where service_id = 'billing-api' and date_pull between current_timestamp :: timestamp - interval '120 minutes' and current_timestamp :: timestamp - interval '60 minutes'),
	'billing-api'
);

select * from minute_data;

select * from minute_data 
where service_id = new.service_id
and date_pull = new.date_pull :: timestamp - interval '120 minutes';


(select AVG(co2e) from minute_data 
where service_id = new.service_id and date_pull between new.date_pull :: timestamp - interval '120 minutes' and new.date_pull :: timestamp - interval '60 minutes';),
(select AVG(kwh) from minute_data 
where service_id = new.service_id and date_pull between new.date_pull :: timestamp - interval '120 minutes' and new.date_pull :: timestamp - interval '60 minutes';),
(select AVG(cpu_percentage) from minute_data 
where service_id = new.service_id and date_pull between new.date_pull :: timestamp - interval '120 minutes' and new.date_pull :: timestamp - interval '60 minutes';),
(select AVG(memory_gb) from minute_data 
where service_id = new.service_id and date_pull between new.date_pull :: timestamp - interval '120 minutes' and new.date_pull :: timestamp - interval '60 minutes';),
(select AVG(disk_gb) from minute_data 
where service_id = new.service_id and date_pull between new.date_pull :: timestamp - interval '120 minutes' and new.date_pull :: timestamp - interval '60 minutes';),
(select AVG(network_gb) from minute_data 
where service_id = new.service_id and date_pull between new.date_pull :: timestamp - interval '120 minutes' and new.date_pull :: timestamp - interval '60 minutes';),
(select AVG(renewable_percent) from minute_data 
where service_id = new.service_id and date_pull between new.date_pull :: timestamp - interval '120 minutes' and new.date_pull :: timestamp - interval '60 minutes';),
new.service_id,
new.date_pull :: timestamp - interval '120 minutes'
);
