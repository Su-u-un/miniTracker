import { DefaultOptions, Options, TrackerConfig, reportTrackerData } from "../types/index";
import { createHistoryEvnent } from "../utils/index";

//按钮能触发的鼠标事件
const MouseEventList: string[] = ['click', 'dblclick', 'contextmenu', 'mousedown', 'mouseup', 'mouseenter', 'mouseout', 'mouseover']

export default class Tracker {
    //上报的数据
    public data: Options;
    //版本信息
    private version: string | undefined;

    public constructor(options: Options) {
        //assign实现导入值对默认值的覆盖
        this.data = Object.assign(this.init(), options)
        //加入监听
        this.installInnerTrack()
    }

    //监听初始化
    private init(): DefaultOptions {
        this.version = TrackerConfig.version;
        //重写pv
        window.history['pushState'] = createHistoryEvnent("pushState")
        window.history['replaceState'] = createHistoryEvnent('replaceState')
        //返回默认值
        return <DefaultOptions>{
            sdkVersion: this.version,
            historyTracker: false,
            hashTracker: false,
            domTracker: false,
            jsError: false
        }
    }

    //暴露给开发者传入id的方法
    public setUserId<T extends DefaultOptions['uid']>(uid: T) {
        this.data.uid = uid;
    }

    //暴露给开发者传入自定义字段的方法
    public setExtra<T extends DefaultOptions['extra']>(extra: T) {
        this.data.extra = extra
    }

    //暴露给开发者传入上报信息的方法
    public sendTracker<T extends reportTrackerData>(data: T) {
        this.reportTracker(data)
    }

    //捕获鼠标事件,可一次性传入多个事件，
    private captureEvents<T>(eventList: string[], targetKey: string, data?: T) {
        //对传入的事件进行循环捕获监听
        eventList.forEach(event => {
            window.addEventListener(event, () => {
                this.reportTracker({ event, targetKey, data })
            })
        })
    }

    //载入监听
    private installInnerTrack() {
        if (this.data.historyTracker) {
            this.captureEvents(['pushState','replaceState','popstate'], 'history-pv')
        }
        if (this.data.hashTracker) {
            this.captureEvents(['hashchange'], 'hash-pv')
        }
        if (this.data.domTracker) {
            this.targetKeyReport()
        }
        if (this.data.jsError) {
            this.jsError()
        }
    }

    //监听dom
    private targetKeyReport() {
        //监听鼠标事件，把所有的都加上监听
        MouseEventList.forEach(event => {
            //将事件对象的target属性强制转换为HTMLElement类型，并赋值给target
            window.addEventListener(event, (e) => {
                const target = e.target as HTMLElement
                //获取dom元素的target-key属性
                const targetValue = target.getAttribute('target-key')
                //如果有某某绑定了key，就发送。
                if (targetValue) {
                    this.sendTracker({
                        targetKey: targetValue,
                        event
                    })
                }
            })
        })
    }

    private jsError() {
        this.errorEvent()
        this.promiseReject()
    }

    private errorEvent() {
        window.addEventListener('error', (e) => {
            this.sendTracker({
                targetKey: 'message',
                event: 'error',
                message: e.message
            })
        })
    }

    private promiseReject() {
        window.addEventListener('unhandledrejection', (event) => {
            event.promise.catch(error => {
                this.sendTracker({
                    targetKey: "reject",
                    event: "promise",
                    message: error
                })
            })
        })
    }

    private reportTracker<T>(data: T) {
        const params = Object.assign(this.data, data, { time: new Date().getTime() })
        let headers = {
            type: 'application/x-www-form-urlencoded'
        };
        let blob = new Blob([JSON.stringify(params)], headers);
        navigator.sendBeacon(this.data.requestUrl, blob)
    }

}