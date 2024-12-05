module.exports = function 消耗血清(change) {
    this.change = change;
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
            });
            let injection;

            for (let surplus_hour of surplus_hour_list) {
                if (surplus_hour.text.indexOf("小时") != -1 || surplus_hour.text.indexOf("时") != -1) {

                    for (let i = 10; i > 0; i--) {
                        click(surplus_hour.right, surplus_hour.bottom);
                        sleep(50);
                        injection = true;
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
            if (injection) {
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

    sleep(1000)
    helper = tool.readJSON("helper");

    if (!helper.任务状态.自动2血清 && helper.自动2血清) {
        helper.注射血清 = 2;
        log("自动注射血清2");
    }
    sleep(150);
    let staging;
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
    }
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
                    area: 4,
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
                helper.战斗.作战 = ITimg.ocr("多重挑战", {
                    action: 4,
                    timing: 1000,
                    area: 4,
                })
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
            this.change(fight_thread);
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
            this.change(fight_thread);
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
            console.info(this.change)
            this.change && this.change(fight_thread);
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