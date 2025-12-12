
export enum MessageEnum {
    // 表单元素值发生改变触发的事件
    ON_ITEM_VALUE_CHANGE,
    // 发送数据改变表单值
    SEND_TO_CHAGE_ITEM_VALUE
}


interface Subscriber {
    id: string
    type: MessageEnum,
    ring: Function
}

class EventBus {
    private subscribers: Set<Subscriber> = new Set();

    /**
     * 订阅消息
     */
    subscribe(subscriber: Subscriber) {
        this.subscribers.add(subscriber);
    }

    /**
     * 取消订阅者
     */
    unSubscribe(subscriber: Subscriber) {
        return this.subscribers.delete(subscriber);
    }

    /**
     * 发布消息
     */
    dispatch({
        type,
        payload
    }: {
        type: MessageEnum,
        payload: Array<any>
    }) {
        this.subscribers.forEach(element => {
            if (element.type === type) {
                element.ring?.(...payload);
            }
        });
    }
}

export default EventBus;