importClass(android.os.Build);
importClass(android.os.Build);
importClass(android.graphics.Color);
importClass(org.opencv.core.Mat);
importClass(org.opencv.android.Utils);
importClass(android.graphics.Bitmap);
importClass(org.opencv.core.Size);
importClass(org.opencv.imgproc.Imgproc);
var MatOfPoint = org.opencv.core.MatOfPoint;
var MatOfPoint2f = org.opencv.core.MatOfPoint2f;
importClass(org.opencv.core.Point);
var Scalar = org.opencv.core.Scalar; // Define Scalar class

//辅助脚本
//var helper = tool.readJSON("helper");

let ITimg = {};
//识别的小图,ocr文字
ITimg.elements = {
    "content": "",
    "number": 0
};
ITimg.results = false;
ITimg.gallery_info = JSON.parse(files.read("./library/gallery/gallery_message.json"), (encoding = "utf-8"));
//ITimg.language = ITimg.gallery_info.服务器;
//整数原子变量,确保计时准确
ITimg.timer_lock = threads.atomic(0);


/**
 * 初始化ITimg识别函数的一些参数默认值,申请截图权限,设置异常超时
 * @param {object} picture_default - 设置picture函数的参数默认值
 * @param {object} ocr_default - 设置OCR文字识别函数的参数默认值
 */
function Prepare(picture_default, ocr_default, outline_default) {
    let context;
    (function() {
        context = this;
    }());
    if (this === context) {
        return new Prepare(picture_default, ocr_default, outline_default);
    };

    if (!picture_default) {
        picture_default = {};
    };
    if (!ocr_default) {
        ocr_default = {}
    };
    if (!outline_default) {
        outline_default = {}
    };
    //属性为undefined时不会在日志中显示
    this.picture = {
        timing: picture_default.timing || 0,
        area: picture_default.area || "全屏",
        nods: picture_default.nods || 0,
        threshold: picture_default.threshold || 0.8,
        grayscale: picture_default.grayscale || undefined,
        resolution: picture_default.resolution || helper.full_resolution || undefined,
        small_image_catalog: picture_default.small_image_catalog || "./library/gallery/",
        matchTemplate_max: picture_default.matchTemplate_max || 5,
    };
    this.ocr = {
        timing: ocr_default.timing || 0,
        area: ocr_default.area || "全屏",
        nods: ocr_default.nods || 0,
        part: ocr_default.part || false,
        similar: ocr_default.similar || 0.75,
        resolution: ocr_default.resolution || undefined,
        ocr_type: ocr_default.ocr_type || helper.defaultOcr,
        correction_path: ocr_default.correction_path || undefined,

    };
    this.outline = {
        type: outline_default.type || "BINARY",
        size: outline_default.size || 10,
        isdilate: outline_default.isdilate,
        timing: outline_default.timing || 0,
        area: outline_default.area || "全屏",
        nods: outline_default.nods || 0,
    }

    ITimg.default_list = this;

    $debug.setMemoryLeakDetectionEnabled(true);

    if (helper.image_monitor && (app.autojs.versionCode > 8082200)) {
        ITimg.permission_detection = false;
        setTimeout(function() {
            ITimg.permission_detection = true;
        }, 60000 * 15)
    }
    log("图库全分辨率兼容：" + this.picture.resolution)
    if (this.picture.resolution) {
        log("缩放参数:" + scaleSet(2, undefined, true))
    }

    if (!$images.getScreenCaptureOptions()) {
        switch (helper.截图方式) {
            case "辅助":
                申请截图();
                break;
            case "Shizuku":
                $shell.setDefaultOptions({
                    adb: true
                });

                break;
        }
        if (helper.异常超时) {
            threads.start(function() {
                let is = 6;
                console.info("异常界面超时暂停处理：" + (is / 2) + "分钟。" + helper.执行);

                fn = function() {
                    if (ITimg.timer_lock == is) {

                        toast("程序在" + (is / 2) + "分钟内未能判断当前界面，状态异常，将暂停并返回桌面")
                        console.error("程序在" + (is / 2) + "分钟内未能判断当前界面，状态异常，将暂停并返回桌面")

                        tool.Floaty_emit("暂停", "状态异常");
                    } else if (ITimg.elements.number > 50) {
                        toast("程序在当前界面连续识别到同一内容" + ITimg.elements.number + "次，状态异常，将暂停并返回桌面")
                        console.error("程序在当前界面连续识别到同一内容" + ITimg.elements.number + "次，状态异常，将暂停并返回桌面")

                        tool.Floaty_emit("暂停", "状态异常");
                    }
                    if (ITimg.timer_lock == "暂停") {
                        return
                    }
                    if (ITimg.results == null || ITimg.results == false) {
                        ITimg.timer_lock.getAndIncrement();
                    } else {
                        ITimg.timer_lock = threads.atomic(0)
                    }

                }
                //每分钟检测一次
                setInterval(fn, 1000 * 60)

            })
        } else {
            log("异常界面超时暂停：" + helper.异常超时)
        }
    }


}

function 申请截图() {
    console.verbose("申请截图")
    if (typeof ITimg.results != "number") {
        ITimg.results = 5;
    }
    while (ITimg.results) {

        $settings.setEnabled('foreground_service', true);
        sleep((typeof ITimg.results != "number" ? 5 : ITimg.results) * 150);
        if (helper.自动授权截图) {
            if (storages.create("Doolu_download").get("Capture") != "true") {
                sleep(20)
                console.verbose("确认线程启动中");
                sleep(30)
                threads.start(function() {
                    if (device.brand != "HUAWEI") {
                        if (device.release != 11) {
                            //  if (files.read("./lib/prototype/Capture.txt") != "true") {
                            var checked;
                            if (checked = idMatches(/(.*checkbox.*|.*remember.*)/).packageNameContains("com.android.systemui").findOne(500)) {
                                checked.click();
                                storages.create("Doolu_download").put("Capture", "true");
                                console.info("已勾选请求辅助截图权限不再显示");
                            };
                            //  };
                        };
                    } else {
                        console.verbose("HUAWEI")
                    }
                    if (beginBtn = classNameContains("Button").textMatches(/(.*立即开始.*|.*允许.*|.*Start now.*|.*立即開始.*|.*允許.*)/).findOne(10000)) {
                        //log(beginBtn)
                        beginBtn.click();
                    } else if (beginBtn = classNameContains("Button").textMatches(/(.*立即开始.*|.*允许.*|.*Start now.*|.*立即開始.*|.*允許.*)/).findOne(10000)) {
                        console.info("允许请求截图权限控件信息:")
                        console.info(beginBtn)
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
            if (!requestScreenCapture(isHorizontalScreen() ? width < height : height > width)) {

                //if (!requestScreenCapture({
                //    orientation: helper.模拟器 ? 1 : 2,
                //})) {

                // 请求截图权限
                toast("申请录屏(横屏辅助截图)权限被拒绝！");
                console.error("申请录屏(横屏辅助截图)权限被拒绝！");
                tool.dialog_tips("温馨提示", "PGRAssistant的PRTS辅助是图像识别脚本程序，在工作前必须先获取录屏(横屏辅助截图)权限！！！\n如需程序自动允许录屏(横屏辅助截图)权限，请前往侧边栏-设置，打开自动允许辅助截图。如果在悬浮窗面板运行时无法申请辅助截图权限，请授权PGRAssistant后台弹出界面权限", "@drawable/ic_report_problem_black_48dp");
                tool.Floaty_emit("展示文本", "状态", "状态：申请录屏权限被拒绝");
                tool.Floaty_emit("暂停", "结束程序");
                ITimg.exit = true;
                break

            } else {
                toast("请求辅助截图权限成功");

                //请求截图权限成功后启动游戏
                if (ITimg.results == 2) {
                    tool.launchPackage(ITimg.packageName);
                }
                console.info("自动请求截图权限成功!!");
                sleep(10)
                break;
            };

        } catch (cap) {
            if (cap.message.toString().indexOf("Couldn't allocate virtual display, because too much virtual display was created for the uid") != -1) {

                let tips = "申请录屏(横屏辅助截图)权限被拒绝！,请重启应用:\n" + cap.message
                toast(tips)
                console.error(tips)

                tool.Floaty_emit("展示文本", "状态", "状态：申请录屏权限被拒绝");

                tool.Floaty_emit("暂停", "结束程序");
                sleep(500);
                break
            }
            $images.stopScreenCapture();
            toast("异常，重新尝试" + cap);
            console.error("申请辅助截图异常，重新尝试\n" + cap);
            // $settings.setEnabled('foreground_service', false);
            sleep(300);
        };

        let tips = "PGRAssistant多次尝试申请辅助截图权限失败! 请查看运行日志-确认报错信息,打开相关权限:'通知','后台弹出界面(小米,vivo才有)',或保持后台省电策略无限制。"

        switch (ITimg.results) {
            case 1:
                toast(tips)
                console.error(tips);

                tool.Floaty_emit("展示文本", "状态", "状态：请求截图权限出错");
                tool.Floaty_emit("暂停", "结束程序");
                exit();
                break
            case 3:
                ITimg.packageName = tool.currentPackage();
                toastLog(tips + "\n\n现在尝试启动PGRAssistant到前台重新尝试")
                app.launchPackage(context.getPackageName());
                sleep(2500);
                break
        }

        ITimg.results--;
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
 * @return png格式图片的字节数组
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
        if (!files.exists(package_path + "/mrfz/screencap.sh")) {
            files.create(package_path + "/mrfz/screencap.png")
            files.create(package_path + "/mrfz/screencap.sh");
            shell("chmod 777 " + package_path + "/mrfz/screencap.png");
            files.write(package_path + "/mrfz/screencap.sh", "screencap -p " + package_path + "/mrfz/screencap.png")
        }
        shell("sh " + package_path + "/mrfz/screencap.sh")
    } catch (err) {
        console.error("adb异常，请确认已在Shizuku应用中授权" + err);
        toast("adb异常，请确认已在Shizuku应用中授权" + err);

        //  tool.Floaty_emit("暂停", "结束程序");
        sleep(500);
        exit();
    }
    sleep(10);
    return images.read(package_path + "/mrfz/screencap.png");
}

function scaleSet(splitScreen, tuku_de, value) {
    splitScreen = 2;
    //判断缩放比例
    if (tuku_de == undefined) {
        tuku_de = [];
        tuku_de[0] = ITimg.gallery_info.分辨率.h;
        tuku_de[1] = ITimg.gallery_info.分辨率.w;
        //  console.error(tuku_de)
    }
    if (tuku_de[0] == height && tuku_de[1] == width) {
        return 1;
    }

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



/** 
 * 在大图中匹配小图
 * @param {string} picture - 图片名称,不包括后缀
 * @param {object} list 
 * @param {number} [list.action = undefined] - 找图识别到后立即进行的操作
 * @param {number} [list.timing = 0] - 找图识别到→action操作后等待时间
 * @param {string | number | ObjectArray} [list.area = "全屏"] - 找图识别区域, 全屏从中划分四角, 1:左上角,2:右上角,3左下角,4:右下角, 可组合
 * @param {number} [list.nods = 0] - 找不到后等待时间
 * @param {object} [list.picture = ITimg.captureScreen_()] - 在指定大图中识别
 * @param {number|boolean} [list.grayscale = undefined] - 灰度化图片,1为大图，2为小图
 * @param {boolean|string} [list.log_policy = undefined] - 识别结果日志打印策略 - true:不显示
 * @param {Number} [list.threshold = 0.8] - 图片相似度 - 0.8
 * @param {boolean} [list.resolution = false] - 使用多分辨率兼容找图 - false
 * @param {string} [list.small_image_catalog = "./mrfz/tuku/"] - picture小图片所在的文件目录
 * @param {Number} [list.matchTemplate_max = 5] - 在大图片中搜索小图片最大的结果数量
 * @returns {boolean|object} - 返回值取决于list.action
 */
function 图像匹配(picture, list) {
    if (!list) {
        list = {};
    };

    list = {
        action: list.action,
        timing: list.timing || ITimg.default_list.picture.timing,
        area: list.area || ITimg.default_list.picture.area,
        nods: list.nods || ITimg.default_list.picture.nods,
        picture: list.picture,
        threshold: list.threshold || ITimg.default_list.picture.threshold,
        grayscale: list.grayscale || ITimg.default_list.picture.grayscale,
        log_policy: list.log_policy,
        resolution: list.resolution || ITimg.default_list.picture.resolution,
        small_image_catalog: list.small_image_catalog,
        matchTemplate_max: list.matchTemplate_max,
    }

    let img;

    let imgList = list.picture || captureScreen_();

    let img_small;
    let small_image_catalog = (list.small_image_catalog || ITimg.default_list.picture.small_image_catalog) + picture + ".png";
    //多分辨率兼容
    if (list.resolution) {

        try {
            let scale = scaleSet();
            img = images.read(small_image_catalog);
            img_small = images.scale(img, scale, scale);
        } catch (e) {
            console.error("缩放失败" + e);

            img_small = images.read(small_image_catalog);
        }
        try {
            img.recycle()
        } catch (e) {};
    } else {
        img_small = images.read(small_image_catalog);
    }

    if (list.grayscale) {
        // 灰度化
        let gray = images.grayscale((list.grayscale == 1 ? imgList : img_small));
        (list.grayscale == 1 ? imgList : img_small).recycle();
        // 重要！灰度化后，图片从argb四通道变成了单通道
        //因此，需要转换为四通道才能用于找图
        if (list.grayscale == 1) {
            imgList = images.cvtColor(gray, "GRAY2BGRA");
        } else {
            img_small = images.cvtColor(gray, "GRAY2BGRA");
        };

        if (helper.调试) {
            let pngPtah = package_path + "/captureScreen/灰度化-" + list.grayscale + "-" + picture + ".png";
            files.ensureDir(pngPtah);
            images.save((list.grayscale == 1 ? imgList : img_small), pngPtah);
        }
        gray.recycle();
    }

    list.area = regional_division(list.area);

    try {
        if (list.action != 6) {
            ITimg.results = $images.findImage(imgList, img_small, {
                region: list.area,
                threshold: list.threshold,
            });
        } else {
            ITimg.results = $images.matchTemplate(imgList, img_small, {
                region: list.area,
                max: list.matchTemplate_max || ITimg.default_list.picture.matchTemplate_max,
                threshold: list.threshold
            });
        }
    } catch (err) {
        if (err.message != "java.lang.NullPointerException: template = null") {
            toast("识图程序发生异常，返回false\n" + picture + err)
            console.error("识图程序发生异常，返回false\n" + picture + err);
        } else {
            console.error("-要匹配的 '" + picture + ".png' 图片为空，返回false。错误信息：" + err.message)
        }
        try {
            imgList.recycle()
            img_small.recycle()
        } catch (e) {}

        return false
    }
    try {
        !imgList.isRecycled() && imgList.recycle();
    } catch (e) {}
    if (ITimg.results) {
        let img_small_xy = {
            w: img_small.getWidth(),
            h: img_small.getHeight()
        }
        //回收图片
        img_small.recycle();
        ITimg.timer_lock = threads.atomic(0);
        if (ITimg.elements.content == picture) {
            ITimg.elements.number = ITimg.elements.number + 1;
        } else {
            ITimg.elements = {
                "content": picture,
                "number": 0
            };
        }
        ITimg.results.x = ITimg.results.x + random((ITimg.results.x > 10) ? -5 : 0, 10);
        ITimg.results.y = ITimg.results.y + random((ITimg.results.y > 10) ? -5 : 0, 10);
        switch (list.action) {

            case 0:
                sleep(50);
                //click_s(cx,cy)
                click(ITimg.results.x + img_small_xy.w / 2, ITimg.results.y + img_small_xy.h / 2);
                break;
            case 1:
                click(ITimg.results.x + 10, ITimg.results.y + 10);
                break
            case 2:
                click(ITimg.results.x + img_small_xy.w, ITimg.results.y)
                break
            case 3:
                click(ITimg.results.x, ITimg.results.y + img_small_xy.h);
                break
            case 4:
                click(ITimg.results.x + img_small_xy.w, ITimg.results.y + img_small_xy.h);
                break

            case 5:
                return {
                    "x": ITimg.results.x,
                    "y": ITimg.results.y,
                    "w": img_small_xy.w,
                    "h": img_small_xy.h,
                    "left": ITimg.results.x,
                    "top": ITimg.results.y,
                    "right": ITimg.results.x + img_small_xy.w,
                    "bottom": ITimg.results.y + img_small_xy.h,
                };
            case 6:
                return ITimg.results;

        };
        (list.log_policy || ITimg.default_list.picture.log_policy) ? "" : console.info(picture + " 匹配成功 " + ITimg.results);

        sleep(list.timing);
        return true;
    } else {
        img_small.recycle();
        sleep(list.nods);
        (list.log_policy || ITimg.default_list.picture.log_policy) ? "" : console.error("" + picture + " 匹配失败\n--找图配置：" + JSON.stringify(list));

        return false;

    };
}


/**
 * 对图片 进行文字识别,并匹配words文字
 * @param {string} words - 需要识别的文字
 * @param {object} list 
 * @param {number} [list.action = undefined] - ocr识别到后立即进行的操作
 * @param {number} [list.timing = 0]  - ocr识别到后等待时间
 * @param {string | number | ObjectArray} [list.area = "全屏"] - 找图识别区域, 全屏从中划分四角, 1:左上角,2:右上角,3左下角,4:右下角, 可组合
 * @param {object} [list.picture = ITimg.captureScreen_()] - 在指定大图中识别
 * @param {number} [list.nods = 0] - 没有匹配到相关的文字后等待时间
 * @param {boolean} [list.part = fasle] - text需要包含字符串words的筛选条件
 * @param {number} [list.similar = 0.7] - 中文模糊匹配相似度,基于字形计算因子
 * @param {boolean} [list.refresh = true] - 是否重新截图界面,在新图片中识别, false:不刷新
 * @param {boolean|object} [list.resolution = false] - 使用多分辨率兼容(缩放大图)识别文字
 * @param {object} [list.gather] - 仅在该数据集{text,left,top,right,bottom}中匹配words文字
 * @param {boolean|string} [list.log_policy = false] - 识别结果日志打印策略. brief:'简短' / true:不显示
 * @param {string} [list.ocr_type = "MlkitOCR"] - ocr扩展类型
 * @param {boolean | object} [list.resolution = false] - 使用多分辨率兼容(调整大图片大小)识别文字,可使用{w:w,h:h}指定大小
 * @param {string} [list.correction_path = false] - ocr识别字符纠正规则json文件路径
 * @returns {boolean|object} - 返回值取决于list.action
 */
function ocr文字识别(words, list) {

    if (!list) {
        list = {};
    }
    list = {
        action: list.action,
        timing: list.timing || ITimg.default_list.ocr.timing,
        picture: list.picture,
        area: list.area || ITimg.default_list.ocr.area,
        nods: list.nods || ITimg.default_list.ocr.nods,
        part: list.part || ITimg.default_list.ocr.part,
        similar: list.similar || ITimg.default_list.ocr.similar,
        refresh: list.refresh,
        resolution: list.resolution || ITimg.default_list.ocr.resolution,
        gather: list.gather,
        log_policy: list.log_policy,
        ocr_type: list.ocr_type || ITimg.default_list.ocr.ocr_type,
        correction_path: list.correction_path || ITimg.default_list.ocr.correction_path
    }
    if (!ITimg.MlkitOCR_module && !ITimg.XiaoYueOCR_module) {
        if (!initocr(list.ocr_type)) {
            return false;
        };
    }
    list.area = regional_division(list.area);
    if (!list.gather) {
        if (list.refresh === undefined || list.refresh == true) {
            //多分辨率兼容
            if (list.resolution) {
                try {
                    if (typeof list.resolution == "object") {
                        list.picture = images.resize(captureScreen_(), [list.resolution.h, list.resolution.w])
                    } else {
                        list.picture = images.resize(captureScreen_(), [height, width])
                    }
                } catch (e) {
                    console.error("缩放失败" + e);

                }

            }

            ITimg.results = ITimg[list.ocr_type + "_module"].detect((list.picture || captureScreen_()), {
                "region": list.area,
                "rectify_json_path": list.correction_path,
            });

            if (list.action == 6) {
                return ITimg.results;
            }
        }
    }
    query_ = undefined;
    //true=匹配部分文字
    if (list.part) {
        query_ = (list.gather || ITimg.results).find(ele => {
            if (ele.text.indexOf(words) != -1) {
                if (list.gather) {
                    if (ele.left >= list.area[0] &&
                        ele.left < list.area[0] + list.area[2] && // 修正：判断 left 是否在指定范围内
                        ele.top >= list.area[1] &&
                        ele.top < list.area[1] + list.area[3] && // 修正：判断 top 是否在指定范围内
                        ele.right - ele.left <= list.area[2] &&
                        ele.bottom - ele.top <= list.area[3]) { // 保持原来的宽度和高度判断
                        return true;
                    }
                } else {
                    return true;
                }

            }
        });
        list.similar = undefined;
    } else {
        //模糊匹配
        query_ = (list.gather || ITimg.results).find(ele => {
            let similar = list.similar;
            list.similar = tool.nlpSimilarity(ele.text, words);
            if (list.similar >= similar) {
                if (list.gather) {

                    if (ele.left >= list.area[0] &&
                        ele.left < list.area[0] + list.area[2] && // 修正：判断 left 是否在指定范围内
                        ele.top >= list.area[1] &&
                        ele.top < list.area[1] + list.area[3] && // 修正：判断 top 是否在指定范围内
                        ele.right - ele.left <= list.area[2] &&
                        ele.bottom - ele.top <= list.area[3]) { // 保持原来的宽度和高度判断
                        return true;
                    }
                } else {
                    return true;
                }
            } else {
                list.similar = similar;
                return false;
            };
        });
    };

    if (query_ != undefined) {

        if (ITimg.elements.content == words) {
            ITimg.elements.number = ITimg.elements.number + 1;
        } else {
            ITimg.elements = {
                "content": words,
                "number": 0
            };
        }


        switch (list.log_policy) {
            case undefined:
            case false:
                console.info("-" + words + " 匹配成功\n--ocr配置：" + JSON.stringify(list) + "\n---内容：" + JSON.stringify(query_));
                break
            case true:
                break
            case "brief":
            case "简短":
                console.info("-" + words + " 匹配成功");

                break
        }
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
                click(query_.right, query_.top);
                break
            case 3:
                click(query_.left, query_.bottom);
                break
            case 4:
                click(query_.right, query_.bottom);
                break
            case 5:
                return query_;
            case 6:
                return ITimg.results;
        }
        sleep(list.timing)
        return true;
    } else {
        sleep(list.nods);
        switch (list.log_policy) {
            case undefined:
            case false:
                console.error("-" + words + " 未匹配到\n--ocr配置：" + JSON.stringify(list) + "\n---识别结果：" + JSON.stringify(ITimg.results));
                break
            case true:
                break
            case "brief":
            case "简短":
                list.gather ? list.gather = "隐藏" : '';
                console.error("-" + words + " 未匹配到\n--ocr配置：" + JSON.stringify(list))
                break
        }

        return false;

    }


}

//二值化图像并查找轮廓
function binarized_contour(list) {

    if (!list) {
        list = {};
    }
    list = {
        canvas: list.canvas,
        action: list.action,
        timing: list.timing || ITimg.default_list.outline.timing,
        picture: list.picture,
        threshold: list.threshold || 100,
        type: list.type || ITimg.default_list.outline.type,
        size: list.size,
        isdilate: list.isdilate || ITimg.default_list.outline.isdilate,
        filter_w: list.filter_w,
        filter_h: list.filter_h,
        filter_vertices: list.filter_vertices,
        area: list.area || ITimg.default_list.outline.area,
        nods: list.nods || ITimg.default_list.outline.nods,
        log_policy: list.log_policy,
    }
    list.area = regional_division(list.area);

    let img_ = list.picture || ITimg.captureScreen_();
    //长时间持有图片
    let img = images.copy(img_, true);
    !img_.isRecycled() && img_.recycle();
    let roiBitmap;
    try {
        roiBitmap = Bitmap.createBitmap(img.bitmap, list.area[0], list.area[1], list.area[2], list.area[3]);
    } catch (e) {
        console.error(e)
        img = ITimg.captureScreen_();
        roiBitmap = Bitmap.createBitmap(img.bitmap, list.area[0], list.area[1], list.area[2], list.area[3]);
    }
    if (roiBitmap.width == height && roiBitmap.height == width) {
        console.verbose("全屏查找矩形")
        roiBitmap = Bitmap.createBitmap(list.area[2], list.area[3], Bitmap.Config.ARGB_8888);
        let canvas = new Canvas(roiBitmap);
        canvas.drawBitmap(img.bitmap, list.area[0], list.area[1], null);
    }
    let mat = new Mat();
    Utils.bitmapToMat(roiBitmap, mat);
    // img.recycle();
    // 转换为灰度图像
    Imgproc.cvtColor(mat, mat, Imgproc.COLOR_BGR2GRAY);
    /*// 降噪
    let imgBlur = mat.clone();
    Imgproc.GaussianBlur(mat, imgBlur, Size(3, 3), 0);
    mat.release();
    */
    // 二值化图像
    Imgproc.threshold(mat, mat, list.threshold, 255, Imgproc["THRESH_" + list.type]);
    if (list.size) {
        // 创建一个结构元素 15
        let kernelSize = list.size; // 结构元素的大小
        let element = Imgproc.getStructuringElement(Imgproc.MORPH_RECT, new Size(kernelSize, kernelSize));
        if (!list.isdilate) {
            //执行图像腐蚀
            Imgproc.erode(mat, mat, element);
        } else {
            // 执行膨胀操作
            Imgproc.dilate(mat, mat, element);
        }
    }
    //查找直边界矩形，多线程的情况下ITimg.results容易和ocr的冲突，所以就改名
    ITimg.results_contour = new java.util.ArrayList();
    let hierarchy = new Mat();
    Imgproc.findContours(mat, ITimg.results_contour, hierarchy, Imgproc.RETR_EXTERNAL, Imgproc.CHAIN_APPROX_SIMPLE);
    if (list.canvas) {
        // 在原始图像上绘制直边界矩形
        rectPaint = new Paint();
        rectPaint.setStyle(Paint.Style.STROKE);
        rectPaint.setStrokeWidth(3);
        rectPaint.setColor(Color.RED);

        rectPaint.setTextSize(30);
        rectPaint.setTextAlign(Paint.Align.CENTER);

        // img = images.matToImage(mat);
        if (typeof list.canvas == "string") {
            list.canvas = {
                name: list.canvas
            }
        } else {
            list.canvas = {};

        }
        list.canvas.img = new Canvas(img);
        !img.isRecycled() && img.recycle();
        Utils.matToBitmap(mat, roiBitmap);
        list.canvas.img.drawBitmap(roiBitmap, list.area[0], list.area[1], rectPaint)

    } else {
        !img.isRecycled() && img.recycle();

    }
    roiBitmap && roiBitmap.recycle();
    let query_contour = [];

    // 循环处理每个轮廓
    for (let i = 0; i < ITimg.results_contour.size(); i++) {
        let contour = ITimg.results_contour.get(i);
        let boundingRect = Imgproc.boundingRect(contour);

        let outline_x = boundingRect.x + list.area[0];
        let outline_y = boundingRect.y + list.area[1];
        let outline_width = boundingRect.width;
        let outline_height = boundingRect.height;
        if (outline_width < list.filter_w || outline_height < list.filter_h || (outline_width == width && outline_height == height)) {
            continue;
        }
        let approxCurve = new MatOfPoint2f();
        let contour2f = new MatOfPoint2f(contour.toArray());
        let epsilon = 0.02 * Imgproc.arcLength(contour2f, true);
        Imgproc.approxPolyDP(contour2f, approxCurve, epsilon, true);
        let vertices = approxCurve.toArray();
        let shape, circularity_;
        if (list.filter_vertices && vertices < list.filter_vertices) {
            continue;
        }
        // 根据轮廓顶点数量判断形状
        if (vertices.length == 3) {
            // 三角形
            shape = "三角形"
        } else if (vertices.length == 4) {
            // 矩形或正方形
            //  let rect = Imgproc.boundingRect(new MatOfPoint(contour.toArray()));
            let aspectRatio = outline_width / outline_height;
            if (aspectRatio >= 0.95 && aspectRatio <= 1.05) {
                shape = "正方形"
            } else {
                shape = "长方形"
            }
        } else {
            // 圆形或其他形状
            let area = Imgproc.contourArea(contour);
            let perimeter = Imgproc.arcLength(new MatOfPoint2f(contour.toArray()), true);
            let circularity = 4 * Math.PI * area / (perimeter * perimeter);
            circularity_ = circularity.toFixed(2)

            if (circularity >= 0.85) {
                shape = "圆形"
            } else {
                shape = "其他形状"
            }
        }



        query_contour.push({
            shape: shape,
            x: outline_x,
            y: outline_y,
            w: outline_width,
            h: outline_height,
            left: outline_x,
            right: outline_x + outline_width,
            top: outline_y,
            bottom: outline_y + outline_height,
            vertices: vertices.length,
            circularity: circularity_
        });


        // console.info("矩阵：" + query_contour.length + "，形状：" + query_contour[query_contour.length - 1].shape + "，数据：xy:" + outline_x, outline_y + "，wh:" + outline_width, outline_height + "，顶点：" + vertices.length);
        if (list.canvas) {

            list.canvas.img.drawText(
                query_contour[query_contour.length - 1].shape,
                outline_x + outline_width / 2,
                outline_y + outline_height + Math.abs(rectPaint.getFontMetrics().top - 10),
                rectPaint
            );
            flattenedPoints = []
            // 计算坐标，绘制轮廓
            vertices.map(function(vertex) {
                vertex.x = vertex.x + list.area[0];
                vertex.y = vertex.y + list.area[1];
                flattenedPoints.push(vertex.x)
                flattenedPoints.push(vertex.y)
                if (flattenedPoints.length % 4 == 0) {
                    flattenedPoints.push(flattenedPoints[flattenedPoints.length - 2])
                    flattenedPoints.push(flattenedPoints[flattenedPoints.length - 2])

                }

                return [vertex.x, vertex.y];
            });
            flattenedPoints.push(flattenedPoints[0]);
            flattenedPoints.push(flattenedPoints[1]);
            list.canvas.img.drawLines(flattenedPoints, rectPaint)
            //list.canvas && list.canvas.drawRect(outline_x, outline_y, outline_x + outline_width, outline_y + outline_height, rectPaint);
        }
    }
    if (list.canvas) {

        list.canvas.img = list.canvas.img.toImage();
        let pngPtah = package_path + "/binarized_contour_" + (list.canvas.name || "") + "visualization.jpg";
        files.ensureDir(pngPtah);

        images.save(list.canvas.img, pngPtah, "jpg", 50);
        list.canvas.img.recycle();
        //app.viewFile(pngPtah);
    }

    if (list.action == 6) {
        return ITimg.results_contour;
    }

    list.canvas ? list.canvas = undefined : undefined;
    if (list.picture) {
        !list.picture.isRecycled() && list.picture.recycle()
        list.picture = "隐藏"
    }

    if (query_contour.length > 0) {
        ITimg.elements = {
            "content": null,
            "number": 0
        };

        switch (list.log_policy) {
            case undefined:
            case false:
                console.info("-匹配到矩阵数量：" + query_contour.length + "，总数：" + ITimg.results_contour.size() + "\n--矩阵配置：" + JSON.stringify(list) + "\n---内容：" + JSON.stringify(query_contour));

                break
            case true:
                break
            case "brief":
            case "简短":
                console.info("-匹配到矩阵数量：" + query_contour.length + "，总数：" + ITimg.results_contour.size());
                break
        }
        switch (list.action) {
            case 0:

                MyAutomator.click(query_contour[0].left + Math.floor(query_contour[0].w / 2), query_contour.top + Math.floor(query_contour[0].h / 2));
                break;

                //点击文字左上角
            case 1:
                MyAutomator.click(query_contour[0].left, query_contour[0].top);
                break
            case 2:
                MyAutomator.click(query_contour[0].right, query_contour[0].top);
                break
            case 3:
                MyAutomator.click(query_contour[0].left, query_contour[0].bottom);
                break
            case 4:
                MyAutomator.click(query_contour[0].right, query_contour[0].bottom);
                break
            case undefined:
            case 5:
                return query_contour;
        }
        sleep(list.timing);
        return true;
    } else {
        sleep(list.nods);
        switch (list.log_policy) {
            case undefined:
            case false:
                console.error("-未匹配到矩阵，总数：" + ITimg.results_contour.size() + "\n--矩阵配置：" + JSON.stringify(list));
                break
            case true:
                break
        }

        return false;
    }


}

function regional_division(region) {
    switch (region) {
        case '全屏':
        case 0:
            return [0, 0, height, width]

        case '左上半屏':
        case 1:
            return [0, 0, height / 2, width / 2];

        case '右上半屏':
        case 2:
            return [height / 2, 0, height / 2, width / 2]

        case '左下半屏':
        case 3:
            return [0, width / 2, height / 2, width / 2]

        case '右下半屏':
        case 4:
            return [height / 2, width / 2, height / 2, width / 2];


        case '左半屏':
        case 13:
            return [0, 0, height / 2, width];

        case '右半屏':
        case 24:
            return [height / 2, 0, height / 2, width]

        case '上半屏':
        case 12:
            return [0, 0, height, width / 2];

        case '下半屏':
        case 34:
            return [0, width / 2, height, width / 2]
        default:
            return region
    }
}


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
                imgList = captureScreen();
                //图片监测
            } else {
                //64位
                if (app.autojs.versionCode > 8082200) {
                    imgList = captureScreen();
                    //重新申请截图权限,并创建定时器
                    if (ITimg.permission_detection) {
                        console.warn("截图权限监测：间隔15分钟重新申请辅助截图权限")
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
                        ITimg.permission_detection = false;
                        setTimeout(function() {
                            ITimg.permission_detection = true;
                        }, 60000 * 15);

                    }
                } else {
                    //32位
                    img = captureScreen();
                    //console.timeEnd("captureScreen")
                    try {
                        imgList = images.copy(img, true);
                        //图片代理
                        if (!helper.图片代理) {
                            img.recycle();
                        }
                    } catch (imgd) {
                        console.error(imgd);
                        console.error("图片似乎已被回收，重新申请辅助截图权限");
                        try {
                            imgList.recycle()
                        } catch (err) {}
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

function initocr(value) {
    if (!value && (ITimg.XiaoYueOCR_module || ITimg.MlkitOCR_module)) return true;
    // helper.defaultOcr = 'MlkitOCR';
    let ocr;

    switch (value || helper.defaultOcr) {
        case 'XiaoYueOCR':
            ocr = require("./modules/xiaoyueocr.js");
            if (!ocr.isInstalled()) {
                toastLog("未安装OCR扩展，无法使用对应功能\n请打开侧边栏-设置,获取OCR扩展下载安装");
                tool.Floaty_emit("展示文本", "状态", "状态：未安装OCR扩展，无法使用对应功能");
                return false;
            }

            ITimg.XiaoYueOCR_module = ocr.prepare();
            if (ITimg.XiaoYueOCR_module.hasOwnProperty('initResult') && !ITimg.XiaoYueOCR_module.initResult) {

                tool.Floaty_emit("展示文本", "状态", "状态：已安装的OCR无法使用");
                toastLog("已安装OCR扩展，但初始化失败,无法使用\n请打开侧边栏-运行日志查看详细报错,尝试解决. 或更换其他OCR扩展");
                return false;
            }

            return ITimg.XiaoYueOCR_module;
        case 'MlkitOCR':
            ocr = require("./modules/mlkitocr.js");
            if (!ocr.isInstalled()) {
                toastLog("未安装OCR扩展，无法使用对应功能\n请打开侧边栏-设置,获取OCR扩展下载安装");
                tool.Floaty_emit("展示文本", "状态", "状态：未安装OCR扩展，无法使用对应功能");
                return false;
            }

            ITimg.MlkitOCR_module = ocr.prepare();

            return ITimg.MlkitOCR_module;
        default:
            tips = "未符合的ocr类型:" + value;
            toast(tips);
            console.error(tips);
            tool.Floaty_emit("展示文本", "状态", "状态：" + tips);
            return false

    }
    // tool.Floaty_emit("展示文本", "状态", "状态：校验OCR插件是否可用...");



}

function 重置计时器(i) {
    if (!i) {
        ITimg.timer_lock = "暂停";
    } else {
        ITimg.timer_lock = threads.atomic(0);
    }
}

ITimg.ocr = ocr文字识别;
ITimg.MlkitOCR = function(words, list) {
    if (!ITimg.MlkitOCR_module) {
        if (!initocr("MlkitOCR")) {
            return false;
        };
    }
    if (!list) {
        list = {};
    }
    list.ocr_type = "MlkitOCR";
    return ocr文字识别(words, list);
}
ITimg.XiaoYueOCR = function(words, list) {
    if (!ITimg.XiaoYueOCR_module) {
        if (!initocr("XiaoYueOCR")) {
            return false;
        };
    }
    if (!list) {
        list = {};
    }
    list.ocr_type = "XiaoYueOCR";
    return ocr文字识别(words, list);
}
ITimg.Prepare = Prepare;
ITimg.initocr = initocr;
ITimg.picture = 图像匹配;
ITimg.contour = binarized_contour;
ITimg.scaleSet = scaleSet;
ITimg.申请截图 = 申请截图;
ITimg.重置计时器 = 重置计时器;
ITimg.captureScreen_ = captureScreen_;

try {
    module.exports = ITimg;
} catch (e) {
    // 用于代理图片资源，请勿移除 否则需要手动添加recycle代码
    log("加载图片代理程序")
    require('./utlis/ResourceMonitor.js')(runtime, this)

    var package_path = context.getExternalFilesDir(null).getAbsolutePath();

    var tool = require("./modules/app_tool.js");
    var helper = tool.readJSON("helper");
    var {
        getRotation,
        getWidthHeight,
        iStatusBarHeight,
        isHorizontalScreen,
    } = require('./modules/__util__.js');
    var height = device.height,
        width = device.width;

    if (width > height || helper.模拟器) {
        height = device.width,
            width = device.height;
    }
    helper.截图方式 = null;
    new ITimg.Prepare();


    // height = 2560;
    // width = 1600;
   
   let name = {
       picture_name:"112",
       canvas_name:"节点"
   }
    let picture = images.read("/storage/emulated/0/DCIM/Screenshots/"+name.picture_name+".jpg");
    // let picture = images.read("/sdcard/Pictures/QQ/存档.jpg");
    //let picture = images.read("/storage/emulated/0/脚本/script-module-warehouse/自定义执行模块/script_file/生息演算速刷/cc.jpg")
   
    let data = binarized_contour({
        canvas: name.canvas_name,
        picture: picture,
        action: 5,
          area: 0,
       // area: [Math.floor(height / 1.5), Math.floor(width / 1.35), height - Math.floor(height / 1.6), width - Math.floor(width / 1.35)],
        //  area:[0,0,2560,1600],
        //   area: [0, 0, height/4, width /4],
        isdilate: false,

        threshold: 200,
        size: 0,
        type: "BINARY",
        filter_w: 30,
        filter_h: 30,
    })




    picture.recycle();
    let pngPtah = package_path + "/binarized_contour_"+ name.picture_name +"visualization.jpg";

    app.viewFile(pngPtah)


    exit();
}