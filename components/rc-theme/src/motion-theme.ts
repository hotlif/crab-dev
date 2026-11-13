import { globalStyle } from '@crab-dev/css';
import { designMotionContract as motion } from './type-motion-values.js';

// Reset the complete motion contract whenever a design boundary changes.
// Components retain their reduced-motion and forced-colors behavior.
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
globalStyle`
    :root, [data-crab-design='md3'] {
        --token-semantic-motion-interaction: ${motion.md3.interaction};
        --token-semantic-motion-fade: ${motion.md3.fade};
        --token-semantic-motion-expand: ${motion.md3.expand};
        --token-semantic-motion-slide-enter: ${motion.md3.slideEnter};
        --token-semantic-motion-slide-exit: ${motion.md3.slideExit};
        --token-semantic-motion-sheet-enter-duration: ${motion.md3.sheetEnterDuration};
        --token-semantic-motion-sheet-exit-duration: ${motion.md3.sheetExitDuration};
        --token-semantic-motion-sheet-easing: ${motion.md3.sheetEasing};
        --token-semantic-motion-layout: ${motion.md3.layout};
        --token-semantic-motion-easing-spatial-default: ${motion.md3.easingSpatialDefault};
        --token-semantic-motion-spatial-fast: ${motion.md3.spatialFast};
        --token-semantic-motion-spatial-default: ${motion.md3.spatialDefault};
        --token-semantic-motion-spatial-slow: ${motion.md3.spatialSlow};
        --token-semantic-motion-effects-fast: ${motion.md3.effectsFast};
        --token-semantic-motion-effects-default: ${motion.md3.effectsDefault};
        --token-semantic-motion-effects-slow: ${motion.md3.effectsSlow};
    }

    [data-crab-design='macos'] {
        --token-semantic-motion-interaction: ${motion.macos.interaction};
        --token-semantic-motion-fade: ${motion.macos.fade};
        --token-semantic-motion-expand: ${motion.macos.expand};
        --token-semantic-motion-slide-enter: ${motion.macos.slideEnter};
        --token-semantic-motion-slide-exit: ${motion.macos.slideExit};
        --token-semantic-motion-sheet-enter-duration: ${motion.macos.sheetEnterDuration};
        --token-semantic-motion-sheet-exit-duration: ${motion.macos.sheetExitDuration};
        --token-semantic-motion-sheet-easing: ${motion.macos.sheetEasing};
        --token-semantic-motion-layout: ${motion.macos.layout};
        --token-semantic-motion-easing-spatial-default: ${motion.macos.easingSpatialDefault};
        --token-semantic-motion-spatial-fast: ${motion.macos.spatialFast};
        --token-semantic-motion-spatial-default: ${motion.macos.spatialDefault};
        --token-semantic-motion-spatial-slow: ${motion.macos.spatialSlow};
        --token-semantic-motion-effects-fast: ${motion.macos.effectsFast};
        --token-semantic-motion-effects-default: ${motion.macos.effectsDefault};
        --token-semantic-motion-effects-slow: ${motion.macos.effectsSlow};
    }

    [data-crab-design='shadcn'] {
        --token-semantic-motion-interaction: ${motion.shadcn.interaction};
        --token-semantic-motion-fade: ${motion.shadcn.fade};
        --token-semantic-motion-expand: ${motion.shadcn.expand};
        --token-semantic-motion-slide-enter: ${motion.shadcn.slideEnter};
        --token-semantic-motion-slide-exit: ${motion.shadcn.slideExit};
        --token-semantic-motion-sheet-enter-duration: ${motion.shadcn.sheetEnterDuration};
        --token-semantic-motion-sheet-exit-duration: ${motion.shadcn.sheetExitDuration};
        --token-semantic-motion-sheet-easing: ${motion.shadcn.sheetEasing};
        --token-semantic-motion-layout: ${motion.shadcn.layout};
        --token-semantic-motion-easing-spatial-default: ${motion.shadcn.easingSpatialDefault};
        --token-semantic-motion-spatial-fast: ${motion.shadcn.spatialFast};
        --token-semantic-motion-spatial-default: ${motion.shadcn.spatialDefault};
        --token-semantic-motion-spatial-slow: ${motion.shadcn.spatialSlow};
        --token-semantic-motion-effects-fast: ${motion.shadcn.effectsFast};
        --token-semantic-motion-effects-default: ${motion.shadcn.effectsDefault};
        --token-semantic-motion-effects-slow: ${motion.shadcn.effectsSlow};
    }
`;
