const js = import("@j7w2/phash-image-comparison");

class ImageScanner {
  private video: HTMLVideoElement
  private width: number = 0
  private height: number = 0
  private yaxis: number = 0
  private doubleCheckVal: string = ""
  private execTime: number = 0
  private canvas_hidden: HTMLCanvasElement
  private hashTexts: string = ""

  constructor(hashTexts: string, width: number, height: number, yaxis: number, video: HTMLVideoElement, canvas_hidden: HTMLCanvasElement) {
    this.hashTexts = hashTexts
    this.width = width;
    this.height = height;
    this.yaxis = yaxis;
    this.video = video
    this.canvas_hidden = canvas_hidden
  }

  public stop() {
    this.execTime = 99999
  }
  
  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  private async exec(buffer: ArrayBuffer): Promise<string> {
    let data = new Uint8Array(buffer);
    return await js.then(js => {
      let result = js.compare_image_with_hashes(data, this.hashTexts);
      const [key, score] = result.split("-")
      if (Number(score) < 28) {
        if (this.doubleCheckVal == key) {
          return key
        } else {
          this.doubleCheckVal = key
        }
      }
      return ""
    });
  }
  
  public async shatter(resolve: any, reject: any) {
    await this.sleep(50)
    var ctx_hidden = this.canvas_hidden.getContext('2d') as CanvasRenderingContext2D;
    var w = this.video.offsetWidth;
    var h = this.video.offsetHeight
    var ratio = this.video.videoWidth / this.video.clientWidth
    this.canvas_hidden.setAttribute('width', String(this.width * ratio));
    this.canvas_hidden.setAttribute('height', String(this.height * ratio));
  
    var x = (w - this.width) / 2 * ratio
    var y = this.yaxis * ratio

    const self = this
  
    ctx_hidden.drawImage(this.video,
      x, y, this.width * ratio, this.height * ratio,
      0, 0, this.width * ratio, this.height * ratio);
      this.canvas_hidden.toBlob(function (blob: Blob|null) {
      self.execTime += 1;
      if (self.execTime > 2000) {
        return false
      }
      if (blob == null) return self.shatter(resolve, reject)
      blob.arrayBuffer().then(async (buffer: ArrayBuffer) => {
        const result = await self.exec(buffer)
        console.log(result)
        if (result != "") {
          return resolve(result)
        }
        self.shatter(resolve, reject)
      })
    }, 'image/png', 0.95);
  }
}

const constrains = {
  video: {
    width: { ideal: 1280 },
    facingMode: {
      exact: 'environment'
    }
  },
  audio: false
};
let imageScanner: ImageScanner|undefined

function requestFullScreen(elem: any) {
  if (elem.requestFullScreen) {
    elem.requestFullScreen();
  }
  else if (elem.webkitRequestFullScreen) {
    elem.webkitRequestFullScreen();
  }
  else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
  }
  else if (elem.msRequestFullScreen) {
    elem.msRequestFullScreen();
  }
}

function lockOrientation(sc:any, mode: string) {
  if (sc.orientation.lock) {
    sc.orientation.lock(mode);
  }
  else if (sc.lockOrientation) {
    sc.lockOrientation(mode);
  }
  else if (sc.webkitLockOrientation) {
    sc.webkitLockOrientation(mode);
  }
  else if (sc.mozLockOrientation) {
    sc.mozLockOrientation(mode);
  }
  else if (sc.msLockOrientation) {
    sc.msLockOrientation(mode);
  }
}

function imageScannerExec(hashTexts: string, w: number, h: number, yaxis: number, video: HTMLVideoElement|null|undefined, canvas_hidden: HTMLCanvasElement|null|undefined) {
  return new Promise((resolve, reject) => {
    
    if (video === undefined || video === null) return reject("not found video element")
    if (canvas_hidden === undefined || canvas_hidden === null) return reject("not found canvas element")

    imageScanner = new ImageScanner(hashTexts, w, h, yaxis, video as HTMLVideoElement, canvas_hidden as HTMLCanvasElement)
    try {
      requestFullScreen(document.documentElement);
      setTimeout(function () {
        lockOrientation(screen, "portrait");
      }, 1);
    } catch (error) {
    }

    window.addEventListener("orientationchange", function () {
      imageScanner?.stop()
      reject("Be sure to try the screen orientation in portrait mode.")
      return
    });

    const nav = navigator as any
    var mediaDevices = nav.mediaDevices || ((nav.mozGetUserMedia || nav.webkitGetUserMedia) ? {
      getUserMedia: function (c: any) {
        return new Promise(function (y, n) {
          (nav.mozGetUserMedia ||
            nav.webkitGetUserMedia).call(navigator, c, y, n);
        });
      }
    } : null);
  
    if (!mediaDevices) {
      reject("This browser is not available.")
      return;
    }
    mediaDevices
      .getUserMedia(constrains)
      .then(function (stream: any) {
        (video as HTMLVideoElement).srcObject = stream;
        (video as HTMLVideoElement).play();
        imageScanner?.shatter(resolve, reject)
      })
      .catch(function (err: any) {
        reject(err)
      });
  });
}

import hashStrings from './hash';
export function imageScannerStart(w: number, h: number, yaxis: number, video: HTMLVideoElement|null|undefined, canvas_hidden: HTMLCanvasElement|null|undefined) {
  return imageScannerExec(hashStrings, w, h, yaxis, video, canvas_hidden)
}

export function imageScannerStop() {
  imageScanner?.stop()
}

(window as any).imageScannerStart = imageScannerStart;
(window as any).imageScannerStop = imageScannerStop;