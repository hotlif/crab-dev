use std::{collections::HashMap, env};
use log::{debug, error};
use serde::Deserialize;
use utoipa::openapi::Info;

#[derive(Deserialize, Clone)]
pub struct Config {

    /**
     * 日志级别 error/warn/info/debug/trace/off
     */
    pub logger_level: String,

    /**
     * 服务
     */
    pub server: Server,

    /**
     * 数据库连接
     */
    pub database_connection: HashMap<String, DatabaseConnection>
}

#[derive(Deserialize, Clone)]
pub struct Server {
    
    /**
     * 地址
     */
    pub host: String,

    /**
     * 端口号
     */
    pub port: u16,

    /**
     * JWT 鉴权
     */
    pub jwt: JWT,

    /**
     * API 文档
     */
    pub openapi_docs: APIDocs
}

#[derive(Deserialize, Clone)]
pub struct APIDocs {
    pub ui_path: String,
    pub json_path: String,
    pub enable: bool,
    pub info: Info
}

#[derive(Deserialize, Clone)]
pub struct JWT {
    /**
     * 私钥
     */
    pub private_key: String,

    /**
     * 公钥
     */
    pub public_key: String,

    /**
     * 过期时间 
     */
    pub expiry_time: u16,

    /**
     * 允许访问请求路径, 不需要经过 JWT 鉴权
     */
    pub allow_access_paths: Vec<String>
}

#[derive(Deserialize, Clone)]
pub struct DatabaseConnection {
    /**
     * 数据库的 url 地址
     */
    pub url: String,

    /**
     * 最大连接数
     */
    pub max_connections: u32,

    /**
     * 最小连接数
     */
    pub min_connections: u32,

    /**
     * 连接超时
     */
    pub connect_timeout: u64,

    /**
     * 空闲超时
     */
    pub idle_timeout: u64,

    /**
     * 最大生命周期
     */
    pub max_lifetime: u64,

    /**
     * 是否显示 sql 日志
     */
    pub sqlx_logging: bool
}

pub fn get_conf () -> Result<Config, std::io::Error> {
    let conf_toml = ".conf.toml";
    let current_dir = env::current_exe()?;
    let conf_toml_path = current_dir.parent().unwrap().join(conf_toml);
    let content = std::fs::read_to_string(&conf_toml_path);
    debug!("read config toml path [{}]", conf_toml_path.display());
    if content.is_err() {
        let error = content.err().unwrap();
        error!("{} [{}]", error.to_string(), conf_toml);
        return Err(error);
    }
    let content = content.unwrap();
    let config: Config = toml::from_str(&content).unwrap();
    return Ok(config);
}
