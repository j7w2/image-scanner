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
./lib/target/release/hash ./png_images ./src/hash
```

以下のようなテキストファイルが出力される。[ファイル名]|[ハッシュ値]が列挙された文字列となる。
```bash
1|wAFxDESsSCtlqa6yYM/IUEYU 1|wAF2CE3oiCZtMqTxYk6mCAR0 1|RIt3xMhoyCZtKKVyYM6QOES0....
```
## Usage
### Webpackコンパイルして利用する場合
上記のhashファイルを./src/hashに配置する。  
以下のコマンドでdistディレクトリにエントリーポイントとwasmが出力される。
```bash
npm install
npm run build
```

### ダウンロードして利用する場合
ダウンロードしたzipを解凍して上記のhashファイルを解凍後のディレクトリに配置する。

### ページ内で読み込み
```html
<video id="video" autoplay playsinline></video>
<canvas id="frame" style="display: none;"></canvas>

<script type="text/javascript" src="./image-scanner.js"></script>
<script type="text/javascript">
  imageScannerStart(180, 180, 100, document.getElementById("video"), document.getElementById("frame"))
</script>
```
