/** Shared browser premises; component state assertions stay with their packages. */
export const environmentCases = [
    { id: "narrow", viewport: { width: 320, height: 768 } },
    { id: "tablet", viewport: { width: 768, height: 1024 } },
    { id: "desktop", viewport: { width: 1440, height: 900 } },
    { id: "touch", viewport: { width: 768, height: 1024 }, hasTouch: true },
    { id: "rtl", config: { direction: "rtl" } },
    { id: "english", config: { locale: "en-US" } },
    { id: "brand", config: { brandColor: "#8c3cc8" } },
    { id: "forced-colors", media: { forcedColors: "active" } },
    { id: "reduced-motion", media: { reducedMotion: "reduce" } },
];
export const acceptanceEnvironments = [...environmentCases, { id: 'zoom-200' }];

/** Context-only options (such as hasTouch) belong in native test.use at declaration. */
export async function applyEnvironment(page, environment) {
    if (environment.viewport) await page.setViewportSize(environment.viewport);
    if (environment.media) await page.emulateMedia(environment.media);
}
