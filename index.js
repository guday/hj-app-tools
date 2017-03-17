var path = require("path");
var fs = require("fs");

var writeNum = 0;

/**
 * 写内容到文件
 * @param dstPath
 * @param context
 * @param isAppend
 */
function writeToFile(dstPath, content, isAppend) {
    var newFileDirName = path.dirname(dstPath);
    //创建文件夹
    mkdirs(newFileDirName, function () {
        //输出目的文件--用于调试
        if (isAppend && writeNum) {
            fs.appendFile(dstPath, content)
        } else {
            fs.writeFile(dstPath, content);
        }
        writeNum++
    });
}

/**
 * 递归创建目录 异步方法
 * @param dirname
 * @param callback
 */
function mkdirs(dirname, callback) {
    fs.exists(dirname, function (exists) {
        if (exists) {
            callback();
        } else {
            //console.log(path.dirname(dirname));
            mkdirs(path.dirname(dirname), function () {
                fs.mkdir(dirname, callback);
            });
        }
    });
}


/**
 * 根据配置过滤字段
 * @param srcStr
 * @param config.enclude
 * @param config.exclude
 */
function filterWithConifg(srcStr, config) {
    var enclude = config && config.enclude || [];
    var exclude = config && config.exclude || [];
    var filterStr = _fiterStr;

    if (enclude.length == 0 && exclude.length == 0) {
        return true;
    }

    if (filterStr(srcStr, exclude)) {
        return false;
    } else if (!filterStr(srcStr, enclude)) {
        return false;
    }
    return true;

    function _fiterStr(str, arr) {
        var filterFlag = false;
        for (var i in arr) {
            if (str.indexOf(arr[i]) > -1) {
                filterFlag = true;
                break;
            }
        }
        return filterFlag;
    }
}

exports.writeToFile = writeToFile;
exports.filterWithConifg = filterWithConifg;
