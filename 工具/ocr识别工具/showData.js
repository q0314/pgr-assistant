function showData(dataList, imgPath, ocrType, ocr) {

    var img = imgPath;
    console.info(img)
    if (files.exists(imgPath)) {
        img = images.read(imgPath);
    }

    var canvas = new Canvas(img);
    let rectanglePaint = new Paint();
    rectanglePaint.setStrokeWidth(3);
    rectanglePaint.setColor(colors.parseColor("#00ff00"));
    rectanglePaint.setStyle(Paint.Style.STROKE); //空心矩形框

    let textPaint = new Paint();
    textPaint.setTextAlign(Paint.Align.CENTER);
    textPaint.setTextSize(30);
    textPaint.setStyle(Paint.Style.FILL);
    textPaint.setColor(colors.parseColor("#f000ff"));
    let fontMetrics = textPaint.getFontMetrics();


    switch (ocr) {
        case '第三方Mlkit':
            let len = dataList.length;
            log("mlkit识别结果总数量" + len)
            for (var i = 0; i < len; i++) {

                let data = dataList[i]
                let frame = data.bounds;
                let rect = [frame.left, frame.top, frame.right, frame.bottom];
                canvas.drawRect(rect[0], rect[1], rect[2], rect[3], rectanglePaint);
                canvas.drawText(
                    data.label,
                    rect[0] + parseInt((rect[2] - rect[0]) / 2),
                    rect[3] + Math.abs(fontMetrics.top),
                    textPaint
                );
            }
            break
       case '官方Mlkit':
            let len2 = dataList.length;
            log("官方mlki识别结果总数量" + len2)
            for (var i = 0; i < len2; i++) {
     
                let data = dataList[i]
                let frame = data.bounds;
                let rect = [frame.left, frame.top, frame.right, frame.bottom];
                canvas.drawRect(rect[0], rect[1], rect[2], rect[3], rectanglePaint);
                canvas.drawText(
                    data.text,
                    rect[0] + parseInt((rect[2] - rect[0]) / 2),
                    rect[3] + Math.abs(fontMetrics.top),
                    textPaint
                );
            }
          case 'PaddleOCR':
               let len3 = dataList.length;

            log("官方PaddleOCR识别结果总数量" + len3)
            for (var i = 0; i < len3; i++) {
     
                let data = dataList[i]
                 console.info(data)
   
                let frame = data.bounds;
                let rect = [frame.right, frame.top, frame.left, frame.bottom];
                canvas.drawRect(rect[0], rect[1], rect[2], rect[3], rectanglePaint);
                canvas.drawText(
                    data.text,
                    rect[0] + parseInt((rect[2] - rect[0]) / 2),
                    rect[3] + Math.abs(fontMetrics.top),
                    textPaint
                );
            }
         
              
           break
    }

    var image = canvas.toImage();
    let newFilename = ocrType + ".png";
    let newFilepath = files.cwd() + "/" + newFilename;
    files.createWithDirs(newFilepath);
    images.save(image, newFilepath);
    log("识别后的图片保存路径: " + newFilepath);
    img.recycle();
    image.recycle()
    app.viewFile(newFilepath)
    return newFilepath;
}
/*
events.on("exit", function() {
    log("结束运行 模块脚本");
});
*/
module.exports = showData;