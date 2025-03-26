use actix_web::{get, web::{self, Data, ServiceConfig}, HttpRequest};
use crab_core::{app_data::AppData, database::get_core_connection, response::Response};
use crab_core::error::Result;
use crab_core_entity::role_menu;
use crab_core_entity::menu;
use crab_core_entity::app;
use crab_core_entity::role_app;
use sea_orm::Condition;
use sea_orm::{EntityTrait, QueryFilter, QueryOrder, QuerySelect};
use sea_orm::ColumnTrait;
use serde::{Deserialize, Serialize};
use utoipa::IntoParams;
use crab_core_auth_jwt::util::decode_header;

#[derive(Deserialize, Serialize, IntoParams, utoipa::ToSchema)]
struct MenuResponse {
    /// 菜单 ID
    pub id: i32,
    /// 菜单名称
    pub name: String,
    /// 菜单路径
    pub path: String,
    /// 菜单图标
    pub icon: Option<String>,
    /// 创建时间
    pub create_at: u64,
    /// 更新时间
    pub updated_at: u64,
    /// 父节点 ID
    pub parent_id: u64,
}

/// 获取当前用户的菜单信息
#[utoipa::path(
    tags = ["crab-core-basic"],
    description = "获取当前用户的菜单信息, 默认为第一个应用的菜单信息",
    responses(
        (status = 200, description = "返回用户可访问的菜单信息", body = Response<Vec<MenuResponse>>),
        (status = 500, description = "请求失败, 返回对应的错误信息", body = crab_core::error::Error)
    )
)]
#[get("/menu/get/user")]
pub async fn get_user(request: HttpRequest, app_data: Data<AppData>) -> Result<Response<Vec<MenuResponse>>> {
    let db = get_core_connection(&app_data)?;
    let public_key = app_data.config.server.jwt.public_key.as_bytes();
    let header_map = request.headers();
    let token = decode_header(header_map, public_key)?;

    let apps = app::Entity::find()
        .join(
            sea_orm::JoinType::LeftJoin,
            app::Entity::belongs_to(role_app::Entity)
                .from(app::Column::Id)
                .to(role_app::Column::Aid)
                .into()
        )
        .filter(role_app::Column::Rid.eq(token.claims.rid))
        .order_by_asc(role_app::Column::Weight)
        .one(db)
        .await?;

    if apps.is_none(){
        return Err(anyhow::anyhow!("there are no available applications for the current role.").into());
    }

    let menus = menu::Entity::find()
        .join(
            sea_orm::JoinType::LeftJoin,
            menu::Entity::belongs_to(role_menu::Entity)
                .from(menu::Column::Id)
                .to(role_menu::Column::Mid)
                .into()
        )
        .filter(
            Condition::all()
                .add(role_menu::Column::Rid.eq(token.claims.rid))
                .add(role_menu::Column::Aid.eq(apps.unwrap().id))
        )
        .all(db)
        .await?.iter().map(|m | MenuResponse {
            id: m.id,
            name: m.name.clone(),
            path: m.path.clone(),
            icon: m.icon.clone(),
            create_at: m.create_at.timestamp() as u64,
            updated_at: m.updated_at.timestamp() as u64,
            parent_id: m.parent_id as u64
        })
        .collect::<Vec<MenuResponse>>();
    return Ok(Response {
        payload: Some(menus)
    })
}

pub fn configure(cfg: &mut ServiceConfig) {
    cfg.service(get_user);
}

pub fn configure_toipa(cfg: &mut utoipa_actix_web::service_config::ServiceConfig) {
    cfg.service(get_user);
}
