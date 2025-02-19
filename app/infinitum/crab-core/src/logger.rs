use chrono::Local;
use colored::Colorize;
use env_logger::Builder;
use env_logger::Env;
use std::io::Write;
use log::Level;

pub fn init (logger_level: &str) {
    let local_time = Local::now();
    Builder::from_env(Env::new().default_filter_or(logger_level))
        .format(move |buf, record| {
            let mut out = format!(
                "[{} - {}] - {}",
                local_time.format("%Y-%m-%d %H:%M:%S.%f"),
                record.level(),
                record.args()
            );
            if record.level() == Level::Error{
                out = out.red().to_string();
            } else if record.level() == Level::Info {
                out = out.green().to_string();
            } else if record.level() == Level::Warn {
                out = out.yellow().to_string();
            }
            writeln!(buf, "{}", out)
        })
        .init();

}
