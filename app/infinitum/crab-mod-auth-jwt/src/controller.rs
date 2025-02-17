use actix_web::post;
use actix_web::web::Json;
use actix_web::web::Data;
use argon2::Argon2;
use argon2::PasswordHash;
use argon2::PasswordVerifier;
use chrono::Duration;
use chrono::Utc;
use crab_core::app_data::AppData;
use crab_core::response::Response;
use crab_core::database::get_core_connection;
use crab_core::error::Result;
use crab_core_entity::user;
use serde::Deserialize;
use serde::Serialize;
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter};

use crate::claims::Claims;
use crate::util::encode;

#[derive(Deserialize, Serialize)]
struct IssueParam {
    username: String,
    password: String
}

#[post("/jwt/issue")]
async fn auth_issue(
    param: Option<Json<IssueParam>>,
    app: Data<AppData>
) -> Result<Response<String>> {

    let db = get_core_connection(&app)?;
    let username = match &param {
        Some(param) => param.username.clone(),
        None => "".to_string()
    };

    let password = match &param {
        Some(param) => param.password.clone(),
        None => "".to_string()
    };

    let user = user::Entity::find().filter(
        user::Column::Username.eq(username)
    ).one(db).await?;
    if let Some(user) = user {
        let password_hash= user.password;
        let parsed_hash = PasswordHash::new(&password_hash)?;
        if Argon2::default().verify_password(password.as_bytes(), &parsed_hash).is_ok() {
            let exp = Utc::now() + Duration::minutes(app.config.server.jwt.expiry_time.into());
            let uid = user.id;
            let claims = Claims {
                exp: exp.timestamp() as usize,
                uid
            };
            let token = encode(&claims, app.config.server.jwt.private_key.trim().as_bytes())?;
            return Ok(Response {
                payload: Some(token)
            })
        } else {
            return Err(anyhow::anyhow!("the account password is incorrect").into());
        }
    }
    return Err(anyhow::anyhow!("the current user does not exist").into());
}
