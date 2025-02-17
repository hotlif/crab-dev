use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Deserialize, Serialize)]
#[sea_orm(table_name = "crab_core_user", comment = "人员信息")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,

    #[sea_orm(comment = "用户名")]
    pub username: String,

    #[sea_orm(comment = "真实姓名")]
    pub realname: String,

    #[sea_orm(comment = "性别")]
    pub gender: i8,

    #[sea_orm(comment = "登录密码")]
    pub password: String,

    #[sea_orm(comment = "出生日期")]
    pub date_of_birth: DateTimeUtc,
    
    #[sea_orm(comment = "创建日期")]
    pub create_at: DateTimeUtc,

    #[sea_orm(comment = "更新时间")]
    pub updated_at: DateTimeUtc,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
