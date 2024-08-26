#[cfg(target_os = "windows")]
use std::os::windows::ffi::OsStrExt;
use std::path::PathBuf;

#[cfg(target_os = "windows")]
use winapi::um::fileapi::SetFileAttributesW;
#[cfg(target_os = "windows")]
use winapi::um::winnt::FILE_ATTRIBUTE_HIDDEN;

pub fn set_folder_invisible(path: PathBuf) {
    for component in path.ancestors() {
        let dir_name = component.file_name().and_then(|os_str| os_str.to_str());

        if let Some(name) = dir_name {
            if name.starts_with('.') {
                #[cfg(target_os = "windows")]
                {
                    // Convert the directory path directly to a wide string for Windows API
                    let wide_path: Vec<u16> = component
                        .as_os_str()
                        .encode_wide()
                        .chain(Some(0))
                        .collect();

                    unsafe {
                        // Set the hidden attribute on the directory itself
                        SetFileAttributesW(wide_path.as_ptr(), FILE_ATTRIBUTE_HIDDEN);
                    }
                }
            }
        }
    }
}