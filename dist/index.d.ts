/**
 * @requestUrl 开发者提供的上报地址
 * @historyTracker 是否监听history
 * @hashTracker 是否监听hash
 * @domTracker 是否监听dom事件
 * @sdkVersion sdk版本
 * @extra 暴露给开发者的自定义上报字段
 * @jsError 是否监听js 和 promise
 */
interface DefaultOptions {
    uid: string | undefined;
    requestUrl: string | undefined;
    historyTracker: boolean;
    hashTracker: boolean;
    domTracker: boolean;
    sdkVersion: string | number;
    extra: Record<string, any> | undefined;
    jsError: boolean;
}
interface Options extends Partial<DefaultOptions> {
    requestUrl: string;
}
declare type reportTrackerData = {
    [key: string]: any;
    event: string;
    targetKey: string;
};

declare class Tracker {
    data: Options;
    private version;
    constructor(options: Options);
    private init;
    setUserId<T extends DefaultOptions['uid']>(uid: T): void;
    setExtra<T extends DefaultOptions['extra']>(extra: T): void;
    sendTracker<T extends reportTrackerData>(data: T): void;
    private captureEvents;
    private installInnerTrack;
    private targetKeyReport;
    private jsError;
    private errorEvent;
    private promiseReject;
    private reportTracker;
}

export { Tracker as default };
