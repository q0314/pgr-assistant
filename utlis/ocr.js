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
    初始化Manager类: function(moniqi) {
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
    识别: function(image, region_, filter) {
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
                    retext = 矫正规则("./utlis/ocr修正规则.json", retext)
                    //console.info(retext)
                    if (!retext) {
                        continue;
                    }
                    taglb.push({
                        text: retext,
                        left: re.bounds.left,
                        top: re.bounds.top,
                        right: re.bounds.right,
                        bottom: re.bounds.bottom,
                    });


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
    销毁: function() {
        log("无需销毁模型")
    },
    矫正规则测试:function(path,retext){
       if(!files.exists(path)){
        toastLog("规则文件不存在,路径:"+path)
        return 
       }
    retext = 矫正规则(path, retext)
    toastLog(retext)
    return retext;
    }

};
function 矫正规则(rectify_json_path, content) {
    var rectify_json = JSON.parse(
        files.read(rectify_json_path, (encoding = "utf-8"))
    );
    if (rectify_json.replace_some_characters) {
        rectify_key = Object.keys(rectify_json.replace_some_characters);

        for (let t = 0; t < rectify_key.length; t++) {
            // console.verbose(rectify_key[t])
            if (rectify_json.replace_some_characters[rectify_key[t]].regular) {
                let matching = content.match(new RegExp(rectify_key[t], "g"));
                if (matching) {
                    //直接用matching[0]只能替换一次
                    content = content.replace(new RegExp(rectify_key[t], "g"), rectify_json.replace_some_characters[rectify_key[t]].correct)
                }
            } else {
                if (content.indexOf(rectify_key[t]) != -1) {
                    content = content.replace(rectify_key[t], rectify_json.replace_some_characters[rectify_key[t]].correct)
                }
            }

        }
    }
    if (rectify_json.replace_full_character) {
        rectify_key = Object.keys(rectify_json.replace_full_character);

        for (let t = 0; t < rectify_key.length; t++) {

            if (rectify_json.replace_full_character[rectify_key[t]].regular) {
                let matching = content.match(new RegExp(rectify_key[t], "g"));
                if (matching) {
                    content = rectify_json.replace_full_character[rectify_key[t]].correct;
                }
            } else {
                if (content == rectify_key[t]) {
                    content = rectify_json.replace_full_character[rectify_key[t]].correct;
                }
            }
        }
    }

    if (rectify_json.filter_partial_characters) {
        rectify_key = Object.keys(rectify_json.filter_partial_characters);

        for (let t = 0; t < rectify_key.length; t++) {
            //  console.verbose(rectify_key[t])

            if (rectify_json.filter_partial_characters[rectify_key[t]]) {
                let matching = content.match(new RegExp(rectify_key[t]));
                if (matching && (matching.input != matching[0])) {
                    return false
                }
            } else {

                if (content.indexOf(rectify_key[t]) != -1 && (content.length != rectify_key[t].length)) {
                    return false
                }
            }
        }
    }

    if (rectify_json.filter_full_characters) {
        rectify_key = Object.keys(rectify_json.filter_full_characters);

        for (let t = 0; t < rectify_key.length; t++) {
            //  console.verbose(rectify_key[t])

            if (rectify_json.filter_full_characters[rectify_key[t]]) {
                let matching = content.match(new RegExp(rectify_key[t]));
                if (matching && (matching.input == matching[0])) {
                    return false
                }
            } else {
                if (content == rectify_key[t]) {
                    return false
                }
            }
        }
    }
    return content
}
try {
    module.exports = ocr_modular;
} catch (e) {
    let retext = "四流";
    retext = 矫正规则("/storage/emulated/0/脚本/明日计划64位/lib/prototype/ocr_公招_矫正规则.json", retext)
    toastLog(retext)
}
events.on("exit", function() {
    sleep(2000);
})