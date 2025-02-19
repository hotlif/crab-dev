import { createRoot } from "react-dom/client";
import { ComponentType } from "react";

export const convertToVue2 = (AnyNode: ComponentType) => {
    const vueWrap = {

        beforeCreate() {
        },
    
        created() {
        },
    
        beforeMount() {
        },
    
        mounted() {
            const self = this as any;
            const props = self.$attrs;
            const root = createRoot(self.$refs.container);
            root.render(<AnyNode {...props} />);
            self.reactRoot = root;
        },
    
        beforeUpdate() {
        },

        updated() {
            const self = this as any;
            const props = self.$attrs;
            self.reactRoot.render(<AnyNode {...props} />);
        },
    
        activated() {
        },
    
        deactivated() {
        },
    
        beforeDestroy() {
        },
    
        destroyed() {
        },
    
        errorCaptured() {
        },
    
        render(createElement: any, context: any) {
            return createElement("div", {
                ref: "container",
            })
        }
    }
    return vueWrap;
}

