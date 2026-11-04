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
