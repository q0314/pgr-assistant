var width = device.width,
    height = device.height;
let banben = false,
    stop = false;

var setting = storages.create("ocr识别助手").get("setting", {
    "x": null,
    "y": null,
    "h": null,
    "w": null,
})

if (app.autojs.versionCode > 8082200) {
    banben = true;
}
if (!banben) {
    v9()
} else {
    识别设置()
}


function 识别设置() {
    let uii = ui.inflate(
        <vertical id="parent">
            <frame>
                <ScrollView>
                    <vertical>
                        
                        
                        <linear gravity="center" margin="0 10 0 0">
                            <text text=" 选择ocr插件" id="prompt_line" textSize="8" marginLeft="5" />
                            <View bg="#f5f5f5" w="*" h="2" />
                        </linear>
                        <text id="wxts" text="温馨" typeface="sans" padding="5" visibility="gone" textColor="#000000" textSize="15sp" layout_gravity="center" />
                        
                        <card id="car" w="*" h="auto" margin="5 0 5 0" cardCornerRadius="2dp"
                        cardElevation="1dp" foreground="?selectableItemBackground" cardBackgroundColor="#eff0f4">
                        
                        <radiogroup mariginTop="0" w="*">
                            
                            <radiogroup id="fu" orientation="horizontal">
                                <radio id="fu1" text="第三方Mlkit" checked="true" />
                                <radio id="fu2" text="官方Mlkit"  />
                                <radio id="fu3" text="PaddleOCR" />
                            </radiogroup>
                            <linear gravity="center" margin="0 -2">
                                <text text=" 识别区域" textSize="8" />
                                <View bg="#f5f5f5" w="*" h="2" />
                            </linear>
                            <radiogroup id="region" orientation="vertical" >
                                
                                <radio id="region2" text="左半屏"  />
                                <radio id="region3" text="右半屏" marginLeft="110" marginTop="-32"/>
                                <radio id="region4" text="上半屏"  />
                                <radio id="region5" text="下半屏" marginLeft="110" marginTop="-32"/>
                                
                                <radio id="region6" text="左上半屏"  />
                                <radio id="region7" text="右上半屏"  marginLeft="110" marginTop="-32"/>
                                <radio id="region8" text="左下半屏"  />
                                <radio id="region9" text="右下半屏"  marginLeft="110" marginTop="-32"/>
                                
                                <radio id="region1" text="全屏" checked="true" />
                                <radio id="region0" text="自定义区域" marginLeft="110" marginTop="-32"/>
                                
                                
                            </radiogroup>
                            
                            <horizontal id="region0_" w="*" visibility="gone">
                                <input id="xx" hint="x" layout_weight="1" lines="1" inputType="number"/>
                                <input id="yy" hint="y" layout_weight="1" lines="1" inputType="number"/>
                                <input id="h" hint="h" layout_weight="1" lines="1" inputType="number" />
                                <input id="w" hint="w" layout_weight="1" lines="1" inputType="number"/>
                                
                                
                            </horizontal>
                            
                            <horizontal w="*">
                                <Switch id="vz" text="识别结果可视化" checked="true" padding="0 5 10 5" textSize="18sp"
                                margin="10 0" thumbSize='24' gravity="center_vertical" w="*"
                                radius='24' />
                                
                            </horizontal>
                        </radiogroup>
                        
                    </card>
                    
                    <horizontal w="*" padding="-3" gravity="center_vertical">
                        <button text="退出" id="exit" textColor="#F4A460" style="Widget.AppCompat.Button.Borderless.Colored" layout_weight="1" />
                        <button text="确认" id="ok" style="Widget.AppCompat.Button.Borderless.Colored" layout_weight="1" />
                    </horizontal>
                </vertical>
            </ScrollView>
        </frame>
        </vertical>);

    var res = dialogs.build({
        type: "foreground-or-overlay",
        customView: uii,
        wrapInScrollView: false
    }).on("dismiss", (dialog) => {
        storages.create("ocr识别助手").put("setting", {
            x: Math.floor(uii.xx.getText()) ? Math.floor(uii.xx.getText()) : null,
            y: Math.floor(uii.yy.getText()) ? Math.floor(uii.yy.getText()) : null,
            h: Math.floor(uii.h.getText()) ? Math.floor(uii.h.getText()) : null,
            w: Math.floor(uii.w.getText()) ? Math.floor(uii.w.getText()) : null,
        })

    }).show()
    log(setting)
    if (setting.x) {
        uii.xx.setText(setting.x.toString());
    }
    if (setting.y) {
        uii.yy.setText(setting.y.toString());
    }
    if (setting.h) {
        uii.h.setText(setting.h.toString());
    }
    if (setting.w) {
        uii.w.setText(setting.w.toString());
    }
    uii.exit.on("click", function() {
        res.dismiss()
    })
    uii.region0.on("check", function(checked) {
        uii.region0_.setVisibility(checked ? 0 : 8)
    })
    uii.ok.on("click", function() {
        let region_s = ischeck(uii.region);
        if (region_s == null) {
            return
        }
        res.dismiss()

        let Config = {
            ocr包名: ischeck(uii.fu),
            可视化: uii.vz.checked,
            识别图片: null,
            识别区域: region_s,
        }
        /*
          
          log(stop)
        if (!stop) {
            stop = true;
        
        window.runOrStop_src.attr("src", "@drawable/ic_fiber_manual_record_black_48dp")
         
         */
        engines.execScriptFile("./ocr识别.js", {
            arguments: {
                Config: Config,
            },
        });
        if (!banben) {
            if (!stop) {
                stop = true;
                window.runOrStop_src.attr("src", "@drawable/ic_fiber_manual_record_black_48dp")


                threads.start(检测)

            }
        }
        //            threads.start(检测)

        function ischeck(id) {
            for (let i = 0; i < id.getChildCount(); i++) {
                let rb = id.getChildAt(i);
                if (rb.isChecked()) {
                    let text = rb.getText()
                    switch (text) {
                        case '全屏':
                            text = [0, 0, height, width]
                            break
                        case '自定义区域':
                            let xx = Math.floor(uii.xx.getText());
                            log("x" + xx)
                            let yy = Math.floor(uii.yy.getText());
                            log("y" + yy)
                            let h = Math.floor(uii.h.getText());
                            let w = Math.floor(uii.w.getText());
                            if (h == 0 && w == 0) {
                                toastLog("请确认自定义的区域");
                                return null;
                            }
                            text = [xx, yy, h, w];


                            break
                        case '左半屏':
                            text = [0, 0, height / 2, width];
                            break
                        case '右半屏':
                            text = [height / 2, 0, height / 2, width]
                            break
                        case '上半屏':
                            text = [0, 0, height, width / 2];
                            break
                        case '下半屏':
                            text = [0, width / 2, height, width / 2]
                            break

                        case '左上半屏':
                            text = [0, 0, height / 2, width / 2];
                            break
                        case '右上半屏':
                            text = [height / 2, 0, height / 2, width / 2]
                            break
                        case '左下半屏':
                            text = [0, width / 2, height / 2, width / 2]
                            break
                        case '右下半屏':
                            text = [height / 2, width / 2, height / 2, width / 2]
                            break
                    }

                    return text;
                }
            }
        }


    })

}

function v9() {


    //启动一个线程用于处理可能阻塞UI线程的操作
    var blockHandle = threads.start(function() {
        setInterval(() => {}, 1000);
    });
    try {
        path
    } catch (e) {
        path = "/sdcard/脚本/测试.js"
    }

    var show = true,
        jsname = "ocr识别.js";
    var window = 创建悬浮窗();
    //延迟1000毫秒再监听悬浮窗，否则可能出现监听失败的情况
    悬浮窗监听(window);


    function 创建悬浮窗() {
        var window = floaty.rawWindow(
            <card w="auto" h="auto" cardCornerRadius="5" cardBackgroundColor="#857FFFAA">
                <linear  orientation="vertical" bg="#755c895f" >
                    <text id="name" margin="8 3 0 0" text="及时行乐" textColor="#2a3e2c" textSize="33px" gravity="center_vertical"/>
                    <linear w="*" h="*">
                        <linear id="action" w="*" h="30" gravity="center">
                            <img id="action_src" src="@drawable/ic_expand_more_black_48dp" w="40" h="28" tint="#2a3e2c"/>
                        </linear>
                        
                        <linear id="ms" w="auto" h="30" marginTop="0">
                            <linear id="runOrStop" w="*" h="*" foreground="?selectableItemBackground">
                                <img  id="runOrStop_src" src="@drawable/ic_play_arrow_black_48dp" w="40" h="25" tint="#2a3e2c"/>
                            </linear>
                            
                            <linear id="log" w="*" h="*">
                                <img id="log" src="@drawable/ic_assignment_black_48dp" w="40" h="23" marginTop="3" tint="#2a3e2c"/>
                            </linear>
                            <linear id="exit" w="*" h="*">
                                <img  src="@drawable/ic_close_black_48dp" w="40" h="25" tint="#2a3e2c"/>
                            </linear>
                        </linear>
                    </linear>
                </linear>
            </card>
        );


        return window;
    }

    function 悬浮窗监听(window) {

        ui.post(() => {
            //初始化悬浮窗及悬浮窗操作对象
            //   window.name.setText(layoutAttribute.title.name);

            window.name.setText(jsname)
            window.setPosition(150, 200);
            window.setTouchable(true);
            // window.optionList.setDataSource(optionList);
        });

        var windowX, windowY, downTime, x, y, maxSwipeW, maxSwipeH, swipe;
        window.action.setOnTouchListener(function(view, event) {
            switch (event.getAction()) {
                case event.ACTION_DOWN:
                    x = event.getRawX();
                    y = event.getRawY();
                    windowX = window.getX();
                    windowY = window.getY();
                    downTime = new Date().getTime();
                    maxSwipeW = device.width - window.getWidth();
                    maxSwipeH = device.height - window.getHeight();
                    swipe = false;
                    return true;
                case event.ACTION_MOVE:
                    let sX = windowX + (event.getRawX() - x);
                    let sY = windowY + (event.getRawY() - y);
                    if (sX <= 0) sX = 0;
                    if (sY <= 0) sY = 0;
                    if (sX >= maxSwipeW) sX = maxSwipeW;
                    if (sY >= maxSwipeH) sY = maxSwipeH;
                    if (new Date().getTime() - downTime > 100 && Math.abs(event.getRawY() - y) > 10 && Math.abs(event.getRawX() - x) > 10 || swipe) {
                        if (swipe == false)(swipe = true);

                        /* 第一次滑动时震动30ms，并且将swipe置为true以忽略滑动条件避免卡顿*/
                        window.setPosition(sX, sY);
                    };
                    return true;
                case event.ACTION_UP:
                    if (Math.abs(event.getRawY() - y) < 10 && Math.abs(event.getRawX() - x) < 10) {
                        if (show) {
                            show = false
                            window.name.setVisibility(8)
                            window.ms.setVisibility(8)
                            window.action.attr("h", 40)
                            window.action_src.attr("src", "@drawable/ic_expand_less_black_48dp")
                        } else {
                            show = true;
                            window.name.setVisibility(0)
                            window.ms.setVisibility(0)
                            window.action.attr("h", 30)
                            window.action_src.attr("src", "@drawable/ic_expand_more_black_48dp")
                        };
                    };
                    return true;
            };
            return true;
        });


    };

    window.runOrStop.on('click', function() {
        识别设置()
    })

    window.log.on('click', function() {
        app.startActivity("console")
    })


    window.exit.on('click', function() {
        let execution = engines.all();
        for (let i = 0; i < execution.length; i++) {
            if (execution[i].getSource().toString().indexOf(jsname) > -1) {
                console.verbose("强行终止" + jsname)
                execution[i].forceStop()
            }
        }
        exit()
    })

    function 检测() {
        while (stop) {
            sleep(500)
            let execution = engines.all();
            for (let i = 0; i < execution.length; i++) {
                if (execution[i].getSource().toString().indexOf(jsname) > -1) {
                    execution = true;
                }
            }
            if (execution !== true) {
                stop = false;
                ui.run(() => {
                    window.runOrStop_src.attr("src", "@drawable/ic_play_arrow_black_48dp")
                })
            }
        }
    }
}