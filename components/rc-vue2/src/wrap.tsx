import { createRoot } from "react-dom/client";
import { ComponentType, createRef } from "react";

export const Vue2Adapter = (AnyNode: ComponentType) => {
    const vueWrap = {
        beforeCreate() {
        },
    
        created() {
        },
    
        beforeMount() {
        },
    
        mounted() {
            const self = this as any;
            self.thisReactRef = createRef();
            self.thisReactRef.current = self;
            const root = createRoot(self.$refs.container);
            root.render(<AnyNode {...{self: self.thisReactRef} as any } />);
            self.reactRoot = root;
        },
    
        beforeUpdate() {
        },

        updated() {
            const self = this as any;
            const props = {
                $this: self.thisReactRef,
            }
            self.reactRoot.render(<AnyNode {...props as any} />);
        },
    
        activated() {
            const self = this as any;
            const props = {
                $this: self.thisReactRef,
                $activated: true,
            }
            self.reactRoot.render(<AnyNode {...props as any } />);
        },
    
        deactivated() {
            const self = this as any;
            const props = {
                $this: self.thisReactRef,
                $activated: false,
            }
            self.reactRoot.render(<AnyNode {...props as any } />);
        },
    
        beforeDestroy() {
        },
    
        destroyed() {
        },
    
        errorCaptured() {
        },
    
        render(createElement: any) {
            return createElement("div", {
                ref: "container",
            })
        }
    }
    return vueWrap;
}

