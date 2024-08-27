importClass(android.content.ComponentName);
runtime.unloadDex('./utlis/java/nlp-hanzi-similar-1.3.0.dex');
runtime.loadDex('./utlis/java/nlp-hanzi-similar-1.3.0.dex');

//指向Android/data/包名/file 路径
var package_path = context.getExternalFilesDir(null).getAbsolutePath();

var tool = require('./modules/app_tool.js');
tool.dialog_tips = require("./modules/Dialog_Tips.js");
var {
    isHorizontalScreen,
    getWidthHeight,
    getRotation,
} = require('./modules/__util__.js');

//读取辅助脚本配置数据
var helper = tool.readJSON("helper");

var Floating;

var height = device.height,
    width = device.width;

if (height < width || helper.模拟器) {
    height = device.width,
        width = device.height;
} else {
    log('坐标兼容', helper.坐标兼容)
    if (helper.坐标兼容) {
        setScreenMetrics(width, height);
    }
}
/**
 * 多分辨率x值自适应兼容
 * @param {number} value 
 * @returns {number}
 */
function frcx(value) {
    return Math.round((height / 2712).toFixed(2) * value);
}

/**
 * 多分辨率y值自适应兼容
 * @param {number} value 
 * @returns {number}
 */
function frcy(value) {
    return Math.round((width / 1220).toFixed(2) * value);
}

if (helper.图片代理) {
    // 用于代理图片资源，请勿移除 否则需要手动添加recycle代码
    log("加载图片代理程序")
    require('./utlis/ResourceMonitor.js')(runtime, this)
}

log("加载图片识别程序");
var ITimg = require("./ITimg.js"); //读取识图库

new ITimg.Prepare({}, {
    saveSmallImg: true,
    picture_failed_further: true,
    correction_path: "./utlis/ocr_矫正规则.json"
}, {}, {
    threshold: 0.75,
    filter_w: frcx(20),
    filter_h: frcy(20),
    saveSmallImg: true,
    picture_failed_further: true,
    imageFeatures: helper.调试,
    visualization: helper.调试
}, helper);
if (!ITimg.initocr()) {
    sleep(500)
    tips = "未安装OCR扩展，无法使用对应功能\n请打开侧边栏-设置,获取OCR扩展下载安装";
    if (ITimg.XiaoYueOCR_module && ITimg.XiaoYueOCR_module.hasOwnProperty('initResult') && !ITimg.XiaoYueOCR_module.initResult) {
        tool.Floating_emit("展示文本", "状态", "状态：已安装的OCR无法使用");
        tips = "已安装OCR扩展，但初始化失败,无法使用\n请打开侧边栏-运行日志查看详细报错,尝试解决. 或更换其他OCR扩展";
    }

    tool.dialog_tips("插件包提示", tips);
    tool.Floating_emit("暂停", "结束程序");
    tool.Floating_emit("展示文本", "状态", "状态：暂停，未安装插件");

    sleep(5000);

}



if (helper.监听键 == "上" || helper.监听键 == "下") {
    threads.start(function() {
        sleep(100);
        events.observeKey();
        if (helper.监听键 == "上") {
            events.setKeyInterceptionEnabled("volume_up", true);
        } else if (helper.监听键 == "下") {
            events.setKeyInterceptionEnabled("volume_down", true);
        }
        events.on("key_down", function(keyCode, events) {
            if (keyCode == keys.volume_up && helper.监听键 == "上") {
                toastLog("音量上键被按下，PGRAssistant将停止运行");
                tool.Floating_emit("展示文本", "状态", "状态：暂停，音量上键按下");
                tool.Floating_emit("暂停", "结束程序");
            } else if (keyCode == keys.volume_down && helper.监听键 == "下") {
                toastLog("音量下键被按下，PGRAssistant将停止运行");
                tool.Floating_emit("展示文本", "状态", "状态：暂停，音量下键按下");
                tool.Floating_emit("暂停", "结束程序");
            }
        });

    });
}
events.on("暂停", function(words) {
    log(words);
    if (words == "继续") {
        Material_await = "允许";
        return
    }
    device.cancelKeepingAwake()
    threads.shutDownAll();
    exit();
});
//作战控制器,不用管
var fight_thread = false;

var coordinate = files.exists("./library/coordinate.json") ? JSON.parse(files.read("./library/coordinate.json")) : {
    "name": width + "x" + height,
    "w": width,
    "h": height,
    "coordinate": {},
    "宿舍": {
        "宿舍房间位置": [],
        "快捷头像位置": []
    }
}
var buff_list = {
    "火队": ["易燃", "火焰轮回"],
    "雷队": ["感电", "电极", "镭射合金"],
    "物理队": ["脆弱", "机械工厂"],
    "暗队": ["腐蚀", "暗影深林"],
    "冰队": ["霜结", "猩红冰原"],
    "空队": ["空域浮台"]
}
var axis_list = {
    return_homepage: [245, 60],
    homepage_battle: [2400, 535],
    homepage_open: [2510, 860],
    activity_level_special: [1990, 660],
    furniture_beautiful: [1512, 418],
    furniture_comfortable: [1512, 603],
    furniture_practical: [1512, 790],
    furniture_quantity_plus: [1266, 1080],
    task_100_active: [2490, 1080],
    recruit_slide_left: [2080, 677, 753, 677],
    recruit_slide_right: [1193, 542, 2294, 497, 500],
    reward_slide_top: [height / 2, 930, height / 2, 200, 500],
}


for (let i in axis_list) {
    if (axis_list[i][2] === true && axis_list[i][3] === true) {
        axis_list[i] = [axis_list[i][0], axis_list[i][1]];
    } else if (axis_list[i][2] === true) {
        axis_list[i] = [axis_list[i][0], frcy(axis_list[i][1])];


    } else if (axis_list[i][3] === true) {
        axis_list[i] = [frcx(axis_list[i][0]), axis_list[i][1]];

    } else if (axis_list[i][2]) {
        if (axis_list[i].length > 3) {
            for (let k in axis_list[i]) {
                if (k == 0 || k == 2) {
                    axis_list[i][k] = frcx(axis_list[i][k]);
                } else if (k == 1 || k == 3) {
                    axis_list[i][k] = frcy(axis_list[i][k]);
                }
            }
        } else {
            axis_list[i] = [frcx(axis_list[i][0]), frcy(axis_list[i][1]), axis_list[i][2]];

        }
    } else {
        axis_list[i] = [frcx(axis_list[i][0]), frcy(axis_list[i][1])];
    }
}

let refreshTime = new Date();
refreshTime.setHours(5, 0, 0, 0);

let Day = refreshTime.getMonth() + 1; //月 
let Dat = refreshTime.getDate(); //日
if (new Date() <= refreshTime) {
    Dat = Dat - 1;
}

if (helper.今日 != Day + "." + Dat) {
    // 刷新日常任务时间记录
    console.log("日常任务时间记录已刷新");

    for (let i in helper.宿舍系列) {
        if (helper.宿舍系列[i].启用) {
            helper.宿舍任务 = true;
        }
        helper.宿舍系列[i].执行状态 = false;
    }

    tool.writeJSON("今日", Day + "." + Dat);
    tool.writeJSON("宿舍任务", helper.宿舍任务);

    tool.writeJSON("任务状态", {
        "每日登录": false,
        "日常补给": false,
        "妙算神机": false,
        "助理交流": false,
        "自动2血清": false,
    });
} else {
    for (let i in helper.宿舍系列) {
        if (helper.宿舍系列[i].启用 && !helper.宿舍系列[i].执行状态) {
            helper.宿舍任务 = true;
        }
    }
    tool.writeJSON("宿舍任务", helper.宿舍任务);

}
helper = tool.writeJSON("宿舍系列", helper.宿舍系列);

主程序();

function 主程序() {
    if (helper.matrix_recurrence) {
        require("./common/矩阵循生.js").main(function(_fight_thread) {
            fight_thread = _fight_thread;
        });

        return
    }
    进入主页();
    helper = tool.readJSON("helper");


    //领取商店每日免费血清
    采购();
    //与助理交流
    交流();
    //与妙算神机交互
    指挥局();
    helper = tool.readJSON("helper");

    //宿舍系列任务
    宿舍();
    ITimg.matchFeatures("宿舍-家具-关闭", {
        action: 0,
        timing: 2000,
        area: 2,
        threshold: 0.85,
        saveSmallImg: true,
        visualization: true,

    });
    if (!coordinate.combat || !coordinate.combat.攻击) {
        坐标配置("战斗");
    }
    if (helper.血清) {
        //领取每日登录血清
        if (!helper.任务状态.每日登录) {
            领取任务奖励(true);
        }

        //消耗血清
        消耗血清();
    }
    helper = tool.readJSON("helper");

    便笺(3000);

    //
    领取任务奖励();
    领取手册经验();
    纷争战区();
    幻痛囚笼();

    //诺曼复兴战();
    require("./common/诺曼复兴战.js")();


    历战映射();
    if (helper.返回桌面) {
        home();
    }
    tool.Floating_emit("展示文本", "状态", "状态：主程序暂停中");
    tool.Floating_emit("暂停", "结束程序");
}


function 启动(package_) {

    var gmvp = device.getMusicVolume()
    sleep(800);
    let getpackage_ = tool.currentPackage();
    switch (getpackage_) {
        //com.kurogame.haru.huawei
        case helper.包名:
            return true
        case null:
            toastLog("暂时无法获取前台应用，默认启动")
            break;
    }
    console.info(getpackage_)
    if (getpackage_ != null && getpackage_.indexOf('com.kurogame.haru') != -1) {
        return true
    }
    toastLog("启动战双中，等待启动完成");
    console.verbose(package_)
    try {
        app.launchPackage(package_ ? package_ : helper.包名)
        /*
        let intent = new Intent();
        intent.setPackage(null);
        let cn = new ComponentName(package_ ? package_ : helper.包名,null);
        intent.setComponent(cn);
        app.startActivity(intent);
        */
    } catch (e) {
        console.error("启动错误" + e)
        app.launchPackage(package_);
    }


    sleep(3000);
    switch (tool.currentPackage()) {
        case package_:
        case helper.包名:
        case "_" + helper.包名:
            break
        default:
            console.error("未匹配到的包名:" + tool.currentPackage() + "，重新启动");

            function uiLaunchApp(appName) {
                var script = '"ui";\nvar args = engines.myEngine().execArgv;\nlet appName = args.appName;\app.launchPackage(appName);exit();';
                engines.execScript("uiLaunchApp", script, {
                    arguments: {
                        appName: appName
                    }
                });
            }

            uiLaunchApp(package_ ? package_ : helper.包名);
            sleep(3000)
            break
    }
    tool.writeJSON("当前音量", gmvp);


    threads.start(function() {
        if (helper.静音) {
            device.setMusicVolume(0)
        } else if (helper.音量修复) {
            device.setMusicVolume(gmvp)
        }
    })
    return true;

}



function 检查获得奖励() {
    let OBTAINREWARDS = ITimg.ocr("集合文本", {
        action: 6,
        area: 5,
    });
    sleep(200);
    let confirm = ITimg.ocr("获得奖励", {
        action: 1,
        gather: OBTAINREWARDS,
        timing: 1000,
    }) || ITimg.ocr("OBTAIN REWARDs", {
        action: 1,
        similar: 0.8,
        gather: OBTAINREWARDS,
        log_policy: "简短",
        timing: 1000,
    }) || ITimg.ocr("OBTAINREWARDS", {
        action: 1,
        similar: 0.8,
        gather: OBTAINREWARDS,
        timing: 1000,
        log_policy: "简短",
    }) || ITimg.ocr("REWARD", {
        action: 1,
        similar: 0.8,
        gather: OBTAINREWARDS,
        timing: 1000,
        log_policy: "简短",
    }) || ITimg.ocr("奖励详情", {
        action: 1,
        similar: 0.8,
        gather: OBTAINREWARDS,
        timing: 1000,
        log_policy: "简短",
    })
    if (confirm) {
        return true;
    } else {
        confirm = ITimg.ocr("获得", {
            action: 5,
            gather: OBTAINREWARDS,
            similar: 0.8,
            log_policy: "简短",
        })
        if (confirm) {
            let confirm2 = ITimg.ocr("奖励", {
                action: 5,
                gather: OBTAINREWARDS,
                similar: 0.8,
                log_policy: "简短",
            })
            if (confirm2.left - confirm.right < frcx(20) && confirm2.bottom - confirm.bottom < frcy(20)) {
                click(confirm.left, confirm.bottom);
                sleep(200);
                click(confirm.left, confirm.bottom);
                sleep(200);
                click(confirm.left, confirm.bottom);
                sleep(600);
                return true;
            }
        }
    }
    sleep(500);
    return false;
}

function 进入主页() {
    tool.Floating_emit("展示文本", "状态", "状态：准备进入主页");

    sleep(1000);
    if (tool.currentPackage() != helper.包名) {
        if (!启动()) {
            启动();

        }
        sleep(5000)
    }
    let number = 0;
    while (true) {
        sleep(1000);
        staging = (ITimg.ocr("主界面", {
            action: 5,
            area: [0, 0, height / 4, width / 4],
        }) || ITimg.ocr("返回", {
            area: [0, 0, height / 4, width / 4],
            refresh: false,
            action: 5,
            similar: 0.72,
            threshold: 0.95,
        }));
        if (staging && staging.top < frcy(100) && staging.right < height / 4) {
            click(staging.left, staging.bottom);
            sleep(1500);
        }
        let staging = ITimg.ocr("集合", {
            action: 6,
            area: 24,
        })
        let _max = 0;

        if (staging && staging.length) {
            console.info("确认主页，右半屏文本信息", staging)
            let text_list = ["任务", "成员", "战斗", "研发", "采购"]
            for (text in text_list) {
                if (ITimg.ocr(text_list[text], {
                        action: 5,
                        gather: staging,
                    })) {
                    _max++;
                }
                if (_max >= 3) {
                           number++;
             
                    break
                }
            }
        }
        if (_max >= 3) {
            //     click(coordinate.coordinate.主页展开.x, coordinate.coordinate.主页展开.y)
            ITimg.matchFeatures("主页展开", {
                action: 0,
                area: 4,
                timing: 1000,
                threshold: 0.75,
                filter_w: frcx(50),
                saveSmallImg: true,
                visualization: true,
            })
            if(number >= 3){
            break
        }
        } else if (!ITimg.ocr("返回", {
                action: 0,
                timing: 1500,
                area: [0, 0, height / 4, width / 4],
                threshold: 0.85,
                saveSmallImg: true,
            })) {
            tool.Floating_emit("展示文本", "状态", "状态：等待进入战双主页");
            toastLog("等待加载登录");
            sleep(2000);
            log("前台包名：" + tool.currentPackage())
            if (tool.currentPackage() != helper.包名) {
                启动();
            }
            ITimg.ocr("更新", {
                action: 0,
                timing: 10000,
                area: 4,
            });
            ITimg.ocr("确定", {
                action: 0,
                timing: 2000,
                area: "下半屏"
            });
            if (ITimg.ocr("点击空白处关闭", {
                    action: 0,
                    timing: 1000,
                    refresh: false,
                    area: "下半屏"
                })) {
                while (ITimg.ocr("点击空白处关闭", {
                        action: 0,
                        timing: 1000,
                        nods: 500,
                        area: "下半屏"
                    })) {}
            }

            click(height / 2, width - frcy(90));

            sleep(500);
            //关闭纷争战区弹窗
            ITimg.matchFeatures("宿舍-家具-关闭", {
                action: 0,
                timing: 2000,
                area: 2,
                threshold: 0.8,
                saveSmallImg: "纷争战区-关闭",
                visualization: true,
            })

        }
    }
}

function 坐标配置(name, x, y) {
    if (name == "战斗") {
        tool.Floating_emit("展示文本", "状态", "状态：获取键位布局..");
        if (!coordinate.combat) {
            coordinate.combat = {};
        }
        返回主页();
        sleep(1000);
        tool.Floating_emit("展示文本", "状态", "状态：准备进入设置");
        let setup_list = ITimg.contour({
            action: 5,
            area: 4,
            canvas: "设置",
            threshold: 240,
            isdilate: true,
            size: 5,
            type: "BINARY",
            filter_w: frcx(10),
            filter_h: frcy(10),
        });
        if (!setup_list || !setup_list.length) {
            return false;
        }
        // log(setup_list);
        setup_list.sort((a, b) => b.y - a.y);
        click(setup_list[0].x, setup_list[0].y);
        sleep(1500);
        setup_list = ITimg.contour({
            action: 5,
            area: 4,
            canvas: "设置",
            threshold: 240,
            isdilate: true,
            size: 5,
            type: "BINARY",
            filter_w: frcx(10),
            filter_h: frcy(10),
        });
        if (!setup_list || !setup_list.length) {
            return false;
        }
        // log(setup_list);
        setup_list.sort((a, b) => b.y - a.y);
        click(setup_list[0].x, setup_list[0].y);
        sleep(1000);

        while (true) {
            ITimg.ocr("键位", {
                action: 1,
                area: 13,
                similar: 0.75,
                timing: 1000,
            });

            if (ITimg.ocr("前往设置", {
                    action: 1,
                    area: 2,
                    similar: 0.75,
                    timing: 2000,
                })) {
                break
            }
        }
        tool.Floating_emit("展示文本", "状态", "状态：获取键位布局...");
        let key_list;
        key_list = ITimg.contour({
            canvas: "键位",
            action: 5,
            area: 0,
            isdilate: false,
            threshold: 200,
            size: 0,
            type: "BINARY",
            filter_w: frcx(50),
            filter_h: frcy(50),
        });
        if (!key_list || key_list.length < 9) {
            sleep(1000);
            key_list = ITimg.contour({
                canvas: "键位",
                action: 5,
                area: 0,
                isdilate: false,
                threshold: 160,
                size: 0,
                type: "BINARY",
                filter_w: frcx(60),
                filter_h: frcy(90),
            });
        }

        key_list = groupColumns(key_list, true);
        let key_position = [];
        for (let id of key_list) {

            if (id.length > 1 && id[0].shape == "正方形") {

                id.sort((a, b) => b.x - b.x);
                key_position.push(id);

            } else {
                id = id[0];
                if (id.shape == "长方形" && id.w < id.h) {
                    coordinate.combat["角色1"] = {
                        "x": id.x,
                        "y": id.y,
                        "w": id.w,
                        "h": parseInt(id.h / 2),
                    };
                    coordinate.combat["角色2"] = {
                        "x": id.x,
                        "y": id.y + parseInt(id.h / 2),
                        "w": id.w,
                        "h": parseInt(id.h / 2),

                    };
                } else if (id.shape == "正方形" && id.x + id.w < height / 2 && id.y + id.h > parseInt(width / 1.5)) {
                    coordinate.combat["移动"] = {
                        "x": id.x,
                        "y": id.y,
                        "w": id.w,
                        "h": id.h,
                    };
                } else if (id.x < height / 2 && id.x + id.w > parseInt(height / 1.2)) {
                    coordinate.combat["信号球"] = {
                        "x": id.x,
                        "y": id.y,
                        "w": id.w,
                        "h": id.h,
                    };
                } else if (id.shape == "长方形" && id.w > id.h && id.y > width / 2) {
                    key_position.push([{
                        shape: '正方形',
                        x: id.x + parseInt(id.w / 1.5),
                        y: id.y,
                        w: parseInt(id.w / 3),
                        h: id.h,
                        vertices: 4
                    }, {
                        shape: '正方形',
                        x: id.x + parseInt(id.w / 3),
                        y: id.y,
                        w: parseInt(id.w / 3),
                        h: id.h,
                        vertices: 4
                    }, {
                        shape: '正方形',
                        x: id.x,
                        y: id.y,
                        w: parseInt(id.w / 3),
                        h: id.h,
                        vertices: 4
                    }])
                }
            }
        }
        console.warn(key_position)
        let key_ = key_position[0][0];
        if (key_.w > key_position[1][0].w && key_.h > key_position[1][0].h) {
            key_position.reverse();
            key_ = key_position[0][0];
        }


        coordinate.combat["辅助机"] = {
            "x": key_.x,
            "y": key_.y,
            "w": key_.w,
            "h": key_.h,

        };

        key_ = key_position[1][0];
        coordinate.combat["闪避"] = {
            "x": key_.x,
            "y": key_.y,
            "w": key_.w,
            "h": key_.h,
        };
        key_ = key_position[1][1];
        coordinate.combat["攻击"] = {
            "x": key_.x,
            "y": key_.y,
            "w": key_.w,
            "h": key_.h,
        };
        key_ = key_position[1][2];
        coordinate.combat["大招"] = {
            "x": key_.x,
            "y": key_.y,
            "w": key_.w,
            "h": key_.h,
        };

        tool.Floating_emit("展示文本", "状态", "状态：退出键位布局.");
        while (!ITimg.ocr("退出", {
                action: 1,
                timing: 1000,
                area: 13,
                nods: 1000,
            })) {

        }

        tool.Floating_emit("展示文本", "状态", "状态：保存键位布局成功");
        toastLog("保存键位布局成功");
        sleep(1000);
        返回主页()
    } else {


        coordinate.coordinate[name] = {
            "x": x,
            "y": y
        };
        log("保存坐标: " + name + "---" + JSON.stringify({
            "x": x,
            "y": y
        }));
    }

    // log(coordinate.combat)
    coordinate = {
        "name": width + "x" + height,
        "w": width,
        "h": height,
        "coordinate": coordinate.coordinate,
        "宿舍": coordinate.宿舍,
        "combat": coordinate.combat
    };
    files.write(
        "./library/coordinate.json",
        JSON.stringify(coordinate),
        (encoding = "utf-8")
    )

}


function 采购() {
    if (!helper.每日血清) {
        return
    }
    tool.Floating_emit("展示文本", "状态", "状态：领取今日补给")
    if (helper.任务状态.日常补给) {
        toastLog("今日日常补给已领取");
        return
    }
    let _max = 8;
    while (_max) {

        ITimg.ocr("采购", {
            action: 1,
            timing: 1500,
            area: 24,
            picture_failed_further: true,
        })

        if (!ITimg.ocr("补给包", {
                action: 0,
                timing: 1200,
                area: 1,
                nods: 1000,
            })) {
            _max--;
        } else {
            break;
        }
    }
    if (!_max) {
        toastLog("无法识别到采购");
        return false
    }
    tool.Floating_emit("面板", "隐藏");
    if (ITimg.ocr("补给包", {
            action: 0,
            timing: 1000,
            area: 1,
            nods: 1000,
        }) || ITimg.ocr("补给包", {
            action: 0,
            timing: 1000,
            area: 1,
            part: true,
        })) {
        (ITimg.ocr("日常补给", {
            action: 1,
            timing: 2000,
            area: 1,
        }) || ITimg.ocr("日常补给", {
            action: 1,
            timing: 2000,
            area: "左上半屏",
            part: true,
            refresh: false,
        }))
        if (ITimg.ocr("每日", {
                action: 1,
                timing: 1500,
                area: 1,
                part: true,
                log_policy: "简短",
            }) || ITimg.ocr("免费", {
                action: 1,
                timing: 1500,
                area: 1,
                part: true,
                refresh: false,
            })) {
            let week = ITimg.ocr("每周限购", {
                action: 5,
                area: 34,
                log_policy: "简短",
            }) || ITimg.ocr("每周限购", {
                action: 5,
                area: 34,
                refresh: false,
                part: true,
            });

            (ITimg.ocr("购买", {
                action: 1,
                timing: 1500,
                area: 34,
                nods: 500,
            }) || ITimg.ocr("购买", {
                action: 1,
                timing: 1500,
                area: 34,
                part: true,
                refresh: false,
                log_policy: "简短",
            }));

            click(height / 2, width - frcy(80));
            sleep(1000);

            //第二次，购买每日的
            if (week) {
                if (ITimg.ocr("每日", {
                        action: 1,
                        timing: 1500,
                        area: "左上半屏",
                        part: true,
                    }) || ITimg.ocr("免费", {
                        action: 1,
                        timing: 1500,
                        area: "左上半屏",
                        part: true,
                        refresh: false,
                    })) {
                    (ITimg.ocr("购买", {
                        action: 1,
                        timing: 1500,
                        area: 34,
                        nods: 500,
                    }) || ITimg.ocr("购买", {
                        action: 1,
                        timing: 1500,
                        area: 34,
                        part: true,
                        refresh: false,
                        log_policy: "简短",
                    }));
                    click(height / 2, width - frcy(80));
                }
            }
            helper.任务状态.日常补给 = true;
            tool.writeJSON("任务状态", helper.任务状态);
        } else {
            helper.任务状态.日常补给 = true;
            tool.writeJSON("任务状态", helper.任务状态);
            toastLog("今日补给包可能已领取")
        }

        tool.Floating_emit("面板", "展开");
        //点击返回

        返回主页(true)

    }
}

function 交流() {
    if (!helper.助理交流) {
        return
    }
    if (helper.任务状态.助理交流) {
        toastLog("今日助理交流已完成");
        return
    }
    tool.Floating_emit("展示文本", "状态", "状态：与助理交互")
    if (!ITimg.ocr("任务", {
            area: "右半屏",
        }) && !ITimg.ocr("战斗", {
            area: "右半屏",
            refresh: false,
        })) {
        返回主页()
    }
    while (true) {
        click(height / 2, width / 2);
        sleep(500);
        if (ITimg.matchFeatures("助理-告白-关闭", {
                action: 0,
                timing: 1500,
                area: 2,
                threshold: 0.85,
                saveSmallImg: true,
                filter_w: frcx(30),
                visualization: true,
            })) {
            continue;
        }
        if (ITimg.ocr("交流", {
                action: 4,
                timing: 2500,
                nods: 2500,
                area: "左上半屏",
            }) || ITimg.ocr("交流", {
                action: 2,
                timing: 2500,
                area: "左半屏",
                part: true,
            }) || ITimg.ocr("交流", {
                action: 2,
                timing: 2500,
                area: 13,
                similar: 0.72,
            })) {

            break
        }
    }
    while (true) {

        click(height / 2, width / 2);
        sleep(500);

        if (ITimg.matchFeatures("助理-告白-关闭", {
                action: 0,
                timing: 1500,
                area: 2,
                threshold: 0.85,
                filter_w: frcy(30),
                saveSmallImg: true,
                visualization: true,
            })) {
            return 交流();
            break
        } else {
            (ITimg.ocr("交流", {
                action: 4,
                timing: 2500,
                nods: 500,
                area: "左上半屏",
            }) || ITimg.ocr("交流", {
                action: 2,
                timing: 2500,
                area: 13,
                similar: 0.72,
            }))
        }
        if (ITimg.ocr("更换成员", {
                action: 5,
                area: 3,
            }) || ITimg.ocr("基本信息", {
                action: 5,
                area: 3,
            })) {
            helper.任务状态.助理交流 = true;
            tool.writeJSON("任务状态", helper.任务状态);

            click.apply(click, axis_list.return_homepage);
            sleep(500);
            break;
        }

    }


}

function 指挥局() {
    let _id = "brilliant_calculations";

    if (!helper[_id] || !helper[_id].启用) {
        return false;
    }
    if (helper.任务状态.妙算神机) {
        toastLog("今日妙算神机已完成");
        return
    }
    tool.Floating_emit("展示文本", "状态", "状态：与妙算神机交互");
    let _max = 5;
    while (_max) {
        if (!ITimg.ocr("任务", {
                area: "右半屏",
            }) && !ITimg.ocr("战斗", {
                area: "右半屏",
                refresh: false,
            })) {
            let staging = ITimg.ocr("主页面", {
                area: 1,
                action: 5,
            });
            if (staging) {
                click(staging.left, staging.bottom);
                坐标配置("主页面", staging.left, staging.bottom)
                sleep(2000)
            } else if (coordinate.coordinate.主页面) {
                click(coordinate.coordinate.主页面.x, coordinate.coordinate.主页面.y);
                sleep(2000);
            }
        }
        if (!ITimg.ocr("公会", {
                action: 4,
                timing: 4000,
                area: 4,
                similar: 0.85,
            }) && !ITimg.ocr("公会", {
                action: 4,
                timing: 4000,
                area: 34,
            })) {
            //click(coordinate.coordinate.主页展开.x, coordinate.coordinate.主页展开.y)
            // sleep(1000);
            if (!ITimg.matchFeatures("主页展开", {
                    action: 0,
                    area: 4,
                    timing: 1000,
                    threshold: 0.75,
                    filter_w: frcx(50),
                    saveSmallImg: true,
                    visualization: true,
                })) {
                click.apply(click, coordinate.homepage_open);
                sleep(1000);
            }
            if (!ITimg.ocr("公会", {
                    action: 4,
                    timing: 4000,
                    area: 4,
                    similar: 0.85,
                }) && !ITimg.ocr("公会", {
                    action: 4,
                    timing: 4000,
                    area: 34,
                })) {
                _max--;
            } else {
                break
            }
        } else {
            break
        }
    }
    if (!_max) {
        tips = "无法确认工会按钮";
        toast(tips);
        console.error(tips);
        return false;
    }
    tool.Floating_emit("面板", "隐藏");
    sleep(500);
    while (true) {
        if (ITimg.ocr("新版指挥局", {
                timing: 1500,
                nods: 500,
                area: "左上半屏",
            }) || ITimg.ocr("指挥局", {
                timing: 1500,
                nods: 1500,
                area: "左上半屏",
                part: true,
                refresh: false,
            })) {
            break
        } else {
            ITimg.ocr("公会", {
                action: 4,
                timing: 4000,
                area: 34,
                part: true,
            })
        }
    }
    if (helper[_id].领取贡献) {
        tool.Floating_emit("展示文本", "状态", "状态：领取公会贡献");
        let contribution = ITimg.ocr("本周贡献", {
            action: 5,
            area: 1,
            refresh: false,
            saveSmallImg: false,
        })
        if (contribution) {
            let _area = [contribution.left - 20, contribution.bottom - (contribution.bottom - contribution.top) * 4, contribution.right - contribution.left + 40, (contribution.bottom - contribution.top) * 3];
            let contribution_max = ITimg.ocr("获取贡献", {
                action: 6,
                area: _area,
                saveSmallImg: false,
            })
            if (contribution_max) {
                //   contribution_max.sort((a, b) => a.top - b.top);
                for (let _max_ of contribution_max) {
                    if (_max_.text.match(/(\d+)/)) {
                        contribution_max = _max_.text.match(/(\d+)/)[0];
                        break
                    }
                }
                toastLog("公会贡献：" + contribution_max)

                if (contribution_max >= 15000) {

                    while (true) {
                        click(contribution.left + (contribution.right - contribution.left) / 2, contribution.top);
                        sleep(1000);
                        if (ITimg.ocr("一键领取", {
                                action: 0,
                                timing: 1000,
                                area: 2,
                            })) {
                            if (检查获得奖励()) {
                                sleep(1000);
                            }
                        }
                        let axis_12000 = ITimg.ocr("12000", {
                            action: 5,
                            area: 4,
                        })
                        if (axis_12000) {

                            while (true) {
                                let slide_left = [axis_12000.left, axis_12000.top, height / 2, axis_12000.top, 500];

                                swipe.apply(swipe, slide_left);
                                sleep(500);
                                axis_12000 = ITimg.ocr("15000", {
                                    action: 5,
                                    area: 4,
                                    nods: 1000,
                                    saveSmallImg: "公会贡献_15000",
                                })
                                if (!axis_12000) {
                                    continue;
                                }
                                click(axis_12000.left + (axis_12000.right - axis_12000.left) / 2, axis_12000.top - frcy(100));
                                sleep(1000);
                                if (检查获得奖励()) {
                                    break;
                                }
                            }
                            break
                        }

                    }
                    返回主页(true);
                    sleep(500);
                }

            }


        }
        tool.Floating_emit("展示文本", "状态", "状态：与妙算神机交互");
    }
    tool.Floating_emit("面板", "展开");

    if (ITimg.ocr("岁雪新宵", {
            area: "右上半屏",
        })) {
        //岁雪新春
        swipe(parseInt(height / 7.2), parseInt(width / 1.35), parseInt(height / 4), parseInt(width / 1.08), 1200);
    }else if(ITimg.ocr("庭梨栖雪", {
            refresh: false,
            area: "右上半屏",
        })){
            press(height/5,width/1.7,1800);
            
        } else if (ITimg.ocr("蔚蓝之夏", {
            refresh: false,
            area: "右上半屏",
        })) {
        //蔚蓝之夏
        swipe(parseInt(height / 7.2), parseInt(width / 1.35), parseInt(height / 10.5), parseInt(width / 1.6), 1800);

    } else {
        //默认大厅皮肤
        //移动小人手势步骤,从x1,y1,到x2,y2;用时1.7秒
        swipe(parseInt(height / 6), parseInt(width / 1.39), parseInt(height / 3.55), parseInt(width / 1.35), 1700);
    }

    /*
    for(let i=0;i<coordinate.移动小人动作.length;i++){
     gestures.apply(null, coordinate.移动小人动作[i]);
     sleep(400);
    };
    */
    //等待1秒
    sleep(1500)
    if (ITimg.ocr("算一签", {
            action: 1,
            timing: 2500,
            area: "右半屏",
            part: true,
        }) || ITimg.ocr("算一签", {
            action: 1,
            timing: 2500,
            area: "右半屏",
            refresh: false,
        })) {
        click(height / 2, width - frcy(80));
        sleep(1000);
        返回主页(true);
        sleep(1000);
        helper.任务状态.妙算神机 = true;
        tool.writeJSON("任务状态", helper.任务状态);
    } else if (ITimg.ocr("查看签文", {
            action: 1,
            timing: 2500,
            area: "右半屏",
        })) {
        if (coordinate.coordinate.返回) {
            click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
            sleep(1000);
        };
        helper.任务状态.妙算神机 = true;
        tool.writeJSON("任务状态", helper.任务状态);
    } else {
        toastLog("无法匹配到算一签,请确认移动小人步骤是否可用");
    }
    返回主页(true);
}


function 宿舍() {
    if (!helper.宿舍系列 || !helper.宿舍任务) {
        return false;
    }
    tool.Floating_emit("面板", "id", "宿舍系列");
    tool.Floating_emit("展示文本", "状态", "状态：准备执行宿舍系列任务");
    let _max = 5;
    while (true) {
        if (!ITimg.ocr("任务", {
                area: "右半屏",
            }) && !ITimg.ocr("战斗", {
                area: "右半屏",
                refresh: false,
            }) && !ITimg.ocr("成员", {
                area: "右半屏",
                refresh: false,
            }) && !ITimg.ocr("研发", {
                area: "右半屏",
                refresh: false,
                part: true,
            })) {
            toastLog("当前似乎不在主页,尝试返回主页")
            返回主页();
        }
        if (!ITimg.ocr("宿舍", {
                action: 0,
                timing: 3000,
                nods: 1500,
            }) && !ITimg.ocr("宿舍", {
                action: 0,
                timing: 3000,
                area: 24,
            }) && !ITimg.ocr("宿舍", {
                action: 1,
                area: 24,
                part: true,
            })) {
            //click(coordinate.coordinate.主页展开.x, coordinate.coordinate.主页展开.y)
            // sleep(1000);
            if (!ITimg.matchFeatures("主页展开", {
                    action: 0,
                    area: 4,
                    timing: 1000,
                    threshold: 0.75,
                    filter_w: frcx(50),
                    saveSmallImg: true,
                    visualization: true,
                })) {
                click.apply(click, coordinate.homepage_open);
                sleep(1000);
            }
        }
        if (ITimg.ocr("委托", {
                timing: 1000,
                saveSmallImg: "宿舍_委托",
                area: [parseInt(height / 1.4), parseInt(width / 1.1), height - parseInt(height / 1.4), width - parseInt(width / 1.1)]
            }) || ITimg.ocr("执勤", {
                area: [parseInt(height / 1.4), parseInt(width / 1.1), height - parseInt(height / 1.4), width - parseInt(width / 1.1)],
                timing: 1000,
                nods: 2000,
                refresh: false,
                saveSmallImg: "宿舍_执勤",
            })) {
            break
        } else {
            _max--;
        }

    }
    if (!_max) {
        tips = "无法确认已进入宿舍";
        toast(tips);
        console.error(tips);
        tool.Floating_emit("展示文本", "状态", "状态：" + tips);
        return false;
    }
    if (ITimg.ocr("完成事件", {
            area: 4,
            action: 1,
            timing: 1500,
        })) {
        click(height / 2, frcy(50));
        sleep(1000);
    }
    helper.宿舍系列.委托任务.启用 && 宿舍_委托();
    //执勤
    helper.宿舍系列.执勤代工.启用 && 宿舍_执勤();

    helper.宿舍系列.touch_role.启用 && 宿舍_抚摸()
    helper.宿舍系列.家具制造.启用 && 宿舍_家具制造();

    //
    if (helper.宿舍系列.领取奖励.启用) {
        tool.Floating_emit("展示文本", "状态", "状态：领取宿舍任务奖励...")
        sleep(2000);
        if (ITimg.ocr("任务", {
                action: 1,
                timing: 2000,
                area: 2,
                saveSmallImg: "宿舍_任务",
            }) || ITimg.ocr("任务", {
                action: 1,
                timing: 2000,
                nods: 1500,
                area: 24,
                saveSmallImg: "宿舍_任务",
            }) || ITimg.ocr("任务", {
                action: 1,
                timing: 2000,
                area: 12,
                saveSmallImg: "宿舍_任务",
            })) {
            ITimg.ocr("每日", {
                action: 1,
                timing: 1000,
                area: 13,
            });

            if (ITimg.ocr("今日任务已完成", {
                    action: 5,
                })) {
                toastLog("今日宿舍任务已完成");
                helper.宿舍系列.领取奖励.执行状态 = true;
                tool.writeJSON("宿舍系列", helper.宿舍系列);
                tool.writeJSON("宿舍任务", false);
            } else {
                if (ITimg.ocr("一键领取", {
                        action: 1,
                        timing: 1500,
                        refresh: true
                    })) {
                    //返回 ,关闭奖励显示
                    返回主页(true);

                }
            }
            //返回
            返回主页(true);


        } else {
            toastLog("无法执行领取任务奖励");
        }
    }
    //返回主界面
    返回主页(true);



}

function 宿舍_委托() {
    if (helper.宿舍系列.委托任务.执行状态) {
        toastLog("今日委托任务已完成");
        return false
    }
    tool.Floating_emit("展示文本", "状态", "状态：执行委托任务")
    //本来是想用ocr的,试了效果不好,只用找图了
    let _max = 5;
    while (true) {
        ITimg.ocr("委托", {
            action: 0,
            timing: 2000,
            nods: 1500,
            area: 4,
            saveSmallImg: "宿舍_委托",
        }) || ITimg.ocr("委托", {
            action: 0,
            timing: 2000,
            area: 34,
            saveSmallImg: "宿舍_委托",
        })

        if (ITimg.ocr("归队", {
                nods: 1500,
                area: [height/2, parseInt(width / 1.2), height / 2, parseInt(width - width / 1.2)],
                action: 5,
            }) || ITimg.ocr("一键", {
                action: 5,
                refresh: false,
                log_policy: "简短",
            }) || ITimg.ocr("领取奖励", {
                action: 5,
                area: 5,
            }) || ITimg.ocr("空闲中", {
                action: 5,
                refresh: false,
                log_policy: "简短",
            }) || ITimg.ocr("已接取委托", {
                action: 5,
                refresh: false,
                log_policy: "简短",
            })) {
            break
        }
    }
    _max = 5;
    while (_max) {
        if (ITimg.ocr("归队", {
                timing: 1500,
                action: 2,
                area: [height/2, parseInt(width / 1.2), height / 2, parseInt(width - width / 1.2)],
            }) || ITimg.ocr("领取奖励", {
                action: 5,
                refresh: false,
            })) {
            ITimg.ocr("一键", {
                area: 4,
                timing: 1500,
                action: 2,
                refresh: false,
            });


            for (let i = 0; i < 2; i++) {
                click(height / 2, width - frcy(50));
                sleep(1000);
            }
        }
        if (ITimg.ocr("一键", {
                area: [height/2, parseInt(width / 1.2), height / 2, parseInt(width - width / 1.2)],
                timing: 1500,
                action: 2,
            }) || ITimg.ocr("派遣", {
                area: 4,
                timing: 1500,
                action: 2,
                refresh: false,
                nods: 1500,
            }) || ITimg.ocr("一键", {
                area: [height/2, parseInt(width / 1.2), height / 2, parseInt(width - width / 1.2)],
                timing: 1500,
                action: 2,
            }) || ITimg.ocr("派遣", {
                area: 4,
                timing: 1500,
                action: 2,
                refresh: false,
            })) {
            helper.宿舍系列.委托任务.执行状态 = true;
            tool.writeJSON("宿舍系列", helper.宿舍系列);
            break
        }
        _max--;
    }
    //返回
    返回主页(true);

}

function 宿舍_执勤() {
    if (helper.宿舍系列.执勤代工.执行状态) {
        toastLog("今日宿舍执勤已完成");
        return;
    }
    tool.Floating_emit("展示文本", "状态", "状态：开始执勤");
    while (true) {
        if (!ITimg.ocr("委托", {
                area: [height / 2, parseInt(width / 1.2), height / 2, parseInt(width - width / 1.2)],

                similar: 0.8,
                saveSmallImg: "宿舍_委托",
            }) && !ITimg.ocr("执勤", {
                refresh: false,
                similar: 0.8,
                saveSmallImg: "宿舍_执勤",
            })) {
            //返回
            返回主页(true);

        }
        if (ITimg.ocr("执勤", {
                action: 0,
                timing: 1000,
                nods: 1500,
                area: 24,
                saveSmallImg: "宿舍_执勤",
            }) || ITimg.ocr("执勤", {
                action: 0,
                timing: 1000,
                area: 4,
                saveSmallImg: "宿舍_执勤",
            })) {
            break
        }
    }
    tool.Floating_emit("面板", "隐藏");
    if (!ITimg.ocr("+", {
            action: 1,
            timing: 1000,
            area: [0, Math.floor(width / 5), height, width - Math.floor(width / 5)],
        })) {
        if (ITimg.ocr("休息中", {
                action: 5,
                refresh: false,
            })) {
            tool.Floating_emit("面板", "展开");
            sleep(500);
            toastLog("休息中");
            helper.宿舍系列.执勤代工.执行状态 = true;
            tool.writeJSON("宿舍系列", helper.宿舍系列);
            //返回
            返回主页(true);

            return
        }
        if (!ITimg.ocr("代工", {
                action: 5,
                area: 1,
                saveSmallImg: "宿舍_执勤_代工",
            })) {
            click(height / 2, parseInt(width / 1.7));
            sleep(1000);
        }
    }
    click(height / 2, width - frcy(80));
    sleep(500);
    let duty = {
        //已选择执勤的小伙伴
        chosen: 0,
    }
    //提前识别开始执勤坐标点
    duty.duty = ITimg.ocr("开始执勤", {
        action: 5,
        area: "下半屏",
        nods: 1500,
    });
    if (!duty.duty) {
        ITimg.ocr("+", {
            action: 1,
            timing: 1500,
            area: [0, Math.floor(width / 5), height, width - Math.floor(width / 5)],
        });
        duty.duty = ITimg.ocr("开始执勤", {
            action: 5,
            area: "下半屏",
        });
    }
    if (duty.duty) {
        sleep(1500);


        function findNearestNumber(array, other, right) {
            let nearestNumber = null;

            for (let j = 0; j < array.length; j++) {
                let otherElement = array[j];
                if (otherElement.text.match(/(\d+)/)) {

                    let distance = Math.abs(other.right - otherElement.right) <= frcx(10) && Math.abs(other.bottom - otherElement.top) <= frcy(40);

                    if (distance) {
                        nearestNumber = otherElement.text.match(/(\d+)/)[1];
                    }
                }
            }
            return nearestNumber;
        }


        for (let i = 0; i < 2; i++) {
            staging = ITimg.ocr("识别集合文本", {
                action: 6
            });
            for (let element of staging) {
                if (element.text.endsWith('/100')) {
                    let match = element.text.match(/(\d+)/);
                    if (match) {
                        let value = parseInt(match[1]);
                        let nearestNumber = findNearestNumber(staging, element);
                        if (nearestNumber && value >= 100 && nearestNumber > 60) {
                            click(element.left, element.bottom);
                            sleep(200);
                            duty.chosen++;
                        }
                    }
                }
                //已选择8位小伙伴时退出遍历
                if (duty.chosen >= 8) {
                    break
                }

            }
            if (duty.chosen < 8) {
                //上滑显示新的小伙伴
                swipe(parseInt(height / 2), parseInt(width / 1.4), parseInt(height / 2), parseInt(width / 2.5), 550);
                sleep(2000);
            } else {
                break;
            }
        }

        toastLog("选择完成");
        tool.Floating_emit("面板", "展开");
        //如果刚才没有识别成功则重新识别
        duty.duty = duty.duty ? duty.duty : ITimg.ocr("开始执勤", {
            action: 5,
            area: "右下半屏"
        });
        sleep(500)
        //点击开始执勤
        click(duty.duty.left, duty.duty.top);

        sleep(500);
        click(duty.duty.left, duty.duty.top);
        sleep(2000);
        //有bug,执勤过了,没一会又可以选择,但是显示工位已被使用
        ITimg.ocr("取消", {
            action: 1,
            timing: 1000,
            area: 4,
        });
    }
    (ITimg.ocr("一键代工", {
        action: 1,
        timing: 1000,
        area: 4,
        similar: 0.85,
        refresh: false
    }) || ITimg.ocr("一键代工", {
        action: 1,
        timing: 1000,
        area: "下半屏",
        part: true,
        refresh: false,
    }) || ITimg.ocr("一键代", {
        action: 1,
        timing: 1000,
        area: "下半屏",
        part: true,
        refresh: false,
        saveSmallImg: "一键代工",
    }));

    if (ITimg.ocr("立即完成", {
            action: 1,
            timing: 1500,
            area: "右下半屏"
        }) && duty.chosen >= 8) {
        helper.宿舍系列.执勤代工.执行状态 = true;
        tool.writeJSON("宿舍系列", helper.宿舍系列);
    }
    click(height / 2, width - frcy(80));
    sleep(1500);

    //返回
    返回主页(true);


}

function 宿舍_抚摸() {


    // 获取当前时间
    let now = new Date();
    if (helper.宿舍系列.touch_role.lastExecutionTime && (now.getTime() - new Date(helper.宿舍系列.touch_role.lastExecutionTime).getTime()) <= 4 * 60 * 60 * 1000) {
        tips = "4个小时内抚摸过所有宿舍小人\nps:开关抚摸角色重置记录";
        toast(tips);
        console.warn(tips);
        helper.宿舍系列.touch_role.执行状态 = true;
        tool.writeJSON("宿舍系列", helper.宿舍系列);
        return false
    } else {
        helper.宿舍系列.touch_role.执行状态 = false;

    }
    if (helper.宿舍系列.touch_role.执行状态) {
        return false;
    }

    sleep(1000);
    if (!ITimg.ocr("执勤", {
            action: 5,
            area: 4,
            saveSmallImg: "宿舍_执勤",
        }) && !ITimg.ocr("执勤", {
            part: true,
            saveSmallImg: "宿舍_执勤",
            refresh: false,
        })) {
        //返回
        while (!返回主页(true)) {

        }
    }
    if (coordinate.宿舍.宿舍房间位置.length == 0) {
        coordinate.宿舍.宿舍房间位置 = []
        tool.Floating_emit("展示文本", "状态", "状态：初始化房间位置...")
        //集合所有含有'宿舍'文本的信息
        let dorm = ITimg.ocr("宿舍", {
            action: 6,
            part: true,
        });
        console.warn(dorm);
        for (let i = 0; i < dorm.length; i++) {
            //过滤不是实际宿舍位置的文本
            let filter_text = ["战斗/宿舍", "宿舍伙伴", "宿舍事", "宿舍执", "宿舍任", "宿舍币"];
            //false代表包含filter_text中任意一个
            let dorm_re = filter_text.every(function(el) {
                return dorm[i].text.indexOf(el) === -1
            });

            if (dorm_re) {

                //字形相似计算
                let simil = tool.nlpSimilarity(dorm[i].text, "号宿舍");
                dorm_re = (simil >= 0.75);
                log("文字: " + dorm[i].text + " ,相似度：" + simil + "，结果:" + dorm_re);

            }
            if (dorm_re) {
                //矫正位置信息
                if ((dorm[i].right - dorm[i].left) > frcx(200)) {
                    dorm[i].right = dorm[i].right - frcx(120);
                }
                if (!dorm[i].right || !dorm[i].bottom) {
                    continue;
                }
                //储存宿舍位置
                coordinate.宿舍.宿舍房间位置.push({
                    name: "宿舍" + i,
                    x: dorm[i].right,
                    y: dorm[i].bottom + 30
                });

            } else {
                dorm.splice(i, 1);
                i--;
            }
        }

        coordinate = {
            "name": width + "x" + height,
            "w": width,
            "h": height,
            "coordinate": coordinate.coordinate,
            "宿舍": coordinate.宿舍,
            "combat": coordinate.combat
        };

        files.write(
            "./library/coordinate.json",
            JSON.stringify(coordinate),
            (encoding = "utf-8")
        )

    }
    tool.Floating_emit("展示文本", "状态", "状态：开始宿舍事件...");
    tool.Floating_emit("面板", "隐藏");
    //逐个点进宿舍
    i = 0;
    try {
        console.info(JSON.stringify(coordinate.宿舍.宿舍房间位置))
    } catch (e) {
        console.error(e)
    }
    for (i in coordinate.宿舍.宿舍房间位置) {

        sleep(500);
        log("点击： x:" + coordinate.宿舍.宿舍房间位置[i].x + "，y:" + coordinate.宿舍.宿舍房间位置[i].y);
        if (!coordinate.宿舍.宿舍房间位置[i].x || !coordinate.宿舍.宿舍房间位置[i].y) {
            continue;
        }
        toastLog("进入" + coordinate.宿舍.宿舍房间位置[i].name);

        click(coordinate.宿舍.宿舍房间位置[i].x, coordinate.宿舍.宿舍房间位置[i].y);
        sleep(2000);
        if (!ITimg.ocr("菜单", {
                area: 34,
                action: 5,
                similar: 0.8,
            }) && !ITimg.ocr("装扮宿舍", {
                refresh: false,
                log_policy: true,
                action: 5,
                area: 4,
            }) && !ITimg.ocr("MENU", {
                refresh: false,
                log_policy: true,
                area: 3,
                action: 5,
                similar: 0.8,
            })) {
            toastLog("无法确认已进入宿舍房间");
            continue;
        }
        if (!coordinate.宿舍.快捷头像位置 || !coordinate.宿舍.快捷头像位置[2] || !coordinate.宿舍.快捷头像位置[0].x) {
            tool.Floating_emit("展示文本", "状态", "获取快捷头像位置坐标..");
            let top = ITimg.matchFeatures("宿舍-房间-编辑", {
                action: 5,
                area: 2,
                threshold: 0.8,
                saveSmallImg: true,
                visualization: true,
            });
            let bottom = ITimg.matchFeatures("宿舍-房间-装扮宿舍", {
                action: 5,
                area: 4,
                threshold: 0.8,
                saveSmallImg: true,
                visualization: true,
            });
            if (!top || !bottom) {
                tips = "无法获取辅助定位信息";
                tool.Floating_emit("展示文本", "状态", tips);
                continue;
            }
            console.warn(top)
            console.warn(bottom)
            coordinate.宿舍.快捷头像位置 = [{
                "name": "小伙伴1",
                "x": top.right - parseInt(top.w / 2.8),
                "y": parseInt((bottom.y - top.bottom) / 1.27)
            }, {
                "name": "小伙伴2",
                "x": top.right - parseInt(top.w / 2.8),
                "y": bottom.y - top.bottom + frcy(35)
            }, {
                "name": "小伙伴3",
                "x": top.right - parseInt(top.w / 2.8),
                "y": bottom.y - top.bottom + parseInt((bottom.y - top.bottom) / 3.4)
            }]
            log(coordinate.宿舍.快捷头像位置)

            files.write(
                "./library/coordinate.json",
                JSON.stringify(coordinate),
                (encoding = "utf-8")
            )
        }
        //触发事件
        toastLog("触发事件");
        try {
            for (k in coordinate.宿舍.快捷头像位置) {
                if (!coordinate.宿舍.快捷头像位置[k].x || !coordinate.宿舍.快捷头像位置[k].y) {
                    toastLog(k + "快捷头像位置坐标未配置：x:" + coordinate.宿舍.快捷头像位置[k].x + ",y:" + coordinate.宿舍.快捷头像位置[k].y)
                    continue
                }
                click(coordinate.宿舍.快捷头像位置[k].x, coordinate.宿舍.快捷头像位置[k].y);
                sleep(150);

            }
        } catch (e) {
            toastLog("点击快捷头像位置出错:" + e);
            continue;
        }
        sleep(1500);
        //逐个抚摸
        for (m in coordinate.宿舍.快捷头像位置) {
            tool.Floating_emit("展示文本", "状态", "状态：准备抚摸" + coordinate.宿舍.快捷头像位置[m].name);
            if (!coordinate.宿舍.快捷头像位置[k].x || !coordinate.宿舍.快捷头像位置[k].y) {
                toastLog(k + "快捷头像位置坐标未配置..：x:" + coordinate.宿舍.快捷头像位置[k].x + ",y:" + coordinate.宿舍.快捷头像位置[k].y)
                continue
            }
            //点击小人
            click(coordinate.宿舍.快捷头像位置[m].x, coordinate.宿舍.快捷头像位置[m].y);
            sleep(1000);
            if (helper.检查小人心情) {
                try {

                    let img = ITimg.captureScreen_();
                    //多点找色,检查心情条;
                    let mood = images.findMultiColors(img, "#47ca4f", [
                        [0, 30, "#47ca4f"]
                    ], {
                        region: [0, 0, height, width / 2],
                        threshold: 8,
                    });
                    !img.isRecycled() && img.recycle()
                    console.info("绿色心情:", mood)
                    if (mood) {
                        toastLog("心情大于80,不进行抚摸操作");
                        continue;
                    }
                } catch (e) {
                    console.error("检查心情条错误", e)
                }
            }
            //使用偏移头像坐标，点击小人旁的抚摸
            click(coordinate.宿舍.快捷头像位置[m].x - frcx(160), coordinate.宿舍.快捷头像位置[m].y);
            sleep(800);
            //识别抚摸次数
            let petting = (ITimg.ocr("抚摸次数", {
                action: 5,
                area: 2,
                saveSmallImg: false,
                part: true,
            }) || ITimg.ocr("/3", {
                action: 5,
                saveSmallImg: false,
                area: 2,
                part: true,
                refresh: false,
                log_policy: "简短",
            }));
            if (petting) {
                let region = [petting.right, 0, height - petting.right, petting.bottom + frcy(10)];
                if (petting.text.length > 4) {
                    region[0] = petting.left + Math.floor((petting.right - petting.left) / 1.6)
                }
                petting = ITimg.ocr("识别集合文本", {
                    area: region,
                    action: 6,
                });
                log("区域：", region)
                console.info(petting);
                if (petting && petting.length > 0) {
                    petting.sort((a, b) => a.left - b.left);
                    let match__ = petting[0].text.match(/(\d+)\/(\d+)/);
                    if (match__) {
                        petting = parseInt(match__[1]);
                    } else {
                        match__ = parseInt(petting[0].text[0]);
                        if (match__.toString() != "NaN") {
                            petting = match__;
                        } else {
                            petting = parseInt(petting[0].text[1]);
                        }
                    }
                } else {
                    petting = false;
                }
            }
            if (petting || petting === 0) {

                log(petting)
                if (petting.toString() == "NaN") {
                    toastLog("无法确认可抚摸次数: " + petting);
                    petting = 3;
                } else {
                    if (petting > 3) {
                        petting = 3;
                    }
                    toastLog("可抚摸次数:" + petting)

                }
                //有时候点进宿舍,没有小人在里面是什么鬼?没有任务在执行
                //就算有个,点小人头像也是没反应,BUG?
            } else if (ITimg.ocr("菜单", {
                    area: 34,
                    action: 5,
                    similar: 0.8,
                }) || ITimg.ocr("装扮宿舍", {
                    refresh: false,
                    log_policy: true,
                    action: 5,

                }) || ITimg.ocr("MENU", {
                    refresh: false,
                    log_policy: true,
                    action: 5,
                    similar: 0.8,
                })) {
                toastLog("无法确认进入抚摸小人界面\n这可能是战双的BUG\n或快捷头像坐标配置错误");
                break
                //continue;
            } else {
                toastLog("无法获取可抚摸的次数,默认抚摸3次");
                petting = 3;
            }

            if (petting == 0) {
                tool.Floating_emit("展示文本", "状态", "状态：没有可抚摸次数");
                返回主页(true);


                continue;
            }
            //抚摸小人动作,
            //默认分辨率w1080,h2160
            for (let n = 0; n < petting; n++) {


                var points = [random(999, 1100)];

                var x_p = 0.15;
                var y_p = 0.7;


                for (let i = 0; i < 6; i++) {
                    //  console.info("数值:", 2.6 - x_p, ",x:", parseInt(height / (2.6 - x_p)))
                    // console.info("数值:", 0.80 + y_p, "y:", parseInt(width / (0.80 + y_p)))

                    points.push([parseInt(height / (2.6 - x_p)) + random(-20, 20), parseInt(width / (0.80 + y_p)) + random(-30, 10)]);
                    x_p = x_p + 0.15;
                    y_p = y_p + 0.7
                }

                x_p = 0.1;
                y_p = 0.7;

                for (let i = 0; i < 6; i++) {
                    //   console.warn("数值:", 1.7 + x_p, ",x:", parseInt(height / (1.7 + x_p)))
                    // console.warn("数值:", 5.6 - y_p, "y:", parseInt(width / (5.6 - y_p)))

                    points.push([parseInt(height / (1.7 + x_p)) + random(-20, 20), parseInt(width / (5.6 - y_p)) + random(-30, 10)]);
                    x_p = x_p + 0.15;
                    y_p = y_p + 0.7

                }


                x_p = 0.1;
                y_p = 0.7;

                for (let i = 0; i < 6; i++) {
                    points.push([parseInt(height / (2.6 - x_p)) + random(-20, 20), parseInt(width / (0.80 + y_p)) + random(-30, 10)]);
                    x_p = x_p + 0.15;
                    y_p = y_p + 0.7
                }

                x_p = 0.1;
                y_p = 0.7;

                for (let i = 0; i < 6; i++) {
                    //   console.warn("数值:", 1.7 + x_p, ",x:", parseInt(height / (1.7 + x_p)))
                    // console.warn("数值:", 5.6 - y_p, "y:", parseInt(width / (5.6 - y_p)))

                    points.push([parseInt(height / (1.7 + x_p)) + random(-20, 20), parseInt(width / (5.6 - y_p)) + random(-30, 10)]);
                    x_p = x_p + 0.15;
                    y_p = y_p + 0.7

                }

                x_p = 0.1;
                y_p = 0.7;

                for (let i = 0; i < 6; i++) {
                    points.push([parseInt(height / (2.6 - x_p)) + random(-20, 20), parseInt(width / (0.80 + y_p)) + random(-30, 10)]);
                    x_p = x_p + 0.15;
                    y_p = y_p + 0.7
                }

                gesture.apply(null, points);



                if (n != 3) {
                    sleep(3000);
                }
            }

            tool.Floating_emit("展示文本", "状态", "状态：抚摸完成");
            返回主页(true);

            continue;
        }
        //点击返回
        if (coordinate.coordinate.返回) {
            click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
            sleep(1500);
        }
    }
    helper.宿舍系列.touch_role.执行状态 = true;
    helper.宿舍系列.touch_role.lastExecutionTime = now.toString();
    tool.writeJSON("宿舍系列", helper.宿舍系列);
    tool.Floating_emit("面板", "展开");
}

function 宿舍_家具制造() {
    if (helper.宿舍系列.家具制造.执行状态) {
        toastLog("今日家具制造已完成");
        return
    }
    let staging;
    while (true) {
        //家具制造
        staging = (ITimg.ocr("制造", {
            action: 5,
            nods: 1000,
            area: 3,
        }) || ITimg.ocr("制造", {
            action: 5,
            area: 34,
            part: true,
            refresh: false,
        }) || ITimg.ocr("制造", {
            action: 5,
            area: 34,
        }));
        if (!ITimg.ocr("商店", {
                action: 5,
                refresh: false,
                part: true,
                saveSmallImg: "宿舍_商店",
            }) && !ITimg.ocr("仓库", {
                action: 5,
                refresh: false,
            })) {
            click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
            sleep(1500);
        }
        if (staging) {
            break
        }
    }

    if (staging) {

        click(staging.left + parseInt((staging.right - staging.left) / 2), staging.top + parseInt((staging.bottom - staging.top) / 2));
        sleep(500);
        click(staging.left + parseInt((staging.right - staging.left) / 2), staging.top + parseInt((staging.bottom - staging.top) / 2));

        log(staging.left + parseInt((staging.right - staging.left) / 2), staging.top + parseInt((staging.bottom - staging.top) / 2));

        toastLog("666")
        sleep(1500);

        tool.Floating_emit("展示文本", "状态", "状态：开始制造家具")
        //点击家具制造第一位
        if (!ITimg.ocr("添加类型", {
                action: 1,
                timing: 1500,
                area: "右半屏",
            })) {
            //   click(staging.left + (staging.right - staging.left / 2), staging.top + (staging.bottom - staging.top / 2));

            sleep(2000);
            ITimg.ocr("添加类型", {
                action: 1,
                timing: 1500,
                area: "右半屏",
            })
        }

        //下滑列表
        swipe(height / 2, frcy(850), height / 2, frcy(200), 600);
        sleep(500);
        //查找家具名,并点击右下
        //  ITimg.ocr(coordinate.宿舍.furniture, { action: 4, timing: 500, });
        //ocr太难用,用固定坐标吧
        /* ITimg.picture("宿舍-家具-挂饰", {
             action: 0,
             timing: 500
         });
         */
        let furniture = ITimg.ocr("挂饰", {
            action: 5,
            area: 13,
        });
        if (furniture) {
            click(furniture.right + frcx(50), furniture.top + (furniture.bottom - furniture.top));
            sleep(1000);
        }
        ITimg.ocr("选择", {
            action: 1,
            timing: 1000,
            area: 4,
        });
        //点击固定坐标,舒适MAX
        switch (random(1, 3)) {
            case 1:
                click.apply(click, axis_list.furniture_beautiful);
                break
            case 2:
                click.apply(click, axis_list.furniture_comfortable);
                break
            case 3:
                click.apply(click, axis_list.furniture_practical);
                break
        }
        /*ITimg.ocr("MAX", {
             action: 1,
             timing: 1000,
             area:34,
             similar:0.90,
         });*/
        sleep(1000);
        //点击两下数量+号,制造三个家具,要限制区域,不然会识别到上面三个
        let serological = ITimg.ocr("+", {
            action: 5,
            similar: 0.85,
            area: [0, Math.floor(width / 1.3), height / 2, width - Math.floor(width / 1.3)],
        })
        if (!serological) {
            serological = axis_list.furniture_quantity_plus;
        } else {
            serological = [serological.left + (serological.right - serological.left) / 2, serological.top + (serological.bottom - serological.top) / 2]
        }
        for (let i = 0; i < 2; i++) {
            click.apply(click, serological);
            sleep(200);
        }

        !ITimg.ocr("制造", {
            action: 4,
            timing: 3000,
            nods: 1000,
            area: "右下半屏",
            saveSmallImg: "宿舍_家具_制造",
        }) && ITimg.ocr("制造", {
            action: 4,
            part: true,
            timing: 3000,
            area: "下半屏",
            saveSmallImg: "宿舍_家具_制造",
        });


        sleep(2500);
        if (staging = (ITimg.matchFeatures("宿舍-家具-关闭", {
                action: 5,
                timing: 1000,
                nods: 1500,
                area: 2,
                threshold: 0.8,
                saveSmallImg: true,
            }) || ITimg.matchFeatures("宿舍-家具-关闭", {
                action: 5,
                timing: 1000,
                area: 2,
                threshold: 0.8,
                saveSmallImg: true,
                visualization: true,

            }))) {
            if (!coordinate.coordinate["宿舍-家具-关闭"]) {
                坐标配置("宿舍-家具-关闭", staging.x + (staging.w / 2), staging.top + (staging.h / 2));
            }
            click(coordinate.coordinate["宿舍-家具-关闭"].x, coordinate.coordinate["宿舍-家具-关闭"].y);

            helper.宿舍系列.家具制造.执行状态 = true;
            tool.writeJSON("宿舍系列", helper.宿舍系列);

        } else if (coordinate.coordinate["宿舍-家具-关闭"]) {
            click(coordinate.coordinate["宿舍-家具-关闭"].x, coordinate.coordinate["宿舍-家具-关闭"].y);

        }
        sleep(500);
        click(coordinate.coordinate["宿舍-家具-关闭"].x, coordinate.coordinate["宿舍-家具-关闭"].y);
        sleep(500)
        click(coordinate.coordinate["宿舍-家具-关闭"].x, coordinate.coordinate["宿舍-家具-关闭"].y);
        sleep(500);
        //返回
        if (coordinate.coordinate.返回) {
            click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
            sleep(1500);
        }
    }

}


function 消耗血清() {
    console.info("---消耗血清---");
    helper = tool.readJSON("helper");
    tool.Floating_emit("面板", "id", "消耗血清");
    tool.Floating_emit("展示文本", "状态", "状态：准备作战中");
    if (!ITimg.ocr("任务", {
            area: "右半屏",
        }) && !ITimg.ocr("战斗", {
            area: "右半屏",
            refresh: false,
        })) {
        返回主页()
    };
    if (helper.IU24HES) {
        tool.Floating_emit("展示文本", "状态", "状态：检查使用将过期血清");
        let expired_serum = (ITimg.ocr("小时", {
            action: 5,
            area: 2,
            part: true,
            saveSmallImg: "血清组剩余时间",
        }) || ITimg.ocr("血清组剩余时间", {
            action: 5,
            area: 2,
            part: true,
            refresh: false,
            saveSmallImg: "血清组剩余时间",
        }))
        if (expired_serum) {
            tool.Floating_emit("面板", "隐藏");
            expired_serum = [expired_serum.right, expired_serum.bottom + frcy(15)];
            click.apply(click, expired_serum);
            sleep(1000);
            expired_serum = ITimg.matchFeatures("血清_减", {
                action: 5,
                area: 1,
            });
            if (expired_serum) {

                expired_serum = [expired_serum.right - (expired_serum.w / 3), expired_serum.top + (expired_serum.h / 3)];
                click.apply(click, expired_serum);
                sleep(1000);

            }
            let surplus_hour_list = ITimg.ocr("集合", {
                action: 6,
                area: 5,
            })

            for (let surplus_hour of surplus_hour_list) {
                if (surplus_hour.text.indexOf("小时") != -1 || surplus_hour.text.indexOf("时") != -1) {

                    for (let i = 10; i > 0; i--) {
                        click(surplus_hour.right, surplus_hour.bottom);
                        sleep(50);

                    }
                    //识别到等待一秒
                    ITimg.ocr("超出该血清最大数量", {
                        action: 5,
                        area: 5,
                        timing: 1000,
                    })
                }
            }
            tool.Floating_emit("面板", "展开");
            expired_serum = (ITimg.ocr("确定", {
                action: 5,
                area: 4,
            }) || ITimg.ocr("确定", {
                action: 5,
                refresh: false,
            }));
            expired_serum = [expired_serum.right, expired_serum.top];
            click.apply(click, expired_serum);
            sleep(200);
            click.apply(click, expired_serum);
            sleep(200);
            click.apply(click, expired_serum);
            sleep(1000);

            if (检查获得奖励()) {
                helper.已注射血清++;
                tool.Floating_emit("展示文本", "血清", "血清：可使用:" + helper.注射血清 + "&已使用:" + helper.已注射血清);
                toastLog("使用即将过期血清");
            }
            frequency = 5;
            while (frequency) {
                sleep(200)
                if (ITimg.matchFeatures("宿舍-家具-关闭", {
                        action: 0,
                        timing: 1000,
                        area: 2,
                        threshold: 0.8,
                        nods: 1000,
                        saveSmallImg: "注射血清-关闭",
                    }) || ITimg.matchFeatures("宿舍-家具-关闭", {
                        action: 0,
                        timing: 1000,
                        area: 2,
                        threshold: 0.8,
                        saveSmallImg: "注射血清-关闭",
                        visualization: true,

                    }) || ITimg.ocr("取消", {
                        action: 1,
                        area: 4,
                        timing: 1000,
                    })) {
                    break
                }
                frequency--;
                if (!frequency) {
                    if (coordinate.coordinate["宿舍-家具-关闭"]) {
                        click(coordinate.coordinate["宿舍-家具-关闭"].x, coordinate.coordinate["宿舍-家具-关闭"].y);

                    }
                }

            }


        }
    }
    this.serum = 便笺(1000, true);

    if (this.serum) {
        if (this.serum < 30 && helper.注射血清 == 0 && (!helper.自动2血清 || helper.任务状态.自动2血清)) {
            toastLog("血清不足30\n可注射血清为" + helper.注射血清 + "次");
            return false
        } else {
            toastLog("当前血清: " + this.serum + (!helper.任务状态.自动2血清 && helper.自动2血清 ? "，自动注射血清2:true" : ""))

        }
    }
    tool.Floating_emit("展示文本", "状态", "状态：准备作战中");
    if (!helper.战斗.活动) {
        if (!ITimg.ocr("战斗", {
                action: 2,
                timing: 3000,
                area: "右半屏",
            }) && !ITimg.ocr("战斗", {
                action: 2,
                timing: 3000,
                area: "右半屏",
                part: true,
            })) {
            //都识别不到，改用固定坐标进入活动
            click.apply(click, axis_list.homepage_battle);

            sleep(3000)
        }
        (ITimg.ocr("资源", {
            action: 1,
            timing: 1000,
            area: "右下半屏",
            nods: 500,
        }) || ITimg.ocr("资源", {
            action: 1,
            timing: 1000,
            area: 34,
        }));
        let gesturexy = [
            [height / 2, width / 2, height - frcx(100), width / 2, 800],
            [height / 2, width / 2, frcx(100), width / 2, 800]
        ];

        while (true) {
            if (ITimg.ocr(helper.战斗.资源名称, {
                    action: 1,
                    timing: 1500,
                    nods: 2000,
                })) {

                break
            } else {
                swipe.apply(swipe, gesturexy[random(0, 1)]);
                sleep(500);
            }
        }
        let checkpoint = ITimg.ocr("已完成", {
            action: 6,
            area: "下半屏",
        })
        if (checkpoint) {

            let point = [0, 0];
            for (i in checkpoint) {
                if (tool.nlpSimilarity(checkpoint[i].text, "已完成") >= 0.80 || checkpoint[i].text == "已完成") {
                    if (checkpoint[i].left > point[0]) {
                        point[0] = checkpoint[i].left;
                        point[1] = checkpoint[i].top
                    }
                }
            }
            if (point[0] == 0) {
                point = (ITimg.ocr(helper.战斗.资源名称, {
                    action: 5,
                    area: 34,
                    gather: checkpoint,
                }) || ITimg.ocr("掉率翻倍", {
                    action: 5,
                    area: 34,

                    part: true,
                    gather: checkpoint
                }));

                if (point) {
                    click(point.right, point.top - frcy(100));
                    sleep(1000);
                } else {
                    toastLog("无法确认 " + helper.战斗.资源名称 + " 中可自动作战关卡，请确认ocr是否识别正确")
                }
                //普通关
            } else if (point[0] != 0) {
                click.apply(click, point);
                sleep(2000);
                if (!ITimg.ocr("自动作战", {
                        action: 5,
                        timing: 1000,
                        area: 4,
                    }) && !ITimg.ocr("自动作战", {
                        action: 5,
                        timing: 1000,
                        area: 34,
                        part: true,
                    })) {
                    toastLog("没有匹配到自动作战")


                }
            }
        }



    } else {
        //限时活动
        log("限时活动")
        if (ITimg.ocr("战斗", {
                action: 2,
                timing: 2000,
                area: "右半屏",
            }) || ITimg.ocr("战斗", {
                action: 2,
                timing: 2000,
                area: "右半屏",
                part: true,
                refresh: false,
            })) {
            if (!ITimg.ocr("限时活动", {
                    action: 0,
                    timing: 1500,
                    area: 4,
                }) && !ITimg.ocr("限时活动", {
                    action: 0,
                    timing: 1500,
                    area: "右半屏",
                    refresh: false,
                    part: true,
                }) && !ITimg.ocr("进行中", {
                    action: 0,
                    timing: 1500,
                    area: "右半屏",
                    part: true,
                })) {
                click(height / 3, width / 2);
                sleep(1000)
            }
            (ITimg.ocr("权限等级", {
                action: 0,
                timing: 1500,
                nods: 1000,
                area: 3,
            }) || ITimg.ocr("权限等级", {
                action: 0,
                timing: 1500,
                nods: 1000,
                refresh: false,
                part: true,
            }) || ITimg.ocr("权限等级", {
                action: 0,
                timing: 1500,
                area: 13,
                part: true,
            }));
            if (!ITimg.ocr("活动", {
                    // action: 0,
                    timing: 100,
                    part: true,
                    area: 3,
                    nods: 1000,
                }) || !ITimg.ocr("商店", {
                    // action: 0,
                    timing: 100,
                    area: 3,
                    refresh: false,
                    //  part: true,
                })) {
                (ITimg.ocr("权限等级", {
                    action: 0,
                    timing: 1500,
                    nods: 1000,
                    area: "下半屏",
                }) || ITimg.ocr("权限等级", {
                    action: 0,
                    timing: 1500,
                    nods: 1000,
                    area: "左半屏",
                    part: true,
                }) || ITimg.ocr("权限等级", {
                    action: 0,
                    timing: 1500,
                    part: true,
                }));

            }
            if (!ITimg.ocr("自动作战", {
                    action: 0,
                    timing: 1500,
                    area: "下半屏",
                    part: true,
                }) && !ITimg.ocr("自动作战", {
                    action: 0,
                    timing: 1500,
                    area: "下半屏",
                    refresh: false,
                })) {
                (ITimg.ocr("已开启", {
                    action: 0,
                    timing: 1500,
                    area: "下半屏",
                    part: true,
                }) || ITimg.ocr("已开启", {
                    action: 0,
                    timing: 1500,
                    area: "下半屏",
                    refresh: false,
                }))
            }

        }

        click(height / 2, width / 2)
        sleep(1000)

        /*
                coordinate.战斗.关卡 = ITimg.ocr("MIX", {
                    action: 1,
                    timing: 1500,
                    area: coordinate.战斗.活动.关卡 ? "左半屏" : "右半屏",
                    part: true
                })
                if (!coordinate.战斗.关卡) {
                    coordinate.战斗.关卡 = ITimg.ocr("MIX", {
                        action: 1,
                        timing: 1500,
                        area: "左半屏",
                        part: true
                    })
                    if (coordinate.战斗.关卡) {
                        text = "活动代币+意识 未开放\n转活动代币";
                        toast(text);
                        console.info(text)
                    }
                } else {
                    text = "刷取 " + coordinate.战斗.活动.关卡 ? "活动代币" : "活动代币+意识";
                    toast(text)
                    console.info(text)
                }
                */

    }

    sleep(1500)
    helper = tool.readJSON("helper");

    if (!helper.任务状态.自动2血清 && helper.自动2血清) {
        helper.注射血清 = 2;
        log("自动注射血清2");
    }
    sleep(150);
    if (helper.注射血清 > 0) {
        tool.Floating_emit("展示文本", "状态", "状态：准备注射血清中")

        ITimg.ocr("/240", {
            action: 1,
            area: 2,
            part: true,
            timing: 1500,
        }) || ITimg.ocr("/240", {
            action: 1,
            area: 12,
            part: true,
            timing: 1500,
        })

    }

    /*
    // ITimg.ocr("MAX", { action: 4, timing: 500, area: "下半屏", part: true })
    if (!ITimg.ocr("确认出战", {
            action: 0,
            timing: 2000,
            part: true,
        })) {
        if (!ITimg.ocr("自动作战", {
                action: 1,
                timing: 1000,
                area: 34,
                part: true,
            }) && !ITimg.ocr("自动作战", {
                action: 1,
                timing: 1000,
                area: 4,
            })) {
            if (!helper.战斗.作战) {
                helper.战斗.作战 = (ITimg.ocr("多重挑战", {
                    action: 4,
                    timing: 1000,
                    area: 4,
                }) || ITimg.ocr("已开启", {
                    action: 0,
                    timing: 1000,
                    area: 4,
                    refresh: false,
                }));
            }
        }

    }
 */
    sleep(500);
    //确定消耗血清
    staging = (ITimg.ocr("确定", {
        timing: 100,
        action: 5,
        area: 4,
        nods: 1500,
    }) || ITimg.ocr("确定", {
        timing: 100,
        action: 5,
        refresh: false,
    }));

    if (staging && staging.left < Math.floor(height / 1.4)) {
        tool.Floating_emit("展示文本", "状态", "状态：血清管理中...")
        if (helper.注射血清 > 0) {
            helper.已注射血清 = 0;
            for (let i = 0; i < helper.注射血清; i++) {
                click(staging.right, staging.top);
                sleep(1500);
                if (检查获得奖励()) {
                    helper.已注射血清++;
                    tool.Floating_emit("展示文本", "血清", "血清：可使用:" + helper.注射血清 + "&已使用:" + helper.已注射血清);
                    if (helper.已注射血清 >= helper.注射血清) {
                        tool.writeJSON("注射血清", 0)
                    }
                }
            }

            frequency = 3;
            while (frequency) {
                sleep(200)
                if (ITimg.matchFeatures("宿舍-家具-关闭", {
                        action: 0,
                        timing: 2000,
                        area: 2,
                        threshold: 0.8,
                        nods: 1000,
                        saveSmallImg: "注射血清-关闭",
                    }) || ITimg.matchFeatures("宿舍-家具-关闭", {
                        action: 0,
                        timing: 2000,
                        area: 2,
                        threshold: 0.8,
                        saveSmallImg: "注射血清-关闭",
                        visualization: true,

                    })) {
                    break
                }
                frequency--;
                if (!frequency) {
                    if (coordinate.coordinate["宿舍-家具-关闭"]) {
                        click(coordinate.coordinate["宿舍-家具-关闭"].x, coordinate.coordinate["宿舍-家具-关闭"].y);

                    }
                }

            }
        } else {
            frequency = 3;
            while (frequency) {
                sleep(200)
                if (ITimg.matchFeatures("宿舍-家具-关闭", {
                        action: 0,
                        timing: 2000,
                        area: 2,
                        threshold: 0.8,
                        nods: 1000,
                        saveSmallImg: "注射血清-关闭",
                    }) || ITimg.matchFeatures("宿舍-家具-关闭", {
                        action: 0,
                        timing: 2000,
                        area: 2,
                        threshold: 0.8,
                        saveSmallImg: "注射血清-关闭",
                        visualization: true,

                    })) {
                    break
                }
                frequency--;
                if (!frequency) {
                    if (coordinate.coordinate["宿舍-家具-关闭"]) {
                        click(coordinate.coordinate["宿舍-家具-关闭"].x, coordinate.coordinate["宿舍-家具-关闭"].y);

                    }
                }

            }
            if (!helper.挑战次数) {
                sleep(1000);
                返回主页();

                return
            }
        }
    }

    if (!helper.任务状态.自动2血清 && helper.自动2血清 && helper.已注射血清 >= 2) {
        helper.任务状态.自动2血清 = true;
        tool.writeJSON("任务状态", helper.任务状态);

    }

    //你可以直接用固定坐标点击
    if (helper.挑战次数 > 0) {

        if (helper.挑战次数 >= 7) {
            //大于7,获取点击MAX
            if (!ITimg.ocr("MAX", {
                    action: 0,
                    timing: 1500,
                    area: 3,
                    similar: 0.85,
                })) {
                toastLog("无法调整挑战次数\n请检查图库图片: 战斗-次数MAX");
            }


        } else {
            this.serological = ITimg.matchFeatures("战斗-次数+", {
                action: 5,
                area: 34,
                threshold: 0.8,
                saveSmallImg: true,
                visualization: true,
            }) || ITimg.ocr("+", {
                action: 5,
                area: 3,
            })

            if (this.serological) {
                for (let i = 1; i < helper.挑战次数; i++) {
                    click(this.serological.left, this.serological.top);
                    sleep(150);
                }

            } else {
                toastLog("无法调整挑战次数\n请检查模板图库图片: 战斗-次数+.png");
            }
        }


    } else {
        toastLog("没有可挑战次数")
        return
    }

    helper.战斗.作战 = false;
    if (!ITimg.ocr("确认出战", {
            action: 0,
            part: true,
            timing: 2000,
            part: true,
        })) {
        if (!ITimg.ocr("自动作战", {
                action: 1,
                timing: 1000,
                area: 4,
            })) {
            if (!helper.战斗.作战) {
                helper.战斗.作战 = (ITimg.ocr("多重挑战", {
                    action: 4,
                    timing: 1000,
                    area: 4,
                }) || ITimg.ocr("已开启", {
                    action: 0,
                    timing: 1000,
                    area: 4,
                    refresh: false,
                }));
            }
        }

    }
    //


    //   if(ITimg.ocr("确认出战", { action: 4, timing: 2000, refresh: false })
    if (helper.战斗.作战) {

        tool.Floating_emit("展示文本", "状态", "状态：作战管理中")

        while (true) {
            ITimg.ocr("作战开始", {
                action: 4,
                timing: 10000,
                area: 4
            })
            if (ITimg.ocr("当前进度", {
                    action: 0,
                    timing: 1500,
                    area: 13,
                }) || ITimg.ocr("当前进度", {
                    area: "左半屏",
                    part: true,
                    refresh: false,
                }) || ITimg.ocr("奖励 X0", {
                    area: "左半屏",
                    nods: 2000,
                    refresh: false,
                })) {
                break
            }
        }
        //点击特殊事件的坐标位置
        click.apply(click, axis_list.activity_level_special);
        sleep(500);
        if (!ITimg.ocr("胜利并结束", {
                action: 0,
                timing: 10000,
                area: "左半屏"
            })) {
            //在新线程中运行作战方案,解决冲突
            fight_thread = threads.start(作战);
        }
        sleep(1000 * 15)
    }
    sleep(1000);
    while (true) {
        if (ITimg.ocr("返回", {
                action: 0,
                timing: 1500,
                area: 34,
                threshold: 0.9,
            }) || ITimg.ocr("自动作战", {
                action: 5,
                timing: 500,
                refresh: false,
            })) {
            //作战完成,终止作战方案
            fight_thread = false;
            ITimg.ocr("返回", {
                action: 0,
                timing: 500,
                area: 34,
                nods: 1500,
            })
            break
        }
        /*if (!ITimg.ocr("当前进度", { refresh: false, part: true, })) {
           sleep(1000)
                if (!ITimg.ocr("当前进度", { part: true, })) {
                    fight_thread = false;
                }
            
        }
        */
        if (ITimg.ocr("确定", {
                action: 5,
                timing: 500,
                area: 4,
                nods: 1000,
                refresh: false,
            })) {
            //作战完成,终止作战方案
            fight_thread = false;
            while (true) {
                if (!ITimg.ocr("确定", {
                        action: 0,
                        timing: 1500,
                        area: 4,
                        nods: 1500,
                    }) && ITimg.ocr("返回", {
                        action: 0,
                        timing: 500,
                        area: 1,
                        threshold: 0.9,
                    })) {
                    break
                }
            }
            break
        }
    }

    返回主页()
}

function 返回主页(only_return) {
    if (only_return) {
        if (coordinate.coordinate.返回) {
            click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
            sleep(2000);
            return true;
        } else {
            let staging = (ITimg.ocr("返回", {
                area: [0, 0, height / 4, width / 4],
                action: 5,
                similar: 0.72,
                threshold: 0.85,
            }) || ITimg.ocr("返回", {
                area: [0, 0, height / 4, width / 4],
                action: 5,
                part: true,
                threshold: 0.85,
            }));
            if (staging) {
                if (staging.right < height / 4 && staging.bottom < width / 4) {
                    click(staging.left, staging.bottom);
                    坐标配置("返回", staging.left, staging.bottom)
                    sleep(2000);
                    return true;
                }
            } else {
                return false;
            }
        }
    }
    tool.Floating_emit("展示文本", "状态", "状态：尝试回到主页..")

    console.info("---返回主页---")
    //返回主页
    let staging = (ITimg.ocr("主页面", {
        area: [0, 0, height / 4, width / 4],
        action: 5,
    }) || ITimg.ocr("主界面", {
        action: 5,
        part: true,
        refresh: false,
        log_policy: "简短",
    }));
    if (staging) {
        click(staging.left, staging.bottom);
        坐标配置("主页面", staging.left, staging.bottom)
        sleep(1500);
    }
    while (true) {
        //不在主页界时,再点下
        if (ITimg.ocr("任务", {
                action: 5,
                area: "右半屏",
            }) && ITimg.ocr("成员", {
                area: "右半屏",
                refresh: false,
            }) && ITimg.ocr("采购", {
                area: "右半屏",
                refresh: false,
                part: true,
                nods: 1000,
            })) {
            break
        } else {
            //返回主页
            staging = (ITimg.ocr("主页面", {
                area: 1,
                action: 5,
            }) || ITimg.ocr("主界面", {
                action: 5,
                part: true,
                refresh: false,
                log_policy: "简短",
            }))
            if (staging) {
                click(staging.left, staging.bottom);
                坐标配置("主页面", staging.left, staging.bottom)
                sleep(3000);
            } else if (ITimg.ocr("官方主页", {
                    area: 24,
                    action: 5,
                }) || ITimg.ocr("库街区", {
                    area: 24,
                    action: 5,
                    refresh: false,
                }) || ITimg.ocr("游戏周边", {
                    area: 24,
                    action: 5,
                    refresh: false,
                })) {
                click(height / 2, width - frcy(80));
                sleep(1000);
            }
        }
    }
}





function 幻痛囚笼() {
    console.info("---幻痛囚笼---");
    if (!helper.phantom_pain_cage || !helper.phantom_pain_cage.启用) {
        return
    }

    // 获取当前时间
    let today = new Date();
    let dayOfWeek = today.getDay(); // 获取当前日期的星期几
    if (helper.phantom_pain_cage.周六日不执行 && (dayOfWeek == 6 || dayOfWeek == 0)) {
        return
    }
    tool.Floating_emit("面板", "id", "幻痛囚笼");
    tool.Floating_emit("展示文本", "状态", "状态：准备处理幻痛囚笼中")
    if (ITimg.ocr("任务", {
            area: "右半屏",
        }) == false && ITimg.ocr("战斗", {
            area: "右半屏",
            refresh: false,
        }) == false) {
        返回主页()
    }
    while (true) {
        if (!ITimg.ocr("战斗", {
                action: 2,
                timing: 3000,
                area: "右半屏",
            }) && !ITimg.ocr("战斗", {
                action: 2,
                timing: 3000,
                area: "右半屏",
                refresh: false,
                part: true,
            })) {
            //都识别不到，改用固定坐标进入活动
            click.apply(click, axis_list.homepage_battle);
            sleep(3000)
        }
        if (ITimg.ocr("挑战", {
                action: 4,
                timing: 2000,
                similar: 0.85,
                area: 4,
            }) || ITimg.ocr("挑战", {
                action: 4,
                timing: 2000,
                similar: 0.8,
                area: 34,
            })) {
            break
        }
    }
    while (true) {
        ITimg.ocr("挑战", {
            action: 4,
            timing: 2000,
            similar: 0.8,
            area: 34,
        })

        if (ITimg.ocr("常规挑战", {
                area: 34,
                action: 5,
                similar: 0.8,
            }) || ITimg.ocr("特殊挑战", {
                action: 5,
                refresh: false,
                similar: 0.8,
            }) || ITimg.ocr("幻痛囚笼", {
                action: 5,
                area: 34,
                refresh: false,
                similar: 0.8,
            })) {
            break;
        }

    }
    //检验
    let operator = ITimg.ocr("/9", {
        area: 34,
        action: 5,
        part: true,
        nods: 1000,
        saveSmallImg: false,
    }) || ITimg.ocr("/9", {
        area: 34,
        action: 5,
        part: true,
        log_policy: "简短",
        saveSmallImg: false,
    }) || ITimg.ocr("/9", {
        area: 4,
        action: 5,
        part: true,
        saveSmallImg: false,
    })

    if (operator) {
        // 使用正则表达式提取数字
        let match = operator.text.match(/(\d+)\/(\d+)/);
        let obtained = parseInt(match[1]);
        let target = parseInt(match[2]);

        // 计算还需多少次作战可达/9
        settlement_frequency = Math.ceil((target - obtained) / 3);

        toastLog('幻痛进度： ' + obtained + '/9');
        if (!settlement_frequency) {
            返回主页();
            return false;
        }
        click(operator.left, operator.top);
        sleep(1500);
    }

    /* sleep(100);
     ITimg.ocr("幻痛囚笼", {
         action: 1,
         refresh: false,
         similar: 0.8,
         timing: 1000,
     })
     */
    tool.Floating_emit("展示文本", "状态", "状态：准备讨伐囚笼boos");
    while (true) {
        ITimg.ocr("幻痛囚笼", {
            area: 34,
            action: 1,
            similar: 0.8,
            timing: 1000,
        })
        let difficulty;
        if (helper.phantom_pain_cage.终极区) {
            difficulty = ITimg.ocr("终极区", {
                action: 5,
                area: 12,
            })
        } else {
            difficulty = ITimg.ocr("高级区", {
                action: 5,
                area: 12,
            })
        }
        if (difficulty) {
            click(difficulty.left, difficulty.bottom + frcy(100));
            sleep(1000);
        }
        ITimg.ocr("确定", {
            action: 1,
            area: 4,
            timing: 1000,
        })

        if (ITimg.ocr("商店", {
                action: 5,
                area: 3,
            }) || ITimg.ocr("讨伐", {
                action: 5,
                refresh: false,
            })) {
            break
        }
    }
    tool.Floating_emit("展示文本", "状态", "状态：进入囚笼讨伐boss");
    sleep(1000)
    let conquest_list = ITimg.ocr("集合", {
        action: 6,
        area: [height / 4, width / 4, height - height / 4, width / 2],

    })
    if (!conquest_list || !conquest_list.length) {
        toastLog("无可讨伐列表");
        return false;
    }
    console.warn("讨伐列表:", conquest_list);
    frequency = 0;
    for (let conquest of conquest_list) {
        if (conquest.text.indexOf("讨伐值") != -1) {
            match = false;
            for (let conquest_number of conquest_list) {
                match = conquest_number.text.match(/(\d+)/);
                if (!match) {
                    continue;
                }
                match = conquest_number;
                match.text = conquest_number.text.match(/(\d+)/)[0];
                console.warn(match)
                if (match && Math.abs(match.left - conquest.left) <= frcx(150) && match.text >= 200000) {
                    break
                } else {
                    match = false;
                }
            }
            if (match) {
                continue;
            }

            while (true) {
                frequency++
                if (frequency > 3) {
                    log("无法进入讨伐boss界面");
                    break
                }
                click(conquest.left, conquest.top - frcy(80));
                sleep(1000);
                if (ITimg.ocr("作战准备", {
                        action: 5,
                        area: 34,
                        nods: 1000,
                    }) || ITimg.ocr("难度提示", {
                        action: 5,
                        area: 34,
                        refresh: false,
                    })) {
                    conquest.confirm = true;
                    if (conquest.left < height / 2) {
                        helper.phantom_pain_cage.A组 = true;
                    } else if (conquest.left < parseInt(height / 1.5)) {
                        helper.phantom_pain_cage.B组 = true;
                    } else {
                        helper.phantom_pain_cage.Y组 = true;
                    }
                    break
                }
            }
            if (conquest.confirm) {
                break;
            }
        }

    }
    tool.Floating_emit("展示文本", "状态", "状态：检验囚笼挑战次数，buff信息");
    //杠符号会让程序导致0是文件夹
    if (ITimg.ocr("0/3", {
            action: 5,
            area: 3,
            refresh: false,
            //文件名不能带特殊符号
            saveSmallImg: "0-3",
            threshold: 0.9,
        })) {
        toastLog("今日已无挑战次数");
        return false
    }

    sleep(500);
    conquest_list = ITimg.ocr("集合", {
        action: 6,
        area: 4,
    });

    console.warn("buff检测");
    console.warn("buff信息", conquest_list);
    let buff;
    for (let key in buff_list) {
        for (let key_text of buff_list[key]) {
            buff = ITimg.ocr(key_text, {
                area: 4,
                action: 5,
                gather: conquest_list,
                similar: 0.8,
                log_policy: "简短",
            })
            if (buff) {
                buff = key;
                break
            }
        }
        if (buff) {
            break;
        }
    }

    let combat_frequency = 3;
    while (combat_frequency) {
        let campaign_value = ITimg.ocr("讨伐值", {
            action: 5,
            area: 2,

        })
        if (campaign_value) {
            campaign_value = ITimg.ocr("集合", {
                action: 6,
                area: [campaign_value.left, campaign_value.bottom, (campaign_value.right - campaign_value.left) * 2, (campaign_value.bottom - campaign_value.top) * 2],

            });
            if (campaign_value) {
                let campaign_value_list = [];
                campaign_value.sort((a, b) => a.left - b.left);
                for (let campaign of campaign_value) {
                    let value = campaign.text.match(/(\d+)\/(\d+)/)
                    if (value) {
                        campaign_value_list.push(value[1]);
                        campaign_value_list.push(value[2]);
                    } else if (campaign.text.match(/(\d+)/)) {
                        campaign_value_list.push(campaign.text.match(/(\d+)/)[0][0]);

                    }
                }
                if (campaign_value_list[0] >= 30000 && campaign_value_list[1]) {

                    let tips = "已经讨伐过了，讨伐值：" + campaign_value_list[0] + "，上限：" + campaign_value_list[1];
                    tool.Floating_emit("展示文本", "状态", "状态：已经讨伐过了");
                    console.error(tips);
                    combat_frequency--;
                    if (combat_frequency == 2) {

                        (!ITimg.ocr("混沌", {
                            action: 1,
                            area: [0, 0, parseInt(height / 4), width],
                            timing: 1000,
                            nods: 1000,
                        }) && ITimg.ocr("混沌", {
                            action: 1,
                            area: [0, 0, parseInt(height / 4), width],
                            timing: 1000,
                        }))
                    } else if (combat_frequency == 1) {
                        (!ITimg.ocr("地狱", {
                            action: 1,
                            area: [0, 0, parseInt(height / 4), width],
                            timing: 1000,
                            nods: 1000,
                        }) && ITimg.ocr("地狱", {
                            action: 1,
                            area: [0, 0, parseInt(height / 4), width],
                            timing: 1000,
                        }))
                    }

                    continue;

                }
            }
        }
        tool.Floating_emit("展示文本", "状态", "状态：开始囚笼自动战斗");
        if (!ITimg.ocr("自动作战", {
                action: 4,
                area: 4,
                refresh: false,
                timing: 500,
            }) || ITimg.ocr("无记录保存", {
                area: 5,
                action: 5,
            })) {
            while (true) {
                ITimg.ocr("作战准备", {
                    action: 1,
                    area: 4,
                    similar: 0.8,
                    timing: 1000,
                })
                if (ITimg.ocr("作战开始", {
                        action: 5,
                        area: 4,
                        refresh: false,
                    }) || ITimg.ocr("黄色", {
                        action: 5,
                        area: 4,
                        refresh: false
                    })) {
                    break;
                } else if (ITimg.ocr("挑战次数不足", {
                        action: 5,
                        area: 5,
                    })) {
                    combat_frequency = 0;
                    break
                }


            }
            if (!combat_frequency) {
                tips = "检测到已无挑战次数";
                toast(tips)
                console.warn(tips);
                tool.Floating_emit("展示文本", "状态", "状态：" + tips);
                break;
            }

            // if(helper.phantom_pain_cage.自适应队伍){
            if (!buff) {
                buff = "默认";
            }
            let ranks, frequency = 0;
            toastLog("属性队伍:" + buff)

            tool.Floating_emit("展示文本", "状态", "状态：优选预设队伍");
            while (true) {
                tool.Floating_emit("面板", "隐藏");
                sleep(500);

                if (ITimg.ocr("队伍", {
                        action: 1,
                        area: 2,
                        timing: 1500,
                    }) || ITimg.ocr("预设", {
                        action: 1,
                        area: 2,
                        timing: 1500,
                    })) {
                    if (frequency == 0 && helper.phantom_pain_cage.老队伍) {
                        滑动手势.apply(滑动手势, axis_list.recruit_slide_left);
                        sleep(100);
                        滑动手势.apply(滑动手势, axis_list.recruit_slide_left);
                        sleep(100);
                        滑动手势.apply(滑动手势, axis_list.recruit_slide_left);
                        sleep(100);


                    }
                }

                if (frequency > 3 && buff != "默认" && !helper.phantom_pain_cage.老队伍) {
                    buff = "默认";
                    frequency = 0;
                    log("回滚界面，选择默认队伍")
                    swipe.apply(swipe, axis_list.recruit_slide_right);
                    sleep(500);
                    滑动手势.apply(滑动手势, axis_list.recruit_slide_right, 500);

                }
                sleep(1500);
                ranks = ITimg.ocr(buff, {
                    action: 5,
                    area: 12,
                    threshold: 0.9,
                });

                if (ranks) {
                    tool.Floating_emit("面板", "展开");
                    ranks = ITimg.ocr("集合_选择", {
                        action: 6,
                        saveSmallImg: false,
                        area: [ranks.left, parseInt(width / 1.5), parseInt(height / 4), width - parseInt(width / 1.5)],
                    });
                    if (ranks && ranks.length) {
                        ranks.sort((a, b) => a.left - b.left);
                        if (ITimg.ocr("选择", {
                                action: 1,
                                similar: 0.70,
                                gather: ranks,
                                saveSmallImg: false,
                                timing: 500,
                            }) && ITimg.ocr("选择", {
                                action: 1,
                                similar: 0.70,
                                gather: ranks,
                                saveSmallImg: false,
                                timing: 1000,
                            })) {
                            break;
                        }
                    }
                }
                if (!helper.phantom_pain_cage.老队伍) {

                    滑动手势.apply(滑动手势, axis_list.recruit_slide_left);
                    sleep(1000);
                } else {
                    //减少老队伍循环次数
                    frequency++;
                    滑动手势.apply(滑动手势, [height / 2, width / 2, (height / 2 + parseInt(height / 6)), width / 2]);
                    sleep(1000)
                }
                if (frequency > 4) {
                    console.warn("无可选属性队伍，随机选择队伍1~2");
                    if (!helper.phantom_pain_cage.老队伍) {
                        log("滑动");
                        swipe.apply(swipe, axis_list.recruit_slide_right);
                        sleep(500);
                        swipe.apply(swipe, axis_list.recruit_slide_right);

                        if (ITimg.ocr("选择", {
                                area: 34,
                                action: 1,
                                timing: 500,
                            }) || ITimg.ocr("选择", {
                                action: 1,
                                timing: 1000,
                                refresh: false,
                            })) {
                            break;
                        }
                    } else {
                        ranks = ITimg.ocr("集合_选择", {
                            action: 6,
                            area: 34,
                        });
                        if (ranks && ranks.length) {
                            ranks.sort((a, b) => b.left - a.left);
                            if (ITimg.ocr("选择", {
                                    action: 1,
                                    similar: 0.70,
                                    gather: ranks,
                                    timing: 500,
                                }) && ITimg.ocr("选择", {
                                    action: 1,
                                    similar: 0.70,
                                    gather: ranks,
                                    timing: 1000,
                                })) {
                                break;
                            }
                        }
                    }

                }
                frequency++;
            }
            ITimg.ocr("确定", {
                action: 1,
                timing: 1000,
                area: [height / 2, width / 2, height - parseInt(height / 1.3), width / 2],
            });
            tool.Floating_emit("展示文本", "状态", "状态：队伍出击")
            ITimg.ocr("作战开始", {
                action: 1,
                area: 4,
                timing: 1000,
            })
            ITimg.ocr("作战开始", {
                action: 1,
                area: 4,
                timing: 1000,
            })
            sleep(6000);

            //在新线程中运行作战方案,解决冲突
            tool.pointerPositionDisplay(true);
            fight_thread = threads.start(作战);
            sleep(5000);
            while (true) {
                if (fight_thread && !fight_thread.isAlive()) {
                    toastLog("重启作战线程");
                    fight_thread = threads.start(作战);
                }
                staging = ITimg.ocr("保存分数", {
                    area: 4,
                    action: 6,
                });
                if (ITimg.ocr("保存分数", {
                        area: 4,
                        action: 5,
                        gather: staging,
                    }) || ITimg.ocr("取消保存", {
                        nods: 1500,
                        area: 4,
                        refresh: false,
                        log_policy: "简短",
                        gather: staging,
                    }) || ITimg.ocr("作战准备", {
                        nods: 1500,
                        area: 4,
                        refresh: false,
                        log_policy: "简短",
                        gather: staging,
                    })) {
                    fight_thread && fight_thread.isAlive() && fight_thread.interrupt();

                    fight_thread = false;

                    // if (i >= 2) {
                    tool.writeJSON("phantom_pain_cage", helper.phantom_pain_cage);
                    tool.writeJSON("周常任务", true);
                    // }

                    sleep(2000);
                    if (ITimg.ocr("保存分数", {
                            action: 1,
                            timing: 1500,
                            refresh: false
                        }) || ITimg.ocr("作战准备", {
                            area: 4,
                            refresh: false,
                            log_policy: "简短",
                            saveSmallImg: false,
                        })) {

                        break;
                    }
                }
            }


            tool.pointerPositionDisplay(false);



            //  }
        }
        combat_frequency--;

    }

    返回主页(true);

    if (!helper.phantom_pain_cage.领取奖励) {
        return false;
    }
    tool.Floating_emit("展示文本", "状态", "状态：领取囚笼奖励");
    staging = ITimg.ocr("下阶段讨伐目标", {
        action: 5,
        area: 13,
    }) || ITimg.ocr("需求：讨伐值", {
        action: 5,
        area: 13,
        part: true,
        refresh: false,
        nods: 1000,
    })
    if (!staging) {

        staging = ITimg.ocr("下阶段讨伐目标", {
            action: 5,
            area: 13,
        }) || ITimg.ocr("需求：讨伐值", {
            action: 5,
            area: 13,
            part: true,
            refresh: false,

        })
    }
    if (!staging) {
        tips = "无法获取奖励入口旁的文本";
        toast(tips);
        console.warn(tips);
        return false;

    }
    staging = [
        [staging.right, staging.top],
        [staging.right, staging.top + frcy(100)]
    ];
    click.apply(click, staging[0]);
    click.apply(click, staging[1]);
    sleep(1500);
    let frequency = [3, 3];
    while (frequency[1]) {
        staging = ITimg.ocr("集合", {
            action: 6,
            area: 24,
        })
        if (!staging || !staging.length) {
            sleep(500);
            continue;
        }
        staging.sort((a, b) => a.top - b.top)
        if (ITimg.ocr("领取", {
                action: 1,
                timing: 1000,
                gather: staging,
            })) {
            if (检查获得奖励()) {
                frequency[0]--;
            } else {
                break;
            }
        }
        if (!frequency[0]) {
            滑动手势.apply(滑动手势, axis_list.reward_slide_top);
            frequency[1]--;
        }
    }
    sleep(500);
    click(height / 2, width - frcy(100));
    sleep(500);

}

function 纷争战区() {
    if (!helper.纷争战区.自动) {
        return
    }
    tool.Floating_emit("面板", "id", "纷争战区");
    // 获取当前时间
    let today = new Date();
    let currentTime = today.getHours() * 60 + today.getMinutes(); // 当前时间（分钟）
    let mondayOpenTime = 5 * 60; // 周一开放时间（05:00）
    let sundayCloseTime = 18 * 60; // 周日截止时间（18:00）
    let dayOfWeek = today.getDay(); // 获取当前日期的星期几
    let isOpen = (dayOfWeek === 1 && currentTime <= mondayOpenTime) || (dayOfWeek === 0 && currentTime >= sundayCloseTime);

    if (isOpen) {

        toastLog("纷争战区 战斗期未开放");
        return false;
    }
    if (helper.纷争战区.lastExecutionTime) {
        let lastExecutionTime = new Date(helper.纷争战区.lastExecutionTime);
        if ((today.getTime() - lastExecutionTime.getTime()) <= 6 * 24 * 60 * 60 * 1000) {

            if (helper.纷争战区.执行状态 && (lastExecutionTime.getDay() != 0 && lastExecutionTime.getDay() <= dayOfWeek)) {
                let tips = "纷争战区 此周期已完成";
                tool.Floating_emit("展示文本", "状态", "状态：" + tips);
                console.warn(tips);
                return false;

            } else {
                helper.纷争战区.执行状态 = false;
                tool.writeJSON("纷争战区", helper.纷争战区);

            }
        }
    }

    tool.Floating_emit("展示文本", "状态", "状态：准备纷争战区中")
    if (!ITimg.ocr("任务", {
            area: "右半屏",
        }) && !ITimg.ocr("战斗", {
            area: "右半屏",
            refresh: false,
        })) {
        返回主页();
    }
    while (true) {
        if (!ITimg.ocr("战斗", {
                action: 2,
                timing: 3000,
                area: "右半屏",
            }) && !ITimg.ocr("战斗", {
                action: 2,
                timing: 3000,
                area: "右半屏",
                refresh: false,
                part: true,
            })) {
            //都识别不到，改用固定坐标进入活动
            click.apply(click, axis_list.homepage_battle);
            sleep(3000)
        }
        if (ITimg.ocr("挑战", {
                action: 4,
                timing: 1000,
                similar: 0.85,
                area: 4,
            }) || ITimg.ocr("挑战", {
                action: 4,
                timing: 1000,
                similar: 0.8,
                area: 34,
            })) {
            break
        }
    }
    while (true) {
        ITimg.ocr("挑战", {
            action: 4,
            timing: 1000,
            similar: 0.85,
            area: 34,
        })

        if (ITimg.ocr("常规挑战", {
                area: 3,
                action: 5,
                similar: 0.8,
                refresh: false,
            }) || ITimg.ocr("特殊挑战", {
                area: 3,
                action: 5,
                refresh: false,
                similar: 0.8,
            }) || ITimg.ocr("纷争战区", {
                action: 5,
                area: 34,
                refresh: false,
                similar: 0.8,
            })) {
            break
        }
    }
    (ITimg.ocr("纷争战区", {
        action: 1,
        timing: 1500,
        area: 34,
    }) || ITimg.ocr("任务奖励已刷新", {
        action: 1,
        timing: 1500,
        area: 34,
    }))
    sleep(1500);
    // let place = ["猩红冰原", "暗影深林", "镭射合金", "火焰轮回", "机械工厂", "空域浮台"]

    let place_collection = ITimg.ocr("集合文本", {
        action: 6,
        area: 24,
    });
    let place_agg = [];
    let place;

    console.warn("战区列表信息:", place_collection);
    if (place_collection && place_collection.length) {

        console.warn("buff检测");
        for (let key in buff_list) {
            for (let key_text of buff_list[key]) {
                if (key_text.length != 4) {
                    continue;
                }
                if (place = ITimg.ocr(key_text, {
                        action: 5,
                        gather: place_collection,
                        saveSmallImg: false,
                        similar: 0.8,
                        log_policy: "简短",
                    })) {
                    place_agg.push([place, key]);
                    break
                }
            }
        }

    }
    console.warn("可挑战的战区列表:", place_agg)

    for (let f of place_agg) {
        /*  if (tool.nlpSimilarity(f.text, "未挑战") < 0.80 && f.text != "未挑战") {
              continue;
          }
          */
        console.info("点击" + f[0].text + " , x:" + f[0].left + ",y:" + f[0].top);
        click(f[0].left, f[0].bottom);
        sleep(1500);

        if (!ITimg.ocr("战斗准备", {
                action: 1,
                timing: 1500,
                area: 4,
                nods: 1000,
            }) && !ITimg.ocr("战斗准备", {
                action: 1,
                timing: 1500,
                area: 34,
            })) {
            continue;
        }


        let ranks, frequency = 0;


        tool.Floating_emit("展示文本", "状态", "状态：优选预设队伍中..");
        while (true) {
            tool.Floating_emit("面板", "隐藏");
            sleep(500);
            ITimg.ocr("队伍", {
                action: 1,
                area: 2,
                timing: 1000,
            }) || ITimg.ocr("预设", {
                action: 1,
                area: 2,
                timing: 1000,
            })
            if (frequency > 3 && f[1] != "默认") {
                f[1] = "默认";
                frequency = 0;
                log("回滚界面，选择默认队伍")
                swipe.apply(swipe, axis_list.recruit_slide_right);
                sleep(500);
                swipe.apply(swipe, axis_list.recruit_slide_right);

            }
            ranks = ITimg.ocr(f[1], {
                action: 5,
                area: 12,
            });


            if (ranks) {
                tool.Floating_emit("面板", "展开");
                ranks = ITimg.ocr("集合_选择", {
                    action: 6,
                    area: [ranks.left, parseInt(width / 1.5), parseInt(height / 4), width - parseInt(width / 1.5)],

                });
                if (ranks && ranks.length) {
                    ranks.sort((a, b) => a.left - b.left);
                    if (ITimg.ocr("选择", {
                            action: 1,
                            similar: 0.70,
                            gather: ranks,
                            timing: 500,
                        }) && ITimg.ocr("选择", {
                            action: 1,
                            similar: 0.70,
                            gather: ranks,
                            timing: 1000,
                        })) {
                        ITimg.ocr("确定", {
                            action: 1,
                            timing: 1500,
                            area: [height / 2, width / 2, parseInt(height / 1.3) - (height / 2), width / 2],
                        });
                        if (ITimg.ocr("作战开始", {
                                action: 1,
                                timing: 6000,
                                nods: 500,
                                area: 4,
                            }) || ITimg.ocr("作战开始", {
                                action: 1,
                                timing: 6000,
                                area: "右半屏",
                                part: true,
                                refresh: false,
                                log_policy: true,
                            })) {
                            break;

                        }
                    }
                }
            }
            滑动手势.apply(滑动手势, axis_list.recruit_slide_left);
            sleep(1000);

            if (frequency > 4) {
                console.warn("无可选属性队伍，随机选择队伍1~2");
                log("滑动")
                swipe.apply(swipe, axis_list.recruit_slide_right);
                sleep(500);
                swipe.apply(swipe, axis_list.recruit_slide_right);

                (ITimg.ocr("选择", {
                    area: 3,
                    action: 1,
                    timing: 200,
                }) && ITimg.ocr("选择", {
                    action: 1,
                    timing: 1000,
                    refresh: false,
                }));
                ITimg.ocr("确定", {
                    action: 1,
                    timing: 1500,
                    area: [height / 2, width / 2, height / 2 - parseInt(height / 1.3), width / 2],
                });
                if (ITimg.ocr("作战开始", {
                        action: 1,
                        timing: 6000,
                        nods: 500,
                        area: 4,
                    }) || ITimg.ocr("作战开始", {
                        action: 1,
                        timing: 6000,
                        area: "右半屏",
                        part: true,
                        refresh: false,
                        log_policy: true,
                    })) {
                    break;

                }
            }
            frequency++;

        }

        //在新线程中运行作战方案,解决冲突
        tool.pointerPositionDisplay(true);
        fight_thread = threads.start(作战);
        sleep(5000);
        while (true) {
            if (fight_thread && !fight_thread.isAlive()) {
                toastLog("重启作战线程");
                fight_thread = threads.start(作战);
            };
            let staging = ITimg.ocr("退出战斗", {
                area: 4,
                action: 6,
            });
            if (ITimg.ocr("退出战斗", {
                    area: 4,
                    action: 5,
                    gather: staging,
                }) || ITimg.ocr("重新开始", {
                    nods: 1500,
                    area: 4,
                    refresh: false,
                    log_policy: "简短",
                    gather: staging,
                })) {
                fight_thread && fight_thread.isAlive() && fight_thread.interrupt();

                fight_thread = false;

                // if (i >= 2) {
                helper.纷争战区.执行状态 = true;
                helper.纷争战区.lastExecutionTime = today.toString();
                tool.writeJSON("纷争战区", helper.纷争战区);
                tool.writeJSON("周常任务", true);
                // }

                sleep(3000);
                ITimg.ocr("退出战斗", {
                    action: 1,
                    timing: 1000,
                    refresh: false
                })
                返回主页(true);

                break;
            }
        }
        tool.pointerPositionDisplay(false);


    }


    sleep(1000);
    let staging = ITimg.ocr("主页面", {
        area: 1,
        action: 5,
    });
    if (staging) {
        click(staging.left, staging.bottom);
        坐标配置("主页面", staging.left, staging.bottom)
        sleep(2000)
    } else if (coordinate.coordinate.主页面) {
        click(coordinate.coordinate.主页面.x, coordinate.coordinate.主页面.y);
        sleep(2000);
    };


}

function 历战映射() {
    if (!helper.历战映射.启用) {
        return
    }

    // 获取当前时间
    tool.Floating_emit("面板", "id", "历战算符");
    tool.Floating_emit("展示文本", "状态", "状态：准备刷取历战算符中")
    if (ITimg.ocr("任务", {
            area: "右半屏",
        }) == false && ITimg.ocr("战斗", {
            area: "右半屏",
            refresh: false,
        }) == false) {
        返回主页()
    }
    if (!ITimg.ocr("战斗", {
            action: 2,
            timing: 3000,
            area: "右半屏",
        }) && !ITimg.ocr("战斗", {
            action: 2,
            timing: 3000,
            area: "右半屏",
            refresh: false,
            part: true,
        })) {
        //都识别不到，改用固定坐标进入活动
        click.apply(click, axis_list.homepage_battle);
        sleep(3000)
    }
    (ITimg.ocr("挑战", {
        action: 4,
        timing: 2000,
        similar: 0.85,
        area: 4,
    }) || ITimg.ocr("挑战", {
        action: 4,
        timing: 2000,
        similar: 0.8,
        area: 34,
    }));

    //检验算符
    let operator = ITimg.ocr("/1500", {
        area: 34,
        action: 5,
        saveSmallImg: false,
        part: true,
    })
    let settlement_frequency = 10;
    if (operator) {
        // 使用正则表达式提取数字
        let match = operator.text.match(/(\d+)\/(\d+)/);
        let obtained = parseInt(match[1]);
        let target = parseInt(match[2]);

        // 计算还需多少次任务可获得满 1500 个物品
        settlement_frequency = Math.ceil((target - obtained) / 150);

        toastLog('已获得 ' + obtained + '个算符，还需 ' + settlement_frequency + '次任务可获得满 ' + target + ' 个算法。');
        if (obtained == target) {
            返回主页();
            return false;
        }
        click(operator.left, operator.top);
        sleep(1500);

    } else {
        let tips = "无法获取已获得算符，请检查/1500相关识别结果";
        toast(tips);
        console.warn(tips);
        operator = (ITimg.ocr("历战映射", {
            action: 5,
            timing: 1000,
            area: 34,
            refresh: false,
        }) || ITimg.ocr("创生算符", {
            action: 5,
            timing: 1000,
            refresh: false,
            part: true,
        }))
    }
    while (true) {
        if (!ITimg.ocr("前往作战", {
                action: 1,
                timing: 2000,
                area: 4,
            }) && !ITimg.ocr("前往作战", {
                action: 1,
                timing: 2000,
                area: 34,
            })) {

            click(operator.left, operator.top);
            sleep(1500);
        }
        if (ITimg.ocr("情报解析", {
                action: 5,
                area: 12,
            }) || ITimg.ocr("环境情报", {
                action: 5,
                area: 12,
                log_policy: "简短",
            })) {
            click(height / 2, frcy(80));
            sleep(500);
            break
        }
        if (ITimg.ocr("开始挑战", {
                action: 5,
                area: 4,
                part: true,
            }) || ITimg.ocr("/14", {
                action: 5,
                nods: 1500,
                part: true,
                refresh: false,
                log_policy: "简短",
            })) {
            break
        }
    }
    while (settlement_frequency) {
        if (!ITimg.ocr("开始挑战", {
                action: 5,
                area: 4,
                similar: 0.70,
            }) && !ITimg.ocr("/14", {
                action: 5,
                nods: 1500,
                area: 4,
                part: true,
                refresh: false,
                log_policy: "简短",

            })) {

            continue;
        }
        if (ITimg.ocr("请先进行成员整备", {
                action: 1,
                refresh: false,
                timing: 1000,
                part: true,
            }) || ITimg.ocr("请先进行", {
                action: 1,
                refresh: false,
                timing: 1000,
                part: true,
                log_policy: "简短",
            }) || ITimg.ocr("成员整备", {
                action: 1,
                refresh: false,
                timing: 1000,
                part: true,
                log_policy: true,
            })) {


            while (true) {
                (ITimg.ocr("队伍", {
                    action: 1,
                    timing: 2000,
                    area: 2,
                }) || ITimg.ocr("预设", {
                    action: 1,
                    timing: 2000,
                    area: "右半屏",
                    refresh: false,
                }));
                (ITimg.ocr("选择", {
                    action: 1,
                    timing: 1000,
                    area: 3,
                }) || ITimg.ocr("选择", {
                    action: 1,
                    timing: 1000,
                    part: true,
                    area: 34,
                }) || ITimg.ocr("选择", {
                    action: 1,
                    timing: 1000,
                    part: true,
                    refresh: false,
                }))

                if (ITimg.ocr("作战开始", {
                        action: 1,
                        nods: 500,
                        timing: 1000,
                        area: 4,
                    })) {
                    break
                }

            }
        }
        while (true) {
            if (ITimg.ocr("5/14", {
                    action: 5,
                    refresh: false,
                })) {
                if (ITimg.ocr("结算", {
                        action: 1,
                        area: 2,
                        timing: 500,
                    })) {
                    if (ITimg.ocr("确定", {
                            action: 1,
                            timing: 1000,
                            area: 4,
                        })) {

                        settlement_frequency--;
                        tool.Floating_emit("展示文本", "挑战", "算符：已获得数量" + (10 - settlement_frequency * 150));

                    }
                    (ITimg.ocr("继续", {
                        action: 1,
                        timing: 1000,
                        area: 4,
                        nods: 1500,
                    }) || ITimg.ocr("继续", {
                        action: 1,
                        timing: 1000,
                        nods: 3000,
                        area: 4,
                    }) || ITimg.ocr("继续", {
                        action: 1,
                        timing: 1000,
                        area: 4,
                    }))
                }


            }

            if (ITimg.ocr("开始挑战", {
                    action: 1,
                    timing: 1500,
                    area: 4,
                    refresh: false,
                }) || ITimg.ocr("开始挑战", {
                    action: 1,
                    timing: 1500,
                    area: 34,
                })) {

                if (ITimg.ocr("确定", {
                        action: 1,
                        timing: 4000,
                        area: 4,
                    })) {
                    click(height / 2, width - frcy(80));
                    break
                }
                ITimg.ocr("保存", {
                    action: 1,
                    timing: 1500,
                    refresh: false,
                    nods: 1500,
                });
                click(height / 2, width - frcy(80));

                break
            }

        }
        //在新线程中运行作战方案,解决冲突
        fight_thread = threads.start(作战);
        tool.pointerPositionDisplay(true);
        sleep(5000);
        while (true) {
            if (fight_thread && !fight_thread.isAlive()) {
                toastLog("重启作战线程");
                fight_thread = threads.start(作战);
            };
            if (!ITimg.ocr("主页面", {
                    action: 5,
                    area: 1,
                }) && ITimg.ocr("返回", {
                    area: 1,
                    action: 1,
                    timing: 1200,
                    refresh: false,
                    nods: 2500,
                })) {
                fight_thread && fight_thread.isAlive() && fight_thread.interrupt();
                fight_thread = false;

                if (ITimg.ocr("确定", {
                        action: 1,
                        timing: 3000,
                        area: 4,
                    })) {
                    break;
                }

            }
        }
        tool.pointerPositionDisplay(false);
    }

    返回主页(true);
    if (ITimg.ocr("奖励", {
            action: 1,
            area: 3,
            timing: 1000,
        }) || ITimg.ocr("1500", {
            action: 1,
            timing: 1000,
            refresh: false,

        })) {
        if (ITimg.ocr("一键领取", {
                action: 0,
                timing: 2000,
                area: 4,
                nods: 1500,
            }) || ITimg.ocr("一键领取", {
                action: 0,
                timing: 2000,
                area: 4,
            })) {
            while (true) {
                if (检查获得奖励()) {
                    click(height / 2, width - frcy(80));
                    sleep(1000);
                    break
                }
            }

        }
    }

    sleep(1000);
    let staging = ITimg.ocr("主页面", {
        area: 1,
        action: 5,
    });
    if (staging) {
        click(staging.left, staging.bottom);
        坐标配置("主页面", staging.left, staging.bottom)
        sleep(2000)
    } else if (coordinate.coordinate.主页面) {
        click(coordinate.coordinate.主页面.x, coordinate.coordinate.主页面.y);
        sleep(2000);
    };


}

function 作战() {
    tool.Floating_emit("展示文本", "状态", "状态：人工智障操作中..");
    释放信号球 = function() {
        //   try{

        // 查找相似列函数
        function findSimilarColumns(column, columns) {
            return columns.filter(col => {
                return (Math.abs(col.w - column.w) <= frcx(5) && Math.abs(col.h - column.h) <= frcy(5) && (col.circularity && Math.abs(parseFloat(col.circularity) - parseFloat(column.circularity)) <= 0.03));
            });
        }


        //比较数据
        function isDeepEqual(obj1, obj2) {
            if (typeof obj1 !== 'object' || obj1 === null ||
                typeof obj2 !== 'object' || obj2 === null) {
                return obj1 === obj2;
            }

            if (Object.keys(obj1).length !== Object.keys(obj2).length) {
                return false;
            }

            for (let key in obj1) {
                if (!obj2.hasOwnProperty(key) || !isDeepEqual(obj1[key], obj2[key])) {
                    return false;
                }
            }

            return true;
        }


        let data = ITimg.contour({
            canvas: "信号球",
            action: 5,
            area: [coordinate.combat.信号球.x, coordinate.combat.信号球.y, coordinate.combat.信号球.w, coordinate.combat.信号球.h],
            isdilate: true,
            threshold: 250,
            size: 15,
            type: "BINARY",
            filter_w: frcx(20),
            filter_h: frcy(20),
        });
        if (!data || data.length == 0) {
            return false;
        }

        // 处理数据
        let groupedData; // = groupColumns(data);
        /*  let largestGroupIndex = groupedData.reduce((largestIndex, group, index) => {
            return group.length > groupedData[largestIndex].length ? index : largestIndex;
        }, 0);
*/
        let largestGroup = data.sort((a, b) => b.x - a.x);
        //groupedData[largestGroupIndex].sort((a, b) => b.x - a.x);
        let largestGroupIndex = null;
        log(largestGroup)
        if (largestGroup.length < 3) {
            console.verbose("信号球数量不足3个");
            data = null;
            groupedData = null;
            largestGroup = null;
            return false;
        }
        groupedData = [];

        largestGroup.forEach(column => {
            //找出相似轮廓
            let similarColumns = findSimilarColumns(column, data);
            if (similarColumns.length < 3) {
                return false;
            }
            //按x从大到小排序
            similarColumns.sort((a, b) => b.x - a.x);
            let adjacent = 0;
            let middleball = [];
            //检验、过滤、分类轮廓(球)位置
            for (let i in similarColumns) {
                i = Number(i);
                let ball1 = largestGroup.findIndex(ele => ele == similarColumns[i - 1])
                let ball2 = largestGroup.findIndex(ele => ele == similarColumns[i])
                let difference = ball2 - ball1;

                if (ball1 != -1) {

                    if (difference == 1) {
                        adjacent++;
                        //1011101，去尾
                    } else if (adjacent == 2 && similarColumns.length == 5) {
                        similarColumns.splice(4, 1)
                    }
                    //相邻两个，一般即为可三消。也有数量4的例外，点击2、3中间即可
                    if (adjacent >= 2 && similarColumns.length == 4) {
                        //去头，重置中间球
                        if (difference == 2) {
                            similarColumns.splice(0, 1);
                            middleball = []
                        }

                    } else {

                        if (difference > 1 && (!middleball[0] || !isDeepEqual(middleball[0], largestGroup[ball1 + 1]))) {
                            middleball.push(largestGroup[ball1 + 1]);
                            for (let bi = ball1 + 2; bi < ball2; bi++) {
                                middleball.push(largestGroup[bi])

                            }

                        }


                    }
                }
            }

            //最多分两组三消.已保存的列表不重复保存
            if ((groupedData[0] && isDeepEqual(similarColumns, groupedData[0].group)) || (groupedData[1] && isDeepEqual(similarColumns, groupedData[1].group))) {
                similarColumns = null;
                return false
            }

            groupedData.push({
                adjacent: adjacent,
                middleball: middleball,
                group: similarColumns
            });
            middleball = null;
            similarColumns = null;


        });
        sleep(100);
        for (let k in groupedData) {
            k = Number(k);
            let eliminate = false;
            if (groupedData[k].adjacent == 2) {

                // if (groupedData[k].middleball.length) {
                for (let m of groupedData[k].middleball) {
                    console.verbose("移除中间球：" + m.x, m.y);
                    sleep(100);
                    click(m.x, m.y);
                    click(m.x, m.y);
                    sleep(200);
                }
                // }
                eliminate = true;

            } else if ((k + 1) == groupedData.length) {
                if (largestGroup.length <= 6) {
                    console.verbose("等待");
                    break
                }
                if (groupedData[k].adjacent == 0) {
                    k && k--;
                }

                for (let m of groupedData[k].middleball) {
                    console.verbose("_移除中间球：" + m.x, m.y);
                    sleep(100);
                    click(m.x, m.y);
                    click(m.x, m.y);
                    sleep(200);
                }
                eliminate = true;
            }
            if (eliminate) {
                console.info("---三消，初始球位置: " + groupedData[k].group[0].x, groupedData[k].group[0].y)
                click(groupedData[k].group[0].x, groupedData[k].group[0].y);
                sleep(200);
                break;
            }
        };
        data = null;
        groupedData = null;
        largestGroup = null;

        /*   }catch(e){
               e = "释放信号球出错："+e;
               toast(e);
               console.error(e);
           }
           */

    }

    切换角色 = function() {

        let role_ = random(1, 2);
        console.info("---点击切换角色" + role_ + "：" + JSON.stringify(coordinate.combat["角色" + role_]));
        click((coordinate.combat["角色" + role_].x + coordinate.combat["角色" + role_].w / 2), (coordinate.combat["角色" + role_].y + coordinate.combat["角色" + role_].h / 2));

        sleep(100);
        ITimg.contour({
            canvas: "角色",
            action: 5,
            area: [coordinate.combat.角色1.x, coordinate.combat.角色1.y, coordinate.combat.角色1.w, coordinate.combat.角色1.h * 2],
            isdilate: true,
            threshold: 200,
            size: 5,
            type: "BINARY",
            filter_w: frcx(30),
            filter_h: frcy(30),
        });

        if (random(0, 1)) {
            if (!role_timing) {
                click((coordinate.combat["角色" + role_].x + coordinate.combat["角色" + role_].w / 2), (coordinate.combat["角色" + role_].y + coordinate.combat["角色" + role_].h / 2));
                sleep(150);
                role_timing = true;
                setTimeout(function() {
                    role_timing = false;
                }, 10000);

            }
        }

    }
    攻击 = function() {

        switch (random(1, 22)) {
            case 20:
            case 19:
            case 18:

                if (!dodge_timing) {
                    log("---点击闪避键");
                    click(coordinate.combat.闪避.x + coordinate.combat.闪避.w / 2, coordinate.combat.闪避.y + coordinate.combat.闪避.h / 2);

                    //连续点击两次闪避后，两秒内不能再次点击闪避
                    if (dodge_timing === false) {
                        dodge_timing = 0;
                    } else {
                        dodge_timing = true;
                        setTimeout(function() {
                            dodge_timing = false;
                        }, 2500);
                        console.log("---点击攻击键_:" + JSON.stringify(coordinate.combat.攻击))
                        click(coordinate.combat.攻击.x + coordinate.combat.攻击.w / 2, coordinate.combat.攻击.y + coordinate.combat.攻击.h / 2);

                    }


                } else {
                    console.log("---点击攻击键__:" + JSON.stringify(coordinate.combat.攻击))
                    click(coordinate.combat.攻击.x + coordinate.combat.攻击.w / 2, coordinate.combat.攻击.y + coordinate.combat.攻击.h / 2);
                }
                sleep(100);
                break
            case 17:
            case 16:
                log("---长按闪避键", coordinate.combat.闪避);
                press(coordinate.combat.闪避.x + coordinate.combat.闪避.w / 2, coordinate.combat.闪避.y + coordinate.combat.闪避.h / 2, 350);


                break
            case 15:
            case 14:
            case 13:
            case 12:

                console.info("---释放大招", coordinate.combat.大招);
                click(coordinate.combat.大招.x + coordinate.combat.大招.w / 2, coordinate.combat.大招.y + coordinate.combat.大招.h / 2);
                sleep(200);
                role_timing = true;
                setTimeout(function() {
                    role_timing = false;
                }, 5000);


                break
            case 11:
                console.log("---点击辅助机:" + JSON.stringify(coordinate.combat.辅助机));
                click(coordinate.combat.辅助机.x + coordinate.combat.辅助机.w / 2, coordinate.combat.辅助机.y + coordinate.combat.辅助机.h / 2);
                sleep(100);

                break
            case 3:
            case 2:
            case 1:
                console.log("---长按攻击键:" + JSON.stringify(coordinate.combat.攻击))
                press((coordinate.combat.攻击.x + coordinate.combat.攻击.w / 2), (coordinate.combat.攻击.y + coordinate.combat.攻击.h / 2), 350);


                break

            default:

                console.log("---点击攻击键:" + JSON.stringify(coordinate.combat.攻击))
                click(coordinate.combat.攻击.x + coordinate.combat.攻击.w / 2, coordinate.combat.攻击.y + coordinate.combat.攻击.h / 2);
                sleep(100);
                break

        }

        operation_list = null;
        return true;
    }
    // fight_thread = true;
    var role_timing = false;
    var dodge_timing = false;
    var frequency = 0;
    while (fight_thread) {

        /**思路:
         * */

        let ran_ = random(1, 15);


        switch (ran_) {
            case 15:
            case 14:
                切换角色();
                break
            case 11:
            case 13:
            case 12:
            case 10:
            case 9:

                释放信号球();
                break
            default:
                攻击() && frequency++;
                break
                //   click(coordinate.combat.攻击键.x, coordinate.combat.攻击键.y)
                // log("点击  攻击键")
                //    sleep(50)
                //  break
        };
        ran_ = null;

    }
}

function 领取任务奖励(value) {
    helper = tool.readJSON("helper");
    if (!helper.任务奖励) {
        return
    }
    
    tool.Floating_emit("展示文本", "状态", "状态：领取任务奖励")
    let _max = 5;
    while (_max) {
        if (!ITimg.ocr("任务", {
                area: "右半屏",
            }) && !ITimg.ocr("战斗", {
                area: "右半屏",
                refresh: false,
            })) {
            返回主页();
        }
    tool.Floating_emit("展示文本", "状态", "状态：领取任务奖励")
        
        click(height / 2, width - frcy(100));
        sleep(500);
        (ITimg.ocr("任务", {
            action: 1,
            timing: 2000,
            area: "右半屏",
        }))
        if (ITimg.ocr("每日", {
                action: 4,
                timing: 1500,
                area: 12,
                threshold: 0.8,
            }) || ITimg.ocr("每周", {
                action: 5,
                timing: 1500,
                threshold: 0.8,
                area: 12,
                refresh: false,
            })) {
            break
        }

    }
    if (!_max) {
        toastLog("无法识别到任务");
        return false;
    }

    if (ITimg.ocr("一键领取", {
            action: 0,
            timing: 2000,
            area: "上半屏",
        })) {
        while (true) {
            if (检查获得奖励()) {
                click(height / 2, width - frcy(80));
                sleep(1000);
                helper.任务状态.每日登录 = true;
                tool.writeJSON("任务状态", helper.任务状态);
                break
            }
        }

    } else {
        helper.任务状态.每日登录 = true;
        tool.writeJSON("任务状态", helper.任务状态);
    }

    if (!value) {
        sleep(500);
        //领取100活跃度奖励
        let active = ITimg.ocr("今日活跃度", {
            action: 5,
            area: 3,
        });

        if (!active) {
            sleep(1000);
            click(height / 2, width - frcy(80));
            sleep(1000);
            active = ITimg.ocr("/活跃度", {
                action: 5,
                part: true,
                area: 3,
            })
        }

        if (active) {

            active = ITimg.ocr("识别集合文本", {
                area: [active.left, active.bottom, active.right - active.left, width - active.bottom],
                action: 6,
            });
            if (active) {
                active.sort((a, b) => a.left - b.left);
                console.warn(active)

                if (Math.floor(active[0].text).toString() == "NaN") {
                    active = Math.floor(active[1].text);
                } else {
                    active = Math.floor(active[0].text)
                }
            }
            if (active >= 100) {
                //获取点击100活跃度位置领取奖励
                active = ITimg.ocr("100", {
                    action: 5,
                    area: 4,
                });
                if (active) {
                    click(active.left, active.top - 100);
                    click(active.left, active.top - 70);
                    sleep(3000);
                    click(height / 2, width - frcy(80))
                    sleep(500);

                } else {

                    toastLog("无法获取100活跃度奖励坐标点位置\n点击固定坐标");
                    click.apply(click, axis_list.task_100_active);
                    sleep(3000);
                    click(height / 2, width - frcy(80))
                    sleep(500);
                }
            } else if (active.toString() == "NaN") {

                toastLog("无法获取活跃度数值");
                //直接点击100活跃度奖励
                click.apply(click, axis_list.task_100_active);
                sleep(3000);
                click(height / 2, width - frcy(80))
                sleep(500);
            } else {
                toastLog("今日任务活跃度:" + active)
            }
        } else {
            toastLog("无法获取活跃度数值");
            click.apply(click, axis_list.task_100_active);
            sleep(3000);
            click(height / 2, width - frcy(80));
            sleep(500);
        }
        检查获得奖励();

        if (helper.周常任务) {
            sleep(1000);
            click(height / 2, width - frcy(80));
            (ITimg.ocr("每周", {
                action: 4,
                timing: 1500,
                area: "左半屏",
                nods: 1500,
            }) || ITimg.ocr("每周", {
                action: 4,
                timing: 1000,
                area: "左半屏",
            }));
            if (ITimg.ocr("一键领取", {
                    action: 0,
                    timing: 1000,
                    area: "上半屏",
                })) {
                while (true) {
                    if (检查获得奖励()) {
                        tool.writeJSON("周常任务", false);
                        break
                    }
                }
            }


        }
    }

    返回主页()

}

function 领取手册经验() {
    if (!helper.手册经验) {
        return
    }
    tool.Floating_emit("面板", "隐藏");
    tool.Floating_emit("展示文本", "状态", "状态：领取手册经验");
    sleep(1000);
    if (!ITimg.ocr("任务", {
            area: "右半屏",
        }) && !ITimg.ocr("战斗", {
            area: "右半屏",
            refresh: false,
        })) {
        返回主页()
    }
    if (!coordinate.coordinate.手册图标位置 || !coordinate.coordinate.手册图标位置.x) {
        sleep(1000);
        let staging = ITimg.ocr("BP", {
            area: 1,
            action: 5,
            nods: 1000,
            similar: 0.80,
        });
        if (!staging) {
            staging = ITimg.ocr("BP", {
                area: 12,
                action: 5,
                similar: 0.80,
            });
        }
        if (staging) {
            坐标配置("手册图标位置", staging.left, staging.bottom)
        } else {
            tips = "无法获取手册图标位置";
            toast(tips)
            console.error(tips)
            return false
        }
    }

    click(coordinate.coordinate.手册图标位置.x, coordinate.coordinate.手册图标位置.y);
    sleep(2500);
    ITimg.ocr("确定", {
        action: 0,
        timing: 1000,
        area: 4,
    });
    if (!ITimg.ocr("评定任务", {
            action: 4,
            timing: 500,
            area: 34,
        })) {
        ITimg.ocr("确定", {
            action: 0,
            timing: 1000,
            area: 4,
        })
        click(height / 2, width - frcy(80));
        ITimg.ocr("评定任务", {
            action: 4,
            timing: 500,
            area: 34,
        })
    } else {

        click(height / 2, width - frcy(80));
        sleep(1000);
    }

    ITimg.ocr("一键领取", {
        action: 1,
        timing: 1500,
        area: 4,
        refresh: false,
    });
    click(height / 2, width - frcy(80));
    sleep(1000);

    if (ITimg.ocr("战略补给", {
            action: 4,
            timing: 1200,
            area: "左上半屏",
        })) {
        ITimg.ocr("一键领取", {
            action: 1,
            timing: 1500,
            area: 4,
        });
        click(height / 2, width - frcy(80));
        sleep(1000);
    }
    返回主页()
    tool.Floating_emit("面板", "展开");


}




function 便笺(sleep_, value) {
    sleep_ = sleep_ || 1000
    let notes = tool.readJSON("notes");
    console.info(notes)
    if (notes == undefined) {
        return
    }

    if (notes.自动识别 || value) {
        tool.Floating_emit("展示文本", "状态", "状态：等待识别血清中...");
        while (true) {
            sleep(sleep_)
            let serum = ITimg.ocr("/240", {
                action: 5,
                saveSmallImg: false,
                area: "上半屏",
                part: true,
            });
            if (!serum) {
                serum = ITimg.ocr("/240", {
                    action: 5,
                    saveSmallImg: false,
                    area: "右半屏",
                    part: true,
                });
            }
            if (!serum) {
                serum = ITimg.ocr("/240", {
                    action: 5,
                    saveSmallImg: false,
                    part: true,
                });
            }
            if (serum) {
                let match_ = serum.text.match(/(\d+)\/(\d+)/);
                if (!match_ || !match_[1]) {
                    text = "无法识别血清数量";
                    toast(text)
                    console.error(text);
                    return text

                }
                serum = parseInt(match_[1]);
                let target_ = parseInt(match_[2]);

                console.warn(serum)
                if (serum.toString() == "NaN") {
                    text = "无法识别血清数量";
                    toast(text)
                    console.error(text);
                    return text
                } else {
                    if (value) {
                        tool.Floating_emit("展示文本", "状态", "状态：血清识别完成");
                        return serum
                    }
                    console.warn("剩余血清数：" + serum)
                    tool.writeJSON("已有血清", serum, "notes")
                    tool.writeJSON("血清数", serum + "/" + target_, "notes")
                    tool.writeJSON("血清时间", new Date(), "notes")
                }
                tool.Floating_emit("展示文本", "状态", "状态：血清识别完成");
                return true
            }

        }


    }

}

function 滑动手势(x1, y1, x2, y2, duration) {
    duration = duration || 1200;
    console.verbose(x1, y1, x2, y2, duration)
    //从x1,y1滑动到x2,y2 持续1000毫秒,y2-50继续滑动10毫秒
    gestures_Ary = [
        [
            [1, duration, [x1, y1],
                [x2, y2]
            ]
        ],
        [
            [25, 200, [x2, y2],
                [x2, y2 - 100]
            ]
        ],
    ];
    for (let i = 0; i < gestures_Ary.length; i++) {
        gestures.apply(null, gestures_Ary[i]);
    }
}
//相似轮廓分组函数
function groupColumns(columns, shape) {
    let groups = [];
    columns.forEach(column => {
        delete column.left;
        delete column.right;
        delete column.bottom;
        delete column.top
        let foundGroup = false;
        groups.forEach(group => {
            if (!foundGroup && Math.abs(column.y - group[0].y) <= frcy(50)) {
                if (shape && column.shape != group[0].shape) {
                    return false
                }
                group.push(column);
                foundGroup = true;
            }
        });
        if (!foundGroup) {
            groups.push([column]);
        }
    });
    return groups;
}

//--------------------------------------------------------