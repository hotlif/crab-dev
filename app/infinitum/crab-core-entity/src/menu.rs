use sea_orm::{entity::prelude::*, Schema};
use serde::{Deserialize, Serialize};

/**
 * 定义菜单信息的表, 定义基础的菜单信息
 */
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Deserialize, Serialize)]
#[sea_orm(table_name = "crab_core_menu", comment = "菜单表")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,

    #[sea_orm(comment = "父级菜单 ID")]
    pub parent_id: i32,

    #[sea_orm(comment = "菜单名称")]
    pub name: String,

    #[sea_orm(comment = "菜单路径")]
    pub path: String,

    #[sea_orm(comment = "菜单图标")]
    pub icon: Option<String>,

    #[sea_orm(comment = "创建日期")]
    pub create_at: DateTimeUtc,

    #[sea_orm(comment = "更新时间")]
    pub updated_at: DateTimeUtc,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}

pub async fn create_table(db: &DatabaseConnection) -> anyhow::Result<()> {
    let backend  = db.get_database_backend();
    let schema = Schema::new(backend);
    db.execute(
        backend.build(
            schema
                .create_table_from_entity(Entity)
                .to_owned()
            .if_not_exists()
        )
    ).await?;
    anyhow::Ok(())
}
