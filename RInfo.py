#!/usr/bin/env python
# -*- coding: utf-8 -*- 
#Author: sanhua.zhang
#Email: sanhua.zh@foxmail.com

import os 
import sys

#fixed coding
if sys.version_info[0] == 2:
	reload(sys)  
	sys.setdefaultencoding('utf8')  
else:
	import imp
	imp.reload(sys)

PROJ_NAME = "ViewerPlug"

PATH_BASE = os.path.abspath(os.path.dirname(__file__))

PATH_PRODUCTION = os.path.join(PATH_BASE, "..", "production")
PATH_PUBLIC = os.path.join(PATH_BASE, "..", "public")
PATH_EGRET_PROJ_ROOT = os.path.join(PATH_BASE, "ViewerPlug")
PATH_CLIENT_TOOLS_ROOT = os.path.join(PATH_BASE, "tools")
PATH_XYX_LUA_SCRIPTS_TOOLS_ROOT = os.path.join(PATH_BASE, "tools", "lua_scripts")
PATH_EGRET_PROJ_RES_ROOT = os.path.join(PATH_EGRET_PROJ_ROOT, "resource")
PATH_EGRET_PROJ_RES_ORIGIN_ROOT = os.path.join(PATH_EGRET_PROJ_ROOT, "resource_origin")
PATH_CLIENT_MIC_ANDROID_PROJ_ROOT = os.path.join(PATH_BASE, "app", "mic", "h5andr")
PATH_CLIENT_MIC_IOS_PROJ_ROOT = os.path.join(PATH_BASE, "app", "mic", "h5ios_hybrid")

RUN_LOG_WEBHOOK_PY = 'python %s --content ' % os.path.join(PATH_CLIENT_TOOLS_ROOT, 'release', 'goDTalkWebHook.py')

RELESE_PATH_ROOT = os.path.join(PATH_EGRET_PROJ_ROOT, 'bin-release', 'web')

# PATH_PRODUCTION_XAP = os.path.join(PATH_PRODUCTION, "XAP")
# PATH_RESOURCES = os.path.join(PATH_PRODUCTION, "Resources")

# # just for test
# PATH_RESOURCES_UPDATE = os.path.join(PATH_BASE, "Update/Resources")
# PATH_ASSETS_UPDATE = os.path.join(PATH_RESOURCES_UPDATE, "assets")
# PATH_SCRIPTS_UPDATE = os.path.join(PATH_RESOURCES_UPDATE, "scripts")

# PATH_RASSETS = os.path.join(PATH_RESOURCES, "rassets")
# PATH_ASSETS = os.path.join(PATH_RESOURCES, "assets")
# PATH_SCRIPTS = os.path.join(PATH_RESOURCES, "scripts")
# PATH_MEDIAS = os.path.join(PATH_RESOURCES, "medias")
# PATH_RELEASE = os.path.join(PATH_RESOURCES, "release/assets")

# PATH_CLIENT = os.path.join(PATH_BASE, "Client")
# PATH_TOOLS = os.path.join(PATH_CLIENT, "tools")
# PATH_TOOLS_RUNTIME = os.path.join(PATH_TOOLS, "runtime")

# PATH_IOS_MAC_XCODEPROJ = os.path.join(PATH_CLIENT, "frameworks/runtime-src/proj.ios_mac")
# PATH_ANDROID_PROJ = os.path.join(PATH_CLIENT, "frameworks/runtime-src/proj.android")

# PATH_COCOS2D = os.path.join(PATH_CLIENT, "frameworks/cocos2d-x")
# PATH_RUNTIME = os.path.join(PATH_CLIENT, "frameworks/runtime-src")

RSYNC_CONFIG = {
	'DEFAULT': 'xh',
	"xh": {
		'debug': {
			'src' : '/data/xhsq_project/xhsq_web',
			'host' : '192.168.6.130',
			'passWordFile' : os.path.join(PATH_CLIENT_TOOLS_ROOT, 'release', 'rsync.pas')
		},
		'release': {
			'folder' : 'agent',
			'src' : '/data/xhsq_project/xhsq_web',
			'host' : '139.159.242.142',
			'passWordFile' : os.path.join(PATH_CLIENT_TOOLS_ROOT, 'release', 'psw_xinghui.pem'),
			'port' : 33335
		},
	},
	"fla": {
		'debug': {
			'src' : '/data/xhsq_project/xhsq_web',
			'host' : '192.168.6.130',
			'passWordFile' : os.path.join(PATH_CLIENT_TOOLS_ROOT, 'release', 'rsync.pas')
		},
		'release': {
			'folder' : 'agent',
			'src' : 'xhsq_web',
			'host' : 'ppkmbtgame02.rmz.flamingo-inc.com',
			'passWordFile' : os.path.join(PATH_CLIENT_TOOLS_ROOT, 'release', 'rsyncRelease.pas')
		},
	},
	"hw": {
		'release': {
			'folder' : 'agent',
			'src' : '/data/xhsq_project/xhsq_web',
			'host' : '49.51.202.233',
			'passWordFile' : os.path.join(PATH_CLIENT_TOOLS_ROOT, 'release', 'psw_xinghui.pem'),
			'port' : 33335
		},
	},
}

DY_RES_HOST = {
    'debug' : '192.168.6.130:4405/xhsq_web',
    'release' : "cfgdat.xxysr.lingwu66.com/xhsq_web"   
}

ART_EXPORT_PATH = '/Users/chl/Documents/flamingo/XHSQ/art'
TEXTUREMERGER_CMD = '/Applications/TextureMerger.app/Contents/MacOS/TextureMerger'
AM_I_ROBOT = False



#丛爷 python tools/release/runRelease.py --buildT r --agent xh_ymdl --onlyD --debug 95495861
#杰周 python tools/release/runRelease.py --buildT r --agent xh_ymdl --onlyD --debug 93132805