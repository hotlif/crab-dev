use std::collections::HashMap;

use sea_orm::DatabaseConnection;

use crate::conf::Config;

pub struct AppData {
    pub config: Config,
    pub database_connection: HashMap<String, DatabaseConnection>
}
