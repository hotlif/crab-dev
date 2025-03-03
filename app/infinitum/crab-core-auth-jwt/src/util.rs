use actix_web::http::header::HeaderMap;
use jsonwebtoken::{decode, Algorithm, DecodingKey, EncodingKey, Header, TokenData, Validation};

use crate::claims::Claims;

pub fn decode_header(header: &HeaderMap, public_key: &[u8]) -> anyhow::Result<TokenData<Claims>> {
    let decoding_key: DecodingKey = DecodingKey::from_rsa_pem(public_key)?;
    let validation_rs256: Validation = Validation::new(Algorithm::RS512);
    if let Some(auth_header) = header.get("Authorization") {
        if let Ok(auth_str) = auth_header.to_str() {
            let token = auth_str;
            let claims = decode::<Claims>(
                &token,
                &decoding_key,
                &validation_rs256
            );

            match claims {
                Ok(claims) => {
                    return anyhow::Ok(claims);
                },
                Err(err) => {
                    let error_str = err.to_string();
                    return Err(anyhow::anyhow!(error_str));
                }
            }
        }
    }
    return Err(anyhow::anyhow!("invalid token"));
}


pub fn encode(claims: &Claims, private_key: &[u8]) -> Result<String, jsonwebtoken::errors::Error> {
    let encoding_key: EncodingKey = EncodingKey::from_rsa_pem(private_key).unwrap();
    let token = jsonwebtoken::encode(&Header::new(Algorithm::RS512), claims, &encoding_key)?;
    Ok(token)
}
