import * as React from 'react';

import { Markdown } from 'src/components/Markdown/Markdown';
import { reportException } from 'src/exceptionReporting';
import { useFlags } from 'src/hooks/useFlags';
import { isAfter } from 'src/utilities/date';

import { DismissibleBanner } from '../DismissibleBanner/DismissibleBanner';

import type { NoticeProps } from '@linode/ui';
import type { ProductInformationBannerLocation } from 'src/featureFlags';

interface Props {
  bannerLocation: ProductInformationBannerLocation;
}

interface ProductInformationBannerProps extends Props, Partial<NoticeProps> {}

export const ProductInformationBanner = React.memo(
  (props: ProductInformationBannerProps) => {
    const { bannerLocation, ...rest } = props;
    const { productInformationBanners } = useFlags();

    const thisBanner = (productInformationBanners ?? []).find(
      (thisBanner) => thisBanner.bannerLocation === bannerLocation
    );

    if (!thisBanner) {
      return null;
    }

    const isImportantBanner =
      thisBanner.decoration.important === 'true'
        ? true
        : thisBanner.decoration.important === 'false'
        ? false
        : true;

    let hasBannerExpired = true;
    try {
      hasBannerExpired = isAfter(
        new Date().toISOString(),
        thisBanner?.expirationDate
      );
    } catch (err) {
      reportException(err);
    }

    if (hasBannerExpired) {
      return null;
    }

    return (
      <DismissibleBanner
        important={isImportantBanner}
        preferenceKey={`${bannerLocation}-${thisBanner.expirationDate}`}
        variant={thisBanner.decoration.variant ?? 'warning'}
        {...rest}
      >
        <Markdown textOrMarkdown={thisBanner.message} />
      </DismissibleBanner>
    );
  }
);
