use sea_orm::{entity::prelude::*, Schema};
use serde::{Deserialize, Serialize};

/**
 * 定义应用信息的表
 */
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Deserialize, Serialize)]
#[sea_orm(table_name = "crab_core_app", comment = "应用信息")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,

    #[sea_orm(comment = "应用名称")]
    pub name: String,

    #[sea_orm(comment = "应用描述")]
    pub description: String,

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
