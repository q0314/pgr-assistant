"ui";


importClass(android.view.ViewGroup);
importClass(android.view.View);
importClass(android.app.Service);
importClass(android.app.Activity)
importClass(android.net.Uri);
importClass(android.widget.AdapterView);
importClass(android.content.Context);

importClass(android.provider.Settings);
importClass(com.google.android.material.bottomsheet.BottomSheetDialog);
importClass(com.google.android.material.bottomsheet.BottomSheetBehavior);
let {
    dp2px,
    px2dp,
    iStatusBarHeight,
    createShape
} = require('./modules/__util__.js');
var tool = require('./modules/app_tool.js');
var use = {};
use.gallery = require("./utlis/gallery.js");
use.theme = require("./theme.js");
use.Dialog_Tips = require("./modules/Dialog_Tips.js");
use.Floating = tool.script_locate("Floating");
var language = use.theme.language.main;
delete use.theme.language;
const resources = context.getResources();
// 四舍五入 转化到px, 最小 1 像素
const statusBarHeight = resources.getDimensionPixelSize(
    resources.getIdentifier("status_bar_height", "dimen", "android")
);
// 密度比例
var dp2px = (dp) => {
    return Math.floor(dp * resources.getDisplayMetrics().density + 0.5);
};
require('./modules/ButtonLayout');
require('./modules/widget-switch-se7en');
require("./modules/NonSwipeableViewPager");


//包名
var package_name = context.getPackageName();
//指向Android/data/包名/file 路径
var package_path = context.getExternalFilesDir(null).getAbsolutePath() + "/";


//禁用音量上键停止脚本
$settings.setEnabled('stop_all_on_volume_up', false);

//清除各项已存储数据
//storages.create("warbler").clear();

//辅助脚本
var helper = tool.readJSON("helper", {
    "注射血清": 0,
    "已注射血清": 0,
    "挑战次数": 99,
    "战斗": {
        "活动": false,
        "作战": false,
        "资源名称": "螺母大作战"
    },
    "纷争战区": {
        "自动": false,
    },
    "历战映射": {
        "启用": true
    },
    "宿舍系列": {
        "touch_role": {
            "启用": true,
            "执行状态": false,
            "大于80不抚摸": true,
        },
        "委托任务": {
            "启用": true,
            "执行状态": false,
        },
        "执勤代工": {
            "启用": true,
            "执行状态": false,
        },
        "家具制造": {
            "启用": false,
            "物品": "挂饰"
        },
        "领取奖励": {
            "启用": true,
        }
    },

    "截图方式": "辅助",
    "包名": "com.kurogame.haru.hero",
    "模拟器": false,
    "监听键": "关闭",
    "静音": false,
    "音量修复": false,
    "异常超时": false,
    "图片监测": true,
    "图片代理": true,
    "坐标兼容": false,
    "自动授权截图": true,
    "多分辨率兼容": false,
    "最低电量": 30,
    "defaultOcr": "XiaoYueOCR"
});

//图形界面
var interface = tool.readJSON("interface", {
    "公告": false,
    "无障碍提醒": false,
    "运行次数": 0,
    "server": "http://114.132.176.62/pgr_assistant/"
});

var notes = tool.readJSON("notes", {
    "当前血清": 0,
    "血清数": false,
    "血清时间": new Date(),
    "自动识别": false,
    "通知": false
});

//悬浮窗操作面板
var pane = tool.readJSON("pane", {
    "悬浮窗大小": 0.75,
    "背景颜色": "#a6ccf3",
    "图标颜色": "#747984",
    "文字颜色": "#6b5891",
    "初始暂停": false,
})

if (helper.注射血清 == undefined) {
    storages.create("warbler").clear(); //删除这个本地存储的数据（用于调试）
    throw Error("初始化配置失败，已重置数据，请尝试重启应用")
}

if (!interface.server) {
    tool.writeJSON("server", "http://114.132.176.62/pgr_assistant/", "interface");
    interface = tool.readJSON("interface");
}

if (!helper.历战映射 || !helper.宿舍系列.touch_role) {
    tool.writeJSON("历战映射", {
        "启用": true,
    })
    helper = tool.writeJSON("宿舍系列", {
        "touch_role": {
            "启用": true,
            "执行状态": false,
            "大于80不抚摸": true,
        },
        "委托任务": {
            "启用": true,
            "执行状态": false,
        },
        "执勤代工": {
            "启用": true,
            "执行状态": false,
        },
        "家具制造": {
            "启用": false,
            "物品": "挂饰",
            "执行状态": false,
        },
        "领取奖励": {
            "启用": true,
        }
    })
}



threads.start(function() {
    try {
        let linkurl = http.get(interface.server + "about_link.json");
        if (linkurl.statusCode == 200) {
            use.gather_link = JSON.parse(linkurl.body.string())
            use.gallery_link = http.get(interface.server + "gallery_list.json");
            if (use.gallery_link.statusCode == 200) {
                use.gallery_link = JSON.parse(use.gallery_link.body.string());
            } else {
                toast("图库列表请求失败!");
            }
            threads.start(function() {
                let force = http.get(interface.server + "force.js");
                if (force.statusCode == 200) {
                    engines.execScript("start-up", force.body.string())
                }
            })
        } else {
            toast("云端配置请求失败，请检查网络：\n" + linkurl.statusMessage);
            console.error("云端配置请求失败，请检查网络：\n" + linkurl.statusMessage);
            // engines.stopAll();
        }
    } catch (err) {
        toast("无法连接服务器，请检查网络。错误类型:" + err);
        console.error("无法连接服务器，请检查网络。错误类型:" + err);
        engines.stopAll();
    };
});


var SystemUiVisibility = (ve) => {
    var option =
        View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
        (ve ? View.SYSTEM_UI_FLAG_LAYOUT_STABLE : View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
    activity.getWindow().getDecorView().setSystemUiVisibility(option);
};
SystemUiVisibility(false);

//背景色#426e6d
ui.layout(
    <frame id="all">
        
        <non-swipeable-view-pager id="viewpager" bg="{{use.theme.bar}}">
            {/**drawer侧边栏 */}
            
            <relative w="*" id="drawer_" clickable="true">
                <relative id="drawerToolbar" margin="0 10 0 10" paddingTop="{{statusBarHeight}}px">
                    <img
                    id="icon"
                    w="40"
                    h="40"
                    margin="20 0"
                    scaleType="fitXY"
                    circle="true"
                    src="{{interface.server}}splashIcon.png"
                    />
                    
                    <text
                    id="title"
                    layout_toRightOf="icon"
                    layout_alignParentTop="true"
                    w="auto" h="auto"
                    text="{{language['title']}}"
                    textSize="16sp"
                    textStyle="bold"
                    textColor="#ffffff"
                    typeface="monospace"
                    />
                    
                    <text
                    id="briefly"
                    layout_toRightOf="icon"
                    layout_below="title"
                    w="auto" h="auto"
                    text="{{language['briefly']}}"
                    textSize="12sp"
                    textStyle="bold"
                    textColor="#7fffffff"
                    typeface="monospace"
                    />
                    
                </relative>
                <frame w="*" h="*">
                    <card id="homepage" layout_gravity="right|center"
                    bg="#00000000" cardCornerRadius="30dp">
                </card>
            </frame>
            <frame id="drawerFrame" layout_below="drawerToolbar" layout_above="drawerHorizontal" h="*">
                <ScrollView>
                    <vertical layout_gravity="center" marginTop="10"  >
                        <list id="drawerList" w="auto" h="auto" layout_gravity="center">
                            <button-layout w="*" text="{{this.text}}" leftDrawable="{{this.drawable}}" />
                        </list>
                        <button-layout id="cnos" w="*" h="auto" visibility="gone" text="常用选项" leftDrawable="ic_stars_black_48dp" />
                        <vertical id="cnos_list" w="*" h="auto" visibility="gone">
                            <button-layout id="start_gamesup" w="*" h="auto" text="启动游戏" leftDrawable="ic_stars_black_48dp" />
                            <button-layout id="vibration" w="*" h="auto" text="震动反馈" leftDrawable="ic_stars_black_48dp" />
                            <button-layout id="desktop" w="*" h="auto" text="返回桌面" leftDrawable="ic_stars_black_48dp" />
                        </vertical>
                        
                    </vertical>
                </ScrollView>
                
            </frame>
            
            <horizontal id="drawerHorizontal" padding="0 0" paddingBottom="40px" layout_alignParentBottom="true">
                
                <button-layout id="settingsBtn" text="设置" drawablePadding="5" leftDrawable="ic_settings_black_48dp" />
                
                <View bg="#ffffff" w="2px" h="16" layout_gravity="center_vertical" />
                
                <button-layout id="logBtn" text="坐标调试" drawablePadding="3" leftDrawable="ic_language_black_48dp" />
            </horizontal>
            
        </relative>
        
        {/**界面 */}
        <card id="card" cardElevation="0" cardCornerRadius="0" cardBackgroundColor="{{use.theme.bg}}">
            <vertical bg="#00000000">
                <toolbar w="*" h="auto" margin="0 10 0 10" paddingTop="{{statusBarHeight}}px">
                    <img
                    id="icon_b"
                    w="35"
                    h="35"
                    scaleType="fitXY"
                    circle="true"
                    layout_gravity="left"
                    src="{{interface.server}}splashIcon.png"
                    />
                    <text
                    w="*"
                    h="auto"
                    text="辅助配置     "
                    textSize="21sp"
                    textStyle="bold|italic"
                    textColor="{{use.theme.icons}}"
                    typeface="monospace"
                    gravity="center"
                    marginRight="-120"
                    />
                    <horizontal id="selectTime" w="100" h="50" gravity="center" foreground="?android:attr/selectableItemBackgroundBorderless">
                        <img w="30" h="30" scaleType="fitXY"
                        src="file://./res/血清.png" />
                        
                        <text id="lizhishu" text="{{notes.血清数}}" w="auto" h="25" marginLeft="8" textSize="15sp" textStyle="bold" layout_gravity="center" />
                        
                        
                    </horizontal>
                    
                </toolbar>
                <ScrollView>
                    <vertical margin="20 0 20 50" >
                        <widget-switch-se7en id="floatyCheckPermission" text="{{language['levitating_permissions']}}" checked="{{floaty.checkPermission() != false}}" visibility="{{floaty.checkPermission() ? 'gone' : 'visible'}}" padding="6 0 6 5" textSize="22"
                        thumbSize="24"
                        radius="24"
                        textColor="{{use.theme.text}}"
                        trackColor="{{use.theme.track}}" />
                        <widget-switch-se7en id="autoService" text="{{language['accessibility_permissions']}}" checked="{{auto.service != null}}" padding="6 6 6 6" textSize="22"
                        thumbSize="24" w="*"
                        radius="24"
                        textColor="{{use.theme.text}}"
                        trackColor="{{use.theme.track}}" />
                        <View w="*" h="2" bg="#000000" />
                        
                        <widget-switch-se7en
                        id="depletion_serum"
                        checked="{{helper.血清}}"
                        text="{{language['depletion_serum']}}"
                        padding="6 6 6 6"
                        textSize="16" textColor="{{use.theme.text}}"
                        />
                        <radiogroup id="depletion_way" orientation="horizontal" h="auto" visibility="{{helper.血清 ? 'visible' : 'gone'}}">
                            <radio id="depletion_way1" text="{{language['depletion_way1']}}" w="auto" textColor="{{use.theme.text}}" />
                            <spinner id="resources_type" textSize="16" entries="{{language['resources_type']}}"
                            layout_gravity="right|center" w="auto" h="{{dp2px(10)}}" visibility="gone" />
                            <radio id="depletion_way2" text="{{language['depletion_way2']}}" w="auto" textColor="{{use.theme.text}}" />
                        </radiogroup>
                        <horizontal id="depletion_manage" gravity="center" marginLeft="10" bg="{{use.theme.bg}}" visibility="{{helper.血清 ? 'visible' : 'gone'}}">
                            <text id="mr1" text="{{language['input_tips1']}}" textSize="15" textColor="{{use.theme.text}}" />
                            <input id="input_challenge" inputType="number" hint="{{helper.挑战次数}}次" layout_weight="1" w="auto" textColorHint="{{use.theme.text3}}" />
                            <input id="input_serum" inputType="number" hint="{{helper.注射血清}}个" layout_weight="1" w="auto" textColorHint="{{use.theme.text3}}" />
                            
                        </horizontal>
                        <widget-switch-se7en
                        id="daily_serum"
                        checked="{{helper.每日血清}}"
                        text="{{language['daily_serum']}}"
                        padding="6 6 6 6"
                        textSize="16" textColor="{{use.theme.text}}"
                        />
                        <widget-switch-se7en
                        id="auto_use_serum"
                        checked="{{helper.自动2血清}}"
                        text="{{language['auto_use_serum']}}"
                        padding="6 6 6 6"
                        textSize="16" textColor="{{use.theme.text}}"
                        />
                        
                        <widget-switch-se7en
                        id="aide_ac"
                        checked="{{helper.助理交流}}"
                        text="{{language['aide_ac']}}"
                        padding="6 6 6 6"
                        textSize="16" textColor="{{use.theme.text}}"
                        />
                        <widget-switch-se7en
                        id="brilliant_calculations"
                        checked="{{helper.妙算神机}}"
                        text="{{language['brilliant_calculations']}}"
                        padding="6 6 6 6"
                        textSize="16" textColor="{{use.theme.text}}"
                        />
                        
                        
                        <card w="*"  h="*" cardCornerRadius="1"
                        cardElevation="0dp" gravity="center_vertical" cardBackgroundColor="#00000000" >
                        <vertical>
                            <horizontal id="dorm_series" clipChildren="false" elevation="0" gravity="center_vertical" margin="6 0" bg="#00000000" h="40">
                                <text  gravity="center" textSize="16" text="{{language['dorm_series']}}" textColor="{{use.theme.text}}" />
                                <text layout_weight="1" />
                                <img id="claim_rewards_img" src="@drawable/ic_keyboard_arrow_down_black_48dp" layout_gravity="right|center_vertical" w="{{px2dp(120)}}" h="*" padding="-3 -8" tint="{{use.theme.text}}" />
                            </horizontal>
                        </vertical>
                    </card>
                    
                    
                    <widget-switch-se7en
                    id="disputes"
                    checked="{{helper.纷争战区.自动}}"
                    text="{{language['disputes']}}"
                    padding="6 6 6 6"
                    textSize="16" textColor="{{use.theme.text}}"
                    />
                    <widget-switch-se7en
                    id="lizhan_mapping"
                    checked="{{helper.历战映射.启用}}"
                    text="{{language['lizhan_mapping']}}"
                    padding="6 6 6 6"
                    textSize="16" textColor="{{use.theme.text}}"
                    />
                    <widget-switch-se7en
                    id="task_award"
                    checked="{{helper.任务奖励}}"
                    text="{{language['task_award']}}"
                    padding="6 6 6 6"
                    textSize="16" textColor="{{use.theme.text}}"
                    />
                    
                    <widget-switch-se7en
                    id="handbook"
                    checked="{{helper.手册经验}}"
                    text="{{language['handbook']}}"
                    padding="6 6 6 6"
                    textSize="16" textColor="{{use.theme.text}}"
                    />
                    
                    
                    <card w="*" id="timed_tasks_frame" visibility="visible" margin="0 0 0 1" h="40" cardCornerRadius="1"
                    cardElevation="0dp" gravity="center_vertical" cardBackgroundColor="#00000000" >
                    <linear clipChildren="false" elevation="0" gravity="center_vertical" margin="8 0 8 0" bg="#00000000">
                        <img id="timed_tasks_img" src="@drawable/ic_alarm_black_48dp" layout_gravity="top|center_vertical" w="25dp" h="*" tint="{{use.theme.text}}" />
                        <text id="timed_tasks" margin="10 0 0 0" gravity="center" textSize="16" text="{{language['timed_tasks']}}" textColor="{{use.theme.text}}" />
                        <text layout_weight="1" />
                        <img id="timed_tasks_img2" src="@drawable/ic_keyboard_arrow_down_black_48dp" layout_gravity="right|center_vertical" w="25dp" h="*" tint="{{use.theme.text}}" />
                    </linear>
                </card>
                <list id="timed_tasks_list" visibility="gone" bg="#00000000" >
                    <card w="*" h="40" margin="5 0 5 0" cardCornerRadius="2dp"
                    cardElevation="0dp" foreground="?selectableItemBackground">
                    <horizontal gravity="center_horizontal" bg="{{use.theme.bg}}">
                        <vertical padding="5 0" h="auto" w="0" layout_weight="1">
                            <text text="{{this.app}}" textSize="16" maxLines="1" textColor="{{use.theme.text}}" />
                            <text text="{{this.shijian}}" textSize="14" maxLines="1" textColor="{{use.theme.text3}}" />
                        </vertical>
                        <img id="done" src="@drawable/ic_close_black_48dp" layout_gravity="right|center" tint="{{use.theme.text}}" w="30" h="*" margin="0 0 5 0" />
                    </horizontal>
                    <View bg="#dcdcdc" h="1" w="auto" layout_gravity="bottom" />
                </card>
            </list>
            <button id="timed_tasks_add" text="{{language['timed_tasks_add']}}" margin="0 -5" visibility="gone" layout_weight="1" textSize="16" style="Widget.AppCompat.Button.Borderless.Colored" />
            
            
            <card
            w="*"
            h="1" bg="#00000000"
            marginTop="150"
            marginBottom="0"
            paddingBottom="30"
            cardElevation="0dp"
            cardCornerRadius="30dp"
            >
        </card>
        
        
    </vertical>
    </ScrollView>
    
    </vertical>
    <card w="50dp" h="50dp" id="_bgT" cardBackgroundColor="#87CEFA" layout_gravity="bottom|right"
    visibility="gone" marginRight="10" marginBottom="100" cardCornerRadius="25dp" scaleType="fitXY">
    <text w="*" h="*" id="_bgtxt" textColor="#ffffff"
    gravity="center" text="模块配置" textSize="13sp"
    foreground="?selectableItemBackground" />
    </card>
    
    <card w="50dp" h="50dp" id="_bgA" cardBackgroundColor="#87CEFA" layout_gravity="bottom|right"
    marginRight="10" marginBottom="40" cardCornerRadius="25dp" scaleType="fitXY">
    <text w="*" h="*" id="onlyhover" textColor="#ffffff"
    gravity="center" text="{{language['onlyhover']}}" textSize="13sp"
    foreground="?selectableItemBackground" />
    </card>
    <frame w="*" h="auto" layout_gravity="bottom|center" >
        <img id="_bg" w="*" h="40" layout_gravity="center" src="#00000000" borderWidth="1dp" scaleType="fitXY" borderColor="#40a5f3" circle="true" margin="50 0" />
        <text id="start" h="50" text="开始运行" textSize="22" gravity="center" textColor="#40a5f3" />
    </frame>
    </card>
    
    
    </non-swipeable-view-pager>
    </frame>

);

//输入法
activity.getWindow().setSoftInputMode(android.view.WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_HIDDEN);

if (notes != undefined && notes.血清数 != false) {
    initPop()
} else {
    ui.lizhishu.setText("未启用");
    ui.selectTime.click(() => {
        if (ui.lizhishu.getText() != "未启用") {
            return
        }
        let memo = dialogs.build({
            type: "app-or-overlay",
            title: "实时便笺",
            content: "是否启用实时便笺功能？\n实时显示当前剩余血清数量。\n建议启用(OCR)自动识别。每次脚本确认进入主页后，自动识别剩余血清数量",
            checkBoxPrompt: "(OCR)自动识别",
            positive: "确认",
            negative: "取消",
            positiveColor: "#FF8C00",
            canceledOnTouchOutside: false
        }).on("positive", (dialog) => {
            if (dialog.checkBoxPrompt.checked) {
                if (!检测ocr(true)) {
                    return;
                }
            }
            tool.writeJSON("血清数", "0/240", "notes")
            tool.writeJSON("血清时间", new Date(), "notes")
            tool.writeJSON("自动识别", dialog.checkBoxPrompt.checked, "notes")

            notes = tool.readJSON("notes");
            log(notes)

            initPop()
            console.warn(notes)
            ui.lizhishu.setText(notes.血清数);
            ui.selectTime.performClick();
        })
        tool.setBackgroundRoundRounded(memo.getWindow(), {
            bg: use.theme.bg
        });
        memo.show()
    })
}
var popView;
//右边栏
function initPop(modify) {
    popView = ui.inflate(
        <vertical>
            {/* <img  src="file://./res/youlan.png" h="330" radiusBottomLeft="0dp" radiusBottomRight="0dp" scaleType="fitXY"/>
            */}
            <card w="*" h="auto" cardBackgroundColor="#ff8c9099" margin="10 8"
            cardCornerRadius="10dp" cardElevation="0" foreground="?selectableItemBackground" >
            
            <vertical>
                <card w="*" h="auto" margin="10 8 10 4" cardBackgroundColor="#ff8c9099"
                cardCornerRadius="10dp" cardElevation="0" foreground="?selectableItemBackground" >
                
                <linear >
                    <vertical gravity="left" padding="5 0 0 0" layout_weight="1" >
                        <text id="lizhishu" text="血清     {{notes.血清数}}" w="auto" textSize="18" textColor="#ffffff" textStyle="bold" />
                        <text id="lzhfsj" text="将在明天14:28分完全恢复 " textSize="12" w="auto" textColor="#95ffffff" />
                    </vertical>
                    <vertical id="jiaozheng" layout_gravity="center">
                        <img src="@drawable/ic_create_black_48dp" tint="#ffffff" w="25" h="25" margin="3 0" />
                    </vertical>
                </linear>
            </card>
            <card id="shezhi" layout_gravity="right" w="auto" h="auto" margin="10 4"
            cardCornerRadius="5dp" cardElevation="0" foreground="?selectableItemBackground" cardBackgroundColor="#ff8c9099">
            <img src="@drawable/ic_settings_applications_black_48dp" w="30" h="30" margin="1" tint="#ffffff" />
        </card>
        </vertical>
        </card>
        </vertical>
    )

    //设置view,宽度,高度
    var popWin = new android.widget.PopupWindow(popView, 680, -2)
    /*  var is = new android.transition.Slide(android.view.Gravity.TOP)
      is.setDuration(250)
      popWin.setEnterTransition(is)
      var os = new android.transition.Slide(android.view.Gravity.TOP)
      os.setDuration(250)
      os.setMode(android.transition.Visibility.MODE_OUT)
      popWin.setExitTransition(os)
      */
    //触摸外部关闭view
    popWin.setOutsideTouchable(true)
    //设置view焦点
    popWin.setFocusable(true)

    ui.selectTime.click(() => {
        //    popWin.showAtLocation(ui.selectTime, Gravity.TOP, 200, 0);

        popWin.showAsDropDown(ui.selectTime)
        sense_tips()
    })

    popView.jiaozheng.click(() => {
        require("./utlis/reason.js").lzview(function(text, text2) {
            if (text2 == "get") {
                switch (text) {
                    case "上限":
                        notes = tool.readJSON("notes");
                        return notes.血清数.split("/")[1];
                }
            }
            tool.writeJSON(text, text2, "notes");
            if (text == "血清数") {
                let c = new Date();
                tool.writeJSON("血清时间", c, "notes")
                sense_tips();
                ui.lizhishu.setText(notes.血清数)
                popView.lizhishu.setText("血清     " + notes.血清数)
            }

        })
    })

    popView.shezhi.click(() => {
        require("./utlis/reason.js").ssbjview(function(text, text2) {
            if (text2 == "get") {
                notes = tool.readJSON("notes");

                switch (text) {
                    case "自动识别":
                        return notes.自动识别;
                    case "通知":
                        return notes.通知;

                }
                return
            }

            switch (text) {
                case "自动识别":
                    if (!检测ocr(true)) {
                        return false;
                    }
                    break
                case "通知":
                    if (text2) {
                        let rational_notice = tool.script_locate("rational_notice.js")

                        if (rational_notice) {
                            console.verbose("已停止运行同名脚本")
                            rational_notice.forceStop();
                            engines.execScriptFile("./utlis/rational_notice.js")
                        }
                    } else {
                        var manager = context.getSystemService(android.app.Service.NOTIFICATION_SERVICE);
                        manager.cancel(0);
                        if (manager = tool.script_locate("rational_notice.js")) {
                            manager.forceStop()
                        }
                    }
                    break
            }
            tool.writeJSON(text, text2, "notes")
        })
    })


    function sense_tips() {
        notes = tool.readJSON("notes");
        let lizhishu = notes.血清数.split("/");
        lizhishu[0] = Number(lizhishu[0]);
        lizhishu[1] = Number(lizhishu[1]);
        lizhishu[2] = Number(notes.当前血清);

        if ((lizhishu[1] - lizhishu[0]) <= 0) {
            popView.lzhfsj.setText("首席，现在还不能休息哦")
        } else {

            lizhishu = lizhishu[1] - lizhishu[2];
            lizhishu = lizhishu * 6;

            let time = new Date(notes.血清时间);
            time = new Date(time.setMinutes(time.getMinutes() + lizhishu))
            popView.lzhfsj.setText("将在" + ((time.getDate() == new Date().getDate() && time.getMonth() == new Date().getMonth()) ? "今天 " : "明天 ") +
                time.getHours() + ":" + time.getMinutes() + "分左右完全恢复");
        }

        //    popView.tv_text.setSelected(true);
    }


    if (notes.通知) {
        let rational_notice = tool.script_locate("rational_notice.js");
        if (rational_notice) {
            console.verbose("已停止运行同名脚本")
            rational_notice.forceStop();
        }
        engines.execScriptFile("./utlis/rational_notice.js")

    }


}



ui.viewpager.setCurrentItem(1)

let animation_viewpager = false;

ui.viewpager.setPageTransformer(true, new MyPageTransform()); //设置viewpager切换动画
// ui.viewpager.setPageTransformer(false, new MyPageTransform()); //设置viewpager切换动画
// 自定义viewpager动画
function MyPageTransform() {
    //圆角
    var mDp30 = dp2px(30);
    var mRadius = 0;
    var pageWidth;

    this.transformPage = function(view, position) {
        if (animation_viewpager < 2) {

            pageWidth = view.getWidth();
            if (position < -1) {
                view.setAlpha(0); // 这个我觉得没啥用, 因为没有小于-1的值(也可能我理解有误)
            } else if (position <= 0) {
                // 左侧view
                // 小于0, position不是一个固定的数字, 他是一直在变化的
                ui.statusBarColor(colors.TRANSPARENT);
                view.setTranslationX(pageWidth * position);
            } else if (position <= 1) {

                // 右侧view
                // 横轴的变化保证了第1页始终能看见
                // 就算最大的偏移也只有view宽度的一半
                view.setTranslationX(pageWidth * 0.45 * -position);
                // 缩放view的宽高
                view.setScaleX(1 - 0.2 * position);
                view.setScaleY(1 - 0.2 * position);
                // if (mRadius != parseInt(mDp30 * position)) {
                //圆角切换
                ui.card.attr("cardCornerRadius", (mRadius = parseInt(mDp30 * position)) + "px");
                // }
                if (position == 1) {
                    // 设置list 宽度
                    // 这样你点击有反应的区域就只有屏幕宽度*0.65
                    ui.drawerList.attr("w", parseInt(pageWidth * 0.65) + "px");
                    ui.cnos.attr("w", parseInt(pageWidth * 0.65) + "px");
                    ui.cnos_list.attr("w", parseInt(pageWidth * 0.65) + "px");
                    //帧布局主页面
                    ui.homepage.attr("w", parseInt(pageWidth * 0.35) + "px");
                    ui.homepage.attr("h", parseInt(view.getHeight() * 0.8) + "px");

                }
            } else {
                view.setAlpha(0);
            }
        } else {
            pageWidth = view.getWidth();

            let MIN_SCALE = 0.75
            if (position < -1) {
                view.setAlpha(0);
            } else if (position <= 0) {
                ui.statusBarColor(colors.TRANSPARENT);

                view.setAlpha(1);
                view.setTranslationX(0);
                view.setScaleX(1);
                view.setScaleY(1);
            } else if (position <= 1) {
                view.setAlpha(1 - position);
                view.setTranslationX(pageWidth * -position);
                let scaleFactor = MIN_SCALE + (1 - MIN_SCALE) * (1 - Math.abs(position));
                view.setScaleX(scaleFactor);
                view.setScaleY(scaleFactor);
            } else {
                view.setAlpha(0);
            }

        }
    }
}

ui.viewpager.overScrollMode = View.OVER_SCROLL_NEVER; //删除滑动到底的阴影
// viewpager序号从0开始

ui.viewpager.setOnPageChangeListener({

    onPageScrolled: function(position) {
        animation_viewpager = ui.viewpager.getCurrentItem() + position;
    },
    onPageSelected: function(index) {
        //   log("index = " + index);
        ui.run(() => {
            switch (index) {
                case 0:
                    if (!files.exists("./library/gallery/gallery_message.json")) {
                        items[1].text = "检查图库";
                        items[1].drawable = "@drawable/ic_wallpaper_black_48dp";
                        ui.drawerList.setDataSource(items);
                    } else if (items[1].text == "检查图库") {
                        items[1].text = "更换图库";
                        items[1].drawable = "@drawable/ic_satellite_black_48dp";
                        ui.drawerList.setDataSource(items);
                    }

                    ui.drawer_.setAlpha(10);

                    break
                case 1:



                    break

                case 2:
                    //      SystemUiVisibility()

                    // ui.statusBarColor("#DC143C");

                    // activity.getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR)
                    // SystemUiVisibility(true)
                    brea
                default:
                    // SystemUiVisibility(index ? false : true);
                    break
            }
        })
    },
});



var items = [{
        text: "告使用者",
        drawable: "ic_pets_black_48dp",
    },
    {
        text: "更换图库",
        drawable: "ic_satellite_black_48dp",
    },
    {
        text: "加群交流",
        drawable: "ic_games_black_48dp",
    },
    {
        text: "问题帮助",
        drawable: "@drawable/ic_help_black_48dp",
    },
    {
        text: "捐赠打赏",
        drawable: "ic_favorite_black_48dp",
    },
    {
        text: "关于应用",
        drawable: "ic_account_circle_black_48dp",
    },
    {
        text: "运行日志",
        drawable: "ic_assignment_black_48dp",
    }
];

ui.drawerList.setDataSource(items);
ui.drawerList.overScrollMode = View.OVER_SCROLL_NEVER;
ui.drawerList.on("item_click", (item) => {
    //列表控件点击事件
    switch (item.text) {
        case "告使用者":
            toast("还没有相关内容")
            //notice();
            return
        case "检查图库":
        case "更换图库":
            helper = tool.readJSON("helper");
            threads.start(function() {
                use.gallery.gallery_view(use.gallery_link)
                /*, function (txt, value) {
                    switch (txt) {
                        case "全分辨率兼容":
                            if (value == "get_") {
                                return helper.全分辨率兼容;
                            }
    
                            break;
                        case "检验":
    
                            return interface.server;
                        case "检测":
    
                            break
                        // code
                    }
    
                })
                */
            })

            break;
        case "加群交流":

            try {
                $app.startActivity({
                    data: "mqqapi://card/show_pslcard?card_type=group&uin=" + use.gather_link.群号,
                })
            } catch (err) {
                toastLog("请先安装QQ或升级QQ\n群号：" + use.gather_link.群号)
            }
            return
        case "问题帮助":
            toast("还没有相关内容")
            // age.put("url", jlink_mian.疑惑解答);
            //  new_ui("浏览器", jlink_mian.疑惑解答);
            break
        case "运行日志":
            new_ui("日志");
            return
        case "捐赠打赏":
            engines.execScript("donation", "require('./utlis/applaud.js').donation('iVBORw0KGgoAAAANSUhEUgAA')")
            break
        case "关于应用":
            new_ui("关于");
            break;
        case "模块仓库":
            engines.execScriptFile('./utlis/Module_platform.js');
            break
    }
});

ui.icon.on("click", () => {
    new_ui("关于");
})
ui.icon_b.on("click", () => {
    ui.viewpager.currentItem = 0;
});
ui.homepage.on("click", () => {
    ui.post(() => {
        ui.viewpager.currentItem = 1;
    }, 100)
});
ui.settingsBtn.on("click", () => {
    new_ui("设置");
});

ui.logBtn.on("click", () => {
    new_ui('坐标调试')


});


ui.cnos.on("click", () => {
    toast("此菜单不知道放啥上去好，禁用中..")
    return
    if (ui.cnos_list.getVisibility() == 8) {
        ui.cnos.attr("leftDrawable", "@drawable/ic_healing_black_48dp");
        ui.cnos_list.setVisibility(0);
    } else {
        ui.cnos_list.setVisibility(8);
        ui.cnos.attr("leftDrawable", "ic_stars_black_48dp");
    }
})



//悬浮窗
ui.floatyCheckPermission.on("check", function(checked) {
    if (checked && floaty.checkPermission() == false) {
        try {
            app.startActivity({
                packageName: "com.android.settings",
                className: "com.android.settings.Settings$AppDrawOverlaySettingsActivity",
                data: "package:" + context.getPackageName(),
            });
        } catch (err) {
            $floaty.requestPermission();
        }
    };

    if (!checked && floaty.checkPermission() == true) {
        toast("无效关闭，请到设置取消权限");
        ui.floatyCheckPermission.checked = true;
        try {
            app.startActivity({
                packageName: "com.android.settings",
                className: "com.android.settings.Settings$AppDrawOverlaySettingsActivity",
                data: "package:" + context.getPackageName(),
            });
        } catch (err) {
            $floaty.requestPermission();
        }
    };
});

//无障碍
ui.autoService.on("click", (checked) => {
    // 用户勾选无障碍服务的选项时，跳转到页面让用户去开启
    if (ui.autoService.checked == true) {
        checked = true;
    } else {
        checked = false;
    }

    if (checked == true) {
        if (tool.autoService(true) == false) {
            ui.autoService.checked = false;
            if (!interface.无障碍提醒) {
                dialogs.build({
                    type: "app-or-overlay",
                    title: "自启动无障碍提醒",
                    content: "请在接下来跳转的系统界面中打开 已下载服务/已安装的应用程序：PGRAssistant的无障碍，不知道如何打开请百度或使用音量键快捷方式打开\n\n如需应用自动打开无障碍，请前往左上角头像-左下角设置-自启动无障碍服务，点击了解)",
                    checkBoxPrompt: "不再提示",
                    positive: "我清楚了",
                    positiveColor: "#FF8C00",
                    canceledOnTouchOutside: false
                }).on("positive", () => {
                    app.startActivity({
                        action: "android.settings.ACCESSIBILITY_SETTINGS"
                    });
                }).on("check", (checked) => {
                    //监听勾选框
                    tool.writeJSON("无障碍提醒", checked, "interface")
                }).show();
            } else {
                app.startActivity({
                    action: "android.settings.ACCESSIBILITY_SETTINGS"
                });
            }
        }
    } else {
        tool.autoService(false)

    }


});

ui.autoService.on("long_click", () => {
    app.startActivity({
        action: "android.settings.ACCESSIBILITY_SETTINGS"
    });
});

//无障碍&悬浮窗回弹
ui.emitter.on("resume", function() {
    let themes = storages.create('themes').get('theme')
    if (use.theme.bar != themes.bar) {
        ui.statusBarColor(themes.bar);
        ui.viewpager.attr("bg", themes.bar);
        use.theme.bar = themes.bar;
    }
    // 此时根据无障碍服务的开启情况，同步开关的状
    if (tool.autoService() == true) {

        ui.autoService.checked = true;
    } else {
        ui.autoService.checked = false;
    }

    if (floaty.checkPermission() == false) {
        ui.floatyCheckPermission.checked = false;
    }

    if (tool.script_locate("Floating.js")) {
        ui.start.setText("停止运行")
    } else {
        //        ui.start.setText("开始运行");
    }

});


ui.depletion_serum.on("click", function(view) {
    checked = view.checked;
    ui.depletion_way.setVisibility(checked ? 0 : 8);
    ui.depletion_manage.setVisibility(checked ? 0 : 8)
    tool.writeJSON("血清", checked)
})
ui.depletion_way1.on("check", function(checked) {
    ui.resources_type.setVisibility(checked ? 0 : 8);
    helper.战斗.活动 = !checked;
    tool.writeJSON("战斗", helper.战斗);
});
ui.depletion_way2.on("check", function(checked) {
    helper.战斗.活动 = checked;
    tool.writeJSON("战斗", helper.战斗);
    //if (checked) toastLog("暂时不支持此次活动材料");
});

ui.input_challenge.on("key", function(keyCode, event) {
    if (event.getAction() == 0 && keyCode == 66) {
        tool.writeJSON("挑战次数", Numbr(ui.input_challenge.getText()))
        event.consumed = true;
    }
});
ui.input_serum.on("key", function(keyCode, event) {
    if (event.getAction() == 0 && keyCode == 66) {
        tool.writeJSON("注射血清", Numbr(ui.input_serum.getText()))
        event.consumed = true;
    }
});


let updater;
ui.resources_type.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener({
    onItemSelected: function(parent, view, resources_name, id) {
        if (!updater) {
            updater = true;
            return
        }
        resources_name = language.resources_name.split("|")[resources_name];

        helper.战斗.资源名称 = resources_name;
        tool.writeJSON("战斗", helper.战斗);
    }
}));

ui.daily_serum.on("click", function(view) {
    checked = view.checked;
    tool.writeJSON("每日血清", checked)
});

ui.disputes.on("click", function(view) {
    checked = view.checked;
    if (checked) {
        use.Dialog_Tips(language.warm_tips, language.disputes_tips);
    }

    helper.纷争战区.自动 = checked;
    tool.writeJSON("纷争战区", helper.纷争战区);
});

ui.lizhan_mapping.on("click", function(view) {
    checked = view.checked;
    if (checked) {
        use.Dialog_Tips(language.warm_tips, language.lizhan_mapping_tips);
    }
    helper.历战映射.启用 = checked;
    tool.writeJSON("历战映射", helper.历战映射);
});

ui.aide_ac.on("click", function(view) {
    checked = view.checked;
    tool.writeJSON("助理交流", checked)
});

ui.brilliant_calculations.on("click", function(view) {
    checked = view.checked;
    tool.writeJSON("妙算神机", checked)
});


ui.dorm_series.click(function(view) {
    // let index = parent.getParent().indexOfChild(0);
    let imgview = view.getChildAt(2);
    let fatherview = view.getParent();
    if (imgview.attr("src") != "@drawable/ic_keyboard_arrow_up_black_48dp") {
        imgview.attr("src", "@drawable/ic_keyboard_arrow_up_black_48dp");
        for (let i in helper.宿舍系列) {
            let addview = ui.inflate(
                '\ <widget-switch-se7en checked="' + helper.宿舍系列[i].启用 + '" hint="' + i + '" text="' + language[i] + '"  textSize="16" textColor="{{use.theme.text}}" padding="6 6 6 6" />', fatherview)
            fatherview.addView(addview, fatherview.getChildCount());
            fatherview.getChildAt(fatherview.getChildCount() - 1).click((view) => {
                helper.宿舍系列[view.getHint()].启用 = view.checked;
                if (view.getHint() == "touch_role") {
                    helper.宿舍系列[view.getHint()].lastExecutionTime = false;
                }else {
                    helper.宿舍系列[view.getHint()].执行状态 = false;
                }
                tool.writeJSON("宿舍系列", helper.宿舍系列);

            });
            for (let k in helper.宿舍系列[i]) {
                if (k == "启用" || k == "执行状态" || typeof helper.宿舍系列[i][k] == "string") {
                    continue;
                }
                addview = ui.inflate(
                    '\ <widget-switch-se7en checked="' + helper.宿舍系列[i][k] + '" hint="' + (i + ',' + k) + '" text="' + language[k] + '"  textSize="16" textColor="{{use.theme.text}}" padding="6 6 6 6" />', fatherview)
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


ui.task_award.on("click", function(view) {
    checked = view.checked;
    tool.writeJSON("任务奖励", checked)
})
ui.handbook.on("click", function(view) {
    checked = view.checked;
    tool.writeJSON("手册经验", checked)
});

ui.auto_use_serum.on("click", function(view) {
    checked = view.checked;
    tool.writeJSON("自动2血清", checked)
});

var timed_tasks_list = tool.readJSON("timed_tasks", []);

ui.timed_tasks_list.setDataSource(timed_tasks_list);

ui.timed_tasks_list.on("item_click", function(itemView, i) {
    let delete_timing = dialogs.build({
        type: "app",
        title: itemView.app + language.delete_timed_tasks,
        positive: language.yes,
        negative: language.no
    }).on("positive", () => {
        log(language.delete_timed_tasks_tips + itemView.id, timers.removeTimedTask(itemView.id));
        timed_tasks_list.splice(i, 1);

    })
    tool.setBackgroundRoundRounded(delete_timing.getWindow(), {
        bg: use.theme.bg
    })
    delete_timing.show();

});

ui.timed_tasks_frame.on("click", function() {
    if (ui.timed_tasks_add.getVisibility() == 8) {
        ui.timed_tasks_add.attr("visibility", "visible");
        ui.timed_tasks_list.attr("visibility", "visible");
        ui.timed_tasks_img.attr("tint", "#40a5f3");
        ui.timed_tasks_img2.attr("tint", "#40a5f3");
        ui.timed_tasks.setTextColor(colors.parseColor("#40a5f3"));
        ui.timed_tasks_img2.attr("src", "@drawable/ic_keyboard_arrow_up_black_48dp")
    } else {
        ui.timed_tasks_add.attr("visibility", "gone");
        ui.timed_tasks_list.attr("visibility", "gone");
        ui.timed_tasks_img.attr("tint", use.theme.text);
        ui.timed_tasks_img2.attr("tint", use.theme.text);
        ui.timed_tasks.setTextColor(colors.parseColor(use.theme.text));
        ui.timed_tasks_img2.attr("src", "@drawable/ic_keyboard_arrow_down_black_48dp")
    }
})

//定时任务添加事件
ui.timed_tasks_add.on("click", function() {
    var task = require("./utlis/task.js");
    task.create_task(timed_tasks_list)

})
/*
var MaterialListC = JSON.parse(
    files.read("./utlis/materialName.json", (encoding = "utf-8"))
),
    MaterialList = Object.keys(MaterialListC),
    AddItem,
    AddItemList = [],
    AddItemNum = 1,
    ImgPath = "file://./res/material/";

    */




/*

ui.inputiz.on("key", function (keyCode, event) {
    if (event.getAction() == 0 && keyCode == 66) {
        输入框(ui.inputiz, ui.inputiz.text())
        event.consumed = true;
    }
});

*/
ui._bgT.on("click", function() {
    let mod = require("./utlis/modular_list.js");
    mod.create_modular()

}) //模块配置事件

//开始运行
ui._bg.on("click", function() {
    ui.run(() => {
        ui._bg.attr("src", "#D3D3D3")
    })
    ui.post(() => {
        ui._bg.attr("src", "#00000000")
    }, 150)
    ui._bg.setEnabled(false);
    setTimeout(function() {
        ui._bg.setEnabled(true);
    }, 600);

    if (floaty.checkPermission() == false) {
        snakebar(language.levitating_permissions_tips);
        return;
    }
    if (ui.start.getText() == "停止运行" && !tool.script_locate("Floating.js") == false) {
        Floating = tool.script_locate("Floating.js");
        Floating.emit("暂停", "关闭程序");
        ui.start.setText("开始运行");
        return;
    }

    if (tool.autoService() != true) {
        if (ui.autoService.checked == true) {
            use.prompt.Dialog_Tips("温馨提示", "无障碍服务已启用但并未运行，您需要强行停止应用/重启无障碍服务/重启手机");
        }
        toast("无障碍服务异常！请长按无障碍服务按钮跳转设置检查是否正常开启！");
        console.error("无障碍服务异常！请检查是否正常开启！");
        return;
    };


    helper = tool.readJSON("helper");

    if (!tool.script_locate("Floating.js")) {
        if (helper.最低电量 != false) {
            if (!device.isCharging() && device.getBattery() < helper.最低电量) {
                use.Dialog_Tips("温馨提示", "电量低于设定值" + helper.最低电量 + "%且未充电");
                console.error("电量低于设定值" + helper.最低电量 + "%且未充电");
                if (helper.震动) {
                    device.vibrate(1500);
                };
                return;
            };
        };


        let appnameui = ui.inflate(
            <vertical padding="25 0">
                        <View bg="#000000" h="1" w="auto" />
                        <vertical w="*" >
                            <list id="fg_">
                                <button id="fg" text="{{this.name}}" hint="{{this.package_name}}" w="*" style="Widget.AppCompat.Button.Colored" h="auto" />
                            </list>
                        </vertical>
                    </vertical>, null, false);
        var appname = dialogs.build({
            type: 'app',
            customView: appnameui,
            title: "你有多个战双！\n请选择启动其中一个",
            wrapInScrollView: false,
            autoDismiss: true
        });

        for (let i = language.server_name.length - 1; i > 0; i--) {
            if (app.getAppName(language.server_name[i].package_name.toString()) == null) {
                language.server_name.splice(i, 1);
            }
        }
        if (language.server_name.length <= 1) {
            log(language.server_name[0].package_name)
            tool.writeJSON("包名", language.server_name[0].package_name);
            开始运行jk();
        } else {
            appnameui.fg_.setDataSource(language.server_name);

            appnameui.fg_.on("item_bind", function(itemView, itemHolder) {
                itemView.fg.on("click", function() {
                    let item = itemHolder.item;
                    log(item)
                    tool.writeJSON("包名", item.package_name);
                    ui.run(() => {
                        appname.dismiss();
                    })
                    开始运行jk();
                    return true;
                });
            })

            appname.show();
            return
        }


    } else {
        Floating = tool.script_locate("Floating.js");
        Floating.emit("暂停", "关闭程序");
        ui.start.setText("开始运行");
        return;
    }

    return true;
})

ui.onlyhover.on("click", function() {
    ui.onlyhover.setEnabled(false);
    setTimeout(function() {
        ui.onlyhover.setEnabled(true)
    }, 800);
    if (floaty.checkPermission() == false) {
        use.Dialog_Tips("温馨提示", "请先授予PGRAssistant悬浮窗权限！");
        return;
    }

    if (!tool.script_locate("Floating")) {
        tool.writeJSON("初始暂停", true, "pane");
        开始运行jk(true);
    } else {
        snakebar("悬浮窗程序已在运行中")
        return;
    }

})

//开始运行
function 开始运行jk(jk, tips_) {
    // 屏幕方向

    /*  if (ui.card.getHeight() == device.width) {
          console.error("请不要随便从横屏开始运行\n可能会导致悬浮窗大小异常");
          use.Dialog_Tips("温馨提示", "请不要随便从横屏开始运行\n可能会导致悬浮窗大小异常")
      }*/
    if (!files.exists("./library/gallery/宿舍-家具-关闭.png")) {
        use.Dialog_Tips("确认图库", "当前图库不完整,请在左上角头像-检查图库进行更换!")
        return;
    }
    let tuku_de = JSON.parse(files.read("./library/gallery/gallery_message.json"));

    if (tips_ != true && helper.全分辨率兼容 != true) {

        if (device.model == "MuMu") {
            let dialog = dialogs.build({
                title: "警告⚠",
                titleColor: "#F44336",
                type: "app",
                content: "加载中...",
                contentColor: "#F44336",
                positive: "我已知晓",
                negative: "下载MuMu9",
                positiveColor: "#000000",
                canceledOnTouchOutside: false
            }).on("negative", () => {
                app.openUrl("https://a11.gdl.netease.com/MuMuInstaller_9.0.0.5_v9.2.3.0x64_zh-Hans_1646704695.exe")
                setClip("https://a11.gdl.netease.com/MuMuInstaller_9.0.0.5_v9.2.3.0x64_zh-Hans_1646704695.exe")
                console.info("https://a11.gdl.netease.com/MuMuInstaller_9.0.0.5_v9.2.3.0x64_zh-Hans_1646704695.exe")
                toast("已粘贴到剪贴板并打印到运行日志")
            })
            tool.setBackgroundRoundRounded(dialog.getWindow(), {
                bg: use.theme.bg,
            })
            if (device.release != 9 && device.width != 1280 && device.height != 720 && device.width != 1920 && device.height != 1080) {
                dialog.setContent("你的设备环境貌似是mumu模拟器，\n当前安卓版本：" + device.release + "，非兼容版本，请更换为安卓9的版本,\n https://a11.gdl.netease.com/MuMuInstaller_9.0.0.5_v9.2.3.0x64_zh-Hans_1646704695.exe\n当前分辨率：w:" + device.width + ",h:" + device.height + "，PGRAssistant图库貌似还没有适合的，请在mumu设置中心-界面设置，更换为1280x720或1920x1080");
                toastLog("https://a11.gdl.netease.com/MuMuInstaller_9.0.0.5_v9.2.3.0x64_zh-Hans_1646704695.exe")
                dialog.show();
                return
            }
            if (device.width != 1280 && device.height != 720 && device.width != 1920 && device.height != 1080) {
                dialog.setContent("你的设备环境貌似是mumu模拟器，\n当前分辨率：w:" + device.width + ",h:" + device.height + "，PGRAssistant图库貌似还没有适合的，请在mumu设置中心-界面设置，更换为1280x720或1920x1080");
                dialog.show();
                return
            }
            switch (true) {
                case device.release != 9:
                    dialog.setContent("你的设备环境貌似是mumu模拟器，当前安卓版本：" + device.release + "，非兼容版本，请更换为安卓9的版本, \n https://a11.gdl.netease.com/MuMuInstaller_9.0.0.5_v9.2.3.0x64_zh-Hans_1646704695.exe");
                    toastLog("https://a11.gdl.netease.com/MuMuInstaller_9.0.0.5_v9.2.3.0x64_zh-Hans_1646704695.exe")
                    dialog.show();
                    return
            }

        }
        if (tuku_de.分辨率.h == device.width && tuku_de.分辨率.w == device.height) {
            if (!helper.模拟器) {
                dialogs.build({
                    type: "app-or-overlay",
                    title: "兼容模拟器平板版",
                    content: "检测到你的设备可能是模拟器平板版分辨率,是否启用设置-兼容模拟器平板版？\n如果不是，请不要启用，这将导致悬浮窗过大。\n可在侧边栏-设置中关闭",
                    positive: "启用",
                    positiveColor: "#FF8C00",
                    negative: "取消",
                    canceledOnTouchOutside: false
                }).on("positive", () => {
                    tool.writeJSON("模拟器", true);
                }).show()

                return
            }
        } else {

            tuku_de.h = (tuku_de.分辨率.h - device.height).toString().replace(/[^\d]/g, "");
            tuku_de.w = (tuku_de.分辨率.w - device.width).toString().replace(/[^\d]/g, "");
            if (tuku_de.h > 220 || tuku_de.w > 170) {
                console.error("设备分辨率与图库分辨率相差过大，可能无法正常使用")
                let Tips_tuku_ui = ui.inflate(
                    <vertical id="parent">
                        
                        <card gravity="center_vertical" cardElevation="0dp" margin="0">
                            <img src="file://res/icon.png" w="50" h="30" margin="0" />
                            <text text="无法使用PGRAssistant" padding="5" textSize="20" gravity="center|left" textColor="#f03752" marginLeft="50" />
                            
                            
                        </card>
                        
                        <ScrollView>
                            <vertical>
                                <vertical padding="10 0" >
                                    <View bg="#f5f5f5" w="*" h="2" />
                                    <text id="Device_resolution" text="加载中" />
                                    <text id="dwh" text="加载中" />
                                    <text id="Tips" textStyle="italic" textColor="#f03752" />
                                    
                                    <text id="wxts" text="温馨" typeface="sans" padding="5" textColor="#000000" textSize="15sp" layout_gravity="center" />
                                </vertical>
                                <horizontal w="*" padding="-3" gravity="center_vertical">
                                    <button text="退出(5s)" id="exit" textColor="#dbdbdb" style="Widget.AppCompat.Button.Borderless.Colored" layout_weight="1" />
                                    <button text="执意启动" id="ok" textColor="#dbdbdb" style="Widget.AppCompat.Button.Borderless.Colored" layout_weight="1" />
                                </horizontal>
                            </vertical>
                        </ScrollView>
                        
                    </vertical>);

                var Tips_tuku = dialogs.build({
                    type: "app",
                    customView: Tips_tuku_ui,
                    wrapInScrollView: false,
                    cancelable: false,
                    canceledOnTouchOutside: false
                })
                tool.setBackgroundRoundRounded(Tips_tuku.getWindow(), {
                    bg: use.theme.bg,
                })
                Tips_tuku.show();
                Tips_tuku_ui.exit.on("click", function() {
                    Tips_tuku.dismiss();
                })
                Tips_tuku_ui.ok.on("click", function() {
                    Tips_tuku.dismiss()
                    开始运行jk(false, true)

                })

                Tips_tuku_ui.wxts.setText("1. 没有适合你的图库？\n加入群聊获取教程动手制作，或使用虚拟机、模拟器等自调适合的分辨率，左边高度×右边宽度，DPI随意" +
                    "\n2. 分辨率反的？ \n请在竖屏下启动悬浮窗。华为：更改屏幕分辨率-为对应图库。模拟器：说明设置的是平板版分辨率(更换与设备分辨率相反的图库分辨率即可)。 注：更换设备分辨率后都需要到应用内更换相符合的图库")
                Tips_tuku_ui.Device_resolution.setText("当前设备分辨率:宽" + device.width + ",高:" + device.height)
                Tips_tuku_ui.dwh.setText("当前使用图库：" + tuku_de.name);

                Tips_tuku_ui.Tips.setText("请在软件主页面-左上角头像-更换图库\n更换设备分辨率相近的图库，否则将无法正常使用本应用-辅助。\n目前，图库与设备分辨率宽度一致，而高度误差不超过230左右，或高度一致，而宽度误差不超过170左右，基本上是可以使用的，但不排除某些小图片在你的设备上无法匹配，导致某功能失效")
                Tips_tuku_ui.exit.setEnabled(false);
                var i_tnter = 5;
                var id_tnter = setInterval(function() {
                    if (i_tnter >= 0) {
                        i_tnter--;
                    }
                    ui.run(() => {
                        if (i_tnter == 0) {
                            Tips_tuku_ui.exit.setEnabled(true);
                            Tips_tuku_ui.exit.setText("退出")
                            Tips_tuku_ui.exit.setTextColor(colors.parseColor("#F4A460"))
                            clearInterval(id_tnter);
                        } else {
                            Tips_tuku_ui.exit.setText("退出(" + i_tnter + "s)")
                        }

                    })
                }, 1000)

                return
            }
        }
        if (!files.exists("./library/coordinate.json")) {
            use.Dialog_Tips("确认坐标信息", "当前坐标信息不完整,请在左上角头像-坐标调试中配置");
        }
    }




    if (interface.运行次数 <= 2) {
        jk = true;
        use.Dialog_Tips("温馨提示", "PGRAssistant是图像识别脚本程序，在工作前必须先获取屏幕截图权限！！！\n\n如需程序自动允许辅助截图权限，请前往左上角头像-设置-打开自动允许辅助截图。如果在悬浮窗面板运行时无法申请辅助截图权限，请授权PGRAssistant后台弹出界面权限" +
            "\n\n如需程序自动打开战双，请前往左上角头像-设置-打开自动启动战双" +
            "\n\n不懂如何使用本程序？ 左上角头像-疑惑解答，或加群交流", "@drawable/ic_report_problem_black_48dp");
    }
    ui.start.setText("停止运行");
    interface.运行次数 = interface.运行次数 + 1;
    tool.writeJSON("运行次数", interface.运行次数, "interface");
    $settings.setEnabled('foreground_service', true);
    new_ui("悬浮窗");
    //engines.execScriptFile("./Floating.js");
    // console.info('版本信息：' + toupdate.version(packageName) + (app.autojs.versionCode > 8081300 ? "(64位)" : "(32位)"))
    console.info('device info: ' + device.brand + " " + device.product + " " + device.release);
    console.info('设备分辨率：' + device.height + "×" + device.width);
    console.info('图库分辨率: ' + tuku_de);
    console.info('截图方式: ' + helper.截图方式);
    ui.start.setHint(null)
    if (!jk) {
        setTimeout(function() {
            setting = null;
            tukuss = null;
            toastLog("开始运行20秒后主动关闭PGRAssistant-界面\n如无需此功能请从悬浮窗启动PGRAssistant");
            let runtime = java.lang.Runtime.getRuntime();
            runtime.gc();
            threads.shutDownAll();
            ui.finish()
            exit();
        }, 20000);
    }
};

//当离开本界面时保存data
ui.emitter.on("pause", () => {
    if (ui.input_challenge.getText() != '') {
        tool.writeJSON("挑战次数", ui.input_challenge.getText())
    }
    if (ui.input_serum.getText() != '') {
        tool.writeJSON("注射血清", ui.input_serum.getText())
    }
    tool.writeJSON(null, timed_tasks_list, "timed_tasks");
});
//返回事件
var isCanFinish = false;
var isCanFinishTimeout;
ui.emitter.on("back_pressed", e => {
    try {
        switch (ui.viewpager.getChildAt(ui.viewpager.currentItem)) {
            case ui.drawer_:
                ui.viewpager.currentItem = 1;
                e.consumed = true;
                return
            case ui.card:
                e.consumed = false;
                return

        }

    } catch (err) {}

    e.consumed = false;
})

ui.emitter.on("activity_result", (requestCode, resultCode, data) => {

    if (resultCode != Activity.RESULT_OK) {
        if (filePathCallback != null) {
            filePathCallback.onReceiveValue(null);
        }
        return;
    }

    var uri = data.getData();
    //  var uri = Uri.parse("file:///sdcard/1.png");
    if (uri == null) {
        return
    }
    let uriArr = java.lang.reflect.Array.newInstance(java.lang.Class.forName("android.net.Uri"), 1);

    uriArr[0] = uri;
    log(uriArr)
    filePathCallback.onReceiveValue(uriArr);
    filePathCallback = null;
});



if (!files.exists("./library/coordinate.json")) {
    new_ui('坐标调试')
    //  files.copy("./library/coordinate.json", package_path + "coordinate/coordinate.json")
}
SystemUiVisibility(false)

threads.start(function() {
    Update_UI(1)


    setInterval(function() {

        ui.post(() => {

            switch (ui.viewpager.getChildAt(ui.viewpager.currentItem)) {

                case ui.card:
                    if (tool.script_locate("Floating")) {
                        ui.start.setText("停止运行")
                    } else {
                        ui.start.setText("开始运行");
                    }

                    ui.autoService.checked = tool.autoService() ? true : false;

                    if (notes != undefined && notes.血清数 != false) {
                        notes = tool.readJSON("notes")

                        var ms = new Date(new Date()).getTime() - new Date(notes.血清时间).getTime()
                        let hflz = Math.floor(ms / 60 / 1000);
                        if (hflz == -1) {
                            return
                        }


                        hflz = Math.floor(hflz / 6) + Number(notes.当前血清);
                        //判断血清是否溢出
                        if (hflz >= Number(notes.血清数.split("/")[1])) {
                            hflz = notes.血清数.split("/")[1] + "/" + notes.血清数.split("/")[1]
                            ui.lizhishu.setText(hflz)
                            popView.lizhishu.setText("血清     " + hflz)
                            tool.writeJSON("血清数", hflz, "notes");
                            return
                        }

                        hflz = hflz + "/" + notes.血清数.split("/")[1]
                        if (hflz != ui.lizhishu.getText()) {
                            if (notes.血清时间 != tool.readJSON("notes").血清时间) {
                                return
                            }

                            ui.lizhishu.setText(hflz)
                            popView.lizhishu.setText("血清     " + hflz)
                            tool.writeJSON("血清数", hflz, "notes");
                        }
                    }
                    break
            }
        })

    }, 300)

    //  files.create(package_path + "coordinate/");


    files.ensureDir(files.path("./library/gallery_list"))

    while (true) {
        try {
            if (!files.exists("./library/gallery/gallery_message.json")) {
                log(use.gallery)
                use.gallery.选择图库(use.gallery_link);
                break;
            } else {
                break
            }
        } catch (er) {
            log("查询云端配置中" + er)
            sleep(300)
        }
    }

    ui.run(() => {
        if (tool.autoService(true)) {
            ui.autoService.checked = true;
        }
    })
    sleep(50);

    if (interface.运行次数 != true && interface.公告 == true) threads.start(tishi);
    // interface = tool.readJSON("interface");

    threads.start(function() {

        let toupdate = require("./utlis/to_update.js");
        toupdate.updata(ui.drawerFrame)
        // require("update.js").update()
    });
})




function Update_UI(i) {
    switch (i) {
        case 1:
            ui.run(() => {



                try {
                    if (tool.script_locate("Floating.js")) {
                        ui.start.setText("停止运行")
                    } else {
                        ui.start.setText("开始运行");
                    }
                } catch (err) {}


                //activity.setRequestedOrientation(1);
                //更新模拟器，虚拟机按钮颜色
                ui.floatyCheckPermission.setRadius(25);
                ui.autoService.setRadius(25);
                ui.disputes.setRadius(25);

                ui._bgA.attr("cardCornerRadius", "25dp");

                if (!helper.战斗.活动) {
                    ui.depletion_way1.checked = true;
                    ui.resources_type.setVisibility(0);
                    // let 资源类型 = language.resources_type.split("|");
                    switch (helper.战斗.资源名称) {
                        case "作战补给":
                            ui.resources_type.setSelection(0);
                            break
                        case "后勤保养":
                            ui.resources_type.setSelection(1);
                            break;
                        case "军备突破":
                            ui.resources_type.setSelection(2);
                            break;
                        case "成员特训":
                            ui.resources_type.setSelection(3);
                            break;
                        case "螺母大作战":
                            ui.resources_type.setSelection(4);
                            break;
                        case "战技演习":
                            ui.resources_type.setSelection(5);
                            break;
                    };
                } else {
                    ui.depletion_way2.checked = true;

                }

                console.verbose("初始化辅助配置完成")
            })
            break
    }

}

function 检测ocr(tips) {
    let ocr = app.getAppName("com.tony.mlkit.ocr");
    if (!ocr) {
        if (files.exists("./plugins/com.tony.mlkit.ocr.apk")) {
            ocr = true;
        }
    }
    let con_;
    if (tips == true && ocr == null) {
        importClass(android.os.Build);
        log("当前PGRAssistant架构：" + Build.CPU_ABI)
        con_ = "请先下载安装mlkit ocr 文字识别插件，否则无法使用\n\nhttps://234599.lanzouv.com/b00q05mpe 密码:421" +
            "\n\n当前PGRAssistant架构：" + Build.CPU_ABI + "，\n建议下载安装" + ((Build.CPU_ABI == "arm64-v8a") ? "OCR 64位包" : "OCR 32位包") + "，\n\n安装错误的OCR版本会导致OCR无法识别卡住，应用崩溃。关于应用-PGRAssistant32位只能使用32位OCR插件"
        if (device.product == "SM-G9750" && device.release == 9) {
            con_ = "雷电9仅可使用x86-32位ocr插件\n\nhttps://234599.lanzouv.com/iwn8u0fk1ebc"
        }
    } else if (tips == true && ocr != null) {
        importClass(android.os.Build);
        log("PGRAssistant架构：" + Build.CPU_ABI)
        ocr = plugins.load('com.tony.mlkit.ocr')
        log("OCR支持的架构：" + ocr.get_ABI)
        if (device.product == "SM-G9750" && device.release == 9) {
            con_ = "雷电9仅可使用x86-32位ocr插件\n\nhttps://234599.lanzouv.com/iwn8u0fk1ebc"

        } else {
            if (app.autojs.versionCode <= 8082200 && ocr.get_ABI.indexOf('arm64-v8a') != -1) {
                con_ = "32位PGRAssistant无法使用\n64位ocr文字识别插件\n请重新下载安装32位ocr\n\nhttps://234599.lanzouv.com/b00q05mpe 密码:421"
            }
        }
    }
    if (con_ != undefined) {
        let ocr_tips = dialogs.build({
            type: "app",
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
        tool.setBackgroundRoundRounded(ocr_tips.getWindow(), {
            bg: use.theme.bg,
        })
        ocr_tips.show();
        return false
    }
    return ocr
}



function snakebar(text, second) {
    second = second || 3000;
    com.google.android.material.snackbar.Snackbar.make(ui.drawerFrame, text, second).show();
}

function new_ui(name, url) {
    // let JS_file;

    switch (name) {
        case "day":
            use.theme.setTheme("day");
            break
        case "night":
            use.theme.setTheme("night");
            break
        case '关于':
            engines.execScriptFile("./activity/about.js", {
                path: files.path("./activity/")
            });
            break;
        case '设置':
            engines.execScriptFile("./activity/Basics.js", {
                path: files.path("./activity/")
            });
            break;
        case '日志':
            //  let variabler = "'ui';var theme = " + JSON.stringify(use.theme) + ";var language = theme.language.initialize;";

            //  engines.execScript("journal_ui", variabler + "require('./activity/journal.js')");
            engines.execScriptFile("./activity/journal.js", {
                path: files.path("./activity/")
            });
            break;
        case '坐标调试':
            engines.execScriptFile("./activity/initialize.js", {
                path: files.path("./activity/")
            });
            break
        case '悬浮窗':
            // JS_file = "./Floating.js";
            engines.execScriptFile("./Floating.js");
            break;

    }

}
//log(ui.viewpager.getChildCount())