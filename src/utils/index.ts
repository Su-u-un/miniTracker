//规定泛型是History对象的键，这样就能让使用者在输入参数时得到提示。指定返回值为any，()=>any=>{}。
export const createHistoryEvnent = <T extends keyof History>(type: T): () => any => {
    //得到history的api
    const origin = history[type];
    //返回一个函数
    return function (this: any) {
        //运行history的api
        const res = origin.apply(this, arguments)
        //新建事件
        var e = new Event(type)
        //发布事件
        window.dispatchEvent(e)
        //返回api的调用
        return res;
    }
}