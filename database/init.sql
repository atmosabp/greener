create table if not exists services(
	id serial primary key,
	name varchar(255),
	max_emitted float,
	min_emitted float
);

create table if not exists hour_data(
-- pensar sobre o id ser guid
	id serial primary key, 
	co2e float,
	date_pull timestamp with time zone default current_timestamp,
	kwh float,
	cpu_percentage float,
	memory_gb float,
	disk_gb float,
	network_gb float,
	renewable_percent integer,
	service_id integer,
	foreign key(services_id) references services(id)
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
	service_id integer,
	foreign key(services_id) references services(id)
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
	service_id integer,
	foreign key(services_id) references services(id)
);

create index idx_hour_data_services_dt on hour_data (services_id, dt_pull);
create index idx_minute_data_services_dt on minute_data (services_id, dt_pull);
create index idx_month_data_services_dt on month_data (services_id, dt_pull);
