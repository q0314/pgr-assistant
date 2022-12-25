/*
// 本插件理论上支持4.1.1开始的所有版本的AutoJS
 // AutoJS Pro 9需要改为$plugins 不过pro建议直接使用官方的那个插件
 let $mlKitOcr = plugins.load('com.tony.mlkit.ocr')
 requestScreenCapture()
 let img = captureScreen()
 // 识别图片中的纯文本
 let text = $mlKitOcr.recognizeText(img)
 console.log('text:', text)
 // 可选参数 region[x, y, w, h] 识别指定区域的文本
 let textInRegion = $mlKitOcr.recognizeText(img, { region: [10, 10, 500, 1000] })
 console.log('text in region:', textInRegion)
 // 获取图片中文本携带位置信息
 let resultList = $mlKitOcr.detect(img)
 console.log('resultList:', JSON.stringify(resultList))
 // 可选参数region和上面的一样
 let resultListInRegion = $mlKitOcr.detect(img, { region: [10, 10, 500, 1000] })
 console.log('result list in region:', JSON.stringify(resultListInRegion))
 // 返回列表字段定义 返回的是一行的文本信息
 /*
 OcrResult {
 label: // 当前行文本信息
 bounds: // 所在区域 Rect 对象
 confidence: // 置信度 0->1
 elements: // OcrResult 行内拆分的元素
 }
 
 */
var $mlKitOcr,
    width = device.width,
    height = device.height;

var ocr_modular = {
    初始化Manager类: function (moniqi) {
        //适配模拟器平板版
        if (moniqi) {
            width = device.height
            height = device.width
        }
        importClass(android.os.Build);

        log("战双辅助架构：" + Build.CPU_ABI)
        $mlKitOcr = plugins.load('com.tony.mlkit.ocr')
        log("OCR支持的架构：" + $mlKitOcr.get_ABI)
        if (device.product == "SM-G9750" && device.release == 9) {
            //"雷电9仅可使用x86-32位ocr插件\n\nhttps://234599.lanzouv.com/iyraG0fjzukf"
            return false
        }
        if (app.autojs.versionCode <= 8082200 && $mlKitOcr.get_ABI.indexOf('arm64-v8a') != -1) {
            return false
        }

        return true
    },
    识别: function (image, region_, filter) {
        let start = new Date()
        let results = null;
        results = $mlKitOcr.detect(image, {
            region: region_,
        });
        !image.isRecycled() && image.recycle();


        var taglb = [];
        // 解析结果
        if (results != null) {
            let quantity = results.length;
            if (quantity > 0) {
                console.verbose("过滤识别结果中")
                for (let i = 0; i < quantity; i++) {
                    var re = results[i]
                    var retext = re.label
                    if (retext == false) {
                        continue;
                    }
                    //对识别错误的文本内容进行矫正
                    switch (retext) {
                        case "舍":
                            retext = "宿舍";
                            break
                        case "-键领取":
                            retext = "一键领取";
                            break
                      
                        case "已售馨":
                            retext = "已售罄";
                            break
                    }
                    retext = retext.replace("エ", "工");
                    retext = retext.replace(/(指辉|指择)/g, '指挥')
                    retext = retext.replace("以员", "成员");
                    retext = retext.replace("峽想", "映想");
                    retext = retext.replace("来购", "采购")
                    retext = retext.replace(/(no0|noo|n00)/g, '/100')
                    retext = retext.replace('健', '键');
                    retext = retext.replace("(", "");
                    retext = retext.replace("+|", "+")
                    retext = retext.replace("O/", "0/")
                    retext = retext.replace('抚模', '抚摸');
                    retext = retext.replace('次數', '次数');
                    retext = retext.replace(/(抚摸次数 |抚摸次数、)/g, '抚摸次数');
                    
                    retext = retext.replace(/(次数O)/g, '次数0');
                    retext = retext.replace(/(次数S)/g, '次数3');
                    retext = retext.replace("按取", "接取");
                    retext = retext.replace("奏托","委托");
                    retext = retext.replace("今运势","今日运势");
                    retext = retext.replace("宿含","宿舍");
                    retext = retext.replace(/(执勒|執勤)/,"执勤");
                    retext = retext.replace(/(委魏|委)/,"委托");
                    switch (retext) {
                        default:
                            taglb.push({
                                text: retext,
                                left: re.bounds.left,
                                top: re.bounds.top,
                                right: re.bounds.right,
                                bottom: re.bounds.bottom,
                            });

                    }


                }
            }

            log("识别结果数量: " + quantity + '\n耗时' + (new Date() - start) + 'ms');
        };
        try {
            !image.isRecycled() && image.recycle();
        } catch (e) {

        }
        results = null;
        return taglb
    },
    销毁: function () {
        log("无需销毁模型")
    }
};
module.exports = ocr_modular;
events.on("exit", function () {
    sleep(2000);
})