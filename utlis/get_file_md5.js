/**
 * 获取指定文件夹内的文件/文件夹内的文件md5
 * 生成指向的文件夹/config/files_md5.json文件
 */
importClass(java.io.FileInputStream);
importClass(java.io.File);
importClass(java.math.BigInteger);
importClass(java.security.MessageDigest);
/**
 * 指向一个相对路径
 * 在战双协作app内也可使用:运行日志-代码测试-第二输入框- ./utlis/get_file_md5.js 执行脚本文件
*/
let path = "./";
let autojs_build_ignore = open(path + ".autojs.build.ignore", mode = "r", encoding = "utf-8");
autojs_build_ignore = autojs_build_ignore.readlines();
let agg = {}
statistical_file(path)

function statistical_file(dir) {
    var list = files.listDir(dir);
    var len = list.length;

    for (let i = 0; i < len; i++) {
        var child = files.join(dir, list[i]);

        console.info(child)
        for (let lines of autojs_build_ignore) {
            if ("." + lines == child) {
                console.log(child + " 是项目自动生成文件.或初始应用包已有无需重复下载的文件")
                child = false;
            }
        }
        if (child === false) {
            continue;
        }
        if (files.isFile(child)) {
            let route = files.path(child)
            child = child.replace(path, "")
            agg[child] = {
                "md5": getFileMD5(route),
                "size": new FileInputStream(route).available()
            }
        } else if (files.isDir(child)) {
            statistical_file(child)
        }
    }
}



/**
 * 获取单个文件的MD5值！

 * @param file
 * @return
 */

function getFileMD5(file) {
    try {
        return $crypto.digest(file, "MD5", {
            input: "file",
            output: "hex"
        })
    } catch (e) {
        //$crypto在aj4.ajx不可用，还有java方法

    }

    file = new File(file);
    if (!file.isFile()) {
        return null;
    }
    let buffer = util.java.array('byte', 1024); //byte[]
    //  let buffer= new byte[1024];
    let len;
    try {
        digest = MessageDigest.getInstance("MD5");
        let in_ = new FileInputStream(file);
        while ((len = in_.read(buffer, 0, 1024)) != -1) {
            digest.update(buffer, 0, len);
        }
        in_.close();
    } catch (e) {
        e.printStackTrace();
        return null;
    }
    let bigInt = new BigInteger(1, digest.digest());
    return bigInt.toString(16);
}

log(JSON.stringify(agg))
files.ensureDir(path + "utlis/files_md5.json")
files.write(
    path + "utlis/files_md5.json",
    JSON.stringify(agg),
    (encoding = "utf-8")
)
toastLog("生成" + path + "utlis/files_md5.json完成")