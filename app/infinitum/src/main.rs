
use std::collections::HashMap;
use std::io::Write;

use actix_web::{middleware::{from_fn, Logger}, App, HttpServer};
use chrono::Local;
use colored::Colorize;
use env_logger::{Builder, Env};
use utoipa_actix_web::AppExt;
use utoipa_swagger_ui::SwaggerUi;
use std::time::Duration;
use crab_core::conf::get_conf;
use crab_core::app_data::AppData;
use crab_mod_auth_jwt::middleware::middleware_mod_auth_jwt;
use log::{error, Level};
use actix_web::web;
use sea_orm::{ConnectOptions, Database, DatabaseConnection};

fn cfg_fn(cfg: &mut web::ServiceConfig) {
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let conf = get_conf();
    if let Err(error) = conf {
        error!("{}", error.to_string());
        return Ok(());
    }
    let conf = conf.unwrap();
    let local_time = Local::now();
    
    Builder::from_env(Env::new().default_filter_or(conf.logger_level.clone()))
        .format(move |buf, record| {
            let mut out = format!(
                "[{} - {}] - {}",
                local_time.format("%Y-%m-%d %H:%M:%S.%f"),
                record.level(),
                record.args()
            );
            if record.level() == Level::Error{
                out = out.red().to_string();
            } else if record.level() == Level::Info {
                out = out.green().to_string();
            } else if record.level() == Level::Warn {
                out = out.yellow().to_string();
            }
            writeln!(buf, "{}", out)
        })
        .init();

    let mut database_connection: HashMap<String, DatabaseConnection> = HashMap::new();
    let openapi_docs = conf.server.openapi_docs.clone();
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

    let app_data = actix_web::web::Data::new(AppData {
        config: conf.clone(),
        database_connection: database_connection
    });

    let host = conf.server.host.clone();
    let port = conf.server.port.clone();

    HttpServer::new(move || {
        let ui_path = openapi_docs.ui_path.clone();
        let json_path = openapi_docs.json_path.clone();
        let app = App::new()
        .app_data(app_data.clone())
        .wrap(Logger::default())
        .wrap(from_fn(middleware_mod_auth_jwt))
        .service(web::scope("/api").configure(cfg_fn));
        if openapi_docs.enable {
            let (app, mut api) = app.into_utoipa_app().split_for_parts();
            api.info = openapi_docs.info.clone();
            app.service(SwaggerUi::new(ui_path).url(json_path, api))
        } else {
            app
        }
    })
    .bind((host, port))?
    .run()
    .await
}
