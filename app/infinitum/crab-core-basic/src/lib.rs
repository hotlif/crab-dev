use actix_web::web;

pub mod controller;

pub fn configure(cfg: &mut web::ServiceConfig) {
    controller::menu::configure(cfg);
    controller::app::configure(cfg);
}

pub fn configure_toipa(cfg: &mut utoipa_actix_web::service_config::ServiceConfig) {
    controller::menu::configure_toipa(cfg);
    controller::app::configure_toipa(cfg);
}
