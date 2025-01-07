import React from 'react';

import { isPathOneOf } from 'src/utilities/routing/isPathOneOf';
import { FOOTER_HEIGHT } from 'src/features/Footer';

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

export const useIsPageScrollable = (
  contentRef: React.RefObject<HTMLElement>
): { isPageScrollable: boolean } => {
  const [isPageScrollable, setIsPageScrollable] = React.useState(false);

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      requestAnimationFrame(() => {
        if (!contentRef.current) {
          return;
        }

        const contentHeight = contentRef.current.scrollHeight;
        const windowHeight = window.innerHeight;

        setIsPageScrollable(contentHeight > windowHeight);
      });
    });

    if (contentRef.current) {
      observer.observe(contentRef.current, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    }
  }, [contentRef]);

  return { isPageScrollable };
};

export const useIsWindowAtBottom = () => {
  const [isBottom, setIsBottom] = React.useState(false);
  const checkIfBottom = React.useCallback(() => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const bottom =
      Math.ceil(windowHeight + scrollTop) >= documentHeight - FOOTER_HEIGHT;

    setIsBottom(bottom);
  }, []);

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
