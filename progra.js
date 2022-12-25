
importClass(android.content.ComponentName);

var tool = require('./utlis/app_tool.js');

//读取辅助脚本配置数据
var helper = tool.readJSON("helper");

var Floaty;
var height = device.height,
    width = device.width,
    ocr;
检测ocr();

//兼容模拟器平板版
if (helper.模拟器) {
    height = device.width,
        width = device.height;
} else {
    if (helper.坐标兼容) {
        setScreenMetrics(width, height);
    };
}

if (helper.图片代理) {
    // 用于代理图片资源，请勿移除 否则需要手动添加recycle代码
    log("加载图片代理程序")
    require('./utlis/ResourceMonitor.js')(runtime, this)
}

log("加载图片识别程序");
let ITimg = require("./ITimg.js"); //读取识图库
ITimg.initialization(ocr);


/**
 * 多分辨率x值自适应兼容
 * @param {number} value 
 * @returns {number}
 */
function frcx(value) {
    return Math.floor((height / 2160) * value);
}

/**
 * 多分辨率y值自适应兼容
 * @param {number} value 
 * @returns {number}
 */
function frcy(value) {
    return Math.floor((width / 1080) * value);
}

for (let i = 0; i < engines.all().length; i++) {
    //寻找悬浮窗脚本
    if (engines.all()[i].toString().indexOf("Floaty") != -1) {
        Floaty = engines.all()[i];
        break;
    }
}

//指向Android/data/包名/file 路径
var package_path = context.getExternalFilesDir(null).getAbsolutePath() + "/"
//作战控制器,不用管
var fight_thread = false;

var coordinate = JSON.parse(files.read("./library/coordinate.json"));
/**
 * 战斗相关配置
 * 资源.资源 - false时程序会去打活动
 * 资源.资源名称 - 想打的资源名称
 * 活动.关卡 - true = 只刷-1,掉落活动代币，false = 刷-2,掉落代币+意识
 
var 战斗 = {

    资源: {
        资源: false,
        //资源名称
        资源名称: "成员经验",
    },
    活动: {
        活动: true,
        关卡: true,
    },
    //是否需要打怪,不用管,程序会决定
    作战: false,
}
*/

//作战 按钮坐标相关信息
/*
var combat = {
    攻击键: { x: frcx(1820), y: frcy(960) },
    信号球1: { x: frcx(2070), y: frcy(760) },
    信号球2: { x: frcx(1910), y: frcy(760) },
}
*/

let Day = new Date().getMonth(); //月
let Dat = new Date().getDate(); //日
Day = Day + 1;
if (Day + "." + Dat != helper.今日) {
    if (new Date().getHours() >= 5) {
        tool.writeJSON("今日", Day + "." + Dat);
        tool.writeJSON("任务状态", {
            "每日登录": false,
            "日常补给": false,
            "妙算神机": false,
            "助理交流": false,
            "宿舍执勤": false,
            "家具制造": false,
        });
        helper = tool.readJSON("helper");
    }
}
主程序();

function 主程序() {
    进入主页();

    //领取商店每日免费血清
    采购();
    //与助理交流
    交流();
    //与妙算神机交互
    指挥局();

    //宿舍系列任务
    宿舍();
    if (helper.血清) {
        //领取每日登录血清
        领取任务奖励(true);
        //消耗血清
        战斗();
    }
    便笺(1000);

    //
    领取任务奖励();
    领取手册经验();
    Floaty.emit("展示文本", "状态", "状态：主程序暂停中");
    Floaty.emit("暂停", "结束程序");
}


function 启动(package_) {

    var gmvp = device.getMusicVolume()
    sleep(800);
    let getpackage_ = getpackage();
    switch (getpackage_) {
        //com.kurogame.haru.huawei
        case helper.包名:
            return
        case null:
            toastLog("暂时无法获取前台应用，默认启动")
            break;
    }
    if (getpackage_ != null && getpackage_.indexOf('com.kurogame.haru') != -1) {
        return
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
    switch (getpackage()) {
        case package_:
        case helper.包名:
        case "_" + helper.包名:
            break
        default:
            console.error("未匹配到的包名:" + getpackage() + "，重新启动");

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
    if (helper.音量) {
        tool.writeJSON("当前音量", gmvp);
    }

    threads.start(function () {
        if (helper.静音) {
            device.setMusicVolume(0)
        } else if (helper.音量修复) {
            device.setMusicVolume(gmvp)
        }
    })
    return true;

}

function 进入主页() {
    Floaty.emit("展示文本", "状态", "状态：准备进入主页")

    sleep(1000);
    if (getpackage() != helper.包名) {
        启动();
    }
    while (true) {
        sleep(1000);
        ITimg.picture("返回", { action: 0, timing: 1500, area: "左上半屏", })
        if (ITimg.ocr("任务", { timing: 3000, area: "右半屏", }) == true && ITimg.ocr("战斗", { timing: 3000, area: "右半屏", refresh: false, }) == true) {
            ITimg.picture("主页-展开", { action: 0, timing: 1000, });
            sleep(1000)
            break
        } else if (!ITimg.picture("返回", { action: 0, timing: 1500, area: "左上半屏" })) {
            Floaty.emit("展示文本", "状态", "状态：等待进入战双主页");
            toastLog("等待加载登录");
            sleep(2000);
            log("前台包名：" + getpackage())
            if (getpackage() != helper.包名) {
                启动();
            }
            ITimg.ocr("更新", { action: 0, timing: 10000, area: "右下半屏" });
            click(height / 2, width - 100);

        }
    }
}



function 采购() {
    if (!helper.每日血清) {
        return
    }
    Floaty.emit("展示文本", "状态", "状态：领取今日补给")
    if (helper.任务状态.日常补给) {
        toastLog("今日日常补给已领取");
        return
    }
    if (!ITimg.ocr("采购", { action: 1, timing: 2000, area: "右半屏", part: true, })) {
        toastLog("无法识别到采购");
        return
    }
    Floaty.emit("面板", "隐藏");
    if (ITimg.ocr("补给包", { action: 0, timing: 1200, area: "左上半屏", part: true, })) {
        ITimg.ocr("日常补给", { action: 1, timing: 2000, area: "左上半屏", part: true, })

        if (ITimg.ocr("免费", { action: 1, timing: 1500, area: "左上半屏", part: true, })) {
            ITimg.ocr("购买", { action: 1, timing: 1500, area: "下半屏", part: true })
            click(height / 2, width - 100);
            sleep(1000);
            let week = ITimg.ocr("每周限购1", { action: 5, area: "左上半屏", part: true });
            let free = ITimg.ocr("免费", { action: 5, refresh: false });

            if (week && free) {
                if (week.left > free.left) {
                    click(free.left, free.top);
                    sleep(1000);
                    ITimg.ocr("购买", { action: 1, timing: 1500, area: "下半屏", part: true })
                    click(height / 2, width - 100);
                }
            }
            helper.任务状态.日常补给 = true;
            tool.writeJSON("任务状态", helper.任务状态);
        } else {
            helper.任务状态.日常补给 = true;
            tool.writeJSON("任务状态", helper.任务状态);
            toastLog("今日补给包可能已领取")
        }

        Floaty.emit("面板", "展开");
        //点击返回
        click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
        sleep(2000)
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
    Floaty.emit("展示文本", "状态", "状态：与助理交互")
    if (ITimg.ocr("任务", { area: "右半屏", }) == false && ITimg.ocr("战斗", { area: "右半屏", refresh: false, }) == false) {
        //返回主页
        click(coordinate.coordinate.主页面.x, coordinate.coordinate.主页面.y);
        sleep(3000)
    }
    click(height / 2, width / 2);
    sleep(1000)
    if (ITimg.ocr("交流", { action: 0, timing: 2500, area: "左上半屏", part: true })) {
        helper.任务状态.助理交流 = true;
        tool.writeJSON("任务状态", helper.任务状态)
    };
    //点击返回
    click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
    sleep(2000)
}


function 指挥局() {
    if (!helper.妙算神机) {
        return
    }
    if (helper.任务状态.妙算神机) {
        toastLog("今日妙算神机已完成");
        return
    }
    Floaty.emit("展示文本", "状态", "状态：与妙算神机交互")
    if (ITimg.ocr("任务", { area: "右半屏", }) == false && ITimg.ocr("战斗", { area: "右半屏", refresh: false, }) == false) {
        //返回主页
        click(coordinate.coordinate.主页面.x, coordinate.coordinate.主页面.y);
        sleep(3000)
    }
    if (!ITimg.ocr("公会", { action: 1, timing: 4000, area: "右半屏", part: true })) {
        toastLog("没有识别到公会,无法执行与妙算神机交互");
        return
    }
    while (true) {
        if (ITimg.ocr("新版指挥局", { timing: 1500, nod: 1500, area: "左上半屏", part: true, })) {
            break
        }
    }

    //移动小人手势步骤,从x1,y1,到x2,y2;用时1.7秒
    swipe(frcx(362), frcy(778), frcx(608), frcy(790), 1700);
    /*
    for(let i=0;i<coordinate.移动小人动作.length;i++){
     gestures.apply(null, coordinate.移动小人动作[i]);
     sleep(400);
  };
  */
    //等待1秒
    sleep(1000)
    if (ITimg.ocr("今日运势", { action: 1, timing: 2500, area: "右半屏", })) {
        //点击返回
        click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
        sleep(1500);
        helper.任务状态.妙算神机 = true;
        tool.writeJSON("任务状态", helper.任务状态);
    } else {
        toastLog("无法匹配到今日运势,请确认移动小人步骤是否可用");
    }
    click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
    sleep(1500)

}

function 宿舍() {
    if (!helper.宿舍系列) {
        return
    }
    Floaty.emit("展示文本", "状态", "状态：准备执行宿舍系列任务")
    if (ITimg.ocr("任务", { area: "右半屏", part: true, }) == false || ITimg.ocr("战斗", { area: "右半屏", refresh: false, part: true, }) == false) {
        toastLog("当前似乎不在主页,尝试返回主页")
        //返回主页
        click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y)
        click(coordinate.coordinate.主页面.x, coordinate.coordinate.主页面.y);
        sleep(3000)
    }
    if (!ITimg.ocr("宿舍", { action: 0, timing: 3000, refresh: false, })) {
        toastLog("无法识别到宿舍");
        return
    }
    while (true) {
        if (ITimg.picture("宿舍-委托", { timing: 1000, nods: 2000, area: "下半屏" })) {
            break
        }

        if (ITimg.ocr("任务", { area: "右半屏", }) == true && ITimg.ocr("战斗", { refresh: false, }) == true) {
            ITimg.ocr("宿舍", { action: 0, timing: 3000, refresh: false, });
        }
    }
    宿舍_委托();
    //执勤
    宿舍_执勤();

    宿舍_抚摸()
    宿舍_家具制造();

    //
    sleep(1000);
    if (ITimg.ocr("任务", { action: 1, timing: 2000, area: "右上半屏", })) {

        if (ITimg.ocr("今日任务已完成", { part: true, })) {
            toastLog("今日宿舍任务已完成");
        } else {

            if (ITimg.ocr("一键领取", { action: 1, timing: 1500, refresh: true })) {
                //返回 ,关闭奖励显示
                click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
                sleep(1000);

            }
        }
        //返回
        click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
        sleep(1000);

    } else {
        toastLog("无法执行领取任务奖励");
    }
    //返回主界面
    click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
    sleep(1000);
}

function 宿舍_委托() {
    Floaty.emit("展示文本", "状态", "状态：执行委托任务")
    //本来是想用ocr的,试了效果不好,只用找图了
    if (ITimg.picture("宿舍-委托", { action: 0, timing: 2500, refresh: false, })) {

        if (ITimg.ocr("领取奖励", { action: 1, timing: 1500, area: "下半屏" })) {
            for (let i = 0; i < 5; i++) {
                click(height / 2, width - 100);
                sleep(1200);
            }
        };
        //红,橙,紫,蓝,绿级别的委托
        let entrusted_color = ["#d3333b", "#dd6b49", "#bc45ab", "#3f78ce", "#469646"];
        for (let i = 0; i < entrusted_color.length; i++) {
            //识别不到有空闲队伍时不接取委托任务
            if (!ITimg.ocr("空闲中", { timing: 1000, area: "下半屏" })) {
                if (i == 2) {
                    toastLog("没有可接取的委托位")
                }
                continue;
            };
            //单点取色,识别委托级别,
            let entrusted = images.findColor(ITimg.captureScreen_(), entrusted_color[i], {
                region: [0, Math.floor(width / 5), height - Math.floor(height / 8), frcy(700)],
                threads: 10
            });
            if (entrusted) {
                //点击委托
                click(entrusted.x, entrusted.y);
                sleep(1500);
                if (!ITimg.ocr("接取委托", { action: 1, timing: 1500, area: [parseInt(height / 1.5), parseInt(width / 2), parseInt(height - (height / 1.5)), parseInt(width / 2)], part: true, })) {
                    continue;
                }
                let multiple;
                if (multiple = ITimg.picture("宿舍-委托-一键派遣&确认", { action: 5, area: "右下半屏" })) {
                    //点击一键派遣
                    click(multiple.x + 10, multiple.y + 10);
                    sleep(1000);
                    log(multiple)
                    //点击确认
                    click(multiple.right, multiple.top + 20);
                    sleep(2000)
                    i--;
                }
            } else {
                log("无法匹配", entrusted_color[i], "结果", entrusted)
            }
        }

        //返回
        click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
        sleep(1000);
    } else {
        toastLog("无法执行委托任务");
    }
}

function 宿舍_执勤() {
    if (helper.任务状态.宿舍执勤) {
        toastLog("今日宿舍执勤已完成");
        return
    }
    Floaty.emit("展示文本", "状态", "状态：开始执勤");
    if (!ITimg.picture("宿舍-委托", { area: "右下半屏" })) {
        //返回
        click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
        sleep(1000);
    }
    if (!ITimg.picture("宿舍-执勤", { action: 0, timing: 1200, area: "右下半屏" })) {
        toastLog("无法进入宿舍执勤");
        return
    }
    Floaty.emit("面板", "隐藏");
    if (!ITimg.ocr("+", { action: 1, timing: 1000, area: [0, Math.floor(width / 5), height, width - Math.floor(width / 5)], })) {
        if (ITimg.ocr("休息中", { refresh: false, part: true })) {
            Floaty.emit("面板", "展开");
            sleep(500);
            toastLog("休息中");
            helper.任务状态.宿舍执勤 = true;
            tool.writeJSON("任务状态", helper.任务状态);
            //返回
            click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
            sleep(1500)
            return
        }
        click(height / 2, parseInt(width / 1.7));
        sleep(1000);
    }

    let duty = {
        //已选择执勤的小伙伴
        chosen: 0,
    }
    //提前识别开始执勤坐标点
    duty.duty = ITimg.ocr("开始执勤", { action: 5, area: "下半屏" });
    sleep(1500)
    //遍历识别三次 心情绿色小图
    for (let i = 0; i < 3; i++) {
        //读取小伙伴绿色心情小图
        duty.mood = images.read(files.read("./library/图片路径.txt") + "宿舍-心情.png")
        //在大图中找出所有心情绿色的小图
        duty.entrusted = images.matchTemplate(ITimg.captureScreen_(), duty.mood, {
            region: [Math.floor(height / 3.5), Math.floor(width / 6), height - Math.floor(height / 3.5), width - Math.floor(width / 6)],
            max: 8,
            threads: 6.5
        });
        log(duty.entrusted);
        if (duty.entrusted) {
            //遍历点击绿色小图的坐标点
            for (z in duty.entrusted.points) {
                //已选择8位小伙伴时退出遍历
                if (duty.chosen >= 8) {
                    break
                }
                click(duty.entrusted.points[z].x, duty.entrusted.points[z].y)
                sleep(200);
                duty.chosen++;
            }
            console.info("已选择的小伙伴:", duty.chosen)
        }
        //已选择8位小伙伴时退出遍历
        if (duty.chosen >= 8) {
            break
        }
        //上滑显示新的小伙伴
        swipe(parseInt(height / 2), parseInt(width / 1.4), parseInt(height / 2), parseInt(width / 2.5), 550);


        sleep(2000);
    }

    toastLog("选择完成");
    Floaty.emit("面板", "展开");
    //对图片进行回收
    !duty.mood.isRecycled() && duty.mood.recycle();
    //如果刚才没有识别成功则重新识别
    duty.duty = duty.duty ? duty.duty : ITimg.ocr("开始执勤", { action: 5, area: "右下半屏" });
    sleep(1000)
    //点击开始执勤
    click(duty.duty.left, duty.duty.top);

    sleep(3000);
    //有bug,执勤过了,没一会又可以选择,但是显示工位已被使用
    ITimg.ocr("取消", { action: 1, timing: 1000, area: "下半屏", part: true });

    if(!ITimg.ocr("一键代工", { action: 1, timing: 1000, area: "下半屏", part: true, refresh: false })){
        ITimg.ocr("一键代工", { action: 1, timing: 1000, area: "下半屏", part: true })
    };
    if (ITimg.ocr("立即完成", { action: 1, timing: 1500, area: "右下半屏" }) != false && duty.chosen >= 8) {
        helper.任务状态.宿舍执勤 = true;
        tool.writeJSON("任务状态", helper.任务状态);
    }
    click(height / 2, width - 100);
    sleep(1500);

    //返回
    click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
    sleep(1500);

}


function 
宿舍_抚摸() {

    sleep(1000);
    if (!ITimg.ocr("执勤", { part: true, area: "右下半屏" })) {
        //返回
        click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
        sleep(1500);
    }
    if (coordinate.宿舍.宿舍房间位置.length == 0) {
        Floaty.emit("展示文本", "状态", "状态：初始化房间位置...")
        //集合所有含有'宿舍'文本的信息
        let dorm = ITimg.ocr("宿舍", { action: 6, part: true, });
        console.warn(dorm)
        for (let i = 1; i < dorm.length; i++) {
            //过滤不是实际宿舍位置的文本
            let dorm_re = (dorm[i].text.indexOf("宿舍") != -1 && dorm[i].text.indexOf("宿舍伙伴") == -1);
            if (dorm_re) {
                dorm_re = (dorm[i].text.indexOf("宿舍事") == -1 && dorm[i].text.indexOf("宿舍币") == -1 && dorm[i].text.indexOf("宿舍执") == -1);
            }
            log("文字: " + dorm[i].text + " ,结果:" + dorm_re);
            if (dorm_re) {
                //矫正位置信息
                if ((dorm[i].right - dorm[i].left) > 200) {
                    dorm[i].right = dorm[i].right - 120;
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
    }
    Floaty.emit("展示文本", "状态", "状态：开始宿舍事件...");
    Floaty.emit("面板", "隐藏");
    //逐个点进宿舍
    i = 0;
    log(coordinate.宿舍.宿舍房间位置)
    for (i in coordinate.宿舍.宿舍房间位置) {
        sleep(500)
        toastLog("进入" + coordinate.宿舍.宿舍房间位置[i].name);
        log("x:" + coordinate.宿舍.宿舍房间位置[i].x + "y:" + coordinate.宿舍.宿舍房间位置[i].y)
        click(coordinate.宿舍.宿舍房间位置[i].x, coordinate.宿舍.宿舍房间位置[i].y);
        sleep(2000);
        if (!ITimg.picture("宿舍-菜单", { area: "左下半屏" })) {
            toastLog("无法确认已进入宿舍房间");
            continue;
        }
        //触发事件
        toastLog("触发事件");
        for (k in coordinate.宿舍.快捷头像位置) {
            click(coordinate.宿舍.快捷头像位置[k].x, coordinate.宿舍.快捷头像位置[k].y);
            sleep(150);
        }
        sleep(3000);
        //逐个抚摸
        for (m in coordinate.宿舍.快捷头像位置) {
            Floaty.emit("展示文本", "状态", "状态：准备抚摸" + coordinate.宿舍.快捷头像位置[m].name);
            //点击小人
            click(coordinate.宿舍.快捷头像位置[m].x, coordinate.宿舍.快捷头像位置[m].y);
            sleep(150);
            //点击小人旁的抚摸
            click(coordinate.宿舍.快捷头像位置[m].x - frcx(160), coordinate.宿舍.快捷头像位置[m].y);
            sleep(3200);
            //多点找色,检查心情条;
            let mood = images.findMultiColors(ITimg.captureScreen_(), "#47ca4f", [[0, 30, "#47ca4f"]], {
                region: [0, 0, height, width / 2],
                threshold: 8,
            });
            console.info("绿色心情:", mood)
            if (mood) {
                if (!ITimg.picture("宿舍-菜单", { action: "左下半屏" })) {
                    toastLog("心情大于80,不进行抚摸操作");
                    click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
                    sleep(1000);
                }
                continue;
            }
            let petting = ITimg.ocr("抚摸次数", { action: 5, area: "右上半屏", part: true, });
            if (petting) {
                petting = petting.text.split('次数')[1][0];
                //转number数字类型;
                petting = Math.floor(petting);
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
            } else if (ITimg.picture("宿舍-菜单", { action: "左下半屏" })) {
                toastLog("无法确认进入抚摸小人界面\n这可能是战双的BUG\n或快捷头像坐标配置错误");
                break
                //continue;
            } else {
                toastLog("无法获取可抚摸的次数,默认抚摸3次");
                petting = 3;
            }

            if (petting == 0) {
                Floaty.emit("展示文本", "状态", "状态：没有可抚摸次数");
                click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
                sleep(1000);
                continue;
            }
            //抚摸小人动作,
            //默认分辨率w1080,h2160
            for (let n = 0; n < petting; n++) {

                var height = device.height,
                width = device.width;
     
     
            var points = [random(999,1100)];
     
            var x_p = 0.15;
            var y_p = 0.7;
     
     
            for (let i = 0; i < 6; i++) {
              console.info("数值:",2.6-x_p,",x:",parseInt(height/(2.6-x_p)))
                console.info("数值:",0.80+y_p,"y:",parseInt(width/(0.80+y_p)))
            
                points.push([parseInt(height / (2.6 - x_p)) + random(-20, 20), parseInt(width / (0.80 + y_p)) + random(-30, 10)]);
                x_p = x_p + 0.15;
                y_p = y_p + 0.7
            }
     
            x_p = 0.1;
            y_p = 0.7;
     
            for (let i = 0; i < 6; i++) {
                console.warn("数值:",1.7+x_p,",x:",parseInt(height/(1.7+x_p)))
                console.warn("数值:",5.6-y_p,"y:",parseInt(width/(5.6-y_p)))
            
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

            Floaty.emit("展示文本", "状态", "状态：抚摸完成");
            click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
            sleep(1500);
            continue;
        }
        //点击返回
        click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
        sleep(2000);
    }
    Floaty.emit("面板", "展开");
}

function 宿舍_家具制造() {
    if (helper.任务状态.家具制造) {
        toastLog("今日家具制造已完成");
        return
    }
    //家具制造
    if (ITimg.ocr("制造", { action: 0, timing: 1500, area: "左下半屏", part: true, })) {
        Floaty.emit("展示文本", "状态", "状态：开始制造家具")
        //点击家具制造第一位
        click(frcx(1300), frcy(400));
        sleep(1500);
        ITimg.ocr("添加类型", { action: 1, timing: 1000, area: "右半屏", });
        //下滑列表
        swipe(height / 2, frcy(850), height / 2, 150, 600);
        sleep(500);
        //查找家具名,并点击右下
        //  ITimg.ocr(coordinate.宿舍.furniture, { action: 4, timing: 500, });
        //ocr太难用,用固定坐标吧
        ITimg.picture("宿舍-家具-挂饰", { action: 0, timing: 500 });
        ITimg.ocr("选择", { action: 1, timing: 1000, });
        //点击固定坐标,舒适MAX
        click(frcx(1150), frcy(530));
        sleep(1000);
        //点击两下数量+号,制造三个家具,要限制区域,不然会识别到上面三个
        let serological = ITimg.picture("宿舍-家具-制造+", { action: 5, threshold: 0.7, area: [0, Math.floor(width / 1.3), height / 2, width - Math.floor(width / 1.3)], })
        if (serological) {
            for (let i = 0; i < 2; i++) {
                click(serological.x + serological.w / 2, serological.y + serological.h / 2);
                sleep(200);
            }
        } else {
            toastLog("无法调整家具制造次数\n请检查图库图片: 宿舍-家具-制造+.png");
        }
        ITimg.ocr("建造", { action: 1, timing: 3000, area: "右下半屏", });
        //点击家具制造第一位,领取家具
        click(frcx(1300), frcy(400));
        sleep(1500);
        if (ITimg.picture("宿舍-家具-关闭", { action: 0, timing: 1000, area: "右上半屏", })) {
            helper.任务状态.家具制造 = true;
            tool.writeJSON("任务状态", helper.任务状态);
        };
        sleep(1000);
        //返回
        click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
        sleep(1000)
    } else {
        toastLog("无法执行家具制造");
    }

}


function 战斗() {

    Floaty.emit("展示文本", "状态", "状态：准备作战中")
    if (ITimg.ocr("任务", { area: "右半屏", }) == false && ITimg.ocr("战斗", { area: "右半屏", refresh: false, }) == false) {
        //返回主页
        click(coordinate.coordinate.主页面.x, coordinate.coordinate.主页面.y);
        sleep(3000)
    };
    let serum = ITimg.ocr("/160", { action: 5, area: "右上半屏", refresh: false, part: true, });
    if (serum) {
        serum = Math.floor(serum.text.split("/")[0]);
        log(serum)
        if (serum < 30 && helper.注射血清 == 0) {
            toastLog("血清不足30\n可注射血清为" + helper.注射血清 + "次");
            return
        } else {
            toastLog("当前血清: " + serum)

        }
    }

    if (!helper.战斗.活动) {
        if (!ITimg.ocr("战斗", { action: 2, timing: 3000, area: "右半屏", part: true, })) {
            //都识别不到，改用固定坐标进入活动
            click(frcx(1950), frcy(500))
            sleep(3000)
        }
        ITimg.ocr("资源", { action: 1, timing: 1000, area: "右下半屏", })
        while (true) {
            if (ITimg.ocr(helper.战斗.资源名称, { action: 1, timing: 1000, nods: 2500, })) {
                break
            };
        }
        let checkpoint = ITimg.ocr("已完成", { action: 6, area: "下半屏", })
        if (checkpoint) {
            let point = [0, 0];
            for (i in checkpoint) {
                if (checkpoint[i].text == "已完成") {
                    if (checkpoint[i].left > point[0]) {
                        point[0] = checkpoint[i].left;
                        point[1] = checkpoint[i].top
                    }
                }
            }
            if (point[0] == 0) {
                toastLog("无法确认 " + helper.战斗.资源名称 + " 中可自动作战关卡，请确认ocr是否识别正确")
            }
            click(point[0], point[1]);
            sleep(2000);

            //为什么不用文字识别?活动关已解锁自动作战,开放新关卡时,没打过的没法自动作战,
            if (!ITimg.picture("战斗-自动作战", { action: 0, timing: 1000, area: "下半屏", threshold: 0.75, })) {
                if (!ITimg.ocr("自动作战", { action: 1, timing: 1000, area: "下半屏", part: true, })) {
                    toastLog("没有匹配到自动作战")

                }
            }
        }

    } else {

        if (!ITimg.ocr("创绘", { action: 1, timing: 3000, area: "右上半屏", })) {
            if (!ITimg.ocr("映想", { action: 1, timing: 3000, area: "右上半屏", part: true, refresh: false })) {
                return
                //都识别不到，改用固定坐标进入活动
                /*
                click(frcx(1950), frcy(360))
                sleep(3000)
                */
            }
        }


        if (!ITimg.ocr("材料", { action: 4, timing: 3000, area: "右半屏", part: true })) {
            //aleidos
            //aleido
            //栖营绘斓
            //栖赞绘斓
            if (!ITimg.ocr("绘斓", { action: 1, timing: 3000, area: "右上半屏", part: true, refresh: false })) {
                //都识别不到，改用固定坐标进入活动
                click(frcx(1900), frcy(590))
                sleep(2000)

            }
        }


        coordinate.战斗.关卡 = ITimg.ocr("MIX", { action: 1, timing: 1500, area: coordinate.战斗.活动.关卡 ? "左半屏" : "右半屏", part: true })
        if (!coordinate.战斗.关卡) {
            coordinate.战斗.关卡 = ITimg.ocr("MIX", { action: 1, timing: 1500, area: "左半屏", part: true })
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
        if (!ITimg.picture("战斗-自动作战", { action: 0, timing: 1000, area: "右下半屏" })) {
            helper.战斗.作战 = ITimg.ocr("多重挑战", { action: 4, timing: 1000, area: "右下半屏", })
        }
    }

    sleep(1500)
    helper = tool.readJSON("helper");
    //你可以直接用固定坐标点击
    if (helper.挑战次数) {
        let serological = ITimg.picture("战斗-次数+", { action: 5, area: "下半屏", threshold: 0.7 })
        if (serological) {
            //小于7次,逐个点击
            if (height.挑战次数 <= 7) {
                for (let i = 1; i < helper.挑战次数; i++) {
                    click(serological.x + 25, serological.y + serological.h / 2);
                    sleep(150);
                }
                //大于7,点击MAX
            } else {
                click(serological.right - 25, serological.y + serological.h / 2);
                sleep(150);
            }
        } else {
            toastLog("无法调整挑战次数\n请检查图库图片: 战斗-次数+.png");
        }
    }
    // ITimg.ocr("MAX", { action: 4, timing: 500, area: "下半屏", part: true })
    ITimg.ocr("确认出战", { action: 4, timing: 2000, part: true, });
    //   if(ITimg.ocr("确认出战", { action: 4, timing: 2000, refresh: false })
    if (helper.战斗.作战) {
        ITimg.ocr("作战开始", { action: 4, timing: 10000, area: "右下半屏" })
        while (true) {
            if (ITimg.ocr("当前进度", { area: "左半屏", nods: 2000, part: true, })) {
                break
            }
        }
        //点击特殊事件的坐标位置
        click(frcx(1750), frcy(580));
        sleep(500);
        if (!Timg.ocr("胜利并结束", { action: 0, timing: 10000, area: "左半屏" })) {
            //在新线程中运行作战方案,解决冲突
            fight_thread = threads.start(作战)
        }
        sleep(1000 * 15)
    }

    while (true) {
        if (ITimg.ocr("返回", { action: 0, timing: 1500, area: "下半屏", nods: 1500, })) {
            //作战完成,终止作战方案
            fight_thread = false;
            ITimg.ocr("返回", { action: 0, timing: 500, area: "下半屏", nods: 1500, refresh: false })
            break
        }
        if (!ITimg.ocr("当前进度", { refresh: false, part: true, })) {
            setTimeout(function () {
                if (!ITimg.ocr("当前进度", { refresh: false, part: true, })) {
                    fight_thread = false;
                }
            }, 1000)
        }
        if (ITimg.ocr("确定", { action: 0, timing: 1500, area: "右下半屏", nods: 1500, refresh: false, })) {
            //作战完成,终止作战方案
            fight_thread = false;
            ITimg.ocr("确定", { action: 0, timing: 500, area: "右下半屏", nods: 1500, refresh: false })

            break
        }
    }

    //返回主页
    click(coordinate.coordinate.主页面.x, coordinate.coordinate.主页面.y);
    sleep(1500)
    //不在主页界时,再点下
    if (ITimg.ocr("任务", { area: "右半屏", }) == false && ITimg.ocr("战斗", { area: "右半屏", refresh: false, }) == false) {
        //返回主页
        click(coordinate.coordinate.主页面.x, coordinate.coordinate.主页面.y);
        sleep(3000)
    }
}

function 作战() {
    Floaty.emit("展示文本", "状态", "状态：战斗中..");

    // fight_thread = true;
    while (fight_thread) {

        /**思路:
         * 随机数为9,10时释放信号球,
         * 随机数为1-8时点击攻击键
         * */
        let ran_ = random(1, 10)
        switch (ran_) {
            case 9:
            case 10:
                //从右到左,随机释放1-8个球
                ran_ = random(1, 8)
                switch (ran_) {

                    case 1:
                        coordinate.combat.x = coordinate.combat.信号球1.x;
                        coordinate.combat.y = coordinate.combat.信号球1.y;
                        break;
                    case 2:
                        coordinate.combat.x = coordinate.combat.信号球2.x;
                        coordinate.combat.y = coordinate.combat.信号球2.y;
                        break;
                    default:
                        coordinate.combat.x = coordinate.combat.信号球1.x - (coordinate.combat.信号球1.x - coordinate.combat.信号球2.x) * (ran_ - 1);
                        console.warn(coordinate.combat.x)
                        coordinate.combat.y = coordinate.combat.信号球1.y;
                        break;
                }
                log("点击  信号球" + ran_);
                click(Math.floor(coordinate.combat.x), Math.floor(coordinate.combat.y));
                sleep(100);
                break
            default:
                click(coordinate.combat.攻击键.x, coordinate.combat.攻击键.y)
                log("点击  攻击键")
                sleep(50)
                break
        }

    }
}
function 领取任务奖励(value) {
    if (!helper.任务奖励) {
        return
    }
    Floaty.emit("展示文本", "状态", "状态：领取任务奖励")
    if (ITimg.ocr("任务", { area: "右半屏", }) == false && ITimg.ocr("战斗", { area: "右半屏", refresh: false, }) == false) {
        //返回主页
        click(coordinate.coordinate.主页面.x, coordinate.coordinate.主页面.y);
        sleep(3000)
    }
    if (!ITimg.ocr("任务", { action: 1, timing: 2000, area: "右半屏", })) {
        toastLog("无法识别到任务");
        return
    }
    ITimg.ocr("每日", { action: 1, timing: 1500, area: "左上半屏", })
    if (ITimg.ocr("一键领取", { action: 0, timing: 7000, area: "上半屏", })) {
        click(height / 2, width - 100);
        sleep(1000);
        helper.任务状态.每日登录 = true;
        tool.writeJSON("任务状态", helper.任务状态);
    }

    if (!value) {
        //领取100活跃度奖励
        let active = ITimg.ocr("/100", { action: 5, area: "左半屏", part: true, })
        if (!active) {
            sleep(1000);
            click(height / 2, width - 100);
            sleep(1000);
            active = ITimg.ocr("/100", { action: 5, part: true, })
        }
        if (active) {
            active = active.text;
            if (active.indexOf("/") == 2) {
                active = Math.floor(active[0] + active[1]);
            } else {
                active = Math.floor(active[0] + active[1] + active[2]);
            }
            if (active >= 100) {
                //获取点击100活跃度位置
                active = ITimg.ocr("100", { action: 5, area: "右下半屏", })
                if (active) {
                    click(active.left, active.top - 100);
                    click(active.left, active.top - 70);
                    sleep(5000);
                    click(height / 2, width - 100)
                    sleep(500);

                } else {

                    toastLog("无法获取100活跃度奖励坐标点位置\n点击固定坐标");
                    click(frcx(2040), frcy(960));
                    sleep(5000);
                    click(height / 2, width - 100)
                    sleep(500);
                }
            } else if (active.toString() == "NaN") {

                toastLog("无法获取活跃度数值");
                //直接点击100活跃度奖励
                click(frcx(2040), frcy(960));
                sleep(5000);
                click(height / 2, width - 100)
                sleep(500);
            } else {
                toastLog("今日任务活跃度:" + active)
            }
        } else {
            toastLog("无法获取活跃度数值");
            click(frcx(2040), frcy(960));
            sleep(5000);
            click(height / 2, width - 100)
            sleep(500);
        }
    }
    //返回主页
    click(coordinate.coordinate.主页面.x, coordinate.coordinate.主页面.y);
    sleep(1000)
}

function 领取手册经验() {
    if (!helper.手册经验) {
        return
    }
    Floaty.emit("面板", "隐藏");
    Floaty.emit("展示文本", "状态", "状态：领取手册经验");
    sleep(1000);
    if (ITimg.ocr("任务", { area: "右半屏", }) == false && ITimg.ocr("战斗", { area: "右半屏", refresh: false, }) == false) {
        //返回主页
        click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
        sleep(3000)
    }

    click(coordinate.coordinate.手册图标位置.x, coordinate.coordinate.手册图标位置.y);
    sleep(1500);
    ITimg.ocr("确定", { action: 0, timing: 1000, area: "左半屏", })
    if (ITimg.ocr("评定任务", { action: 1, timing: 500, area: "左下半屏", })) {
        ITimg.ocr("一键领取", { action: 1, timing: 1500, area: "右下半屏", });
        click(height / 2, width - 100);
        sleep(1000);
    }
    if (ITimg.ocr("战略补给", { action: 1, timing: 500, area: "左上半屏", })) {
        ITimg.ocr("一键领取", { action: 1, timing: 1500, area: "右下半屏", });
        click(height / 2, width - 100);
        sleep(1000);
    }
    //点击返回
    click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
    sleep(1000)
    Floaty.emit("面板", "展开");


}

function 便笺(sleep_, value) {
    sleep_ = sleep_ || 1000
    let notes = tool.readJSON("notes");
    console.info(notes)
    if (notes == undefined) {
        return
    }

    if (notes.自动识别 == true) {
        if (检测ocr() == false) {
            return false
        }
        Floaty.emit("展示文本", "状态", "状态：等待识别血清中...");

        sleep(sleep_)
        let serum = ITimg.ocr("/160", { action: 5, area: "右上半屏", part: true, });
        if (serum) {
            serum = Math.floor(serum.text.split("/")[0]);
            console.warn(serum)
            if (serum.toString() == "NaN") {
                let text = "无法识别血清数量";
                toast(text)
                console.error(text);
                return text
            } else {
                if (value) {
                    return serum
                }
                console.warn("剩余血清数：" + serum)
                tool.writeJSON("已有血清", serum, "notes")
                tool.writeJSON("血清数", serum + "/160", "notes")
                tool.writeJSON("血清时间", new Date(), "notes")
            }
            return true
        }

        Floaty.emit("展示文本", "状态", "状态：血清识别完成");

    }

}


function 检测ocr() {
    if (ocr) return;
    ocr = app.getAppName("com.tony.mlkit.ocr");
    if (ocr != null) {
        function version(packageName) {
            importPackage(android.content);
            var pckMan = context.getPackageManager();
            var packageInfo = pckMan.getPackageInfo(packageName, 0);
            return packageInfo.versionName;
        }
        ocr = require("./utlis/ocr.js");
        let ocr_ = ocr.初始化Manager类(helper.模拟器 ? true : false);
        if (ocr_ == false) {
            if (device.product == "SM-G9750" && device.release == 9) {
                ocr_ = "雷电9仅可使用x86-32位ocr插件\n\nhttps://234599.lanzouv.com/iyraG0fjzukf"
            } else {
                ocr_ = "32位战双辅助无法使用\n64位ocr文字识别插件\n请重新下载安装32位ocr\n\nhttps://234599.lanzouv.com/b00q05mpe 密码:421"
            }
            dialogs.build({
                type: "foreground-or-overlay",
                title: "提醒",
                titleColor: "#000000",
                contentColor: "#F44336",
                content: ocr_,
                positive: "下载",
                negative: "取消",
                cancelable: false,
                canceledOnTouchOutside: false,
                // view高度超过对话框时是否可滑动
                wrapInScrollView: false,
                // 按下按钮时是否自动结束对话框
                autoDismiss: true
            }).on("positive", () => {
                threads.start(function () {
                    app.launchPackage(packageName)
                    sleep(1500)

                    if (device.product == "SM-G9750" && device.release == 9) {
                        app.openUrl("https://234599.lanzouv.com/iwn8u0fk1ebc")
                        toastLog("转向OCR x86_32位版本，所有版本链接：https://234599.lanzouv.com/b00q05mpe")

                    } else {
                        if (app.autojs.versionCode > 8082200) {

                            app.openUrl("https://234599.lanzouv.com/b00q05mpe")
                        } else {
                            app.openUrl("https://234599.lanzouv.com/tp/iaVLC0d3i62d")
                            toastLog("转向OCR32位版本，所有版本链接：https://234599.lanzouv.com/b00q05mpe")
                        }
                    }

                    toastLog("密码:421")
                })
            }).show();

            Floaty.emit("面板", "展开");
            Floaty.emit("展示文本", "状态", "状态：暂停，无法使用插件");
            Floaty.emit("暂停", "结束程序");

            return false
        }
    } else {
        ocr = false;
        toastLog("未安装OCR插件，无法使用\n请打开主页-自动公开招募，获取OCR插件下载安装");
        importClass(android.os.Build);
        log("当前战双辅助架构：" + Build.CPU_ABI)
        let con_ = "请先下载安装mlkit ocr 文字识别插件，否则无法使用\n\nhttps://234599.lanzouv.com/b00q05mpe 密码:421" +
            "\n\n当前战双辅助架构：" + Build.CPU_ABI + "，\n建议下载安装" + ((Build.CPU_ABI == "arm64-v8a") ? "OCR 64位包" : "OCR 32位包") + "，\n\n安装错误的OCR版本会导致OCR无法识别，应用崩溃。关于应用-战双辅助32位只能使用32位OCR插件"

        dialogs.build({
            type: "foreground-or-overlay",
            title: "提醒",
            titleColor: "#000000",
            contentColor: "#F44336",
            content: con_,
            positive: "下载",
            negative: "取消",
            cancelable: false,
            canceledOnTouchOutside: false,
            // view高度超过对话框时是否可滑动
            wrapInScrollView: false,
            // 按下按钮时是否自动结束对话框
            autoDismiss: true
        }).on("positive", () => {
            threads.start(function () {
                app.launchPackage(packageName)
                sleep(1500)
                if (app.autojs.versionCode > 8082200) {

                    app.openUrl("https://234599.lanzouv.com/b00q05mpe")
                } else {
                    app.openUrl("https://234599.lanzouv.com/tp/iaVLC0d3i62d")
                    toastLog("转向OCR32位版本，所有版本链接：https://234599.lanzouv.com/b00q05mpe")
                }
                toastLog("密码:421")
            })

        }).show()

        Floaty.emit("面板", "展开");
        Floaty.emit("展示文本", "状态", "状态：暂停，未安装插件");
        Floaty.emit("暂停", "结束程序");
        return false
    }
}

/**
 * 获取当前前台应用包名
 * @returns {string | object}
 */
function getpackage() {
    if (!runtime.getAccessibilityBridge()) {
        return currentPackage();
    }
    // 通过windowRoot获取根控件的包名，理论上返回一个 速度较快
    let windowRoots = runtime.getAccessibilityBridge().windowRoots()
    if (windowRoots && windowRoots.size() > 0) {
        if (windowRoots && windowRoots.size() >= 2) {
            log('windowRoots size: ' + windowRoots.size())
        }
        for (let i = 0; i < windowRoots.size(); i++) {
            let root = windowRoots.get(i)
            if (root !== null && root.getPackageName()) {
                return root.getPackageName()
            }
        }
    }
    // windowRoot获取失败了通过service.getWindows获取根控件的包名，按倒序从队尾开始获取 速度相对慢一点
    try {
        let service = runtime.getAccessibilityBridge().getService()
        let serviceWindows = service !== null ? service.getWindows() : null
        if (serviceWindows && serviceWindows.size() > 0) {
            log('windowRoots未能获取包名信息，尝试service window size: ', serviceWindows.size())
            for (let i = serviceWindows.size() - 1; i >= 0; i--) {
                let window = serviceWindows.get(i)
                if (window && window.getRoot() && window.getRoot().getPackageName()) {
                    return window.getRoot().getPackageName()
                }
            }
        }
    } catch (e) {
        console.error(e)
    }
    log('service.getWindows未能获取包名信息，通过currentPackage()返回数据')
    // 以上方法无法获取的，直接按原方法获取包名
    return currentPackage();
}

//--------------------------------------------------------