 - [日本語](/docs/README.ja.md)

## Demo


## Create hashes from png images
Compile and use the rust code.
```bash
cd lib
cargo build --bin hash --release
./target/release/hash $IMAGE_DIR $OUTPUT_FILE_NAME
```

It is easier to handle png file names if they are IDs (numbers) to identify them.  
Example (1.png)
```bash
./lib/target/release/hash ./png_images ./src/hash
```

A text file like the following will be output. The [filename]|[hash value] will be an enumerated string.
```bash
1|wAFxDESsSCtlqa6yYM/IUEYU 1|wAF2CE3oiCZtMqTxYk6mCAR0 1|RIt3xMhoyCZtKKVyYM6QOES0....
```
