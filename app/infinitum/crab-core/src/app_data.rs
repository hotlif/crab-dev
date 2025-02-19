use std::{collections::HashMap, time::Duration};

use log::error;
use sea_orm::{ConnectOptions, Database, DatabaseConnection};

use crate::conf::Config;

pub struct AppData {
    pub config: Config,
    pub database_connection: HashMap<String, DatabaseConnection>
}

pub async fn init_database_connection(conf: &Config) -> HashMap<String, DatabaseConnection> {
    let mut database_connection: HashMap<String, DatabaseConnection> = HashMap::new();
    for (key, value) in conf.database_connection.clone() {
        let mut opt = ConnectOptions::new(value.url);
        opt.max_connections(value.max_connections)
            .min_connections(value.min_connections)
            .connect_timeout(Duration::from_secs(value.connect_timeout))
            .idle_timeout(Duration::from_secs(value.idle_timeout))
            .max_lifetime(Duration::from_secs(value.max_lifetime))
            .sqlx_logging(value.sqlx_logging);
        let db = Database::connect(opt).await;
        match db {
            Ok(db) => {
                database_connection.insert(key, db);
            },
            Err(err) => {
                error!("{}", err.to_string());
            }
        }
    }
    return database_connection;
}
