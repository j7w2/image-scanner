 - [English](/README.md)
## Demo
ブラウザ上でカメラを起動して映し出された対象の映像が、予め用意された画像のいずれかと一致するかを判定するシステム。

## png画像のハッシュ値を計算
一旦rustのコードをコンパイルして使用する。
```bash
cd lib
cargo build --bin hash --release
./target/release/hash $IMAGE_DIR $OUTPUT_FILE_NAME
```
pngファイル名は識別するためのID(数値)などにしておくと扱いやすい。  
例(1.png)
```bash
./lib/target/release/hash ./png_images ./hash
```

以下のようなテキストファイルが出力される。[ファイル名]|[ハッシュ値]が列挙された文字列となる。
```bash
1|wAFxDESsSCtlqa6yYM/IUEYU 1|wAF2CE3oiCZtMqTxYk6mCAR0 1|RIt3xMhoyCZtKKVyYM6QOES0....
```
