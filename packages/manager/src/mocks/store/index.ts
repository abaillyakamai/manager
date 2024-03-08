import { getMockData, setMockData } from './utils';

import type {
  CreateMockStoreEntity,
  GetMockStoreEntities,
  GetMockStoreEntity,
  PutMockStore,
} from './types';

export const getMockStoreEntities = <FeatureEntity>({
  feature,
  initialEntities,
  key,
}: GetMockStoreEntities<FeatureEntity>) => {
  let storedEntities: FeatureEntity[] = getMockData({
    feature,
    key,
  });

  if (!storedEntities) {
    setMockData({
      data: initialEntities,
      feature,
      key,
    });
    storedEntities = initialEntities;
  }

  return { entities: storedEntities };
};

export const getMockStoreEntity = <FeatureEntity>({
  entityId,
  feature,
  key,
}: GetMockStoreEntity<FeatureEntity>) => {
  const storedEntities: FeatureEntity[] = getMockData({
    feature,
    key,
  });

  if (!entityId) {
    return { entity: null };
  }

  const entityMatch = storedEntities.find(
    (storedEntity: FeatureEntity) => storedEntity['id'] === entityId
  );

  return { entity: entityMatch };
};

export const createMockStoreEntity = <FeatureEntity>({
  feature,
  key,
  payload,
}: CreateMockStoreEntity<FeatureEntity>) => {
  const storedEntities: FeatureEntity[] = getMockData({
    feature,
    key,
  });

  if (storedEntities) {
    setMockData({
      data: [...storedEntities, payload],
      feature,
      key,
    });
  } else {
    setMockData({
      data: [payload],
      feature,
      key,
    });
  }

  const storedDataLength = storedEntities?.length || 0;
  payload['id'] = storedDataLength + 1;

  return { entity: payload };
};

export const updateMockStoreEntity = <FeatureEntity>({
  entityId,
  feature,
  key,
  payload,
}: PutMockStore<FeatureEntity>) => {
  const storedEntities: FeatureEntity[] = getMockData({
    feature,
    key,
  });
  const entityIndex = storedEntities.findIndex(
    (storedEntity: FeatureEntity) => storedEntity['id'] === entityId
  );

  if (entityIndex === -1) {
    return { entity: null };
  }

  const updatedEntity = {
    ...storedEntities[entityIndex],
    ...payload,
  };

  const updatedEntities = [...storedEntities];
  updatedEntities[entityIndex] = updatedEntity;

  setMockData({
    data: updatedEntities,
    feature,
    key,
  });

  return { entity: updatedEntity };
};
