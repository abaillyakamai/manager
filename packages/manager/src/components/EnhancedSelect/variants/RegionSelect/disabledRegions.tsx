import * as React from 'react';

import { Link } from 'src/components/Link';
import { Typography } from 'src/components/Typography';
import { regionFactory } from 'src/factories';

import type { Region } from '@linode/api-v4';

// DATA
const TOKYO_DISABLED_MESSAGE =
  'Tokyo is sold out while we expand our capacity. We recommend deploying workloads in Osaka.';
const TOKYO_DISABLED_MESSAGE_LINK =
  'https://www.linode.com/blog/linode/tokyo-region-availability-update/';

// UTILS
interface DisabledMessage {
  disabledLink: string;
  disabledMessage: string;
}

const disabledMessage = ({
  disabledLink,
  disabledMessage,
}: DisabledMessage): JSX.Element => (
  <Typography>
    {disabledMessage}
    <br />
    <Link to={disabledLink}>Learn more</Link>.
  </Typography>
);
interface DisabledRegion {
  /**
   * The message to display when the region is disabled.
   */
  disabledMessage: JSX.Element;
  /**
   * A list of paths that should not display the fake region.
   */
  excludePaths?: string[];
  /**
   * The fake region to display.
   */
  fakeRegion: Region;
  /**
   * The feature flag that controls whether the fake region should be displayed.
   */
  featureFlag: string;
}

export const listOfDisabledRegions: DisabledRegion[] = [
  {
    disabledMessage: disabledMessage({
      disabledLink: TOKYO_DISABLED_MESSAGE_LINK,
      disabledMessage: TOKYO_DISABLED_MESSAGE,
    }),
    excludePaths: ['/object-storage/buckets/create'],
    fakeRegion: regionFactory.build({
      id: 'ap-northeast',
      label: 'Tokyo, JP',
    }),
    featureFlag: 'soldOutTokyo',
  },
];
