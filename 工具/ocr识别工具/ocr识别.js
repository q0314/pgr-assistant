var Config = engines.myEngine().execArgv['Config'] || {
     ocr包名: "第三方Mlkit",
    //ocr包名: "官方Mlkit",
    //ocr包名: "PaddleOCR",
    可视化: true,
    识别图片: null,
    识别区域: [0, 0, device.width, device.height]
};
try{
    log(Config.ocr包名)
switch (Config.ocr包名) {
    
    case "第三方Mlkit":
        var ocr = plugins.load("com.tony.mlkit.ocr")
        break
     case "官方Mlkit":
   var ocr = plugins.load("org.autojs.autojspro.plugin.mlkit.ocr")
    case "PaddleOCR":
        // 创建OCR对象，需要先在Auto.js Pro的插件商店中下载官方PaddleOCR插件。
        // 或确认打包的APP已内置paddleocr
        var ocr = $ocr.create({
            models: 'slim',
            // 指定精度相对低但速度更快的模型，若不指定则为default模型，精度高一点但速度慢一点
        });
        break
}
}catch(e){
    throw new Error("请确认该ocr插件是否已安装/已内置\n错误信息:"+e)
    
}
var img;
if (!Config.识别图片) {
    //安卓版本低于11时，使用截图权限截图
    if (device.release > 10 && auto.rootInActiveWindow != null) {

        /*安卓11级以上版本可以使用无障碍截图

         *截图频率限制。系统限制截图最多一秒一次，否则抛出异常
         */
        img = $automator.takeScreenshot();
        log("无障碍截图")

    } else {
        //如果有无障碍权限，自动允许截图权限
        if (auto.rootInActiveWindow) {

            new java.lang.Thread(function() {
                if (device.brand != "HUAWEI") {
                    if (device.release != 11) {
                        //  if (files.read("./lib/prototype/Capture.txt") != "true") {
                        var checked;
                        if (checked = idMatches(/(.*checkbox.*|.*remember.*)/).packageNameContains("com.android.systemui").findOne(1000)) {
                            checked.click();
                            storages.create("Doolu_download").put("Capture", "true");
                            console.info("已勾选请求辅助截图权限不再显示");
                        };
                        //  };
                    };
                } else {
                    console.verbose("HUAWEI")
                }
                if (beginBtn = classNameContains("Button").textMatches(/(.*立即开始.*|.*允许.*|.*Start now.*|.*立即開始.*|.*允許.*)/).findOne(20000)) {
                    //log(beginBtn)
                    beginBtn.click();
                };

            }).start();
        }

        if (!requestScreenCapture()) {
            throw new Error("请允许截图权限!")
        }
        sleep(300)

        img = captureScreen()
        log("截图权限截图")

    }
} else {
    img = images.read(Config.识别图片);
}
if (Config.可视化) {
    var showData = require("./showData");
}


let results;
let ocrType = "识别结果/"+Config.ocr包名+" 可视化";
console.time("耗时")
switch (Config.ocr包名) {
    case '第三方Mlkit':
        importClass(android.os.Build);
        log("cpu架构：" + Build.CPU_ABI)
        log("ocr架构：" + ocr.get_ABI);

        results = ocr.detect(img, {
            region: Config.识别区域,
        });
        console.timeEnd("耗时")
        log(JSON.parse(JSON.stringify(results)))
        break
    case '官方Mlkit':
        let ocr_ = new ocr();
        results = ocr_.detect(img, {
            region: Config.识别区域,
        });
        log(results)
        ocr_.release();
        break
    case 'PaddleOCR':
        results = ocr.detect(img, {
            region: Config.识别区域,
        });
        log(results)
        ocr.release();
        break
    default:
        throw new Error("请确认识别使用的ocr插件是否已安装？");
        break
}



if (Config.可视化 && results) {
    let imgpatn = files.cwd() + "/识别结果/图片.png";
    files.ensureDir(imgpatn)
    images.save(img, imgpatn)
    showData(results, imgpatn, ocrType, Config.ocr包名);
}

img.recycle();