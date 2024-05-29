"ui";
importClass(android.graphics.Color);
let packageName = context.getPackageName();
var tool = require('../modules/app_tool.js');
var helper = tool.readJSON("helper")
var theme = require("../theme.js");
var language = theme.language.basics;
//指向Android/data/包名/file 路径
var package_path = context.getExternalFilesDir(null).getAbsolutePath() + "/";
try {

    ui.statusBarColor(theme.bar);
} catch (err) {

    var theme = require("../theme.js");
    ui.statusBarColor(theme.bar);

}

let {
    dp2px,
    createShape
} = require('../modules/__util__.js');

let BottomWheelPicker = require('../activity/BottomWheelPicker.js').build({
    positiveTextColor: "#FFFFFF",
    positiveBgColor: theme.bar,
    positivestrokeColor: theme.bar,
});

let ocr_plugin = {
    "MlkitOCR": require('../modules/mlkitocr.js'),
    "XiaoYueOCR": require('../modules/xiaoyueocr.js')
}

function zoom(x) {
    return Math.floor((device.width / 1080) * x);
};
//包名
var package_name = context.getPackageName();
require('../modules/widget-switch-se7en');


ui.layout(
    <vertical id='exit'>
        <appbar>
            <toolbar id='toolbar' title='高级设置' bg='{{theme.bar}}' w="*">
                
                
            </toolbar>
            
        </appbar>
        <frame>
            <ScrollView>
                <vertical>
                    <text text='运行配置' margin="10 5 10 0" h="35dp" id="text_bg"
                    gravity="center|left" textSize='16sp' textColor='{{theme.bar}}'>
                </text>
                
                
                
                <horizontal padding="20 4" id="volume_suspended_id" >
                    <vertical layout_weight="1" >
                        <text text="{{language['volume_suspended']}}" textColor="#000000" textSize="16sp" textStyle="bold" />
                        <text text="{{language['volume_suspended_description']}}" textColor="#95000000" textSize="10sp" marginTop="2" />
                    </vertical>
                    
                    <widget-switch-se7en id="volume_suspended" checked="{{helper['监听键'] == '关闭' ? false : true}}"
                    padding="15 5" textSize="18sp"
                    thumbSize='24' radius='24' layout_gravity="center" />
                </horizontal>
                <radiogroup margin="25 0 10 0" id="volume_suspended_list" visibility="{{helper['监听键'] == '关闭' ? 'gone' : 'visible'}}"
                gravity="bottom" orientation="horizontal">
                <radio id="volume_suspended_under" text="{{language['volume_suspended_under']}}" w="auto" h="auto" checked="{{helper['监听键'] == '上' ? true : false}}" />
                <radio id="volume_suspended_above" text="{{language['volume_suspended_above']}}" w="auto" checked="{{helper['监听键'] == '下' ? true : false}}"/>
            </radiogroup>
            <View bg="#666666" h="1" w="*" margin="10 0" />
            
            
            
            <horizontal padding="20 4" id="auto_empower_screenshots_id" >
                <vertical layout_weight="1" >
                    <text text="{{language['auto_empower_screenshots']}}" textColor="#000000" textSize="16sp" textStyle="bold" />
                    <text text="{{language['auto_empower_screenshots_description']}}" textColor="#95000000" textSize="10sp" marginTop="2" />
                </vertical>
                <widget-switch-se7en id="auto_empower_screenshots" checked="{{helper.自动授权截图}}"
                padding="15 5" textSize="18sp"
                thumbSize='24' radius='24' layout_gravity="center" />
            </horizontal>
            <View bg="#666666" h="1" w="*" margin="10 0" />
            
            
            <horizontal padding="20 4" id="unusual_interface_suspended_id" >
                <vertical layout_weight="1" >
                    <text text="{{language['unusual_interface_suspended']}}" textColor="#000000" textSize="16sp" textStyle="bold" />
                    <text text="{{language['unusual_interface_suspended_description']}}" textColor="#95000000" textSize="10sp" marginTop="2" />
                </vertical>
                
                <widget-switch-se7en id="unusual_interface_suspended" checked="{{helper.异常超时}}"
                padding="15 5" textSize="18sp"
                thumbSize='24' radius='24' layout_gravity="center" />
            </horizontal>
            <View bg="#666666" h="1" w="*" margin="10 0" />
            
            
            <horizontal padding="20 4" id="suspended_desktop_id" >
                <vertical layout_weight="1" >
                    <text text="{{language['suspended_desktop']}}" textColor="#000000" textSize="16sp" textStyle="bold" />
                    <text text="{{language['suspended_desktop_description']}}" textColor="#95000000" textSize="10sp" marginTop="2" />
                </vertical>
                
                <widget-switch-se7en id="suspended_desktop" checked="{{helper.返回桌面}}"
                padding="15 5" textSize="18sp"
                thumbSize='24' radius='24' layout_gravity="center" />
            </horizontal>
            <View bg="#666666" h="1" w="*" margin="10 0" />
            
            <horizontal padding="20 4" gravity="center">
                <vertical layout_weight="2" >
                    <text text="{{language['OCRExtensions-type']}}" textColor="black" textSize="16sp" textStyle="bold"  />
                    <text text="{{language['OCRExtensions-explain']}}" textColor="#95000000" textSize="10sp" marginTop="2" />
                </vertical>
                <vertical >
                    <TextView id="OCRExtensions_type" padding="5 5" textSize="15sp"
                    margin="10" textColor="black" lines="1" />
                    <TextView id="OCRCorrection_rules" text="{{language['OCRCorrection-rules']}}" padding="5 5" textSize="15sp"
                    margin="10 5 10 0" textColor="black" lines="1" gravity="center" />
                </vertical>
            </horizontal>
            <View bg="#666666" h="1" w="*" margin="10 0" />
            
            <horizontal  padding="20 4" id="OCRExtensions_" gravity="center">
                <vertical layout_weight="1" >
                    <text text="{{language['OCRExtensions']}}" textColor="black" textSize="16sp" textStyle="bold" />
                </vertical>
                <widget-switch-se7en id="OCRExtensions" layout_gravity="center" padding="5 5"
                margin="10 0" thumbSize='24' radius='24' />
                
            </horizontal>
            
            
            
            
            
            <text text='高级功能' margin="10 5 10 0" h="35dp" id="text_bg"
            gravity="center|left" textSize='16sp' textColor='{{theme.bar}}'>
        </text>
        
        <horizontal padding="20 4" id="auto_accessibility_id" >
            <vertical layout_weight="1" >
                <text text="{{language['auto_accessibility']}}" textColor="#000000" textSize="16sp" textStyle="bold" />
                <text text="{{language['auto_accessibility_description']}}" textColor="#95000000" textSize="10sp" marginTop="2" />
            </vertical>
            
            <widget-switch-se7en id="auto_accessibility" checked="{{tool.checkPermission('android.permission.WRITE_SECURE_SETTINGS') ?  true : false}}"
            padding="15 5" textSize="18sp"
            thumbSize='24' radius='24' layout_gravity="center" />
        </horizontal>
        <View bg="#666666" h="1" w="*" margin="10 0" />
        
        <horizontal padding="20 4" id="senior_screenshot_id" >
            <vertical layout_weight="1" >
                <text text="{{language['senior_screenshot']}}" textColor="#000000" textSize="16sp" textStyle="bold" />
                <text text="{{language['senior_screenshot_description']}}" textColor="#95000000" textSize="10sp" marginTop="2" />
            </vertical>
            
            <widget-switch-se7en id="senior_screenshot" checked="{{helper['截图方式'] == '辅助' ? false : true}}"
            padding="15 5" textSize="18sp"
            thumbSize='24' radius='24' layout_gravity="center" />
        </horizontal>
        <radiogroup margin="25 0 10 0" id="senior_screenshot_list" visibility="{{helper['截图方式'] == '辅助' ? 'gone' : 'visible'}}"
        gravity="bottom" orientation="horizontal">
        <radio id="shizuku_screenshot" text="{{language['shizuku_screenshot']}}" w="auto" checked="{{helper['截图方式'] == 'Shuzuku' ? true : false}}"/>
        <radio id="root_screenshot" text="{{language['root_screenshot']}}" w="auto" h="auto" checked="{{helper['截图方式'] == 'root' ? true : false}}"/>
    </radiogroup>
    <View bg="#666666" h="1" w="*" margin="10 0" />
    
    {/*
    
    
    <card w="*" id="indx3" h="40" foreground="?selectableItemBackground">
        <widget-switch-se7en id="zdjs" text="自动解锁屏幕" checked="false" padding="15 10 15 5" textSize="18sp"
        margin="10 0" thumbSize='24' gravity="top|center_vertical"
        radius='24' />
        <frame layout_gravity="right|center_horizontal" w="{{zoom(330)}}px" h="35" marginTop="5">
            <img id="zdjstxt" src="@drawable/ic_error_black_48dp" w="28sp" tint="#A9a9a9" />
        </frame>
        <linear>
            <input id="inputd" gravity="bottom" visibility="gone" hint="设置：图形.数字.混合" lines="1" margin="20 35 0 0" layout_weight="1" />
            <button id="input_file4" text="导入解锁模块" margin="0 35 5 0" style="Widget.AppCompat.Button.Borderless.Colored" />
        </linear>
    </card>
    
    
    <text text='界面设置' margin="10 5 10 0" h="35dp" id="text_bg2"
    gravity="center|left" textSize='16sp' textColor='{{theme.bar}}'>
    </text>
    
    
    <card w="*" id="indx_tecr" h="40" foreground="?selectableItemBackground">
        <widget-switch-se7en id="tecr" text="自定义页面主题色" checked="false" padding="15 10 15 5" textSize="18sp"
        margin="10 0" thumbSize='24' gravity="top|center_vertical"
        radius='24' layout_weight="1" />
        <frame layout_gravity="right|center_horizontal" w="{{zoom(330)}}px" h="35" marginTop="5" >
            <img id="tecrtxt" src="@drawable/ic_error_black_48dp" w="28sp" tint="#A9a9a9" />
        </frame>
        <linear padding="-1">
            <input id="inputd_tecr" gravity="bottom" visibility="gone" hint="输入16进制颜色码，回车  或→" margin="30 35 0 0" layout_weight="1" />
            <button id="inputd_tecr_b" text="颜色列表" margin="0 35 5 0" style="Widget.AppCompat.Button.Borderless.Colored" />
        </linear>
    </card>
    
    <card w="*" id="indx" h="40" foreground="?selectableItemBackground">
        <widget-switch-se7en id="xfcs" text="设置悬浮窗主题色" checked="false" padding="15 10 15 5" textSize="18sp"
        margin="10 0" thumbSize='24' gravity="top|center_vertical"
        radius='24' />
        <frame layout_gravity="right|center_horizontal" w="{{zoom(330)}}px" h="35" marginTop="5">
            <img id="xfcstxt" src="@drawable/ic_error_black_48dp" w="28sp" tint="#A9a9a9" />
        </frame>
        <horizontal margin="30 35 30 0" gravity="bottom">
            <input id="bg" visibility="gone" hint="#dcdcdc" lines="1" layout_weight="1" />
            <input id="theme" visibility="gone" hint="#dcdcdc" lines="1" layout_weight="1" />
            <input id="toast" visibility="gone" hint="#dcdcdc" lines="1" layout_weight="1" />
        </horizontal>
    </card>
    <card w="*" id="indx__" h="40" foreground="?selectableItemBackground">
        <horizontal margin="10 0">
            <text id="valueB" w="auto" layout_gravity="center" text="设置悬浮窗大小 75" padding="15 5 1 5" textColor="black" textSize="18sp" />
            <seekbar id="seekbar" paddingLeft="-120" w="*" h="*" max="100" progress="75" secondaryProgress="75" />
        </horizontal>
        
    </card>
    
    */}
    
    <text text='BUG修复' margin="10 5 10 0" h="35dp" id="text_bg3"
    gravity="center|left" textSize='16sp' textColor='{{theme.bar}}'>
    </text>
    
    
    
    <horizontal padding="20 4" id="coordinate_adaptation_id" >
        <vertical layout_weight="1" >
            <text text="{{language['coordinate_adaptation']}}" textColor="#000000" textSize="16sp" textStyle="bold" />
            <text text="{{language['coordinate_adaptation_description']}}" textColor="#95000000" textSize="10sp" marginTop="2" />
        </vertical>
        
        <widget-switch-se7en id="coordinate_adaptation" checked="{{helper.坐标兼容}}"
        padding="15 5" textSize="18sp"
        thumbSize='24' radius='24' layout_gravity="center" />
    </horizontal>
    <View bg="#666666" h="1" w="*" margin="10 0" />
    
    <horizontal padding="20 4" id="image_monitoring_id" >
        <vertical layout_weight="1" >
            <text text="{{language['image_monitoring']}}" textColor="#000000" textSize="16sp" textStyle="bold" />
            <text text="{{language['image_monitoring_description']}}" textColor="#95000000" textSize="10sp" marginTop="2" />
        </vertical>
        
        <widget-switch-se7en id="image_monitoring" checked="{{helper.图片监测}}"
        padding="15 5" textSize="18sp"
        thumbSize='24' radius='24' layout_gravity="center" />
    </horizontal>
    <View bg="#666666" h="1" w="*" margin="10 0" />
    
    
    <horizontal padding="20 4" id="image_broker_id" >
        <vertical layout_weight="1" >
            <text text="{{language['image_broker']}}" textColor="#000000" textSize="16sp" textStyle="bold" />
            <text text="{{language['image_broker_description']}}" textColor="#95000000" textSize="10sp" marginTop="2" />
        </vertical>
        
        <widget-switch-se7en id="image_broker" checked="{{helper.图片代理}}"
        padding="15 5" textSize="18sp"
        thumbSize='24' radius='24' layout_gravity="center" />
    </horizontal>
    <View bg="#666666" h="1" w="*" margin="10 0" />
    
    
    <horizontal padding="20 4" id="simulator_tablet_id" >
        <vertical layout_weight="1" >
            <text text="{{language['simulator_tablet']}}" textColor="#000000" textSize="16sp" textStyle="bold" />
            <text text="{{language['simulator_tablet_description']}}" textColor="#95000000" textSize="10sp" marginTop="2" />
        </vertical>
        
        <widget-switch-se7en id="simulator_tablet" checked="{{helper.模拟器}}"
        padding="15 5" textSize="18sp"
        thumbSize='24' radius='24' layout_gravity="center" />
    </horizontal>
    <View bg="#666666" h="1" w="*" margin="10 0" />
    
    
    <text text='应用权限' margin="10 5 10 0" h="35dp" id="text_bg4"
    gravity="center|left" textSize='16sp' textColor='{{theme.bar}}'>
    </text>
    
    <horizontal padding="20 5" id="PROJECT_MEDIA_" >
        <vertical layout_weight="1" >
            <text text="{{language['PROJECT_MEDIA']}}" textColor="black" textSize="16sp" textStyle="bold"/>
            <text text="{{language['PROJECT_MEDIA-expiain'].replace('%packageName%',packageName)}}" textColor="#95000000" textSize="10sp" marginTop="2" />
        </vertical>
        <widget-switch-se7en id="PROJECT_MEDIA" layout_gravity="center" padding="5 5" textSize="18sp"
        margin="10 0" thumbSize='24' radius='24' />
    </horizontal>
    
    <horizontal  padding="20 5" id="front_desk_service_" >
        <vertical layout_weight="1" >
            <text text="前台通知服务" textColor="black" textSize="16sp" textStyle="bold"/>
            <text text="必要权限，用于保持应用在后台运行，需要时会自动开关,无需关心" textColor="#95000000" textSize="10sp" marginTop="2" />
        </vertical>
        <widget-switch-se7en id="front_desk_service" layout_gravity="center" padding="5 5" textSize="18sp"
        margin="10 0" thumbSize='24' radius='24' checked="{{$settings.isEnabled('foreground_service')}}" />
    </horizontal>
    
    <horizontal  padding="20 5" id="ignore_battery_ptimization_" >
        <vertical layout_weight="1" >
            <text text="忽略电池优化" textColor="black" textSize="16sp" textStyle="bold" />
            <text text="为保障应用可以在后台运行,点击进入电池优化界面,选择无限制,并且在多任务界面锁定本应用(后台任务上锁),有无障碍异常/系统杀应用/应用闪退的情况时，请尝试" textColor="#95000000" textSize="10sp" marginTop="2" />
        </vertical>
        <widget-switch-se7en id="ignore_battery_ptimization" layout_gravity="center" padding="5 5" textSize="18sp"
        margin="10 0" thumbSize='24' radius='24' checked="{{$power_manager.isIgnoringBatteryOptimizations()}}" />
    </horizontal>
    
    
    <horizontal padding="20 4" id="self_starting_id" >
        <vertical layout_weight="1" >
            <text text="{{language['self_starting']}}" textColor="#000000" textSize="16sp" textStyle="bold" />
            <text text="{{language['self_starting_description']}}" textColor="#95000000" textSize="10sp" marginTop="2" />
        </vertical>
        
        <widget-switch-se7en id="self_starting" checked="false"
        padding="15 5" textSize="18sp"
        thumbSize='24' radius='24' layout_gravity="center" />
    </horizontal>
    <View bg="#666666" h="1" w="*" margin="10 0" />
    
    
    
    <text text='开发相关' margin="10 5 10 0" h="35dp" id="text_bg4"
    gravity="center|left" textSize='16sp' textColor='{{theme.bar}}'>
    </text>
    
    <horizontal padding="20 4" id="manageimage_run_script_id" >
        <vertical layout_weight="1" >
            <text text="{{language['manageimage_run_script']}}" textColor="#000000" textSize="16sp" textStyle="bold" />
        </vertical>
    </horizontal>
    <View bg="#666666" h="1" w="*" margin="10 0" />
    
    
    {/*<card w="*" id="indx2" margin="10 3 10 3" h="45" cardCornerRadius="10"
    cardElevation="5dp" gravity="center_vertical"  >
    <widget-switch-se7en id="adbc" text="启用ADB点击" checked="false" padding="15 5 15 5" textSize="18sp"
    thumbSize='24'
    radius='24'/>
    <text padding="15 0 0 0" textSize="12" gravity="bottom" text="显示代理点击成功但是没有任何操作时启用" textColor="#808080"/>
    </card>*/}
    
    <vertical padding="0 15">
    </vertical>
    </vertical>
    </ScrollView>
    
    </frame>
    </vertical>
)


//音量暂停辅助
ui.volume_suspended.on("click", (view) => {
    ui.run(() => {
        if (view.checked) {
            tool.writeJSON("监听键", "上");
            ui.volume_suspended_list.setVisibility(0);
        } else {
            ui.volume_suspended_list.setVisibility(8);
            tool.writeJSON("监听键", "关闭");
        }
    })
});
ui.volume_suspended_id.click(() => {
    ui.volume_suspended.performClick()
})
//自动授权辅助截图权限
ui.auto_empower_screenshots.on("click", (view) => {
    storages.create("warbler").put("Capture_automatic", view.checked);

});

ui.auto_empower_screenshots_id.on("click", () => {
    ui.auto_empower_screenshots.performClick();

});



//异常界面超时暂停
ui.unusual_interface_suspended.on("click", (view) => {
    tool.writeJSON("异常超时", view.checked)

});
ui.unusual_interface_suspended_id.click(() => {
    ui.unusual_interface_suspended.performClick();
})
//暂停后返回桌面
ui.suspended_desktop.on("click", (view) => {
    tool.writeJSON("返回桌面", view.checked);
})

ui.suspended_desktop_id.on("click", () => {
    ui.suspended_desktop.performClick()
})

/**
 * ocr类型设置
 */
ui.OCRExtensions_type.on('click', (view) => {
    BottomWheelPicker.setData(Object.keys(ocr_plugin))
        .show().then(result => {
            view.setText(result.text);
            tool.writeJSON("defaultOcr", result.text);

            ui.OCRExtensions.checked = false;
            ui.post(() => {
                ui.OCRExtensions.checked = ocr_plugin[result.text].isInstalled();
            }, 200);

        })
});
ui.OCRExtensions.on("click", (view) => {
    if (view.checked) {
        ocr_plugin[ui.OCRExtensions_type.getText().toString()].install({
            successCallback: function() {
                tool.writeJSON("ocrExtend", true);
            },
            failCallback: function() {
                tool.writeJSON("ocrExtend", false);
            },
        });
    } else {
        toastLog('已安装插件扩展请勿取消');
        view.checked = true;
    }
});
ui.OCRCorrection_rules.on('click', (view) => {
    engines.execScriptFile("./ocrfix.js", {
        arguments: {
            json_path: files.path('../utlis/ocr_矫正规则.json'),

        }
    })
});



//自启动无障碍服务
ui.auto_accessibility.click((view) => {
    let sysmui = ui.inflate(
        <vertical id="parent">
                    <frame>
                        <ScrollView>
                            <vertical>
                                <horizontal margin="0" bg="#00000000">
                                    <img src="file://res/icon.png" w="50" h="30" margin="0 5" />
                                    <text text="安全系统设置权限管理" layout_gravity="left|center_vertical" textColor="#000000" />
                                    <horizontal w="*" h="*" gravity="right" clickable="true" >
                                        <img id="exit" src="@drawable/ic_clear_black_48dp" layout_gravity="center" w="35" height="35" padding="5" marginRight="5" foreground="?selectableItemBackground" />
                                    </horizontal>
                                </horizontal>
                                <linear gravity="center" margin="0 -2">
                                    <View bg="#f5f5f5" w="*" h="2" />
                                </linear>
                                <vertical padding="10 0" >
                                    <text id="wxts" typeface="sans" textColor="#000000" textSize="13sp" />
                                    <text id="wxts_s" w="*" h="*" padding="5" typeface="sans" textColor="#3282fa" textSize="13sp" enabled="true" focusable="true" longClickable="true" />
                                </vertical >
                                
                                
                                <vertical id="grant" marginBottom="5">
                                    <card w="*" id="root" h="*" cardElevation="5" cardCornerRadius="5" margin="10 5" foreground="?selectableItemBackground" >
                                        <vertical margin="10 5" >
                                            <text text="ROOT授权" textSize="22sp" textColor="#000000" />
                                            <text id="root_txt" text="使用root权限获取安全系统设置权限" textSize="13sp" />
                                        </vertical>
                                    </card>
                                    <card w="*" id="Shizuku" h="*" cardElevation="5" cardCornerRadius="5" margin="10 5" foreground="?selectableItemBackground" >
                                        <vertical margin="10 5" >
                                            <text text="Shizuku授权" textSize="22sp" textColor="#000000" />
                                            <text id="Shizuku_txt" text="使用Shizuku应用获取安全系统设置权限，详情查看官网：https://shizuku.rikka.app/zh-hans/" autoLink="web" textSize="13sp" enabled="true" textIsSelectable="true" focusable="true" longClickable="true" />
                                        </vertical>
                                    </card>
                                    
                                    <card w="*" id="indx2" h="*" cardElevation="5" cardCornerRadius="5" margin="10 5" >
                                        <vertical margin="10 5" >
                                            <horizontal>
                                                <text id="adb" text="ADB授权" textSize="22sp" textColor="#000000" />
                                                <horizontal w="*" h="*" gravity="right|center_vertical">
                                                    <text id="adb_s" text="推荐" textColor="#00ff00" padding="6 4" textSize="12" marginRight="10" />
                                                </horizontal>
                                            </horizontal>
                                            <text id="adb_txt" autoLink="web" text="使用adb执行相关命令获取安全系统设置权限，ADB调试方式多种多样，详情B站/百度 ADB使用。或查看群文件/B站 https://b23.tv/utHN8cE 关于自启动无障碍教程视频。安卓11 / 两台手机均可授权" textSize="13sp" textIsSelectable="true" focusable="true" />
                                        </vertical>
                                    </card>
                                </vertical>
                            </vertical>
                        </ScrollView>
                    </frame>
                </vertical>);

    var sysm_b = dialogs.build({
        type: "app",
        customView: sysmui,
        wrapInScrollView: false
    }).on("dismiss", () => {
        ui.auto_accessibility.checked = tool.checkPermission("android.permission.WRITE_SECURE_SETTINGS") ? true : false;
    }).show()
    setBackgroundRoundedRectangle(sysmui.adb_s, 3)
    if (!view.checked) {
        sysmui.grant.setVisibility(8);
        sysmui.wxts.setText(language.cancel_authorization)
        sysmui.wxts_s.setText("adb shell pm revoke " + package_name + " android.permission.WRITE_SECURE_SETTINGS")
    } else {

        let shellScript = 'adb shell pm grant ' + package_name + ' android.permission.WRITE_SECURE_SETTINGS'

        sysmui.wxts.setText(language.authorization_accessibility)
        sysmui.wxts_s.setText(shellScript)
    }
    sysmui.wxts_s.click((view) => {
        setClip(view.getText())
        toastLog(language.copy_tips)
    })
    sysmui.root.click(() => {
        if ($shell.checkAccess("root")) {
            shell("pm grant " + package_name + " android.permission.WRITE_SECURE_SETTINGS", {
                root: true,
            });
            toastLog("root" + language.authorization_tips_yes);
            sysm_b.dismiss()
        } else {
            toastLog(language.authorization_tips_on + "root")
        }
    })
    sysmui.Shizuku.click(() => {
        if ($shell.checkAccess("adb")) {
            shell("pm grant " + package_name + " android.permission.WRITE_SECURE_SETTINGS", {
                adb: true,
            });
            toastLog("ADB" + language.authorization_tips_yes);
            sysm_b.dismiss()
        } else {
            toastLog(language.authorization_tips_on + "Shizuku")
        }
    })
    sysmui.exit.click(() => {
        sysm_b.dismiss()
    })

    function setBackgroundRoundedRectangle(view, w, bg) {
        w = w || 5
        bg = bg || Color.GREEN
        gradientDrawable = new GradientDrawable();
        gradientDrawable.setShape(GradientDrawable.RECTANGLE);
        gradientDrawable.setStroke(5, bg);
        gradientDrawable.setCornerRadius(10);
        gradientDrawable.setSize(50, 50);
        view.setBackground(gradientDrawable);
    }

})
ui.auto_accessibility_id.click((view) => {
    ui.auto_accessibility.performClick()
})

//坐标自适应
ui.coordinate_adaptation.click((view) => {
    tool.writeJSON("坐标兼容", view.checked);
})
ui.coordinate_adaptation_id.click(() => {
    ui.coordinate_adaptation.performClick();
})

//图片监测
ui.image_monitoring.click((view) => {
    tool.writeJSON("图片监测", view.checked)
})
ui.image_monitoring_id.click(() => {
    ui.image_monitoring_description.performClick()
})


//图片代理
ui.image_broker.on("click", (view) => {
    tool,
    writeJSON("图片代理", view.checked);
});
ui.image_broker_id.click(() => {
    ui.image_broker.performClick();
})


//兼容模拟器平板版
ui.simulator_tablet.on("click", (view) => {
    tool.writeJSON("模拟器", view.checked);

})
ui.simulator_tablet_id.click(() => {
    ui.simulator_tablet.performClick();
})

ui.PROJECT_MEDIA.click((view) => {

    let cmd = "appops set " + packageName + " PROJECT_MEDIA " + (view.checked ? "allow" : "ignore");
    let sh_manner = "root";
    let counting = 2;
    while (counting--) {
        let sh_ = {};
        sh_[sh_manner] = true;
        if ($shell.checkAccess(sh_manner)) {
            if (shell(cmd, sh_).code == 0) {
                toastLog((view.checked ? "" : language["cancel"]) + language['grant'].replace("%results%", language["ok"]) + sh_manner)

                return true;
            } else {
                view.checked = (view.checked ? false : true);
                toastLog((view.checked ? "" : language["cancel"]) + language['grant'].replace("%results%", language["no"]) + language["identify-grant"] + sh_manner)
            };
        } else {
            toastLog(language['identify-permissions'] + sh_manner)
        }
        sh_manner = "adb";
    }

    view.checked = false;
})
ui.PROJECT_MEDIA_.on("click", () => {
    ui.PROJECT_MEDIA.performClick();
});

//前台通知服务
ui.front_desk_service.on("click", (view) => {
    view.checked ? $settings.setEnabled('foreground_service', true) : $settings.setEnabled('foreground_service', false);
})
ui.front_desk_service_.on("click", (view) => {
    ui.front_desk_service.performClick()
})

//允许应用自启动
ui.self_starting.click((view) => {
    app.openAppSetting(package_name);
});
ui.self_starting_id.click(() => {
    ui.self_starting.performClick()
})

//管理运行脚本
ui.manageimage_run_script_id.click((view) => {
    require('./script.js').Administration()
})




//使用高级权限截图
ui.senior_screenshot.on("click", (view) => {
    ui.senior_screenshot_list.attr("visibility", view.checked ? "visible" : "gone")
    tool.writeJSON("截图方式", "辅助");
});



ui.root_screenshot.on("click", () => {
    $shell.setDefaultOptions({
        adb: false
    });
    files.createWithDirs(package_path + "library/screencap.png")
    if (shell("screencap -p " + package_path + "library/screencap.png", true).code == 0) {
        toast(language.root_screenshot_tips)
        ui.root_screenshot.checked = true;
        tool.writeJSON("截图方式", "root")

    } else {
        toastLog(language.screenshot_no);
        ui.root_screenshot.checked = false;
        tool.writeJSON("截图方式", "辅助");
        return

    }
})
ui.shizuku_screenshot.on("click", (view) => {
    try {
        $shell.setDefaultOptions({
            adb: true
        });
        files.createWithDirs(package_path + "library/screencap.png")
        let adb = shell("screencap -p " + package_path + "library/screencap.png")

        if (adb.code == 0) {
            toast(language.shizuku_screenshot_tips)

            // ui.Shizuku.checked = true;
            tool.writeJSON("截图方式", "Shizuku")
        } else {
            toastLog(language.screenshot_no + adb);
            ui.shizuku_screenshot.checked = false;
            tool.writeJSON("截图方式", "辅助");
            return
        }
    } catch (err) {
        toastLog(language.shizuku_screenshot_no + err);
        ui.shizuku_screenshot.checked = false;
        tool.writeJSON("截图方式", "辅助");

    }
});

/*
//前台通知服务
ui.qtfw.on("check", (checked) => {
    ui.qtfw.checked ? $settings.setEnabled('foreground_service', true) : $settings.setEnabled('foreground_service', false);
})
ui.qtfwtxt.on("click", () => {
    提示(ui.qtfwtxt, ui.qtfw, "开启后脚本运行更稳定，必要时程序将自动开启")
})
//悬浮窗主题色
ui.xfcs.on("check", (checked) => {
    if (checked) {
        ui.run(() => {
            ui.bg.attr("visibility", "visible");
            ui.theme.attr("visibility", "visible");
            ui.toast.attr("visibility", "visible");
            ui.indx.attr("h", "80")
        })
    } else {
        ui.run(() => {
            ui.bg.attr("visibility", "gone");
            ui.theme.attr("visibility", "gone");
            ui.toast.attr("visibility", "gone");
            ui.indx.attr("h", "45")
        })
        Matching.写入("bg", "#Aeeeee");
        Matching.写入("theme", "#a9a9a9");
        Matching.写入("toast", "#FF8C00");
    }
})
ui.xfcstxt.on("click", () => {
    提示(ui.xfcstxt, ui.xfcs, "左边为悬浮窗背景色，中间为悬浮窗图标颜色，\n右边为悬浮窗字体颜色，手动关闭可还原初始状态\n不懂具体如何输入请百度十六进制颜色码")
})
//悬浮窗大小
var seekbarListener = new android.widget.SeekBar.OnSeekBarChangeListener({
    onProgressChanged: function (v, progress, fromUser) {
        try {
            if (v == ui.seekbar) {
                if (progress <= 50) {
                    progress = 50;
                }
                ui.seekbar.progress = progress;
                ui.valueB.setText("设置悬浮窗大小 " + String(parseInt(progress)));
                Matching.写入("Floaty_size", progress / 100);

            }
        } catch (e) {
            console.error(e)
        }
    }
});
ui.seekbar.setOnSeekBarChangeListener(seekbarListener);
//页面主题色
ui.tecr.on("check", (checked) => {
    if (checked) {
        ui.run(() => {
            ui.inputd_tecr.attr("visibility", "visible");
            ui.inputd_tecr_b.attr("visibility", "visible");
            ui.indx_tecr.attr("h", "80")
        })
    } else {
        ui.run(() => {
            ui.inputd_tecr.attr("visibility", "gone");
            ui.inputd_tecr_b.attr("visibility", "gone");
            ui.indx_tecr.attr("h", "40")
        })
        let txt = "#926e6d";
        ui.statusBarColor(txt);
        ui.toolbar.attr("bg", txt);
        txt = colors.parseColor(txt);
        ui.text_bg.setTextColor(txt);
        ui.text_bg2.setTextColor(txt);
        ui.text_bg3.setTextColor(txt);
        ui.text_bg4.setTextColor(txt);
        storages.create("configure").put("theme_colors", {
            bar: "#926e6d"
        })
    }
})
ui.tecrtxt.on("click", () => {
    提示(ui.tecrtxt, ui.tecr, "关闭开关还原默认页面主题色")
})
    ui.zdjs.on("check", (checked) => {
    Matching.写入("解锁屏幕", checked);
    if (checked) {
        ui.run(() => {
            ui.indx3.attr("h", "80")
            ui.inputd.attr("visibility", "visible");
        })
        if (password != null || password != undefined) {
            if (password.length >= 4) {
                ui.inputd.setHint("*****")
            }
        }
    } else {
        ui.run(() => {
            ui.indx3.attr("h", "45")
            ui.inputd.attr("visibility", "gone")
        })
        storage.put("password", null);
        // ui.inputd.setText("");
    }

});
ui.zdjstxt.on("click", () => {
    提示(ui.zdjstxt, ui.zdjs, "锁屏密码仅用于定时任务执行时解锁屏幕，支持图案密码九宫格1~9，请自行转换")
})
ui.input_file4.on("click", () => {
    File_selector(".js");
})
*/







/*function 是否有查看使用情况的权限() {
    importClass(android.app.AppOpsManager);
    let appOps = context.getSystemService(context.APP_OPS_SERVICE);
    let mode = appOps.checkOpNoThrow(
        "android:get_" + "usage_stats",
        android.os.Process.myUid(),
        context.getPackageName()
    );
    return (granted = mode == AppOpsManager.MODE_ALLOWED);
}*/
/*


ui.inputd_tecr.on("key", function (keyCode, event) {
    if (event.getAction() == 0 && keyCode == 66) {
        颜色码(ui.inputd_tecr, "theme_colors");
        event.consumed = true;
    }
});

ui.inputd_tecr_b.on("click", () => {
    engines.execScript("Color_selector_ui", java.lang.String.format("'ui';require('./lib/prototype/Colour_list.js');"));
});
ui.emitter.on("resume", function () {
    let themes = theme.bar
    theme = storages.create('themes').get('theme')
    if (themes.bar != theme.bar) {
        ui.statusBarColor(theme.bar);
        ui.toolbar.attr("bg", theme.bar);
        theme.bar = colors.parseColor(theme.bar);
        ui.text_bg.setTextColor(theme.bar);
        ui.text_bg2.setTextColor(theme.bar);
        ui.text_bg3.setTextColor(theme.bar);
        ui.text_bg4.setTextColor(theme.bar);
    }
})
ui.bg.on("key", function (keyCode, event) {
    if (event.getAction() == 0 && keyCode == 66) {
        颜色码(ui.bg, "bg");
        event.consumed = true;
    }
});

ui.theme.on("key", function (keyCode, event) {
    if (event.getAction() == 0 && keyCode == 66) {
        颜色码(ui.theme, "theme")
        event.consumed = true;
    }
});
ui.toast.on("key", function (keyCode, event) {
    if (event.getAction() == 0 && keyCode == 66) {
        颜色码(ui.toast, "toast");
        event.consumed = true;
    }
});


function 颜色码(id, ids, txt, oper) {
    if (id.text().indexOf("0x") > -1) {
        txt = colors.toString(id.text());
    } else {
        txt = id.text();
    }
    try {
        id.setTextColor(Color.parseColor(txt));
        id.setHint(txt);
        id.setText(null);
        if (ids == "theme_colors") {
            storages.create("configure").put("theme_colors", {
                bar: txt
            });
            ui.statusBarColor(txt);
            ui.toolbar.attr("bg", txt);
            txt = colors.parseColor(txt);
            ui.text_bg.setTextColor(txt);
            ui.text_bg2.setTextColor(txt);
            ui.text_bg3.setTextColor(txt);
            ui.text_bg4.setTextColor(txt);

        } else {
            Matching.写入(ids, txt);
        }

        return true;
    } catch (er) {
        console.error(er);
        id.setError("自定义的主题色不是\n16进制六位或八位颜色码");
    }
}


ui.inputd.on("key", function (keyCode, event) {
    if (event.getAction() == 0 && keyCode == 66) {
        if (ui.inputd.text().length >= 4) {
            let storage = storages.create("time");
            storage.put("password", ui.inputd.text());
            toast("密码保存成功");
            ui.inputd.setHint(ui.inputd.text());
            ui.inputd.setText(null);

        } else {
            ui.inputd.setError("密码低于四位数无法保存!")
        }
        event.consumed = true;
    }
});
*/
function File_selector(mime_Type, fun) {
    toastLog("请选择后缀为.js类型的文件");
    let FileChooserDialog = require("./prototype/file_chooser_dialog");
    FileChooserDialog.build({
        title: '请选择后缀为.js的文件',
        type: "app-or-overlay",
        // 初始文件夹路径
        dir: "/sdcard/",
        // 可选择的类型，file为文件，dir为文件夹
        canChoose: ["file"],
        mimeType: mime_Type,
        wrapInScrollView: true,
        // 选择文件后的回调
        fileCallback: (file) => {
            if (file == null) {
                toastLog("未选择路径");
                return
            }

            console.info("选择的文件路径：" + file);
            modular_id(file)

        }

    }).show();

}

activity.setSupportActionBar(ui.toolbar);
activity.getSupportActionBar().setDisplayHomeAsUpEnabled(true);
ui.toolbar.setNavigationOnClickListener({
    onClick: function() {
        ui.finish();
    }
});

/*
importClass(android.view.MenuItem);
//在toolbar添加按钮
ui.emitter.on('create_options_menu', menu => {
    let item = menu.add(0, 17, 0, '模块仓库');
    item.setShowAsAction(MenuItem.SHOW_AS_ACTION_IF_ROOM | MenuItem.SHOW_AS_ACTION_WITH_TEXT);
});

//监听菜单选项点击
ui.emitter.on('options_item_selected', (e, item) => {
    if (item.getTitle() == '模块仓库') {
        engines.execScriptFile('./lib/Module_platform.js');
    }
})
*/
//当离开本界面时保存
ui.emitter.on("pause", () => {

    if (ui.volume_suspended.checked) {
        tool.writeJSON("监听键", ui.volume_suspended_list.getChildAt(1).checked ? "下" : "上");
    }




});


update_ui()

function update_ui() {
    ui.run(() => {
        ui.OCRExtensions_type.setText(helper.defaultOcr || 'undefined');
        ui.OCRExtensions_type.setBackground(createShape(5, 0, 0, [2, theme.bar]));
        ui.OCRCorrection_rules.setBackground(createShape(5, 0, 0, [2, theme.bar]));
        if (helper.defaultOcr) helper = tool.writeJSON("ocrExtend", ocr_plugin[helper.defaultOcr].isInstalled());

        ui.OCRExtensions.checked = helper.ocrExtend || false;

        ui.volume_suspended.setRadius(25);
        ui.auto_empower_screenshots.setRadius(25);

        ui.senior_screenshot.setRadius(25);
        ui.unusual_interface_suspended.setRadius(25);
        ui.suspended_desktop.setRadius(25);
        ui.auto_accessibility.setRadius(25);
        ui.coordinate_adaptation.setRadius(25);
        ui.image_monitoring.setRadius(25);
        ui.image_broker.setRadius(25);
        ui.simulator_tablet.setRadius(25);
        ui.self_starting.setRadius(25);
        try {
            let appOpsManager = context.getSystemService(context.APP_OPS_SERVICE);
            ui.PROJECT_MEDIA.checked = (appOpsManager.checkOpNoThrow(appOpsManager.OPSTR_PROJECT_MEDIA, android.os.Process.myUid(), packageName) == appOpsManager.MODE_ALLOWED);
        } catch (e) {
            console.error(e);
            ui.PROJECT_MEDIA.checked = context.getPackageManager().checkPermission("android.permission.PROJECT_MEDIA", packageName) == PackageManager.PERMISSION_GRANTED;
        }

    })
}