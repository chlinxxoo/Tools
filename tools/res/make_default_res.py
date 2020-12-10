#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import os
import re
import json
import sys
import fileinput, glob, string, sys, os, argparse
import platform
#import pdb
from os.path import join
dir=os.path.abspath(os.path.dirname(__file__))

sys.path.append(os.path.join(dir, "../../"))
import RInfo

RES_ROOT = os.path.join(RInfo.PATH_EGRET_PROJ_RES_ROOT)
ORIGIN_RES_JSON = os.path.join(RInfo.PATH_EGRET_PROJ_RES_ROOT, 'default.res.json')
# TARGET_RES_JSON = os.path.join(RInfo.PATH_EGRET_PROJ_RES_ROOT, 'default.res2.json')
TARGET_RES_JSON = ORIGIN_RES_JSON

file_filter = {
    "json" : "json",
    "png" : "image",
    "jpg" : "image",
    "fnt" : "font",
    "proto" : "text",
    "dbbin" : "bin",
    "zip" : "bin",
    "bin" : "bin",
    "mp3" : "sound"
}

#正则表达式表示的忽略文件
ignored = set([
    ".*/default.res.json",
    ".*/default.thm.json",
    ".*/\\..*",
    ".*\\.css",
    ".*/ignore_res/.*",
])

'''
拼接成如下格
{
    "name": "name",
    "type": "t",
    "url": "url"
}
'''
def trans(url, t, name, scale9grid):
    if scale9grid:
        result="{\"url\":\""+url+"\",\"type\":\""+t+"\",\"name\":\""+name+"\",\"scale9grid\":\""+scale9grid+"\"}"
    else:
        result="{\"url\":\""+url+"\",\"type\":\""+t+"\",\"name\":\""+name+"\"}"
    return result

#检查是否需要忽略文件，返回True表示需要忽略
def ignore(filePath):
    for ignore in ignored:
        obj = re.match(ignore, filePath)
        if obj:
            # print 'ignored: ' + filePath
            return True
    return False

def work(resRoot):
    grouped = set()
    #没有加入任何分组的资源会被放入ungrouped分组，以便整理
    ungrouped = set()
    res = {}
    scale9gridInfo = {}

    result = "{\"groups\":"
    with open(ORIGIN_RES_JSON) as f:
        data = json.load(f)
        result += json.dumps(data["groups"])
    for group in data["groups"]:
        keys = group["keys"].split(",")
        for key in keys:
            grouped.add(key)
    for item in data["resources"]:
        if item["type"] == "sheet":
            #sheet类型被标记为1，在最后整理resources时不会被加入
            res[item["name"]] = 1

        if "scale9grid" in item:
            # 提取scale9grid信息
            scale9gridInfo[item["name"]] = item["scale9grid"]

    types = "("
    for t in file_filter:
        types += t + "|"
    types = types[:-1] + ')'
    for root, dirs, files in os.walk(resRoot):
        for file in files:
            matchObj = file.split('.')
            if len(matchObj) == 2 and file_filter.get(matchObj[1], False):
                name = matchObj[0] + "_" + matchObj[1]
                if not ignore(os.path.join(root, file)) and not res.get(name, False):
                    if name not in grouped:
                        pass
                        # ungrouped.add(name)
                    url = os.path.relpath(os.path.join(root, file), resRoot)
                    typ = file_filter[matchObj[1]]
                    scale9grid = None
                    if name in scale9gridInfo:
                        scale9grid = scale9gridInfo[name]
                    
                    res[name] = trans(url, typ, name, scale9grid)

    if len(ungrouped) != 0:
        result = result[:-1] #去掉最后的]
        keys = ""
        for key in ungrouped:
            keys += key + ","
        keys = keys[:-1] #去掉最后的,
        result += ",{\"keys\":\""+keys+"\",\"name\":\"ungrouped\"}]"
    result += ","

    result += "\"resources\":["
    for item in data["resources"]:
        if item["type"] == "sheet":
            # chl 刷新subkeys
            content = ''
            with open(join(resRoot, item["url"])) as f:
                sheetJson = json.load(f)
                for key, value in sheetJson["frames"].items():
                    content = content + key + ','
            item["subkeys"] = content[:-1]
            
            result += json.dumps(item) + ","
            
    if len(res) != 0:
        for r in res:
            if(res[r] != 1):
                result += res[r] + ","

    result = result[:-1]
    result += "]}"

    #格式化JSON文本
    if platform.system() == "Windows":
        # windows需要转换
        result = result.replace('\\','/')
    result = json.dumps(json.loads(result), sort_keys = True, indent = 4, separators=(',', ': '))
    #print result
    #pdb.set_trace()
    with open(TARGET_RES_JSON, "w") as f:
        f.write(result)


def fix(fixPath):
    s9gDict = {}
    with open(ORIGIN_RES_JSON, 'r') as f:
        jC = json.load(f)
        for res in jC['resources']:
            if 'scale9grid' in res:
                s9gDict[res['name']] = res['scale9grid']


    with open(fixPath, 'r') as f:
        jC = json.load(f)
        for res in jC['resources']:
            if res['name'] in s9gDict:
                res['scale9grid'] = s9gDict[res['name']]
    

    with open(fixPath, 'w') as f:
        f.write(json.dumps(jC))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='''
重型生成default.res.json，默认是根据resource里面的资源生成，可以额外指定另一个目录
''')
    parser.add_argument('--resourceRoot', action="store", dest="resourceRoot", help='额外指定资源根目录，比如resource_origin')
    parser.add_argument('--fixEgretBuild', action="store", dest="fixEgretBuild", help='修复白鹭编译会缺失scale9grid，从ORIGIN_RES_JSON里面获取scale9grid，补充到指定发布defalut.res文件')

    results = parser.parse_args()

    if results.fixEgretBuild:
        fix(results.fixEgretBuild)
    else:
        rr = RES_ROOT
        if results.resourceRoot:
            rr = results.resourceRoot
        work(rr)