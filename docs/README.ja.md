 - [English](/README.md)
## Demo
ブラウザ上でカメラを起動して映し出された対象の映像が、予め用意された画像のいずれかと一致するかを判定するシステム。
![demo](https://i-407.com/images/github/image_scanner_demo.gif)

## png画像のハッシュ値を計算
予め用意した画像を以下のようにスライドした画像にトリミングしてハッシュ値を計算する。  

![images](https://i-407.com/images/github/image-trims.png)  

最大5列5行のトリミングをデフォルトとする。  
  
一旦rustのコードをコンパイルして使用する。
```bash
cd lib
cargo build --bin hash --release
./target/release/hash $IMAGE_DIR $OUTPUT_FILE_NAME
```
複数のpng画像のpHash値を計算して出力。(12 x 12bit)  
リアルタイムで計算するのは時間がかかるうえに画像ファイルもブラウザでロードする必要があり非効率なので、事前にhash値を求めておく。
pngファイル名は識別するためのID(数値)などにしておくと扱いやすい。(例:1.png)
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

### Webページ内で読み込み
videoタグ、canvasタグ(display:none)は必須。webpackでコンパイル済みのファイル群を以下のように読み込んで利用する。

```html
<meta name="viewport" content="width=device-width,initial-scale=1"><!--スマホ用にこの設定は必須 -->

<video id="video" autoplay playsinline></video>
<canvas id="frame" style="display: none;"></canvas>

<script type="text/javascript" src="./image-scanner.ja.js"></script>
<script type="text/javascript">
  imageScannerStart(
    200, // カメラのスキャン枠のwidth(px)
    200, // カメラのスキャン枠のheight(px)
    100, // カメラのスキャン枠のy軸pt(px)
    document.getElementById("video"), // video element
    document.getElementById("frame") // canvas element
  ).then(res => {
    console.log('成功!: id=' + res)
  }).catch(err => {
    console.log(err)
  })
</script>
```
