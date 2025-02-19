use actix_web::{
    error, http::{header::ContentType, StatusCode}, HttpResponse
};
use derive_more::derive::{Display, Error};
use serde_json::json;


#[derive(Debug, Display, Error, utoipa::ToSchema)]
pub struct Error {
    pub message: String
}

impl Error {
    pub fn new(message: &str) -> Self {
        Self {
            message: message.to_string()
        }
    }
}

impl error::ResponseError for Error {
    fn error_response(&self) -> HttpResponse {
        HttpResponse::build(StatusCode::INTERNAL_SERVER_ERROR)
            .insert_header(ContentType::json())
            .body(json!({
                "message": self.message
            }).to_string())
    }
}

impl From<anyhow::Error> for Error {
    fn from(err: anyhow::Error) -> Error {
        Error { message: err.to_string() }
    }
}

impl From<serde_json::Error> for Error {
    fn from(err: serde_json::Error) -> Error {
        Error { message: err.to_string() }
    }
}

impl From<sea_orm::DbErr> for Error {
    fn from(err: sea_orm::DbErr) -> Error {
        Error { message: err.to_string() }
    }
}

impl From<argon2::password_hash::Error> for Error {
    fn from(err: argon2::password_hash::Error) -> Error {
        Error { message: err.to_string() }
    }
}

impl From<jsonwebtoken::errors::Error> for Error {
    fn from(err: jsonwebtoken::errors::Error) -> Error {
        Error { message: err.to_string() }
    }
}

pub type Result<T> = std::result::Result<T, Error>;
