importClass(android.widget.AdapterView);
importClass(android.content.Context);


var intent = engines.myEngine().execArgv.intent;

sleep(100);
log(intent);
if (intent == null) {
    toastLog("请使用定时任务运行此脚本");
    exit();
};
device.wakeUp();
device.wakeUpIfNeeded();

let extras = intent.extras;
let id_str;
if (extras) {
    let iter = extras.keySet().iterator();
    while (iter.hasNext()) {
        let key = iter.next();
        if (key == "task_id") {
            id_str = extras.get(key);
            break;
        }

    }
}

toast("定时任务执行中");
console.warn("定时任务执行中");

if (id_str == undefined) {
    toast("定时任务id为空，取消执行")
    console.error("定时任务id为空，取消执行")
    exit();
}


function 判断() {
    var Floaty;
    var Timing_data;
    var tool = require('./utlis/app_tool.js');
     var helper = tool.readJSON("helper");
    var timed_tasks = tool.readJSON("timed_tasks");
    var theme = require("./theme.js");
    var language = theme.language.main;
    sleep(100);


    if (floaty.checkPermission() == false) {
        console.error("定时任务启动失败，请先授予明日计划悬浮窗权限！");
        return;
    }

    if (tool.autoService(true) == false) {
        toast("定时任务启动失败，无障碍服务异常！请检查是否正常开启！");
        console.error("定时任务启动失败，无障碍服务异常！请检查是否正常开启！");
        return;
    };

    if (!files.exists("./library/gallery/返回.png")) {
        toast("定时任务启动失败，图库缺失,请在主页左上角重新选择!")
        console.error("定时任务启动失败，图库缺失,请在主页左上角重新选择!")
        return;
    }
    if (helper.最低电量) {
        if (!device.isCharging() && device.getBattery() < helper.最低电量) {
            toast("定时任务启动失败，电量低于设定值" + helper.最低电量 + "%且未充电");
            console.error("定时任务启动失败，电量低于设定值" + helper.最低电量 + "%且未充电");
            return;
        };
    };


    log("尝试唤醒设备");
    device.wakeUpIfNeeded()
    if (!device.isScreenOn()) {
        device.wakeUp()

    if (helper.自动解锁) {

        log('======自动解锁======')

        var password = tool.readJSON("password");
        let ExternalUnlockDevice = files.exists(password) ? require(password) : null

        if (ExternalUnlockDevice) {
            log('使用自定义解锁模块')
            try {
                ExternalUnlockDevice.implement();

            } catch (err) {
                toastLog("自定义解锁模式发生异常：" + err)
                console.error("自定义解锁模式发生异常：" + err)
                exit();
            }
        }

    } else {
        toast("未开启自动自动解锁，仅点亮屏幕尝试下")
        console.warn("未开启自动自动解锁，仅点亮屏幕尝试下")
        device.wakeUp();
    }
}
    console.info("定时任务ID："+id_str)
   for (let i = 0; i < timed_tasks.length; i++) {
        console.info("任务配置ID："+timed_tasks[i].id)
        if (timed_tasks[i].id == id_str) {
            Timing_data = timed_tasks[i];
            id_str = i;
            break
        }
    }
    sleep(200)
    if (Timing_data == undefined) {
        throw new Error("解析数据失败, 未定义：" + Timing_data)
    }
    
    sleep(500);
    app.launchPackage(context.getPackageName())
    sleep(2000)
    if (Floaty = tool.script_locate("Floating.js")) {
        toastLog("关闭上一个悬浮窗，启动新程序")
        Floaty.emit("暂停", "关闭程序");
    }

   if(Timing_data.frequency){
    tool.writeJSON("挑战次数", Timing_data.frequency);
    }
    if(Timing_data.serum != false){
    tool.writeJSON("注射血清", Timing_data.serum);
    }
    tool.writeJSON("静音",Timing_data.volume)
    sleep(500);
    tool.writeJSON("包名", Timing_data.app_package);

    $settings.setEnabled('foreground_service', true);
    var js= "./Floating.js"
  
    engines.execScriptFile(js)
/*
    setTimeout(function() {
        if(Timing_data.screen){
            console.info("将在熄屏状态下运行此定时任务")
            let execution = engines.all();
            for (let i = 0; i < execution.length; i++) {
                if (execution[i].getSource().toString().indexOf("Screen operation") > -1) {
                    console.verbose("已停止运行同名脚本")
                    execution[i].forceStop();
                }
            }
            engines.execScript("Screen operation", "if(files.exists(files.path('./utlis/screen.js'))){require('./utlis/screen.js').mask()}else{require('./screen.js').mask()}");
          };
    },3000)
    */
    setTimeout(function() {
        if (Timing_data.shijian.indexOf(language.elapsed_time_abbreviation[0]) != -1) {
            console.verbose("删除单次定时任务")
            timed_tasks.splice(id_str, 1);
            tool.writeJSON("timed_tasks", timed_tasks,"timed_tasks");
        }
        threads.shutDownAll();
        exit();
    }, 30000);

}
threads.start(function(){
engines.execScript("new timed_tasks", "var Config=engines.myEngine().execArgv;var id_str = Config.id;eval(Config.load)();", {
    arguments: {
        load: 判断.toString(),
        id: id_str,
    },
});
})