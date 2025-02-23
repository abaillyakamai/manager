import { yupResolver } from '@hookform/resolvers/yup';
import { CreateLinodeSchema } from '@linode/validation';

import { accountQueries } from 'src/queries/account/queries';
import { regionQueries } from 'src/queries/regions/regions';
import { getRegionCountryGroup, isEURegion } from 'src/utilities/formatRegion';
import { isNullOrUndefined } from 'src/utilities/nullOrUndefined';

import {
  CreateLinodeFromBackupSchema,
  CreateLinodeFromMarketplaceAppSchema,
  CreateLinodeFromStackScriptSchema,
} from './schemas';
import { getLinodeCreatePayload } from './utilities';

import type { LinodeCreateType } from './types';
import type {
  LinodeCreateFormContext,
  LinodeCreateFormValues,
} from './utilities';
import type { CreateLinodeRequest } from '@linode/api-v4';
import type { QueryClient } from '@tanstack/react-query';
import type { FieldErrors, Resolver } from 'react-hook-form';
import type { ObjectSchema } from 'yup';

export const getLinodeCreateResolver = (
  tab: LinodeCreateType | undefined,
  queryClient: QueryClient
): Resolver<LinodeCreateFormValues, LinodeCreateFormContext> => {
  const schema = linodeCreateResolvers[tab ?? 'OS'];
  return async (values, context, options) => {
    const transformedValues = getLinodeCreatePayload(structuredClone(values));

    const { errors } = await yupResolver(
      schema as ObjectSchema<CreateLinodeRequest>,
      {},
      { mode: 'async', raw: true }
    )(transformedValues, context, options);

    if (tab === 'Clone Linode' && !values.linode) {
      (errors as FieldErrors<LinodeCreateFormValues>)['linode'] = {
        message: 'You must select a Linode to clone from.',
        type: 'validate',
      };
    }

    const regions = await queryClient.ensureQueryData(regionQueries.regions);
    const selectedRegion = regions.find((r) => r.id === values.region);

    const hasSelectedAnEURegion = isEURegion(
      getRegionCountryGroup(selectedRegion)
    );

    if (hasSelectedAnEURegion && !context?.profile?.restricted) {
      const agreements = await queryClient.ensureQueryData(
        accountQueries.agreements
      );

      const hasSignedEUAgreement = agreements.eu_model;

      if (!hasSignedEUAgreement && !values.hasSignedEUAgreement) {
        (errors as FieldErrors<LinodeCreateFormValues>)[
          'hasSignedEUAgreement'
        ] = {
          message:
            'You must agree to the EU agreement to deploy to this region.',
          type: 'validate',
        };
      }
    }

    const secureVMViolation =
      context?.secureVMNoticesEnabled &&
      !values.firewallOverride &&
      isNullOrUndefined(values.firewall_id);

    if (secureVMViolation) {
      (errors as FieldErrors<LinodeCreateFormValues>)['firewallOverride'] = {
        type: 'validate',
      };
    }

    if (errors) {
      return { errors, values };
    }

    return { errors: {}, values };
  };
};

export const linodeCreateResolvers = {
  Backups: CreateLinodeFromBackupSchema,
  'Clone Linode': CreateLinodeSchema,
  Images: CreateLinodeSchema,
  OS: CreateLinodeSchema,
  'One-Click': CreateLinodeFromMarketplaceAppSchema,
  StackScripts: CreateLinodeFromStackScriptSchema,
};
