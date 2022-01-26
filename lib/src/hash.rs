extern crate image;
extern crate img_hash;
use img_hash::{HasherConfig, ImageHash};
use std::fs::File;
use std::io::{self, BufReader, Read, Write};
use std::{env, fs};

fn write_file(output: &String, result: &String) -> Result<(), Box<std::error::Error>> {
    let mut file = File::create(&output)?;
    file.write_all(result.trim_end().as_bytes()).unwrap();
    file.flush()?;
    Ok(())
}

fn get_hash(
    target: &mut image::ImageBuffer<image::Rgba<u8>, std::vec::Vec<u8>>,
) -> ImageHash {
    let hasher = HasherConfig::new().hash_size(12, 12).to_hasher();
    let hash = hasher.hash_image(target);
    return hash;
}

fn get_hashes(
    target: &mut image::ImageBuffer<image::Rgba<u8>, std::vec::Vec<u8>>,
    size: u32,
    sub: u32,
    n: u32,
) -> Vec<ImageHash> {
    let hasher = HasherConfig::new().hash_size(12, 12).to_hasher();
    let mut ret = Vec::new();
    if n == 0 {
        let hash = hasher.hash_image(target);
        ret.push(hash);
    } else {
        let axis = n * 2 + 1;
        for x_axis in 0..axis {
            for y_axis in 0..axis {
                let x = x_axis * sub;
                let y = y_axis * sub;
                let _image =
                    image::imageops::crop(target, x, y, size - sub * n * 2, size - sub * n * 2)
                        .to_image();
                let resize_image = image::imageops::resize(
                    &_image,
                    size / 2,
                    size / 2,
                    image::imageops::FilterType::Nearest,
                );
                ret.push(hasher.hash_image(&resize_image));
            }
        }
    }
    return ret;
}

fn main() {
    let max = 5;
    let size = 1000;
    let args: Vec<String> = env::args().collect();
    let image_dir = &args[1];
    let output_path = &args[2];
    let mut result_string = String::new();
    for entry in fs::read_dir(image_dir).unwrap() {
        let _entry = entry.unwrap();
        let path = _entry.path();
        let file_name = _entry.file_name();
        let path_str = String::from(path.to_string_lossy());
        let mut f_name = String::from(file_name.to_string_lossy()).replace(".png", "");
        let mut _image = image::open(path_str).unwrap();
        let mut target =
            image::imageops::resize(&_image, size, size, image::imageops::FilterType::Nearest);

        if f_name.contains("_o") {
            f_name = f_name.replace("_o", "");
            let hv = get_hash(&mut target);
            result_string = result_string + &f_name.to_string() + "|" + &hv.to_base64().to_string() + " ";
        } else {
            for n in 0..max {
                let sub = size / 8 / max;
                let hash_vec = get_hashes(&mut target, size, sub, n);
                for hv in hash_vec.iter() {
                    result_string = result_string + &f_name.to_string() + "|" + &hv.to_base64().to_string() + " " ;
                }
            }
        }
    }

    write_file(output_path, &result_string);
}
