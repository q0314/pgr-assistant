importClass(android.animation.ObjectAnimator);
importClass(android.content.Context);
importClass(android.widget.AdapterView);
importClass(android.content.ContextWrapper);
importClass(android.view.WindowManager)

importClass(android.net.Uri);
importClass(android.webkit.WebSettings);
importClass(android.webkit.ValueCallback);

//启动一个线程用于处理可能阻塞UI线程的操作
var blockHandle = threads.start(function() {
    setInterval(() => {}, 1000);
});
let {
    dp2px,
    px2dp,
    iStatusBarHeight,
    createShape
} = require('./modules/__util__.js');


var use = {};
var tool = require("./modules/app_tool.js");
var theme = require("./theme.js");
use.Dialog_Tips = require("./modules/Dialog_Tips.js");
var language = theme.language.floaty;
language.main = theme.language.main;
delete theme.language

var helper = tool.readJSON("helper");

//图标运行状态,是否手动暂停
var eliminate = false;

var pane = tool.readJSON("pane", {
    "悬浮窗大小": 0.75,
    "背景颜色": "#a6ccf3",
    "图标颜色": "#747984",
    "文字颜色": "#6b5891",
    "初始暂停": false,
})
let size = pane.悬浮窗大小;
size = Number(size);

if (size == undefined || isNaN(size) == true || size == 0) {
    size = 0.75;
}

//设置悬浮窗初始属性{!
var layoutAttribute = {
    //设置悬浮窗左上角小圆点的尺寸
    windowOperate: {
        w: zoom(75),
        h: zoom(75)
    },
    //设置悬浮窗的尺寸和启动时的初始位置
    whole: {
        w: zoom(600),
        h: zoom(240),
        iniX: zoom(65),
        iniY: zoom(130)
    },
    //设置标题栏的名称及高度a
    title: {
        name: " ",
        h: zoom(75)
    },
    //用于程序运行时判断布局是否显示
    homepage: {
        show: true
    },
    //设置布局的配色
    setColor: {
        bg: pane.背景颜色,
        theme: pane.图标颜色,
        toast: pane.文字颜色
    },
};
//更准确的屏幕属性
var screenAttribute = {
    w: device.width,
    h: device.height,
    direction: 获取屏幕方向(),
};

//设置顶部功能键图标
var 功能图标 = [
    "@drawable/ic_pause_circle_outline_black_48dp",
    "file://./res/ic_Rational_exchange_black_48dp.png",
    // "@drawable/ic_assignment_ind_black_48dp",
    "@drawable/ic_settings_applications_black_48dp",
    "@drawable/ic_power_settings_new_black_48dp",
];

var optionList = [
    "@drawable/ic_border_outer_black_48dp",
    "@drawable/ic_assignment_black_48dp",
];

var window = 创建悬浮窗();


function record(text, time, log) {
    try {
        Combat_report
        if (Combat_report == undefined) {
            return;
        }
    } catch (err) {
        return
    }
    Combat_report.record(text, time, log);
}

//延迟1000毫秒再监听悬浮窗，否则可能出现监听失败的情况
setTimeout(() => {
    旋转监听();

    悬浮窗监听(window);
}, 1000);

function 创建悬浮窗() {
    var window = floaty.rawWindow(
        // var window = floaty.window(
        <frame w="auto" id="parent" h="auto">
            <vertical id="homepage" w="{{layoutAttribute.whole.w}}px" h="{{layoutAttribute.whole.h}}px" bg="{{layoutAttribute.setColor.bg}}">
                <frame id="title" w="{{layoutAttribute.whole.w - layoutAttribute.windowOperate.w}}px" h="{{layoutAttribute.title.h}}px" layout_gravity="right">
                    <text id="name" marginLeft="{{zoom(25)}}px" w="{{zoom(460)}}px" text="战斗/宿舍" textColor="{{layoutAttribute.setColor.theme}}" textSize="{{zoom(40)}}px" gravity="left|center" />
                    <horizontal w="*" gravity="right" id="operation" >
                        <grid id="功能" w="auto" h="auto" spanCount="4" layout_gravity="right">
                            <img text="1" w="{{zoom(75)}}px" h="*" src="{{this}}" tint="{{layoutAttribute.setColor.theme}}" />
                        </grid>
                    </horizontal>
                    <horizontal w="*" gravity="right|center" id="operation2" visibility="gone">
                        <img id="daxiao" w="{{zoom(75)}}px" h="*" margin="4 0 2 0 " tint="{{layoutAttribute.setColor.theme}}" src="@drawable/ic_crop_free_black_48dp" />
                        
                        <grid id="操作" w="auto" h="auto" spanCount="6" layout_gravity="right">
                            <img text="1" w="{{zoom(60)}}px" h="*" src="{{this}}" tint="{{layoutAttribute.setColor.theme}}" margin="8 0" />
                        </grid>
                        <spinner id="工具" background="file://res/ic_bookmark.webp" margin="8 0" spinnerMode="dropdown" backgroundTint="{{layoutAttribute.setColor.theme}}" w="{{zoom(60)}}px" h="{{zoom(60)}}px" popupBackground="#dcdcdc" dropDownHorizontalOffset="{{zoom(-300)}}px" />
                    </horizontal>
                </frame>
                <frame id="xxbj" w="*" h="*">
                    <text id="tos" text="状态：信息待更新中" textColor="{{layoutAttribute.setColor.toast}}" textSize="{{zoom(45)}}px" h="auto" layout_gravity="top" />
                    <text id="tod" text="挑战：信息待更新中" textColor="{{layoutAttribute.setColor.toast}}" textSize="{{zoom(45)}}px" h="auto" layout_gravity="center" />
                    <text id="tof" text="血清：信息待更新中" textColor="{{layoutAttribute.setColor.toast}}" textSize="{{zoom(45)}}px" h="auto" layout_gravity="bottom" />
                    <horizontal id="Material_Science" w="*" h="20" marginLeft="-3" layout_gravity="bottom">
                        
                    </horizontal>
                    <frame w="auto" h="auto" marginRight="{{zoom(3)}}px" layout_gravity="center_vertical|right">
                        <list id="optionList" w="*" h="auto">
                            <img id="option" w="{{zoom(70)}}px" h="{{zoom(80)}}px" src="{{this}}" tint="{{layoutAttribute.setColor.theme}}" />
                        </list>
                    </frame>
                </frame>
                
            </vertical>
            <card w="{{layoutAttribute.windowOperate.w}}px" h="{{layoutAttribute.windowOperate.h}}px" cardCornerRadius="{{zoom(40)}}px" backgroundTint="{{layoutAttribute.setColor.bg}}" cardElevation="0">
                <img id="windowOperate" w="*" h="*" src="@drawable/ic_ac_unit_black_48dp" tint="{{layoutAttribute.setColor.theme}}" />
            </card>
        </frame>
    );
    if (device.brand != "HUAWEI" && device.brand != "HONOR" && device.brand != "NZONE") {
        旋转动画(window.windowOperate, 720, 'z', 2000);
    } else {
        log("HUAWEI && HONOR && Nzone");
    }
    sleep(50)
    window.setPosition(layoutAttribute.whole.iniX, layoutAttribute.whole.iniY);

    /* threads.start(function() {
         let i = window.getX();
          for (let iy = window.getY(); iy < layoutAttribute.whole.iniY; iy++) {
             if(i < layoutAttribute.whole.iniX){
             i = i + 0.5;
             }
             sleep(8)
             ui.post(() => {
                 window.setPosition(i, iy);
             }, 1)
         }
     })*/

    /* if (params.flags == 83887656) {
         log("当前可以触摸, 修改为不可触摸");
         params.flags |= WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL;
         // params.flags |= WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE;
     } else if (params.flags == 83887672) {
         log("当前不可以触摸, 修改为可触摸");
         params.flags &= ~WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE;
     } else {
         //  throw new Error("params.flags 未知数: " + params.flags);
     }
     params.flags |= WindowManager.LayoutParams.FLAG_WATCH_OUTSIDE_TOUCH
    params.flags = WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL | WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE;
     */
    return window;
}

function 悬浮窗监听(window) {
    //初始化悬浮窗及悬浮窗操作对象
    ui.post(() => {
        window.setTouchable(true);
        window.功能.setDataSource(功能图标)
        //window.optionList.setDataSource(optionList);
        layoutAttribute.whole.x = window.getX();
        layoutAttribute.whole.y = window.getY();
    });

    var windowX, windowY, downTime, x, y, maxSwipeW, maxSwipeH, swipe;

    window.windowOperate.setOnTouchListener(function(view, event) {
        switch (event.getAction()) {
            case event.ACTION_DOWN:
                x = event.getRawX();
                y = event.getRawY();
                windowX = window.getX();
                windowY = window.getY();
                downTime = new Date().getTime();
                /*if (获取屏幕方向() == "竖屏") {
                    maxSwipeW = screenAttribute.w - window.getWidth();
                    maxSwipeH = screenAttribute.h - window.getHeight();
                } else {
                    maxSwipeW = screenAttribute.h - window.getWidth();
                    maxSwipeH = screenAttribute.w - window.getHeight();
                }
                */

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
                    /* 第一次滑动时震动30ms，并且将swipe置为true以忽略滑动条件避免卡顿*/
                    if (swipe == false)(device.vibrate(30), swipe = true);
                    layoutAttribute.whole.x = sX;
                    layoutAttribute.whole.y = sY;
                    ui.run(function() {
                        window.setPosition(sX, sY);
                    })

                };
                return true;
            case event.ACTION_UP:
                if (Math.abs(event.getRawY() - y) < 10 && Math.abs(event.getRawX() - x) < 10) {
                    if (layoutAttribute.homepage.show) {
                        layoutAttribute.homepage.show = false;
                        blockHandle.setTimeout(() => {
                            隐藏主界面();
                        }, 0);
                    } else {
                        layoutAttribute.homepage.show = true;
                        blockHandle.setTimeout(() => {
                            展开主界面();
                        }, 0);
                    };
                };
                return true;
        };
        return true;
    });


    let delay = true;
    window.功能.on("item_click", function(icon) {
        switch (icon) {
            case 功能图标[0]:
                if (delay) {
                    if (功能图标[0] == "@drawable/ic_pause_circle_outline_black_48dp") {
                        eliminate = false;
                        threads.start(暂停);
                        $ui.post(() => {
                            window.tos.setText("状态：主程序暂停中");
                        }, 200)
                    } else {
                        eliminate = true;
                        threads.start(继续);
                    };
                    delay = false;
                    setTimeout(function() {
                        delay = true;
                    }, 1000);
                } else {
                    toast("你的操作太快啦");
                }
                break;
            case 功能图标[1]:
                执行次数()

                break;
            case 功能图标[2]:
                主页设置()
                break;
            case 功能图标[3]:

                eliminate = true;
                暂停(true);
                $settings.setEnabled('foreground_service', false);
                threads.shutDownAll();
                window.close()
                toastLog("主动关闭PRTS辅助及悬浮窗");

                setTimeout(function() {
                    let execution = engines.all();
                    for (let i = 0; i < execution.length; i++) {
                        if (execution[i].getSource().toString().indexOf("PRTS辅助") > -1) {
                            toastLog("强行终止PRTS辅助")
                            execution[i].forceStop()
                        }
                    }
                    exit();
                }, 1500);

                break;
        }

    });

    window.optionList.on("item_click", function(icon) {

        switch (icon) {
            case optionList[0]:
                if (optionList[0] == "@drawable/ic_assignment_black_48dp") {
                    Combat_report.view_show();
                    return
                }
                if (tool.script_locate("progra")) {
                    toast("请先点击" + window.name.text() + "右侧的图标暂停");
                    return;
                };
                tool.writeJSON("侧边", "宿舍");
                继续();
                break;

        };
    });



};




function 执行次数() {
    helper = tool.readJSON("helper");
    let rewriteView = ui.inflate(
        <vertical padding="10 0">
            <View bg="#ffffff" h="1" w="auto" />
            
            <View bg="#000000" h="1" w="auto" />
            <Switch  id="depletion_serum"
            checked="{{helper.血清}}"
            text="{{language['depletion_serum']}}"
            padding="6 6 6 6"
            textSize="16"
            />
            <Switch id="auto_use_serum"
            checked="{{helper.自动2血清}}"
            text="{{language.main['auto_use_serum']}}"
            padding="6 6 6 6"  textSize="16" textColor="{{theme.text}}"
            />
            <radiogroup id="depletion_way" orientation="horizontal" h="auto" visibility="{{helper.血清 ? 'visible' : 'gone'}}">
                <radio id="depletion_way1" text="{{language['depletion_way1']}}" w="auto"  />
                <spinner id="resources_type" textSize="16" entries="{{language.main['resources_type']}}"
                layout_gravity="right|center" w="auto" h="20dp" visibility="gone" />
                <radio id="depletion_way2" text="{{language['depletion_way2']}}" w="auto"  />
            </radiogroup>
            <Switch id="ysrh" checked="{{helper.黑卡}}" text="仅使用药剂恢复血清" visibility="gone" padding="6 6 6 6" textSize="16sp" />
            
            <horizontal gravity="center" marginLeft="5">
                <text id="mr1" text="挑战上限:" textSize="15" textColor="#212121" />
                <input id="input_challenge" inputType="number" hint="{{helper.挑战次数}}次" layout_weight="1" paddingLeft="6" w="auto" />
                <text id="mr2" text="磕药/黑卡:" textSize="15" textColor="#212121" />
                <input id="input_serum" inputType="number" hint="{{helper.注射血清}}个" layout_weight="1" w="auto" />
            </horizontal>
            <linear >
                <button id="buiok" text="确认设置" margin="0 -5 0 -4" layout_weight="1" style="Widget.AppCompat.Button.Colored" h="auto" />
            </linear>
        </vertical>, null, false);
    var rewriteDialogs = dialogs.build({
        customView: rewriteView,
        wrapInScrollView: false,
        autoDismiss: true
    }).on("dismiss", (dialog) => {
        rewriteView = null;
        rewriteDialogs = null;
    })
    if (!helper.战斗.活动) {
        rewriteView.depletion_way1.checked = true;
        rewriteView.resources_type.setVisibility(0);
        let 资源类型 = language.main.resources_name.split("|");
        资源类型 = 资源类型.indexOf(helper.战斗.资源名称);
        if (资源类型 != -1) {
            rewriteView.resources_type.setSelection(资源类型);
        }
    } else {
        rewriteView.depletion_way2.checked = true;

    }

    rewriteView.depletion_serum.on("click", function(view) {
        checked = view.checked;
        rewriteView.depletion_way.setVisibility(checked ? 0 : 8);
        rewriteView.auto_use_serum.setVisibility(checked ? 0 : 8);
        //    rewriteView.depletion_manage.setVisibility(checked ? 0 : 8)
        tool.writeJSON("血清", checked);
    })

    rewriteView.auto_use_serum.on("click", function(view) {
        checked = view.checked;
        tool.writeJSON("自动2血清", checked);
    })


    rewriteView.depletion_way1.on("check", function(checked) {
        rewriteView.resources_type.setVisibility(checked ? 0 : 8);
        helper.战斗.活动 = !checked;
        tool.writeJSON("战斗", helper.战斗);
    });
    rewriteView.depletion_way2.on("check", function(checked) {
        if (checked) toastLog("暂时不支持此次活动材料");
    });

    let updater;
    rewriteView.resources_type.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener({
        onItemSelected: function(parent, view, resources_name, id) {
            if (!updater) {
                updater = true;
                return
            }
            resource_name = language.main.resources_name.split("|")[resource_name];

            helper.战斗.资源名称 = resource_name;
            tool.writeJSON("战斗", helper.战斗);
        }
    }));


    rewriteView.ysrh.on("check", (checked) => {
        tool.writeJSON("黑卡", checked);
    });
    rewriteView.buiok.on("click", () => {
        输入框事件()
    });


    rewriteView.input_challenge.on("key", function(keyCode, event) {
        if (event.getAction() == 0 && keyCode == 66) {
            输入框事件()
            event.consumed = true;
        }
    });
    rewriteView.input_serum.on("key", function(keyCode, event) {
        if (event.getAction() == 0 && keyCode == 66) {
            输入框事件()
            event.consumed = true;
        }
    });


    rewriteDialogs.show()

    function 输入框事件() {

        var rwt = rewriteView.input_challenge.text(),
            rwt2 = rewriteView.input_serum.text();

        if (rwt.length > 3) {
            rewriteView.input_challenge.setError("最高999次");
            return
        };

        if (rwt2.length > 2) {
            rewriteView.input_serum.setError("使用药剂、黑卡\n恢复血清最高99个");
            return
        };
        if (rwt2.length > 0) {
            tool.writeJSON("注射血清", rwt2)
            record("设置了磕药/黑卡：" + rwt2 + "个");
        } else {
            rewriteView.input_serum.setError("请输入数字");
        };

        if (rwt.length > 0) {
            tool.writeJSON("挑战次数", rwt);
            record("设置了挑战次数上限：" + rwt + "次");
        } else {
            rewriteView.input_challenge.setError("请输入数字");
        };



        if (rwt.length == 0 && rwt2.length == 0) {
            toastLog("没有输入任何内容，仅生效部分选项");
        }
        rwt = null;
        rwt2 = null;
        ui.run(function() {
            helper = tool.readJSON("helper");
            window.tod.setText("挑战：可挑战次数:" + helper.挑战次数);
            window.tof.setText("血清：可使用:" + helper.注射血清 + "&已使用:" + helper.已注射血清);

            rewriteView.input_challenge.setHint(" " + helper.挑战次数);

            rewriteView.input_serum.setHint(" " + helper.注射血清);
            rewriteView.input_challenge.setText("");
            rewriteView.input_serum.setText("");


        });
        rewriteDialogs.dismiss();

    }
}

function 主页设置() {
    helper = tool.readJSON("helper");

    let setupView = ui.inflate(
        <vertical margin="10 0">
            {/* <Switch id="dorm_series" checked="{{helper.宿舍系列}}" text="{{language.dorm_series}}" padding="6 6 6 6" textSize="16sp" />*/}
            <Switch  id="aide_ac"
            checked="{{helper.助理交流}}"
            text="{{language.main['aide_ac']}}"
            padding="6 6 6 6" textSize="16" textColor="{{theme.text}}"
            />
            <card w="*"  h="*" cardCornerRadius="1"
            cardElevation="0dp" gravity="center_vertical" cardBackgroundColor="#00000000" >
            <vertical>
                <horizontal id="brilliant_calculations" clipChildren="false" elevation="0" gravity="center_vertical" margin="6 0" bg="#00000000" h="40">
                    <text  gravity="center" textSize="16" text="{{language.main['brilliant_calculations']}}" textColor="{{theme.text}}" />
                    <text layout_weight="1" />
                    <Switch id="_brilliant_calculations"  checked="{{helper.brilliant_calculations.启用}}" />
                    
                    <img id="brilliant_calculations_img" src="@drawable/ic_keyboard_arrow_down_black_48dp" layout_gravity="right|center_vertical" w="{{px2dp(120)}}" h="*" padding="-3 -8" tint="{{theme.text}}" />
                </horizontal>
            </vertical>
        </card>
        
        <card w="*"  h="*" cardCornerRadius="1"
        cardElevation="0dp" gravity="center_vertical" cardBackgroundColor="#00000000" >
        <vertical>
            <horizontal id="dorm_series" clipChildren="false" elevation="0" gravity="center_vertical" margin="6 0" bg="#00000000" h="40">
                <text  gravity="center" textSize="16" text="{{language['dorm_series']}}" textColor="{{theme.text}}" />
                <text layout_weight="1" />
                <img id="claim_rewards_img" src="@drawable/ic_keyboard_arrow_down_black_48dp" layout_gravity="right|center_vertical" w="{{px2dp(120)}}" h="*" padding="-3 -8" tint="{{theme.text}}" />
            </horizontal>
        </vertical>
        </card>
        
        <card w="*"  h="*" cardCornerRadius="1"
        cardElevation="0dp" gravity="center_vertical" cardBackgroundColor="#00000000" >
        <vertical>
            <horizontal id="norman_revival_war" clipChildren="false" elevation="0" gravity="center_vertical" margin="6 0" bg="#00000000" h="40">
                <text  gravity="center" textSize="16" text="{{language.main['norman_revival_war']}}" textColor="{{theme.text}}" />
                <text layout_weight="1" />
                <img src="@drawable/ic_keyboard_arrow_down_black_48dp" layout_gravity="right|center_vertical" w="{{px2dp(120)}}" h="*" padding="-3 -8" tint="{{theme.text}}" />
            </horizontal>
        </vertical>
        </card>
        <card w="*"  h="*" cardCornerRadius="1"
        cardElevation="0dp" gravity="center_vertical" cardBackgroundColor="#00000000" >
        <vertical>
            <horizontal id="phantom_pain_cage" clipChildren="false" elevation="0" gravity="center_vertical" margin="6 0" bg="#00000000" h="40">
                <text  gravity="center" textSize="16" text="{{language.main['phantom_pain_cage']}}" textColor="{{theme.text}}" />
                <text layout_weight="1" />
                <Switch id="_phantom_pain_cage"  checked="{{helper.phantom_pain_cage.启用}}" />
                   
                <img src="@drawable/ic_keyboard_arrow_down_black_48dp" layout_gravity="right|center_vertical" w="{{px2dp(120)}}" h="*" padding="-3 -8" tint="{{theme.text}}" />
            </horizontal>
        </vertical>
        </card>
        
        <Switch id="disputes"
        checked="{{helper.纷争战区.自动}}"
        text="{{language.main['disputes']}}"
        padding="6 6 6 6" textSize="16" textColor="{{theme.text}}"
        />
        <Switch id="lizhan_mapping"
        checked="{{helper.历战映射.启用}}"
        text="{{language.main['lizhan_mapping']}}"
        padding="6 6 6 6" textSize="16" textColor="{{theme.text}}"
        />
        <Switch id="task_award"
        checked="{{helper.任务奖励}}"
        text="{{language.main['task_award']}}"
        padding="6 6 6 6" textSize="16" textColor="{{theme.text}}"
        />
        
        <Switch id="handbook"
        checked="{{helper.手册经验}}"
        text="{{language.main['handbook']}}"
        padding="6 6 6 6" textSize="16" textColor="{{theme.text}}"
        />
        <Switch
        id="matrix_recurrence"
        checked="{{helper.matrix_recurrence}}"
        text="{{language.main['matrix_recurrence']}}"
        padding="6 6 6 6"
        textSize="16" textColor="{{theme.text}}"
        />
        <horizontal id="matrix_iteration_ranks_id" marginLeft="8" gravity="center" visibility="{{helper.matrix_recurrence ? 'visible' : 'gone'}}">
            <text  text="{{language.main['matrix_iteration_ranks']}}" textSize="16" textColor="{{theme.text}}" w="auto"  />
            <horizontal w="*" gravity="right">
                <spinner id="matrix_iteration_ranks" textSize="16" entries="{{language.main['matrix_iteration_ranks_list']}}"
                gravity="right|center" h="{{dp2px(12)}}"  />
            </horizontal>
            
        </horizontal>
        </vertical>);
    var setup = dialogs.build({
        customView: setupView,
        wrapInScrollView: true,
        autoDismiss: true
    }).on("dismiss", (dialog) => {
        setupView = null;
        setup = null;
    })

    /* setupView.dorm_series.click((view) => {
        tool.writeJSON("宿舍系列", view.checked);
    });
*/
    //    checked ? setupView.gmcs.attr("visibility", "visible") : setupView.gmcs.attr("visibility", "gone");
    updater = false;
    setupView.matrix_iteration_ranks.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener({
        onItemSelected: function(parent, view, resources_name, id) {
            if (!updater) {
                updater = true;
                return
            }
            let text = parent.getSelectedItem()
            tool.writeJSON("矩阵循生队伍", text);
        }
    }));
    setupView.disputes.on("click", function(view) {
        checked = view.checked;

        helper.纷争战区.自动 = checked;
        tool.writeJSON("纷争战区", helper.纷争战区);
    });

    setupView.lizhan_mapping.on("click", function(view) {
        checked = view.checked;

        helper.历战映射.启用 = checked;
        tool.writeJSON("历战映射", helper.历战映射);
    });

    setupView.aide_ac.on("click", function(view) {
        checked = view.checked;
        tool.writeJSON("助理交流", checked)
    });

    setupView._brilliant_calculations.on("click", function(view) {
        let _id = "brilliant_calculations";
        helper[_id]["启用"] = view.checked;
        tool.writeJSON(_id, helper[_id]);
    });

    setupView.brilliant_calculations.click(function(view) {
        let imgview = view.getChildAt(2);
        let fatherview = view.getParent();
        let _id = "brilliant_calculations";
        if (imgview.toString().indexOf("ImageView") == -1) {
            imgview = view.getChildAt(3);
        }
        if (imgview.attr("src") != "@drawable/ic_keyboard_arrow_up_black_48dp") {
            imgview.attr("src", "@drawable/ic_keyboard_arrow_up_black_48dp");

            for (let k in helper[_id]) {

                addview = ui.inflate(
                    '\ <Switch checked="' + helper[_id][k] + '" hint="' + k + '" text="' + language.main[_id + "_" + k] + '"  textSize="16" textColor="{{theme.text}}" padding="6 6 6 6" />', fatherview)
                fatherview.addView(addview, fatherview.getChildCount());
                fatherview.getChildAt(fatherview.getChildCount() - 1).click((view) => {
                    let id_ = view.getHint();
                    helper[_id][id_] = view.checked;

                    tool.writeJSON(_id, helper[_id]);

                });

            }

            fatherview.getParent().setCardElevation(1);
            //        log(fatherview.getChildAt(1).getChildAt(0))
        } else {
            //删除视图监听、视图对象
            for (let i = fatherview.getChildCount() - 1; i > 0; i--) {
                fatherview.getChildAt(i).removeAllListeners()
                fatherview.removeView(fatherview.getChildAt(i));
            }
            fatherview.getParent().setCardElevation(0);
            imgview.attr("src", "@drawable/ic_keyboard_arrow_down_black_48dp");
        }


    });


    setupView.task_award.on("click", function(view) {
        checked = view.checked;
        tool.writeJSON("任务奖励", checked)
    })
    setupView.handbook.on("click", function(view) {
        checked = view.checked;
        tool.writeJSON("手册经验", checked)
    });

    setupView.matrix_recurrence.on("click", function(view) {
        checked = view.checked;
        if (checked) {
            use.Dialog_Tips(language.main.warm_tips, language.main.matrix_recurrence_tips);
        }
        setupView["matrix_iteration_ranks_id"].setVisibility(checked ? 0 : 8);

        helper.matrix_recurrence = checked;
        tool.writeJSON("matrix_recurrence", helper.matrix_recurrence);
    })

    setupView.dorm_series.click(function(view) {
        // let index = parent.getParent().indexOfChild(0);
        let imgview = view.getChildAt(2);
        let fatherview = view.getParent();
        if (imgview.attr("src") != "@drawable/ic_keyboard_arrow_up_black_48dp") {
            imgview.attr("src", "@drawable/ic_keyboard_arrow_up_black_48dp");
            for (let i in helper.宿舍系列) {
                let addview = ui.inflate(
                    '\ <Switch checked="' + helper.宿舍系列[i].启用 + '" hint="' + i + '" text="' + language.main[i] + '"  textSize="16" textColor="{{theme.text}}" padding="6 6 6 6" />', fatherview)
                fatherview.addView(addview, fatherview.getChildCount());
                fatherview.getChildAt(fatherview.getChildCount() - 1).click((view) => {
                    helper.宿舍系列[view.getHint()].启用 = view.checked;
                    if (view.getHint() == "touch_role") {
                        helper.宿舍系列[view.getHint()].lastExecutionTime = false;
                    } else {
                        helper.宿舍系列[view.getHint()].执行状态 = false;
                    }
                    tool.writeJSON("宿舍系列", helper.宿舍系列);

                });
                for (let k in helper.宿舍系列[i]) {
                    if (k == "启用" || k == "执行状态" || typeof helper.宿舍系列[i][k] == "string") {
                        continue;
                    }
                    addview = ui.inflate(
                        '\ <Switch checked="' + helper.宿舍系列[i][k] + '" hint="' + (i + ',' + k) + '" text="' + language.main[k] + '"  textSize="16" textColor="{{theme.text}}" padding="6 6 6 6" />', fatherview)
                    fatherview.addView(addview, fatherview.getChildCount());
                    fatherview.getChildAt(fatherview.getChildCount() - 1).click((view) => {
                        let id_ = view.getHint().split(",");
                        helper.宿舍系列[id_[0]][id_[1]] = view.checked;

                        tool.writeJSON("宿舍系列", helper.宿舍系列);

                    });
                }
            }

            fatherview.getParent().setCardElevation(1);
            //        log(fatherview.getChildAt(1).getChildAt(0))
        } else {
            //删除视图监听、视图对象
            for (let i = fatherview.getChildCount() - 1; i > 0; i--) {
                fatherview.getChildAt(i).removeAllListeners()
                fatherview.removeView(fatherview.getChildAt(i));
            }
            fatherview.getParent().setCardElevation(0);
            imgview.attr("src", "@drawable/ic_keyboard_arrow_down_black_48dp");
        }


    });


    setupView.norman_revival_war.click(function(view) {
        let imgview = view.getChildAt(2);
        let fatherview = view.getParent();
        if (imgview.attr("src") != "@drawable/ic_keyboard_arrow_up_black_48dp") {
            imgview.attr("src", "@drawable/ic_keyboard_arrow_up_black_48dp");

            for (let k in helper.norman_revival_war) {

                addview = ui.inflate(
                    '\ <Switch checked="' + helper.norman_revival_war[k] + '" hint="' + k + '" text="' + language.main["norman_revival_war_" + k] + '"  textSize="16" textColor="{{theme.text}}" padding="6 6 6 6" />', fatherview)
                fatherview.addView(addview, fatherview.getChildCount());
                fatherview.getChildAt(fatherview.getChildCount() - 1).click((view) => {
                    let id_ = view.getHint()
                    helper.norman_revival_war[id_] = view.checked;

                    tool.writeJSON("norman_revival_war", helper.norman_revival_war);

                });

            }

            fatherview.getParent().setCardElevation(1);
            //        log(fatherview.getChildAt(1).getChildAt(0))
        } else {
            //删除视图监听、视图对象
            for (let i = fatherview.getChildCount() - 1; i > 0; i--) {
                fatherview.getChildAt(i).removeAllListeners()
                fatherview.removeView(fatherview.getChildAt(i));
            }
            fatherview.getParent().setCardElevation(0);
            imgview.attr("src", "@drawable/ic_keyboard_arrow_down_black_48dp");
        }


    });

setupView._phantom_pain_cage.on("click", function(view) {
    let _id = "phantom_pain_cage";
    helper[_id]["启用"] = view.checked;
    tool.writeJSON(_id, helper[_id]);
});
    setupView.phantom_pain_cage.click(function(view) {
        let imgview = view.getChildAt(3);
        let fatherview = view.getParent();
        if (imgview.attr("src") != "@drawable/ic_keyboard_arrow_up_black_48dp") {
            imgview.attr("src", "@drawable/ic_keyboard_arrow_up_black_48dp");

            for (let k in helper.phantom_pain_cage) {
                if (k.indexOf("组") == 1) {
                    continue;
                }
                addview = ui.inflate(
                    '\ <Switch checked="' + helper.phantom_pain_cage[k] + '" hint="' + k + '" text="' + language.main["phantom_pain_cage_" + k] + '"  textSize="16" textColor="{{theme.text}}" padding="6 6 6 6" />', fatherview)
                fatherview.addView(addview, fatherview.getChildCount());
                fatherview.getChildAt(fatherview.getChildCount() - 1).click((view) => {
                    let id_ = view.getHint();

                    if (language.main["phantom_pain_cage_" + id_ + "_tips"] && view.checked) {
                        use.Dialog_Tips(language.main.phantom_pain_cage, language.main["phantom_pain_cage_" + id_ + "_tips"]);
                    }
                    helper.phantom_pain_cage[id_] = view.checked;

                    tool.writeJSON("phantom_pain_cage", helper.phantom_pain_cage);

                });

            }

            fatherview.getParent().setCardElevation(1);
            //        log(fatherview.getChildAt(1).getChildAt(0))
        } else {
            //删除视图监听、视图对象
            for (let i = fatherview.getChildCount() - 1; i > 0; i--) {
                fatherview.getChildAt(i).removeAllListeners()
                fatherview.removeView(fatherview.getChildAt(i));
            }
            fatherview.getParent().setCardElevation(0);
            imgview.attr("src", "@drawable/ic_keyboard_arrow_down_black_48dp");
        }


    });
    if (helper.matrix_recurrence) {
        let matrix_iteration_ranks_list = language.main.matrix_iteration_ranks_list.split("|");
        setupView.matrix_iteration_ranks.setSelection((matrix_iteration_ranks_list.indexOf(helper.矩阵循生队伍) != -1) ? matrix_iteration_ranks_list.indexOf(helper.矩阵循生队伍) : 0);

    }
    setup.show();

}


function 暂停(form) {
    //  themeJs = "night";
    form = form || "无";
    功能图标[0] = "@drawable/ic_play_circle_outline_black_48dp";

    ui.run(function() {
        window.功能.setDataSource(功能图标);

    });

    //判断不是手动暂停的

    if (eliminate == false) {
        try {
            if (helper.静音 == true && helper.当前音量 != false) {
                device.setMusicVolume(helper.当前音量)
                tool.writeJSON("当前音量", false);
            }
        } catch (err) {
            console.error("恢复音量失败" + err)
        }

    }

    $settings.setEnabled('foreground_service', false);

    use.progra = tool.script_locate("progra");
    if (use.progra) {
        use.progra.emit("暂停", "结束程序");
        eliminate = false;
        ui.run(function() {
            if (window.tos) {
                window.tos.setText("状态：主程序暂停中");
            }
        });
        setTimeout(function() {
            use.progra = tool.script_locate("progra");
            if (use.progra) {
                console.verbose("强行终止progra")
                use.progra.forceStop();
            }

        }, 1000)
    }


};

function 继续() {
    功能图标[0] = "@drawable/ic_pause_circle_outline_black_48dp";

    ui.run(function() {
        window.功能.setDataSource(功能图标);
        window.tos.setText("状态：等待程序重启中");

        if (helper.最低电量) {
            if (!device.isCharging() && device.getBattery() < helper.最低电量) {
                toast("警告:电量低于设定值" + helper.最低电量 + "%且未充电");
                console.error("警告:电量低于设定值" + helper.最低电量 + "%且未充电");
                device.vibrate(1500);
                window.tos.setText("警告：电量低且未充电");
            };
        };
        helper = tool.readJSON("helper");
        程序();
    });

};

function zoom(x) {
    var v;
    if (!helper.模拟器) {
        //  /2*0.9/520
        v = device.width / 2 * size / 420;
    } else {
        v = device.height / 2 * size / 420;
    }
    return parseInt(x * v)
    //  return Math.floor((device.width / 1080) * n);
};

function 隐藏主界面(callback) {
    ui.post(() => {
        旋转动画(window.windowOperate, 720, 'z', 1200);
    });
    const fps = 10;
    var fpsH = layoutAttribute.whole.h / fps;
    var fpsW = layoutAttribute.whole.w / fps;
    var fpsX = (window.getX() - layoutAttribute.whole.x) / fps;
    var fpsY = (window.getY() - layoutAttribute.whole.y) / fps;
    for (let i = fps - 1; i >= 0; i--) {
        let h = layoutAttribute.windowOperate.h + fpsH * i;
        let w = layoutAttribute.windowOperate.w + fpsW * i;
        let x = layoutAttribute.whole.x + fpsX * i;
        let y = layoutAttribute.whole.y + fpsY * i;
        ui.post(() => {
            window.setPosition(x, y);
            window.setSize(w, h);
        });
        sleep(200 / fps);
    };
    ui.post(() => {
        window.homepage.setVisibility('8');
        window.disableFocus()
    });
    if (callback) callback(true);
};

function 展开主界面(callback) {
    ui.post(() => {
        旋转动画(window.windowOperate, -720, 'z', 1200);
        window.homepage.setVisibility('0');
    });
    var fps = 10;
    var fpsH = (layoutAttribute.whole.h - layoutAttribute.windowOperate.h) / fps;
    var fpsW = (layoutAttribute.whole.w - layoutAttribute.windowOperate.w) / fps;
    for (let i = fps - 1; i >= 0; i--) {
        let h = layoutAttribute.whole.h - fpsH * i;
        let w = layoutAttribute.whole.w - fpsW * i;
        let x = window.getX() + w > screenAttribute.w ? screenAttribute.w - w : layoutAttribute.whole.x;
        let y = window.getY() + h > screenAttribute.h ? screenAttribute.h - h : layoutAttribute.whole.y;
        ui.post(() => {
            window.setPosition(x, y);
            window.setSize(w, h);
        });
        sleep(200 / fps);
    };
    if (callback) callback(true);
};

function 悬浮窗复位() {
    let fps = 60;
    var aim = [layoutAttribute.whole.iniX, layoutAttribute.whole.iniY];
    let nowXY = [window.getX(), window.getY()];
    let fpsXY = [(aim[0] - window.getX()) / fps, (aim[1] - window.getY()) / fps];
    let re = /\d+/;
    for (var i = 0; i <= fps; i++) {
        let sX = nowXY[0] + fpsXY[0] * i;
        let sY = nowXY[1] + fpsXY[1] * i;
        if (re.exec(aim[0] - window.getX()) < 10 && re.exec(aim[1] - window.getY()) < 5) {
            break
        }
        ui.run(() => {
            window.setPosition(sX, sY);
        })

        sleep(100 / fps);
    };
    layoutAttribute.whole.x = window.getX();
    layoutAttribute.whole.y = window.getY();
};

function 旋转动画(控件, 角度, 方向, 时间) {
    var animator = ObjectAnimator.ofFloat(控件, 方向 == 'x' ? 'rotationX' : 方向 == 'y' ? 'rotationY' : 'rotation', 0, 角度, 角度);
    animator.setDuration(时间);
    animator.start();
};

function 旋转监听() {
    //screenAttribute.direction == "横屏" ? (screenAttribute.w = device.width, screenAttribute.h = device.height - screenAttribute.titleH) : (screenAttribute.h = device.width, screenAttribute.w = device.height - screenAttribute.titleH);
    setInterval(() => {
        let getDirection = 获取屏幕方向();
        if (getDirection != screenAttribute.direction) {
            screenAttribute.direction = getDirection;
            // screenAttribute.direction == "竖屏" ? (screenAttribute.w = device.width, screenAttribute.h = device.height - screenAttribute.titleH) : (screenAttribute.h = device.width, screenAttribute.w = device.height - screenAttribute.titleH);
            threads.start(function() {
                悬浮窗复位();
            })
        };
    }, 1000);
};


function 获取屏幕方向() {
    /*
        let wmanager_width = new ContextWrapper(context).getSystemService(context.WINDOW_SERVICE).getDefaultDisplay().getWidth();
         log(wmanager_width)
         if((wmanager_width-device.width) >= 250){
             return "横屏";
         }else{
             return "竖屏";
         }*/

    if (context.resources.configuration.orientation == 2) {
        //横屏
        return "横屏";
    } else if (context.resources.configuration.orientation == 1) {
        //竖屏
        return "竖屏";
    }
};


程序();

function 程序(implem) {
    helper = tool.readJSON("helper");
    ui.post(() => {
        if (!helper.血清) {
            window.name.setText("宿舍系列")
        }
        if (!helper.宿舍系列) {
            window.name.setText("战斗任务")
        }
        window.tod.setText("挑战：可挑战次数:" + helper.挑战次数);
        window.tof.setText("血清：可使用:" + helper.注射血清 + "&已使用:" + helper.已注射血清);
    })
    if (pane.初始暂停) {
        threads.start(暂停);
        ui.run(function() {
            window.tos.setText("状态：主程序暂停中");
        })
        pane = false;
        tool.writeJSON("初始暂停", false, "pane");
    } else {
        eliminate = false;
        ui.post(() => {
            console.verbose("开始运行")
            engines.execScriptFile("./progra.js", {
                delay: 200,
                path: files.path('./'),
            });
        }, 200)
        setTimeout(function() {
            if (!eliminate) {
                if (tool.script_locate("progra") == false) {
                    /*
                    if (files.read("./mrfz/Byte.txt") == "true") {
                        files.write("./mrfz/Byte.txt", "false");
                        return;
                    }
                    */
                    if (window) {
                        switch (window.tos.text()) {
                            case "状态：主程序暂停中":
                                break
                            case "状态：识别结束，暂停中":
                                break;
                            case "状态：暂停，未安装插件":
                                break;
                            default:
                                toastLog("PGRAssistant启动失败，请尝试重新启动");
                                暂停();
                                ui.run(function() {
                                    window.tos.setText("状态：PGRAssistant启动失败");
                                })
                                return
                        }
                    }
                }
            }
            return
        }, 5000);

    }
}

threads.start(function() {
    events.on("暂停", function(words) {
        暂停();
        switch (words) {
            case "状态异常":
                ui.run(function() {
                    window.tos.setText("状态：异常，超时暂停处理");
                });
                home();
                home();
                break
            case "低电量":
                if (helper.公告 == true) {
                    关闭应用(helper.执行, "电量低于设定值且未充电");
                } else {
                    ui.run(function() {
                        window.tos.setText("状态：暂停，电量低且未充电");
                    })
                }
                break
            case "关闭程序":
                toastLog("停止悬浮窗及PGRAssistant中...")
                exit();
                break
        }
    });

    setTimeout(function() {
        events.on("展示文本", function(words, text) {
            if (eliminate) {
                return
            }
            switch (words) {
                case "状态":
                    ui.run(function() {
                        window.tos.setText(text);
                    });
                    break;
                case "挑战":
                    ui.run(function() {
                        window.tod.setText(text);
                    });
                    break;
                case "血清":
                    ui.run(function() {
                        window.tof.setText(text);
                    });
                    break;

                default:
                    text = "无法处理传递的悬浮窗展示文本:" + words
                    toast(text)
                    console.error(text)
                    break;
            }
        });

        events.on("面板", function(words, xy) {

            switch (words) {
                case "id":
                    ui.run(function() {
                        window.name.setText(xy);
                    });
                    break
                case "展开":
                    threads.start(function() {
                        layoutAttribute.homepage.show = true;
                        展开主界面();
                    })

                    break;
                case "隐藏":
                    threads.start(function() {
                        layoutAttribute.homepage.show = false;
                        隐藏主界面();
                    })
                    break;
                case "复位":
                    threads.start(function() {
                        悬浮窗复位();
                    })
                    break;
                case "触摸":
                    xy ? log("修改为可触摸") : log("修改为不可触摸");
                    if (xy) {
                        window.setTouchable(true);
                    } else {
                        window.setTouchable(false);
                    }
                    break
                case "位置":
                    try {
                        //示例: {"x":200,"y":300"}
                        if (typeof xy != "object") {
                            toastLog("不是对象");
                            return
                        }
                        setTimeout(function() {
                            layoutAttribute.whole.x = window.getX();
                            layoutAttribute.whole.y = window.getY();
                        }, 500)

                        window.setPosition(xy.x, xy.y);
                    } catch (err) {
                        toast("设置面板位置异常：" + err)
                        console.error("设置面板位置异常：" + err)
                    }
                    break

            }
        });

        console.verbose("悬浮窗加载完成")

    }, 500);
})