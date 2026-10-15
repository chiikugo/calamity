// Prevents additional console window on Windows in release, DO NOT REMOVE!!

//default root that is the entry point for rust code
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    calamity_develop_lib::run()
}
