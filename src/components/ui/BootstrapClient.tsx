'use client';

import { useEffect } from 'react';

/**
 * Loads Bootstrap's JavaScript once. Its data API (data-bs-toggle) listens on the
 * document, so the navbar toggler, dropdowns and accordions in both JSX and CMS
 * HTML work without per-component wiring.
 */
export default function BootstrapClient() {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);
  return null;
}
