extern crate image;
extern crate img_hash;
use img_hash::{HasherConfig, ImageHash};

fn get_hash(target: &image::ImageBuffer<image::Rgba<u8>, std::vec::Vec<u8>>, hash_dim: u32) -> ImageHash {
    let hasher = HasherConfig::new().hash_size(hash_dim, hash_dim).to_hasher();
    hasher.hash_image(target)
}

fn get_basic_hashes(book_hashes_str: &str) -> Vec<PHashObj> {
    let _vecs: Vec<&str> = book_hashes_str.split(' ').collect();
    let mut ret = Vec::new();
    for vec in _vecs.iter() {
        let tuple_vecs: Vec<&str> = vec.splitn(2, '|').collect();
        ret.push(PHashObj {
            id: tuple_vecs[0].parse::<u8>().unwrap(),
            value: ImageHash::from_base64(tuple_vecs[1]).unwrap(),
        });
    }
    return ret;
}

struct PHashObj {
    id: u8,
    value: ImageHash,
}

/// hashes_str is a string that all images are hashed.
/// Its format is iterator of '{id}[|]{hash_str}[space]'.
pub fn compare_image_with_hashes(
    image_origin: image::DynamicImage,
    hashes_str: &str,
    hash_dim_option: Option<u32>,
    size_option: Option<u32>,
) -> String {
    let size = size_option.unwrap_or(500);
    let hash_dim = hash_dim_option.unwrap_or(12);
    let hashes = get_basic_hashes(hashes_str);
    let target = image::imageops::resize(
        &image_origin,
        size,
        size,
        image::imageops::FilterType::Nearest,
    );

    let hash = get_hash(&target, hash_dim);
    let mut min_result: (u8, u32) = (0, 999);
    for compare_p_hash in hashes.iter() {
        let result = compare_p_hash.value.dist(&hash);
        if result < min_result.1 {
            min_result = (compare_p_hash.id, result);
        }
    }

    return min_result.0.to_string() + "-" + &min_result.1.to_string();
}
