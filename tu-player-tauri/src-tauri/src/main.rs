// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#[tauri::command]
fn get_video_path() -> String{
    let video_path = "file:///home/tonni/Downloads/The Simpsons S01-S30 (1989-) + Shorts (1987-1989) + Movie (2007)/The Simpsons S02 (360p re-dvdrip)/The Simpsons S02E03 Treehouse of Horror.mp4";
    return video_path.to_string();

}

fn main() {
  tauri::Builder::default()
  .invoke_handler(tauri::generate_handler![get_video_path])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
