
use actix_web::{middleware::{from_fn, Logger}, App, HttpServer};
use utoipa_actix_web::{scope, AppExt};
use utoipa_swagger_ui::SwaggerUi;
use crab_core::conf::get_conf;
use crab_core::app_data::init_database_connection;
use crab_core::app_data::AppData;
use crab_mod_auth_jwt::middleware::middleware_mod_auth_jwt;
use log::error;
use actix_web::web;

fn cfg_fn(cfg: &mut web::ServiceConfig) {
    crab_mod_auth_jwt::controller::configure(cfg);
}

fn cfg_fn_toipa(cfg: &mut utoipa_actix_web::service_config::ServiceConfig) {
    crab_mod_auth_jwt::controller::configure_toipa(cfg);
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let conf = get_conf();
    let conf = match conf {
        Ok(conf) => conf,
        Err(err) => {
            error!("{}", err.to_string());
            return Ok(());
        }
    };
    crab_core::logger::init(&conf.logger_level);
    let database_connection = init_database_connection(&conf).await;
    let openapi_docs = conf.server.openapi_docs.clone();
    let app_data = actix_web::web::Data::new(AppData {
        config: conf.clone(),
        database_connection
    });

    let host = conf.server.host.clone();
    let port = conf.server.port.clone();

    HttpServer::new(move || {
        let ui_path = openapi_docs.ui_path.clone();
        let json_path = openapi_docs.json_path.clone();
        if openapi_docs.enable {
            let (app, mut api) = App::new()
            .into_utoipa_app()
            .map(|app| {
                app
                    .app_data(app_data.clone())
                    .wrap(Logger::default())
                    .wrap(from_fn(middleware_mod_auth_jwt))
            })
            .service(scope("/api").configure(cfg_fn_toipa))
            .split_for_parts();
            api.info = openapi_docs.info.clone();
            return app.service(SwaggerUi::new(ui_path).url(json_path, api))
        } else {
            let app = App::new()
            .app_data(app_data.clone())
            .wrap(Logger::default())
            .wrap(from_fn(middleware_mod_auth_jwt))
            .service(web::scope("/api").configure(cfg_fn));
            return app;
        }
    })
    .bind((host, port))?
    .run()
    .await
}
