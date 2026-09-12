'use client';

interface FullscreenDocument extends Document {
  webkitFullscreenElement?: Element;
  mozFullScreenElement?: Element;
  msFullscreenElement?: Element;
  webkitExitFullscreen?: () => Promise<void> | void;
  mozCancelFullScreen?: () => Promise<void> | void;
  msExitFullscreen?: () => Promise<void> | void;
}

interface FullscreenElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void> | void;
  mozRequestFullScreen?: () => Promise<void> | void;
  msRequestFullscreen?: () => Promise<void> | void;
}

export function isCurrentlyFullscreen(): boolean {
  if (typeof document === 'undefined') return false;
  const doc = document as FullscreenDocument;
  const hasNative = !!(
    doc.fullscreenElement ||
    doc.webkitFullscreenElement ||
    doc.mozFullScreenElement ||
    doc.msFullscreenElement
  );
  const hasPseudo = document.documentElement.classList.contains('pseudo-fullscreen');
  return hasNative || hasPseudo;
}

export async function toggleFullscreenMode(): Promise<boolean> {
  if (typeof document === 'undefined') return false;
  const doc = document as FullscreenDocument;
  const docEl = document.documentElement as FullscreenElement;

  const isNative = !!(
    doc.fullscreenElement ||
    doc.webkitFullscreenElement ||
    doc.mozFullScreenElement ||
    doc.msFullscreenElement
  );
  const isPseudo = document.documentElement.classList.contains('pseudo-fullscreen');

  // If already in fullscreen (native or simulated), exit it
  if (isNative) {
    try {
      if (doc.exitFullscreen) {
        await doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        await doc.webkitExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        await doc.mozCancelFullScreen();
      } else if (doc.msExitFullscreen) {
        await doc.msExitFullscreen();
      }
    } catch (err) {
      console.warn('Error exiting native fullscreen:', err);
    }
    document.documentElement.classList.remove('pseudo-fullscreen');
    return false;
  }

  if (isPseudo) {
    document.documentElement.classList.remove('pseudo-fullscreen');
    return false;
  }

  // Try native fullscreen request with vendor prefixes
  try {
    if (docEl.requestFullscreen) {
      await docEl.requestFullscreen();
      return true;
    } else if (docEl.webkitRequestFullscreen) {
      await docEl.webkitRequestFullscreen();
      return true;
    } else if (docEl.mozRequestFullScreen) {
      await docEl.mozRequestFullScreen();
      return true;
    } else if (docEl.msRequestFullscreen) {
      await docEl.msRequestFullscreen();
      return true;
    }
  } catch (err) {
    console.warn('Native fullscreen request was blocked or unsupported, activating simulated fullscreen mode:', err);
  }

  // Fallback: simulated fullscreen for iframes, permission-restricted environments, and touch devices
  document.documentElement.classList.add('pseudo-fullscreen');
  return true;
}

export function subscribeFullscreenChange(callback: (isFullscreen: boolean) => void): () => void {
  if (typeof document === 'undefined') return () => {};

  const handler = () => {
    callback(isCurrentlyFullscreen());
  };

  const events = [
    'fullscreenchange',
    'webkitfullscreenchange',
    'mozfullscreenchange',
    'MSFullscreenChange',
  ];

  events.forEach((ev) => document.addEventListener(ev, handler));

  return () => {
    events.forEach((ev) => document.removeEventListener(ev, handler));
  };
}
