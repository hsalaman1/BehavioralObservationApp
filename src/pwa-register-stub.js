// No-op stub for virtual:pwa-register in Electron builds.
// Service workers are not supported in Electron (file:// protocol),
// so this stub silently skips SW registration.
export function registerSW() {}
