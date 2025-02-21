use actix_web::{rt, web, Error, HttpRequest, HttpResponse};
use actix_ws::AggregatedMessage;
use futures_util::StreamExt as _;
use log::error;

/**
 * 使用 WebSocket 作消息的中转
 */
pub async fn message(req: HttpRequest, stream: web::Payload) -> Result<HttpResponse, Error> {
    let (res, mut session, stream) = actix_ws::handle(&req, stream)?;

    let mut stream = stream
        .aggregate_continuations()
        .max_continuation_size(2_usize.pow(20));

    rt::spawn(async move {
        while let Some(msg) = stream.next().await {
            match msg {
                Ok(AggregatedMessage::Text(text)) => {
                    let result = session.text(text).await;
                    if let Err(err) = result {
                        error!("{}", err.to_string());
                    }
                }
                Ok(AggregatedMessage::Binary(bin)) => {
                    let result = session.binary(bin).await;
                    if let Err(err) = result {
                        error!("{}", err.to_string());
                    }
                }
                Ok(AggregatedMessage::Ping(msg)) => {
                    let result = session.pong(&msg).await;
                    if let Err(err) = result {
                        error!("{}", err.to_string());
                    }
                }
                Ok(AggregatedMessage::Pong(msg)) => {
                    let result = session.ping(&msg).await;
                    if let Err(err) = result {
                        error!("{}", err.to_string());
                    }
                },
                Ok(AggregatedMessage::Close(msg)) => {
                    if let Some(msg) = msg {
                        error!("close websocket error code [{:?}]", msg.code);
                    }
                },
                Err(err) => {
                    error!("{}", err.to_string());
                }
            }
        }
    });
    Ok(res)
}
