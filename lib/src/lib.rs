extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;
mod compare_image;

#[wasm_bindgen]
pub fn compare_image_with_hashes(
    data: Vec<u8>,
    hashes_str: &str,
    hash_dim_option: Option<u32>,
    size_option: Option<u32>,
) -> String {
    let image_origin = image::load_from_memory_with_format(&data, image::ImageFormat::Png).unwrap(); 
    return compare_image::compare_image_with_hashes(image_origin, hashes_str, hash_dim_option, size_option);
}
