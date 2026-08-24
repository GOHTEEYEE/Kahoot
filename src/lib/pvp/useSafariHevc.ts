"use client";

import { useLayoutEffect, useState } from "react";

/** HEVC+alpha works in Safari; Chrome may report hvc1 but composites the alpha as empty. */
export function useSafariHevc() {
  const [safari, setSafari] = useState(false);
  useLayoutEffect(() => {
    const ua = navigator.userAgent;
    setSafari(/safari/i.test(ua) && !/chrome|chromium|android|crios|fxios|edg/i.test(ua));
  }, []);
  return safari;
}
