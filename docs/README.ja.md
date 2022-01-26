## png画像のハッシュ値を計算
一旦rustのコードをコンパイルして使用する。
```shell
cd lib
cargo build --bin hash --release
./target/release/hash $IMAGE_DIR $OUTPUT_FILE_NAME
```
pngファイル名は識別するためのID(数値)などにしておくと扱いやすい。
例。
```shell
./lib/target/release/hash ./png_images ./hash
```

以下のようなテキストファイルが出力される。[ファイル名]|[ハッシュ値]が列挙された文字列となる。
```text
1|wAFxDESsSCtlqa6yYM/IUEYU 1|wAF2CE3oiCZtMqTxYk6mCAR0 1|RIt3xMhoyCZtKKVyYM6QOES0....
```