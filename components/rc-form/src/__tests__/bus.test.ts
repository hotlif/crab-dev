import { describe, expect, it, mock } from "@crab-dev/wake/test";
import EventBus, { MessageEnum } from "../bus.js";
describe("EventBus", () => {
    it('defers listeners added during dispatch until the next message', () => {
        const bus = new EventBus();
        const later = { id: 'later', type: MessageEnum.ON_ITEM_VALUE_CHANGE, ring: mock.fn() };
        const first = { id: 'first', type: MessageEnum.ON_ITEM_VALUE_CHANGE, ring: () => {
            bus.unSubscribe(first);
            bus.subscribe(later);
        } };
        bus.subscribe(first);
        bus.dispatch({ type: MessageEnum.ON_ITEM_VALUE_CHANGE });
        expect(later.ring).not.toHaveBeenCalled();
        bus.dispatch({ type: MessageEnum.ON_ITEM_VALUE_CHANGE });
        expect(later.ring).toHaveBeenCalledTimes(1);
    });
    it("dispatches only subscribers with matching type", () => {
        const bus = new EventBus();
        const onChange = mock.fn();
        const onVerify = mock.fn();
        const subscriberA = {
            id: "a",
            type: MessageEnum.ON_ITEM_VALUE_CHANGE,
            ring: onChange,
        };
        const subscriberB = {
            id: "b",
            type: MessageEnum.TRIGGER_ITEM_VERIFICATION,
            ring: onVerify,
        };
        bus.subscribe(subscriberA);
        bus.subscribe(subscriberB);
        bus.dispatch({
            type: MessageEnum.ON_ITEM_VALUE_CHANGE,
            payload: [{ name: "field", value: 1 }],
        });
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onVerify).not.toHaveBeenCalled();
    });
    it("unSubscribe removes subscriber", () => {
        const bus = new EventBus();
        const onChange = mock.fn();
        const subscriber = {
            id: "a",
            type: MessageEnum.ON_ITEM_VALUE_CHANGE,
            ring: onChange,
        };
        bus.subscribe(subscriber);
        expect(bus.getSubscribers().size).toBe(1);
        bus.unSubscribe(subscriber);
        bus.dispatch({
            type: MessageEnum.ON_ITEM_VALUE_CHANGE,
            payload: [{ name: "field", value: 1 }],
        });
        expect(bus.getSubscribers().size).toBe(0);
        expect(onChange).not.toHaveBeenCalled();
    });
});
