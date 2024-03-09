import _ from 'lodash';

import { getMockData, setMockData } from './utils';

import type {
  CreateMockStoreEntity,
  DeleteMockStoreEntity,
  GetMockStoreEntities,
  GetMockStoreEntity,
  PutMockStoreEntity,
} from './types';

export const getMockStoreEntities = <FeatureEntity>({
  featureKey,
  initialEntities,
  queryKey,
}: GetMockStoreEntities<FeatureEntity>) => {
  try {
    let storedEntities: FeatureEntity[] = getMockData({
      featureKey,
      queryKey,
    });

    if (!storedEntities) {
      setMockData({
        data: initialEntities,
        featureKey,
        queryKey,
      });
      storedEntities = initialEntities;
    }

    return { entities: storedEntities ?? initialEntities };
  } catch (e) {
    throw new Error(
      `Failed to fetch entities. Please try again later. Error: ${e}`
    );
  }
};

export const getMockStoreEntity = <FeatureEntity>({
  entityId,
  featureKey,
  queryKey,
}: GetMockStoreEntity<FeatureEntity>) => {
  try {
    const storedEntities: FeatureEntity[] = getMockData({
      featureKey,
      queryKey,
    });

    if (!entityId) {
      return { entity: null };
    }

    const entityMatch = storedEntities.find(
      (storedEntity: FeatureEntity) => storedEntity['id'] === entityId
    );

    return { entity: entityMatch };
  } catch (e) {
    throw new Error(
      `Failed to fetch entity. Please try again later. Error: ${e}`
    );
  }
};

export const createMockStoreEntity = <FeatureEntity>({
  featureKey,
  payload,
  queryKey,
}: CreateMockStoreEntity<FeatureEntity>) => {
  try {
    const storedEntities: FeatureEntity[] = getMockData({
      featureKey,
      queryKey,
    });

    if (storedEntities) {
      setMockData({
        data: [...storedEntities, payload],
        featureKey,
        queryKey,
      });
    } else {
      setMockData({
        data: [payload],
        featureKey,
        queryKey,
      });
    }

    const storedDataLength = storedEntities?.length || 0;
    payload['id'] = storedDataLength + 1;

    return { entity: payload ?? null };
  } catch (e) {
    throw new Error(
      `Failed to create entity. Please try again later. Error: ${e}`
    );
  }
};

export const updateMockStoreEntity = <FeatureEntity>({
  deepMerge = true,
  entityId,
  featureKey,
  payload,
  queryKey,
}: PutMockStoreEntity<FeatureEntity>) => {
  try {
    const storedEntities: FeatureEntity[] = getMockData({
      featureKey,
      queryKey,
    });
    const entityIndex = storedEntities.findIndex(
      (storedEntity: FeatureEntity) => storedEntity['id'] === entityId
    );

    if (entityIndex === -1) {
      return { entity: null };
    }

    const updatedEntity = deepMerge
      ? _.mergeWith(
          storedEntities[entityIndex],
          payload,
          (objValue, srcValue) => {
            if (_.isArray(objValue)) {
              return objValue.concat(srcValue);
            }
            return objValue;
          }
        )
      : {
          ...storedEntities[entityIndex],
          ...payload,
        };

    const updatedEntities = [...storedEntities];
    updatedEntities[entityIndex] = updatedEntity;

    setMockData({
      data: updatedEntities,
      featureKey,
      queryKey,
    });

    return { entity: updatedEntity ?? null };
  } catch (e) {
    throw new Error(
      `Failed to update entity. Please try again later. Error: ${e}`
    );
  }
};

export const deleteMockStoreEntity = <FeatureEntity>({
  entityId,
  featureKey,
  queryKey,
}: DeleteMockStoreEntity) => {
  try {
    const storedEntities: FeatureEntity[] = getMockData({
      featureKey,
      queryKey,
    });

    const updatedEntities = storedEntities.filter(
      (storedEntity: FeatureEntity) => storedEntity['id'] !== entityId
    );

    setMockData({
      data: updatedEntities,
      featureKey,
      queryKey,
    });

    return { entity: null };
  } catch (e) {
    throw new Error(
      `Failed to delete entity. Please try again later. Error: ${e}`
    );
  }
};
