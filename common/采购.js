module.exports = function 采购() {
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
                area: 4,
                log_policy: "简短",
            }) || ITimg.ocr("每周限购", {
                action: 5,
                area: 4,
                refresh: false,
                part: true,
            });

            (ITimg.ocr("购买", {
                action: 1,
                timing: 1500,
                area: 4,
                nods: 500,
            }) || ITimg.ocr("购买", {
                action: 1,
                timing: 1500,
                area: 4,
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
                        area: 4,
                        nods: 500,
                    }) || ITimg.ocr("购买", {
                        action: 1,
                        timing: 1500,
                        area: 4,
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