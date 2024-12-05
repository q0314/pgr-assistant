module.exports = function 纷争战区(change) {
    this.change = change;
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
        //模块可获取但无法直接修改主程序的变量
            this.change(fight_thread);
            
        sleep(5000);
        while (true) {
            if (fight_thread && !fight_thread.isAlive()) {
                toastLog("重启作战线程");
                fight_thread = threads.start(作战);
                this.change(fight_thread);
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
                    this.change(fight_thread);

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