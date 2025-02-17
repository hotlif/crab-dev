use std::{env, fs::{self, remove_file}, io, path::{Path, PathBuf}};

fn copy_dir(src: &Path, dst: &Path) -> io::Result<()> {
    if !dst.exists() {
        fs::create_dir_all(dst)?;
    }
    for entry in fs::read_dir(src)? {
        let entry = entry?;
        let entry_path = entry.path();
        let target_path = dst.join(entry.file_name());
        if entry_path.is_dir() {
            copy_dir(&entry_path, &target_path)?;
        } else {
            fs::copy(&entry_path, target_path)?;
        }
    }
    Ok(())
}

fn main() {
    let out_path = PathBuf::from(env::var("OUT_DIR").expect("OUT_DIR environment variable not set"));
    let conf_src = PathBuf::from(".conf.toml");
    let conf_dst = out_path.parent().unwrap().parent().unwrap().parent().unwrap().join(".conf.toml");
    if conf_dst.exists() {
        remove_file(&conf_dst).unwrap();
    }
    if let Err(e) = fs::copy(&conf_src, &conf_dst) {
        panic!("Failed to copy [.conf.toml] file: {}", e);
    }

    let conf_src = PathBuf::from("./assets");
    let conf_dst = out_path.parent().unwrap().parent().unwrap().parent().unwrap().join("assets");
    if let Err(e) = copy_dir(&conf_src, &conf_dst) {
        panic!("Failed to copy [assets] file: {}", e);
    }
}
