//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class ViewerPlug extends egret.DisplayObjectContainer {
    private gp_root: eui.Group
    public static dbInstance: dragonBones.EgretArmatureDisplay

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    public async inject() {
        this.log("注入")
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        await RES.loadConfig("resource/default.res.json", "resource/");
        await this.loadTheme()
        this.initDebugPanel()
    }

    private onAddToStage(event: egret.Event) {

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin

            context.onUpdate = () => {

            }
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);
        })
    }

    private initDebugPanel() {
        this.gp_root = new eui.Group()
        let layout = new eui.VerticalLayout()
        this.gp_root.layout = layout
        this.addChild(this.gp_root)

        let BtnConfig = [
            {
                clazz: eui.Button,
                text: 'debugDraw',
                func: () => {
                    ViewerPlug.dbInstance.debugDraw = !ViewerPlug.dbInstance.debugDraw
                }
            },
            {
                clazz: eui.Button,
                text: '打印骨骼',
                func: () => {
                    ViewerPlug.dbInstance.armature.getBones().forEach((bone => {

                    }))
                }
            },
            {
                clazz: eui.Label,
                text: '龙骨',
                func: undefined
            }
        ]

        for (let c of BtnConfig) {
            let clazz: eui.Button | eui.Label
            if (c.clazz == eui.Button) {
                clazz = new c.clazz() as eui.Button
                clazz.label = c.text
                if (c.func) {
                    clazz.addEventListener(egret.TouchEvent.TOUCH_TAP, c.func, clazz)
                }
            } else if (c.clazz == eui.Label) {
                clazz = new c.clazz() as eui.Label
                clazz.text = c.text
            }

            this.gp_root.addChild(clazz)
        }
    }

    private log(message?: any, ...optionalParams: any[]) {
        egret.log("【ViewerPlug】" + message, optionalParams)
    }
}