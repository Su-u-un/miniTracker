'use strict';

//枚举类型，规定埋点的设置信息，版本等等
var TrackerConfig;
(function (TrackerConfig) {
    TrackerConfig["version"] = "1.0.0";
})(TrackerConfig || (TrackerConfig = {}));

//规定泛型是History对象的键，这样就能让使用者在输入参数时得到提示。指定返回值为any，()=>any=>{}。
const createHistoryEvnent = (type) => {
    //得到history的api
    const origin = history[type];
    //返回一个函数
    return function () {
        //运行history的api
        const res = origin.apply(this, arguments);
        //新建事件
        var e = new Event(type);
        //发布事件
        window.dispatchEvent(e);
        //返回api的调用
        return res;
    };
};

//按钮能触发的鼠标事件
const MouseEventList = ['click', 'dblclick', 'contextmenu', 'mousedown', 'mouseup', 'mouseenter', 'mouseout', 'mouseover'];
class Tracker {
    constructor(options) {
        //assign实现导入值对默认值的覆盖
        this.data = Object.assign(this.init(), options);
        //加入监听
        this.installInnerTrack();
    }
    //监听初始化
    init() {
        this.version = TrackerConfig.version;
        //重写pv
        window.history['pushState'] = createHistoryEvnent("pushState");
        window.history['replaceState'] = createHistoryEvnent('replaceState');
        //返回默认值
        return {
            sdkVersion: this.version,
            historyTracker: false,
            hashTracker: false,
            domTracker: false,
            jsError: false
        };
    }
    //暴露给开发者传入id的方法
    setUserId(uid) {
        this.data.uid = uid;
    }
    //暴露给开发者传入自定义字段的方法
    setExtra(extra) {
        this.data.extra = extra;
    }
    //暴露给开发者传入上报信息的方法
    sendTracker(data) {
        this.reportTracker(data);
    }
    //捕获鼠标事件,可一次性传入多个事件，
    captureEvents(eventList, targetKey, data) {
        //对传入的事件进行循环捕获监听
        eventList.forEach(event => {
            window.addEventListener(event, () => {
                this.reportTracker({ event, targetKey, data });
            });
        });
    }
    //载入监听
    installInnerTrack() {
        if (this.data.historyTracker) {
            this.captureEvents(['pushState', 'replaceState', 'popstate'], 'history-pv');
        }
        if (this.data.hashTracker) {
            this.captureEvents(['hashchange'], 'hash-pv');
        }
        if (this.data.domTracker) {
            this.targetKeyReport();
        }
        if (this.data.jsError) {
            this.jsError();
        }
    }
    //监听dom
    targetKeyReport() {
        //监听鼠标事件，把所有的都加上监听
        MouseEventList.forEach(event => {
            //将事件对象的target属性强制转换为HTMLElement类型，并赋值给target
            window.addEventListener(event, (e) => {
                const target = e.target;
                //获取dom元素的target-key属性
                const targetValue = target.getAttribute('target-key');
                //如果有某某绑定了key，就发送。
                if (targetValue) {
                    this.sendTracker({
                        targetKey: targetValue,
                        event
                    });
                }
            });
        });
    }
    jsError() {
        this.errorEvent();
        this.promiseReject();
    }
    errorEvent() {
        window.addEventListener('error', (e) => {
            this.sendTracker({
                targetKey: 'message',
                event: 'error',
                message: e.message
            });
        });
    }
    promiseReject() {
        window.addEventListener('unhandledrejection', (event) => {
            event.promise.catch(error => {
                this.sendTracker({
                    targetKey: "reject",
                    event: "promise",
                    message: error
                });
            });
        });
    }
    reportTracker(data) {
        const params = Object.assign(this.data, data, { time: new Date().getTime() });
        let headers = {
            type: 'application/x-www-form-urlencoded'
        };
        let blob = new Blob([JSON.stringify(params)], headers);
        navigator.sendBeacon(this.data.requestUrl, blob);
    }
}

module.exports = Tracker;
