/**
 * Shared AudioContext utility — prevents browser crash from creating too many AudioContext instances.
 * Browsers limit concurrent AudioContexts to ~6. This module reuses a single global instance.
 */

let sharedCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (typeof window === 'undefined') {
    throw new Error('AudioContext is only available in the browser');
  }
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!sharedCtx || sharedCtx.state === 'closed') {
    sharedCtx = new AudioContextClass();
  }
  // Resume if suspended (required by browsers after user gesture)
  if (sharedCtx.state === 'suspended') {
    sharedCtx.resume();
  }
  return sharedCtx;
}
