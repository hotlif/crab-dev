use argon2::{password_hash::{rand_core::OsRng, SaltString}, Argon2};
use crab_core::error::Result;
use sea_orm::{ActiveValue::Set, DatabaseBackend, DatabaseConnection, Statement};
use sea_orm::ActiveModelTrait;
use sea_orm::ConnectionTrait;
use argon2::PasswordHasher;
use chrono::Utc;

pub async fn initialize_database(db: &DatabaseConnection) -> Result<String> {
    let query_res = db
        .query_one(Statement::from_string(
            DatabaseBackend::Postgres,
            "SELECT 1 FROM information_schema.tables t where t.table_schema = 'public' AND  t.table_name = 'crab_core_user';",
        ))
        .await?;
    if query_res.is_none() {
        let rid = initialize_user_and_role_and_superuser(db).await?;
        initialize_app_and_menu(rid, db).await?;
    }
    Ok("Database initialization successful.".to_string())
}

pub async fn initialize_app_and_menu(rid: i32, db: &DatabaseConnection) -> Result<String> {

    crab_core_entity::app::create_table(db).await?;
    crab_core_entity::menu::create_table(db).await?;
    crab_core_entity::role_app::create_table(db).await?;
    crab_core_entity::role_menu::create_table(db).await?;

    let dev_app = crab_core_entity::app::ActiveModel {
        name: Set("开发者平台".to_string()),
        description: Set("用于开发者平台, 用来开发管理的模块, 此处所有功能都是给开发人员使用的".to_string()),
        create_at: Set(Utc::now()),
        updated_at: Set(Utc::now()),
        ..Default::default()
    };

    let dev_app = dev_app.insert(db).await?;

    let role_app = crab_core_entity::role_app::ActiveModel {
        rid: Set(rid),
        aid: Set(dev_app.id),
        weight: Set(0.0),
        create_at: Set(Utc::now()),
        updated_at: Set(Utc::now()),
        ..Default::default()
    };
    role_app.insert(db).await?;

    let app = crab_core_entity::menu::ActiveModel {
        parent_id: Set(0),
        name: Set("应用管理".to_string()),
        path: Set("".to_string()),
        icon: Set(None),
        create_at: Set(Utc::now()),
        updated_at: Set(Utc::now()),
        ..Default::default()
    };

    let app = app.insert(db).await?;

    let my_app_menu = crab_core_entity::role_menu::ActiveModel {
        rid: Set(rid),
        mid: Set(app.id),
        aid: Set(dev_app.id),
        create_at: Set(Utc::now()),
        updated_at: Set(Utc::now()),
        ..Default::default()
    };
    my_app_menu.insert(db).await?;

    let menu = crab_core_entity::menu::ActiveModel {
        parent_id: Set(app.id),
        name: Set("应用商城".to_string()),
        path: Set("/Core/AppStore".to_string()),
        icon: Set(None),
        create_at: Set(Utc::now()),
        updated_at: Set(Utc::now()),
        ..Default::default()
    };

    let menu = menu.insert(db).await?;
    let my_app_menu = crab_core_entity::menu::ActiveModel {
        parent_id: Set(app.id),
        name: Set("我的应用".to_string()),
        path: Set("/Core/AppManager".to_string()),
        icon: Set(None),
        create_at: Set(Utc::now()),
        updated_at: Set(Utc::now()),
        ..Default::default()
    };

    let my_app_menu = my_app_menu.insert(db).await?;
    let my_app_role_menu = crab_core_entity::role_menu::ActiveModel {
        rid: Set(rid),
        mid: Set(my_app_menu.id),
        aid: Set(dev_app.id),
        create_at: Set(Utc::now()),
        updated_at: Set(Utc::now()),
        ..Default::default()
    };
    my_app_role_menu.insert(db).await?;
    let role_menu = crab_core_entity::role_menu::ActiveModel {
        rid: Set(rid),
        mid: Set(menu.id),
        aid: Set(dev_app.id),
        create_at: Set(Utc::now()),
        updated_at: Set(Utc::now()),
        ..Default::default()
    };
    role_menu.insert(db).await?;
    Ok("initialization of menu information successful.".to_string())
}

/**
 * 初始化, 并且初始化一个用户名字叫 root, 角色是 Root
 * 
 * - 用户表
 * - 角色表
 * - 超级管理员表
 */
pub async fn initialize_user_and_role_and_superuser(db: &DatabaseConnection) -> Result<i32> {
    let password = b"root";
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    let password_hash = argon2.hash_password(password, &salt).unwrap().to_string();

    crab_core_entity::user::create_table(db).await?;
    crab_core_entity::user_role::create_table(db).await?;
    crab_core_entity::superuser::create_table(db).await?;
    crab_core_entity::role::create_table(db).await?;

    let root_user = crab_core_entity::user::ActiveModel {
        username: Set("root".to_string()),
        realname: Set("root".to_string()),
        gender: Set(0),
        password: Set(password_hash),
        date_of_birth: Set(Utc::now()),
        create_at: Set(Utc::now()),
        updated_at: Set(Utc::now()),
        ..Default::default()
    };
    let root_user = root_user.insert(db).await?;

    let superuser_data = crab_core_entity::superuser::ActiveModel {
        uid: Set(root_user.id),
        create_at: Set(Utc::now()),
        updated_at: Set(Utc::now()),
        ..Default::default()
    };

    superuser_data.insert(db).await?;

    let root_role = crab_core_entity::role::ActiveModel {
        name: Set("Root".to_string()),
        description: Set("System root directory role, this role cannot be deleted.".to_string()),
        create_at: Set(Utc::now()),
        updated_at: Set(Utc::now()),
        ..Default::default()
    };

    let root_role = root_role.insert(db).await?;

    let root_user_role = crab_core_entity::user_role::ActiveModel {
        uid: Set(root_user.id),
        rid: Set(root_role.id),
        create_at: Set(Utc::now()),
        updated_at: Set(Utc::now()),
        ..Default::default()
    };
    root_user_role.insert(db).await?;
    Ok(root_role.id)
}

