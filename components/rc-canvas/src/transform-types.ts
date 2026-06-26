/** Transformer 组件的变换状态（受控） */
export interface TransformState {
    /** 矩形左上角 x（未旋转参考系，旋转绕中心进行） */
    x: number;
    /** 矩形左上角 y（未旋转参考系，旋转绕中心进行） */
    y: number;
    width: number;
    height: number;
    /** 绕矩形中心旋转的角度（弧度，逆时针为正） */
    rotation: number;
}
