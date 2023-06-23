/**
 * @requestUrl 开发者提供的上报地址
 * @historyTracker 是否监听history
 * @hashTracker 是否监听hash
 * @domTracker 是否监听dom事件
 * @sdkVersion sdk版本
 * @extra 暴露给开发者的自定义上报字段
 * @jsError 是否监听js 和 promise 
 */
export interface DefaultOptions {
    //暴露给开发者的uid传入，uv统计
    uid: string | undefined,
    requestUrl: string | undefined,
    historyTracker: boolean,
    hashTracker: boolean,
    domTracker: boolean,
    sdkVersion: string | number,
    extra: Record<string, any> | undefined,
    jsError:boolean
}

//开发者必须传入上报地址
export interface Options extends Partial<DefaultOptions> {
    requestUrl: string,
}

//枚举类型，规定埋点的设置信息，版本等等
export enum TrackerConfig {
    version = '1.0.0'
}

//上报信息定义
export type reportTrackerData = {
    [key: string]: any,
    event: string,
    targetKey: string
}