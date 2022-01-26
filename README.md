## Create hashes from png image

```shell
cd lib
cargo build --bin hash --release
./target/release/hash $IMAGE_DIR $OUTPUT_FILE_NAME
```

For example
```shell
./lib/target/release/hash ./png_images ./hash
```