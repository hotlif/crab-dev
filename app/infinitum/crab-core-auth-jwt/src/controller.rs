use actix_web::post;
use actix_web::web;
use actix_web::web::Json;
use actix_web::web::Data;
use actix_web::HttpRequest;
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
use crab_core_entity::user_role;
use crab_core_entity::superuser;
use serde::Deserialize;
use serde::Serialize;
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter};
use utoipa::IntoParams;

use crate::claims::Claims;
use crate::util::decode_header;
use crate::util::encode;


/// 发送心跳, 重新获取 Token
#[utoipa::path(
    tags = ["crab-core-auth-jwt"],
    description = "发送心跳, 告诉服务器连接有效",
    request_body = IssueParam,
    responses(
        (status = 200, description = "获取 Token 成功", body = Response<String>),
        (status = 500, description = "获取 Token 失败", body = crab_core::error::Error)
    )
)]
#[post("/jwt/heartbeat")]
async fn jwt_heartbeat(request: HttpRequest, app: Data<AppData>) -> Result<Response<String>> {
    let public_key = app.config.server.jwt.public_key.as_bytes();
    let header_map = request.headers();
    let token = decode_header(header_map, public_key)?;
    let exp = Utc::now() + Duration::minutes(app.config.server.jwt.expiry_time.into());
    let claims = Claims {
        exp: exp.timestamp() as usize,
        uid: token.claims.uid,
        rid: token.claims.rid,
        is_superuser: token.claims.is_superuser
    };
    let token = encode(&claims, app.config.server.jwt.private_key.trim().as_bytes())?;
    Ok(Response {
        payload: Some(token)
    })
}

/// 通过账号密码请求 JWT Token 的参数结构体
#[derive(Deserialize, Serialize, IntoParams, utoipa::ToSchema)]
struct IssueParam {
    /// 用户名
    username: String,
    /// 密码
    password: String
}

/// 获取 Token 
#[utoipa::path(
    tags = ["crab-core-auth-jwt"],
    description = "使用账号密码, 获取 Token 信息",
    request_body = IssueParam,
    responses(
        (status = 200, description = "获取 Token 成功", body = Response<String>),
        (status = 500, description = "获取 Token 失败", body = crab_core::error::Error)
    )
)]
#[post("/jwt/issue")]
async fn jwt_issue(
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

            let role = user_role::Entity::find().filter(
                user_role::Column::Uid.eq(uid)
            ).one(db).await?;

            let superuser_info = superuser::Entity::find().filter(
                superuser::Column::Uid.eq(uid)
            ).one(db).await?;
        
            if let Some(role) = role {
                let claims = Claims {
                    exp: exp.timestamp() as usize,
                    uid,
                    rid: role.rid,
                    is_superuser: superuser_info.is_some()
                };
                let token = encode(&claims, app.config.server.jwt.private_key.trim().as_bytes())?;
                return Ok(Response {
                    payload: Some(token)
                })
            } else {
                return Err(anyhow::anyhow!("the current user does not have a role").into());
            }
        } else {
            return Err(anyhow::anyhow!("the account password is incorrect").into());
        }
    }
    return Err(anyhow::anyhow!("the current user does not exist").into());
}

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(jwt_issue);
    cfg.service(jwt_heartbeat);
}

pub fn configure_toipa(cfg: &mut utoipa_actix_web::service_config::ServiceConfig) {
    cfg.service(jwt_issue);
    cfg.service(jwt_heartbeat);
}

#[cfg(test)]
mod tests {
    use actix_web::{test, App};
    use argon2::password_hash::{rand_core::OsRng, SaltString};
    use crab_core::{app_data::init_database_connection, conf::get_conf};
    use crab_core::database::get_core_connection;
    use crab_core::response::Response;
    use argon2::PasswordHasher;
    use sea_orm::IntoActiveModel;
    use sea_orm::{ActiveValue::NotSet, Set, ActiveModelTrait};
    use super::*;

    #[actix_web::test]
    async fn test_auth_issue_api() {
        crab_core::logger::init("debug");
        let conf = get_conf().unwrap();
    
        let database_connection = init_database_connection(&conf).await;
        let app_data = actix_web::web::Data::new(AppData {
            config: conf.clone(),
            database_connection
        });

        let db = get_core_connection(&app_data).unwrap();
        user::create_table(db).await.unwrap();
        let password = b"2f3c17b443ea2a8cba81e3beebe056f5";
        let salt = SaltString::generate(&mut OsRng);
        let argon2 = Argon2::default();
        let password_hash = argon2.hash_password(password, &salt).unwrap().to_string();
        let root: user::ActiveModel = user::ActiveModel {
            id: NotSet,
            username: Set("2f3c17b443ea2a8cba81e3beebe056f5".to_owned()),
            password: Set(password_hash),
            realname: Set("2f3c17b443ea2a8cba81e3beebe056f5".to_owned()),
            gender: Set(1),
            date_of_birth: Set(chrono::Utc::now()),
            updated_at: Set(chrono::Utc::now()),
            create_at: Set(chrono::Utc::now()),
        };
        let root= root.insert(db).await.unwrap();

        let app = test::init_service(
            App::new()
            .app_data(app_data.clone())
            .service(web::scope("/api").configure(configure))
        ).await;

        let req = test::TestRequest::post()
        .uri("/api/jwt/issue")
        .set_json(IssueParam {
            username: "2f3c17b443ea2a8cba81e3beebe056f5".to_owned(),
            password: "2f3c17b443ea2a8cba81e3beebe056f5".to_owned()
        })
        .to_request();
        let resp = test::call_service(&app, req).await;
        let status = resp.status();
        let body = test::read_body(resp).await;
        assert!(status.is_success());
        let response_json = serde_json::from_slice::<Response<String>>(&body.to_vec()).unwrap();
        assert!(response_json.payload.is_some());
        println!("jwt token: {}", response_json.payload.unwrap());
        user::Entity::delete(root.into_active_model()).exec(db).await.unwrap();
    }
}
