use actix_web::dev::{ServiceRequest, ServiceResponse};
use actix_web::body::MessageBody;
use actix_web::http::header::ContentType;
use actix_web::http::StatusCode;
use actix_web::{web, Error, HttpResponse};
use actix_web::middleware::Next;
use serde_json::json;
use chrono::Utc;
use crab_core::app_data::AppData;
use globset::Glob;

use crate::util::decode_header;

pub async fn middleware_mod_auth_jwt (
    req: ServiceRequest,
    next: Next<impl MessageBody>,
) -> Result<ServiceResponse<impl MessageBody>, Error> {
    let app_data = req.app_data::<web::Data<AppData>>();
    let mut public_key = String::new();

    if let Some(app_data) = app_data {
        let conf = app_data;
        let allow_access_paths = &conf.config.server.jwt.allow_access_paths;
        public_key = conf.config.server.jwt.public_key.clone();
        let element = allow_access_paths.iter().find(|element| {
            let glob = Glob::new(element).unwrap().compile_matcher();
            glob.is_match(&req.path())
        });
        if element.is_some() {
            return next.call(req).await;
        }
    }

    let claims = decode_header(req.headers(), public_key.trim().as_bytes());

    match claims {
        Ok(token_data) => {
            let claims = token_data.claims;
            let current_time = Utc::now().timestamp();
            if claims.exp < current_time as usize {
                return Err(
                    actix_web::error::InternalError::from_response(
                        "",
                        HttpResponse::build(StatusCode::UNAUTHORIZED)
                    .insert_header(ContentType::json())
                    .body(
                        json!({
                            "message": "the current token has expired."
                        }).to_string()
                    )).into()
                );
            }
            return next.call(req).await;
        },
        Err(err) => {
            return Err(
                actix_web::error::InternalError::from_response(
                    "",
                    HttpResponse::build(StatusCode::UNAUTHORIZED)
                .insert_header(ContentType::json())
                .body(
                    json!({
                        "message": err.to_string()
                    }).to_string()
                )).into()
            );
        }
    }
}
