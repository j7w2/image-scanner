 - [日本語](/docs/README.ja.md)

## Demo
A system that determines whether the image of a target projected by activating a camera on a browser matches one of the pre-prepared images.
![demo](https://i-407.com/images/github/image_scanner_demo.gif)

## Create hashes from png images
The hash value is calculated by trimming the pre-prepared image into a sliding image as shown below.   

![images](https://i-407.com/images/github/image-trims.png)  

Compile and use the rust code.
```bash
cd lib
cargo build --bin hash --release
./target/release/hash $IMAGE_DIR $OUTPUT_FILE_NAME
```

Calculate and output pHash values for multiple png images. (12 x 12bit).  
Calculating the hash values in real time is time-consuming and inefficient because the image files need to be loaded in the browser, so the hash values are calculated in advance.  
It is easier to handle png file names if they are IDs (numbers) to identify them.  
Example (1.png)
```bash
./lib/target/release/hash ./png_images ./src/hash
```

A text file like the following will be output. The [filename]|[hash value] will be an enumerated string.
```bash
1|wAFxDESsSCtlqa6yYM/IUEYU 1|wAF2CE3oiCZtMqTxYk6mCAR0 1|RIt3xMhoyCZtKKVyYM6QOES0....
```

## Usage
### Webpack compile and use
Place the above hash file in . /src/hash.  
The following command will output the entry point and WASM to the dist directory.
```bash
npm install
npm run build
```

### Loading in a web page
The video tag and canvas tag (display:none) are required, and the webpack pre-compiled files are loaded and used as follows.

```html
<meta name="viewport" content="width=device-width,initial-scale=1"><!--This setting is mandatory for smartphones. -->

<video id="video" autoplay playsinline></video>
<canvas id="frame" style="display: none;"></canvas>

<script type="text/javascript" src="./image-scanner.ja.js"></script>
<script type="text/javascript">
  imageScannerStart(
    200, // Camera scan frame width(px)
    200, // Camera scan frame height(px)
    100, // Camera scan frame y axis(px)
    document.getElementById("video"), // video element
    document.getElementById("frame") // canvas element
  ).then(res => {
    console.log('Success!: id=' + res)
  }).catch(err => {
    console.log(err)
  })
</script>
```