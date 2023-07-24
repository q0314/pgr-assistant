<!--

 * @Author: 梦月時謌
 * @Date: 2022-12-15 22:51:45
 * @LastEditTime: 
-->

# 战双帕弥什助手

战双帕弥什助手,建议在auto.js Pro8,auto.js pro9中运行

### 开发工具
以下均为手机端开发工具

Auto.js pro 付费，
https://pro.autojs.org/

Auto.js 免费，bug多，开发者已不再维护
https://hyb1996.github.io/AutoJs-Docs/#/
 
Autox.js 免费，第三方维护的auto.js免费版
http://doc.autoxjs.com/

### 目录说明 （截至2023-01-11）
```
pgr-assistant
├─activity                        界面目录
│  └─languages                    语言包存放目录
│      zh-CN.json
│      ...                             
│    about.js                     关于界面
│    basics.js                    设置界面
│    debug.js                     应用内代码测试界面
│    devices.js                   模拟器/虚拟机使用情况界面
│    initialize.js                初始化坐标界面
│    journal.js                   运行日志界面
├─build                           aj打包时自动产生的构建目录
├─images                          aj打包时自动产生的图标目录
├─library                         存放坐标信息,图库文件目录
│  ├─coordinate                   预置坐标信息文件目录
│  │    1080x2160.json
│  │    ...     
│  └─gallery                      解压后的图库文件目录
│    coordinate.json              坐标信息
│    screencap.sh                 shizuku截图执行文件
│    图片路径.txt                  用于指向图库文件所在目录
├─res                             aj打包时自动产生的资源目录
├─utlis                           配套方法,模块源码目录
│    ocr.js                       ocr识别管理模块
│    gallery.js                   图库文件管理模块
│    ...
│ Floaty.js                       悬浮窗
│ main.js                         主界面
│ ITimg.js                        截图,找图识别,ocr识别模块
│ progra.js                       **脚本逻辑文件**
│ theme.js                        界面主题模块
| ...                             待补充
```
