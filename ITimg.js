
var tool = require('./utlis/app_tool.js');


//辅助脚本
var helper = tool.readJSON("helper");

var path_ = context.getExternalFilesDir(null).getAbsolutePath();
var ITimg_state = false,
    cc = threads.atomic(0);
var Floaty,
    jiance,
    ocr,
    dingshiqi;
if (app.autojs.versionCode > 8082200) {
    jiance == true;
}
var height = device.height;
var width = device.width;

if (helper.模拟器) {
    height = device.width;
    width = device.height;
}



function initialization(ocr_) {
    if (ocr_) {
        console.info(ocr_)
        ocr = ocr_;
    }
    if (files.read("./library/图片路径.txt") == "./library/gallery/") {
        switch (helper.截图方式) {
            case "辅助":
                申请截图(helper.模拟器);
                break;
            case "Shizuku":
                $shell.setDefaultOptions({
                    adb: true
                });

                break;
        }
        if (helper.异常超时) {
            threads.start(function () {
                var is;

                is = 12;
                console.info("异常界面超时暂停处理：6分钟。" + helper.执行);

                fn = function () {
                    if (cc == is && ITimg_state == null) {
                        if (is == 12) {
                            is = 6;
                        } else {
                            is = 35;
                        }
                        toast("程序在" + is + "分钟内未能判断当前界面，状态异常，将暂停并返回桌面")
                        console.error("程序在" + is + "分钟内未能判断当前界面，状态异常，将暂停并返回桌面")
                        for (let i = 0; i < engines.all().length; i++) {
                            //寻找悬浮窗脚本
                            if (engines.all()[i].toString().indexOf("Floaty") >= 0) {
                                Floaty = engines.all()[i];
                            }
                        }
                        Floaty.emit("暂停", "状态异常");
                    }
                    if (cc == "暂停") {
                        return
                    }
                    if (ITimg_state == null || ITimg_state == false) {
                        cc.getAndIncrement()
                    } else {
                        cc = threads.atomic(0)
                    }

                }
                //半分钟发一次
                setInterval(fn, 30000)

            })
        } else {
            log("异常界面超时暂停：" + helper.异常超时)
        }
    }
    //因为ocr,脚本通信无法接收,不知道为啥
    //线程阻塞? 开多线程也没用
    threads.start(function () {
        events.on("暂停", function (s_words) {
            console.info(s_words);
            device.cancelKeepingAwake()
            threads.shutDownAll();
            exit();
        });
    });
}

function 申请截图(simulator) {
    console.verbose("申请截图")
    while (true) {
        $settings.setEnabled('foreground_service', true);
        sleep(10);
        if (storages.create("Doolu_download").get("Capture_automatic") != false) {
            if (storages.create("Doolu_download").get("Capture") != "true") {
                sleep(20)
                console.verbose("确认线程启动中");
                sleep(30)
                threads.start(function () {
                    if (device.brand != "HUAWEI") {
                        if (device.release != 11) {
                            //  if (files.read("./utlis/prototype/Capture.txt") != "true") {
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
                })

            } else {
                console.info("已勾选请求辅助截图权限不再显示");
            }
        } else {
            console.verbose("未开启自动允许辅助截图权限");

        }

        sleep(200);
        try {
            console.warn("开始请求辅助截图权限\n----------如一直卡住请打开后台弹出界面权限")

            if (!requestScreenCapture({
                orientation: simulator ? 1 : 2,
            })) {
                // 请求截图权限
                toastLog("请求横屏辅助截图权限失败！");
                require("./utlis/Dialog_Tips.js").Dialog_Tips("温馨提示", "战双辅助的PRTS辅助是图像识别脚本程序，在工作前必须先获取屏幕截图权限！！！\n如需程序自动允许辅助截图权限，请前往侧边栏-设置，打开自动允许辅助截图。如果在悬浮窗面板运行时无法申请辅助截图权限，请授权战双辅助后台弹出界面权限", "@drawable/ic_report_problem_black_48dp");

                for (let i = 0; i < engines.all().length; i++) {
                    //寻找悬浮窗脚本
                    if (engines.all()[i].toString().indexOf("Floaty") >= 0) {
                        Floaty = engines.all()[i];
                    }
                }
                Floaty.emit("暂停", "结束程序");
                sleep(500);
                exit();
            } else {
                toast("请求辅助截图权限成功");

                console.info("自动请求截图权限成功!!");
                sleep(10)
                break;
            };

        } catch (cap) {
            $images.stopScreenCapture();
            toast("异常，重新尝试" + cap);
            console.error("申请辅助截图异常，重新尝试\n" + cap);
            $settings.setEnabled('foreground_service', false);
            sleep(500);
        };
    }
};

/*
function click_s(x, y) {
    //强制停止微信
    if (helper.ADB) {
        log("6668")
      let shhh = shell("input tap " + 450 + " " + 100);
        toastLog(shhh+"@@@")
    } else {
        click(x, y)
    }
}*/
/*
function rootgetScreen() {
console.time('rootScreenCapture');
let img = rootScreenCapture();
console.timeEnd('rootScreenCapture');
console.log(img);
img.saveTo(files.cwd() + '/test.png');
img.recycle();
*/
/**
 * 使用root截图
 * @returns  png格式图片的字节数组
 */
function rootgetScreen() {
    let tempBuffer = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024);
    let byteArrayOutputStream = new java.io.ByteArrayOutputStream();
    try {
        let exec = java.lang.Runtime.getRuntime().exec(['su', '-c', '/system/bin/screencap -p']);
        exec.getOutputStream().close();
        let inputStream = exec.getInputStream();
        let bufferedInputStream = new java.io.BufferedInputStream(inputStream);
        let count;
        while ((count = bufferedInputStream.read(tempBuffer)) !== -1) {
            byteArrayOutputStream.write(tempBuffer, 0, count);
        }
        bufferedInputStream.close();
        let retCode = exec.waitFor();
        // console.log(retCode);
        exec.destroy();
    } catch (e) {
        console.error($debug.getStackTrace(e));
    }
    return images.fromBytes(byteArrayOutputStream.toByteArray());
}

function adbSgetScreen() {
    //$shell.setDefaultOptions({adb : true});
    try {
        if (!files.exists(path_ + "/library/screencap.sh")) {
            files.create(path_ + "/library/screencap.png")
            files.create(path_ + "/library/screencap.sh");
            shell("chmod 777 " + path_ + "/library/screencap.png");
            files.write(path_ + "/library/screencap.sh", "screencap -p " + path_ + "/library/screencap.png")
        }
        shell("sh " + path_ + "/library/screencap.sh")
    } catch (err) {
        console.error("adb异常，请确认已在Shizuku应用中授权" + err);
        toast("adb异常，请确认已在Shizuku应用中授权" + err);
        for (let i = 0; i < engines.all().length; i++) {
            //寻找悬浮窗脚本
            if (engines.all()[i].toString().indexOf("Floaty") >= 0) {
                Floaty = engines.all()[i];
            }
        }
        Floaty.emit("暂停", "结束程序");
        sleep(500);
        exit();
    }
    sleep(10);
    return images.read(path_ + "/library/screencap.png");
}
log("多分辨率兼容：" + helper.多分辨率兼容)
if (helper.多分辨率兼容) {
    log("参数:" + scaleSet(2, undefined, true))
}

function scaleSet(splitScreen, tuku_de, value) {
    splitScreen = 2;
    //判断缩放比例
    if (tuku_de == undefined) {
        tuku_de = files.read("./library/gallery/gallery_message.json")
    }
    tuku_de = tuku_de.split("×");
    if (tuku_de.length == 1) {
        tuku_de = tuku_de.split("x");
        console.error(tuku_de)
    }
    if (tuku_de[0] == height && tuku_de[1] == width) {
        return 1;
    }
    //height
    tuku_de[0] = tuku_de[0].replace(/[^\d]/g, "")
    tuku_de[1] = tuku_de[1].replace(/[^\d]/g, "")

    let DefaultDelta = tuku_de[0] / tuku_de[1],
        DeviceDelta = height / width;
    if (value) {
        log(tuku_de[0])
        log(tuku_de[1])
        log(DefaultDelta)
        console.verbose(DeviceDelta)
        log(DefaultDelta < DeviceDelta)
        console.info(DefaultDelta < DeviceDelta ? width / tuku_de[1] : height / tuku_de[0]);
    }

    if (splitScreen == 2) {
        if (DefaultDelta > DeviceDelta) {
            return width / tuku_de[1];
        } else {
            return height / tuku_de[0];
        }
    } else {
        return width / tuku_de[0];
    }
}
$debug.setMemoryLeakDetectionEnabled(true);


/**
 * 在大图中匹配小图
 * @param {string} picture - 图片名称,不包括后缀
 * @param {object} list 
 * @param {number} [list.action = undefined] - 找图识别到后立即进行的操作
 * @param {number} [list.timing = 0] - 找图识别到后等待时间
 * @param {string|object[]} [list.area = "全屏"] - 找图识别区域
 * @param {number} [list.nods = 0] - 找不到后等待时间
 * @param {boolean} [list.grayscale = undefined] - 灰度化图片
 * @param {number} [list.threshold = 0.8] - 图片相似度
 * @returns {boolean|object} - 返回值取决于list.action
 */
function 找图(picture, list) {

    list = {
        action: list.action,
        timing: list.timing || 0,
        area: list.area || "全屏",
        nods: list.nods || 0,
        picture: list.picture,
        threshold: list.threshold || 0.8,
        grayscale: list.grayscale,
    }

    var img;

    var imgList;
    imgList = list.picture ? list.picture : captureScreen_();

    let img_small;
    if (helper.多分辨率兼容) {
        try {
            let scale = scaleSet();
            img = images.read(files.read("./library/图片路径.txt") + picture + ".png");
            img_small = images.scale(img, scale, scale);
        } catch (e) {
            console.error("缩放失败" + e);

            img_small = images.read(files.read("./library/图片路径.txt") + picture + ".png");
        }
        try {
            img.recycle()
        } catch (e) { };
    } else {
        img_small = images.read(files.read("./library/图片路径.txt") + picture + ".png");;
    }

    if (list.grayscale) {
        // 灰度化
        let gray = images.grayscale(img_small);
        // 重要！灰度化后，图片从argb四通道变成了单通道
        //因此，需要转换为四通道才能用于找图
        img_small = images.cvtColor(gray, "GRAY2BGRA");
        gray.recycle();
    }

    switch (list.area) {
        case '全屏':
            list.area = [0, 0, height, width]
            break
        case '左半屏':
            list.area = [0, 0, height / 2, width];
            break
        case '右半屏':
            list.area = [height / 2, 0, height / 2, width]
            break
        case '上半屏':
            list.area = [0, 0, height, width / 2];
            break
        case '下半屏':
            list.area = [0, width / 2, height, width / 2]
            break

        case '左上半屏':
            list.area = [0, 0, height / 2, width / 2];
            break
        case '右上半屏':
            list.area = [height / 2, 0, height / 2, width / 2]
            break
        case '左下半屏':
            list.area = [0, width / 2, height / 2, width / 2]
            break
        case '右下半屏':
            list.area = [height / 2, width / 2, height / 2, width / 2]
            break
    }

    try {
        ITimg_state = $images.findImage(imgList, img_small, {
            region: list.area,
            threshold: [list.threshold],
        });

    } catch (err) {
        if (err.message != "java.lang.NullPointerException: template = null") {
            toast("识图程序发生异常，返回false\n" + picture + err)
            console.error("识图程序发生异常，返回false\n" + picture + err);
        } else {
            console.error("要匹配的 '" + picture + ".png' 图片为空，返回false。错误信息：" + err.message)
        }
        try {
            imgList.recycle()
            img_small.recycle()
        } catch (e) { }

        return false
    }
    try {
        imgList.recycle();
        !imgList.isRecycled() && imgList.recycle();
    } catch (e) { }
   if (ITimg_state) {
        let img_small_xy = {
            w: img_small.getWidth(),
            h: img_small.getHeight()
        }
        //回收图片
        img_small.recycle();
        cc = threads.atomic(0);
        ITimg_state.x = ITimg_state.x + random(-10, 10);
        ITimg_state.y = ITimg_state.y + random(-10, 10);
        cx = ITimg_state.x + img_small_xy.w / 2;
        cy = ITimg_state.y + img_small_xy.h / 2;
        switch (list.action) {
            case 0:
                sleep(50);
                //click_s(cx,cy)
                click(cx, cy);
                break;
            case 1:
                click(ITimg_state.x+10, ITimg_state.y+10);
                break
            case 2:
                click(ITimg_state.x + img_small_xy.w, ITimg_state.y)
                break
            case 3:
                click(ITimg_state.x, ITimg_state.y + img_small_xy.h);
                break
            case 4:
                click(ITimg_state.x + img_small_xy.w, ITimg_state.y + img_small_xy.h);
                break

            case 5:
                return {
                    "x": ITimg_state.x,
                    "y": ITimg_state.y,
                    "w": img_small_xy.w,
                    "h": img_small_xy.h,
                    "left": ITimg_state.x,
                    "top": ITimg_state.y,
                    "right": ITimg_state.x + img_small_xy.w,
                    "hbottom": ITimg_state.y + img_small_xy.h,
                };
            case 6:
                toastLog("找图没有这个action")
                return "找图没有这个action";

        };
        console.info(picture + " 匹配成功 " +  ITimg_state)

        sleep(list.timing)
        return true;
    } else {
        img_small.recycle();
        sleep(list.nods);
       console.error(picture  + " 匹配失败\n找图配置：" + JSON.stringify(list));
       
        return false;

    };
}

/**
 * 对captureScreen() 进行文字识别,并匹配words文字
 * @param {string} words - 需要识别的文字
 * @param {object} list 
 * @param {number} [list.action = undefined] - ocr识别到后立即进行的操作
 * @param {number} [list.timing = 0]  - ocr识别到后等待时间
 * @param {string|object[]} [list.area = "全屏"] - ocr识别区域
 * @param {object} [list.picture = captureScreen_()] - 自定义要识别的图片
 * @param {number} [list.nods = 0] - 没有匹配到相关的文字后等待时间
 * @param {boolean} [list.part = fasle] - 仅匹配部分重要文字
 * @param {boolean} [list.refresh = true] - 是否重新截图,在新界面中识别
 * @returns {boolean|object} - 返回值取决于list.action
 */
function ocr文字识别(words, list) {
    list = {
        action: list.action,
        timing: list.timing || 0,
        picture: list.picture,
        area: list.area || "全屏",
        nods: list.nods || 0,
        part: list.part || false,
        refresh: list.refresh
    }
    //     console.info("文字：" + id_text + "， 区域:" + region_ + "， 点击:" + id_click + "， 延时:" + delayed + "，匹配方式：" + id_matching + "，重新获取：" + Refresh)
    switch (list.area) {
        case '全屏':
            list.area = [0, 0, height, width]
            break

        case '左半屏':
            list.area = [0, 0, height / 2, width];
            break
        case '右半屏':
            list.area = [height / 2, 0, height / 2, width]
            break
        case '上半屏':
            list.area = [0, 0, height, width / 2];
            break
        case '下半屏':
            list.area = [0, width / 2, height, width / 2]
            break

        case '左上半屏':
            list.area = [0, 0, height / 2, width / 2];
            break
        case '右上半屏':
            list.area = [height / 2, 0, height / 2, width / 2]
            break
        case '左下半屏':
            list.area = [0, width / 2, height / 2, width / 2]
            break
        case '右下半屏':
            list.area = [height / 2, width / 2, height / 2, width / 2]
            break
    }
    if (list.refresh == undefined || list.refresh == true) {
        result = ocr.识别(list.picture ? list.picture : captureScreen_(), list.area);
    }
    query_ = undefined;
    //true=匹配部分文字
    list.part ? query_ = result.find(ele => ele.text.indexOf(words) != -1) : query_ = result.find(ele => ele.text == words);

    if (query_ != undefined) {
        cc = threads.atomic(0);
        console.info(words + " 匹配成功\n配置：" + JSON.stringify(list) + "内容：" + JSON.stringify(query_))
        switch (list.action) {
            case undefined:
                break
            case 0:

                click(query_.left + Math.floor((query_.right - query_.left) / 2), query_.top + Math.floor((query_.bottom - query_.top) / 2))
                break;

            //点击文字左上角
            case 1:
                click(query_.left, query_.top);
                break
            case 2:
                click(query_.right, query_.top)
                break
            case 3:
                click(query_.left, query_.bottom);
                break
            case 4:
                click(query_.right, query_.bottom)
                break
            case 5:
                return query_
            case 6:
                return result;
        }
        sleep(list.timing)
        return true;
    } else {
        sleep(list.nods)
        console.error( words + " 未匹配到\n配置：" + JSON.stringify(list) + "\n识别结果：" + JSON.stringify(result));
        return false;

    }


}



function 重置计时器(i) {
    if (i == false) {
        cc = "暂停";
    } else {
        cc = threads.atomic(0);
    }
}
/**
 * 截取当前屏幕并返回一个image对象
 * @param {string} way - 截图的方式,可选: 'root' 'Shizuku' '辅助'
 * @returns {object}
 */
function captureScreen_(way) {
    way = way || helper.截图方式;
    let img;
    let imgList;
    switch (way) {
        case "root":

            imgList = rootgetScreen();
            break;
        case "Shizuku":

            imgList = adbSgetScreen()
            break;
        case "辅助":
            if (!helper.图片监测) {
                imgList = captureScreen()
            } else {
                //64位
                if (app.autojs.versionCode > 8082200) {
                    imgList = captureScreen()
                    //创建定时器
                    if (jiance) {
                        console.warn("图片监测：间隔15分钟重新申请辅助截图权限")
                        $images.stopScreenCapture();
                        sleep(100);
                        try {
                            申请截图();
                        } catch (err) {
                            console.warn(err);
                        }
                        sleep(3000);
                        switch (way) {
                            case "辅助":
                                imgList = captureScreen();
                                break;
                            case "root":
                                imgList = rootgetScreen();
                                break;
                            case "Shizuku":
                                imgList = adbSgetScreen();
                                break;
                        }
                        jiance = false;
                    } else if (!dingshiqi) {
                        dingshiqi = true;
                        setTimeout(function () {
                            jiance = true;
                            dingshiqi = false;
                        }, 60000 * 15)

                    }
                } else {
                    //32位
                    img = captureScreen();
                    //console.timeEnd("captureScreen")
                    try {
                        imgList = images.copy(img);
                        if (!!helper.图片代理) {
                            img.recycle();
                        }
                    } catch (imgd) {
                        console.error(imgd);
                        console.error("图片似乎已被回收，重新申请辅助截图权限");
                        try {
                            imgList.recycle()
                        } catch (err) { }
                        $images.stopScreenCapture();
                        sleep(100);
                        try {
                            申请截图();
                        } catch (err) {
                            console.warn(err);
                        }
                        sleep(3000);
                        switch (way) {
                            case "辅助":
                                imgList = captureScreen();
                                break;
                            case "root":
                                imgList = rootgetScreen();
                                break;
                            case "Shizuku":
                                imgList = adbSgetScreen();
                                break;
                        }

                    };
                }
            }
            break;
    }
    return imgList
}

var ITimg = {}
ITimg.picture = 找图;
ITimg.ocr = ocr文字识别;
ITimg.scaleSet = scaleSet;
ITimg.申请截图 = 申请截图;
ITimg.重置计时器 = 重置计时器;
ITimg.captureScreen_ = captureScreen_;
ITimg.initialization = initialization;

module.exports = ITimg;