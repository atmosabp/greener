drop table if exists hour_data;
drop table if exists minute_data;
drop table if exists month_data;
drop table if exists services;

create table services(
	id serial not null primary key,
	name varchar(255),
	max_emitted float,
	min_emitted float
);

create table hour_data(
--id ou vai ser serial ou guid
	id serial primary key, 
	services_id integer,
	co2e float,
	dt_pull timestamp with time zone default current_timestamp,
	kwh float,
	cpu_percentage float,
	memory_gb float,
	disk_gb float,
	network_gb float,
	renewable_percent integer,
	foreign key(services_id) references services(id)
);

create table minute_data(
	id serial primary key,
	services_id integer,
	co2e float,
	kwh float,
	dt_pull timestamp with time zone default current_timestamp,
	cpu_percentage float,
	memory_gb float,
	disk_gb float,
	network_gb float,
	renewable_percent integer,
	foreign key(services_id) references services(id)
);

create table month_data(
	id serial primary key,
	services_id integer,
	co2e float,
	kwh float,
	dt_pull timestamp with time zone default current_timestamp,
	cpu_percentage float,
	memory_gb float,
	disk_gb float,
	network_gb float,
	renewable_percent integer,
	foreign key(services_id) references services(id)
);

create index idx_hour_data_services_dt on hour_data (services_id, dt_pull);
create index idx_minute_data_services_dt on minute_data (services_id, dt_pull);
create index idx_month_data_services_dt on month_data (services_id, dt_pull);