use actix_web::web::Data;
use anyhow::Ok;

use crate::app_data::AppData;

pub fn get_core_connection (app: &Data<AppData>) -> anyhow::Result<&sea_orm::DatabaseConnection>{
    let connection = app.database_connection.get("core");
    if let Some(connection) = connection {
        return Ok(connection);
    }
    return Err(anyhow::anyhow!("the database connection named 'core' cannot be empty, because this is the most basic database connection."));
}
