function 坐标配置(name, x, y) {
    if (name == "战斗") {
        if (x != "test") {
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
        }
        let key_list;
        key_list = ITimg.contour({
            canvas: "键位",
            action: 5,
            area: 0, //[0, 0, height, width],
            picture: y,
            isdilate: false,
            threshold: 200,
            size: 0,
            type: "BINARY",
            filter_w: 50,
            filter_h: 50,
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

            if (id.length > 1 && id[0].shape == "圆形") {

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
                } else if (id.shape == "圆形" && id.x + id.w < height / 2 && id.y + id.h > parseInt(width / 2)) {
                    coordinate.combat["移动"] = {
                        "x": id.x,
                        "y": id.y,
                        "w": id.w,
                        "h": id.h,
                    };
                } else if (id.shape = "长方形" && id.x > height / 3 && id.x < height / 1.4 && id.y > width / 1.5) {
                    coordinate.combat["状态栏"] = {
                        x: id.x,
                        y: id.y,
                        w: id.w,
                        h: id.h,
                    }

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
                } else if (id.shape == "正方形") {
                    coordinate.combat["效应"] = {
                        "x": id.x,
                        "y": id.y,
                        "w": id.w,
                        "h": id.h,
                    };
                }
            }
        }
        if (coordinate.combat["信号球"].h > coordinate.combat["移动"].h) {
            let difference = parseInt(coordinate.combat["信号球"].h / 2.2)
            coordinate.combat["信号球"].y = coordinate.combat["信号球"].y + difference
            coordinate.combat["信号球"].h -= difference;
        }
        let key_ = JSON.parse(JSON.stringify(coordinate.combat["角色2"]));
        key_.y += key_.h;

        coordinate.combat["辅助机"] = key_;
        key_position = key_position[1] ? key_position[1] : key_position[0];

        coordinate.combat["闪避"] = {
            "x": key_.x,
            "y": key_.y,
            "w": key_.w,
            "h": key_.h,
        };
        key_ = key_position[1];
        coordinate.combat["攻击"] = {
            "x": key_.x,
            "y": key_.y,
            "w": key_.w,
            "h": key_.h,
        };
        key_ = key_position[2];
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

    log(coordinate.combat)
    coordinate = {
        "name": width + "x" + height,
        "w": width,
        "h": height,
        "coordinate": coordinate.coordinate,
        "宿舍": coordinate.宿舍,
        "combat": coordinate.combat
    };
    /* files.write(
        "./library/coordinate.json",
        JSON.stringify(coordinate),
        (encoding = "utf-8")
    )
*/
}
try {
    module.exports = 坐标配置;
} catch (e) {
    var height = device.height,
        width = device.width;
    console.info(height)
    require('../utlis/ResourceMonitor.js')(runtime, this)

    var ITimg = require("../ITimg.js"); //读取识图库
    ITimg.setting.截图方式 = null;
    new ITimg.Prepare({}, {
        saveSmallImg: true,
        picture_failed_further: true,
        correction_path: "./utlis/ocr_矫正规则.json"
    }, {}, {
        threshold: 0.75,
        filter_w: 20,
        filter_h: 20,
        saveSmallImg: true,
        picture_failed_further: true,
        imageFeatures: true,
        visualization: true
    });
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
                if (!foundGroup && Math.abs(column.y - group[0].y) <= 50) {
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

    var coordinate = {
        "name": width + "x" + height,
        "w": width,
        "h": height,
        "coordinate": {},
        "combat": [],
        "宿舍": {
            "宿舍房间位置": [],
            "快捷头像位置": []
        }
    }
    let img = images.read("/sdcard/DCIM/Screenshots/1112.jpg")

    坐标配置("战斗", "test", img)
}