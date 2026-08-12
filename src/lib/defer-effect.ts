/** Schedule work after the current effect commit (avoids set-state-in-effect lint). */
export function deferEffect(fn: () => void): void {
  queueMicrotask(fn);
}
