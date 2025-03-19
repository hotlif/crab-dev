use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    /**
     * Token 到期时间
     */
    pub exp: usize,

    /**
     * 用户 ID
     */
    pub uid: i32,

    /**
     * 角色 ID
     */
    pub rid: i32,

    /**
     * 是否是超级用户
     */
    pub is_superuser: bool,
}
