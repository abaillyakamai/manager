import * as React from 'react';
import { debounce } from 'throttle-debounce';

import { isPathOneOf } from 'src/utilities/routing/isPathOneOf';

export const linkIsActive = (
  href: string,
  locationSearch: string,
  locationPathname: string,
  activeLinks: Array<string> = []
) => {
  const currentlyOnOneClickTab = locationSearch.match(/one-click/gi);
  const isOneClickTab = href.match(/one-click/gi);

  /**
   * mark as active if the tab is "one click"
   * Other create tabs default back to Linodes active tabs
   */
  if (currentlyOnOneClickTab) {
    return isOneClickTab;
  }

  return isPathOneOf([href, ...activeLinks], locationPathname);
};

export const useIsWindowAtBottom = () => {
  const [isBottom, setIsBottom] = React.useState(false);
  const checkIfBottom = React.useCallback(
    debounce(10, () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const bottom = Math.ceil(windowHeight + scrollTop) >= documentHeight;

      setIsBottom(bottom);
    }),
    []
  );

  React.useEffect(() => {
    checkIfBottom();
    const onScroll = () => requestAnimationFrame(checkIfBottom);
    document.body.onscroll = onScroll;
    return () => {
      document.body.onscroll = null;
    };
  }, [checkIfBottom]);

  return isBottom;
};
