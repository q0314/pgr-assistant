module.exports =  function 宿舍() {
    
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
                scale:1,
                threshold: 0.8,
                saveSmallImg: true,
            }) || ITimg.matchFeatures("宿舍-家具-关闭", {
                action: 5,
                timing: 1000,
                area: 2,
                scale:1,
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

        
        sleep(500);
        click(coordinate.coordinate["宿舍-家具-关闭"].x, coordinate.coordinate["宿舍-家具-关闭"].y);
        sleep(500)
        click(coordinate.coordinate["宿舍-家具-关闭"].x, coordinate.coordinate["宿舍-家具-关闭"].y);
        sleep(500);
    }
        //返回
        if (coordinate.coordinate.返回) {
            click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
            sleep(1500);
        }else{
                返回主页(true);
        }
    }

}
