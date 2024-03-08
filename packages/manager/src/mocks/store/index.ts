import { getMockData, setMockData } from './utils';

import type {
  GetMockStoreEntities,
  GetMockStoreEntity,
  PostMockStore,
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
  newEntity,
}: PostMockStore<FeatureEntity>) => {
  const storedEntities: FeatureEntity[] = getMockData({
    feature,
    key,
  });

  if (storedEntities) {
    setMockData({
      data: [...storedEntities, newEntity],
      feature,
      key,
    });
  } else {
    setMockData({
      data: [newEntity],
      feature,
      key,
    });
  }

  const storedDataLength = storedEntities?.length || 0;
  newEntity['id'] = storedDataLength + 1;

  return { entity: newEntity };
};

export const updateMockStoreEntity = <FeatureEntity>({
  feature,
  key,
  updatedEntity,
}: PutMockStore<FeatureEntity>) => {
  const storedData: FeatureEntity[] = getMockData({
    feature,
    key,
  });

  if (storedData) {
    const updatedData = storedData.filter(
      (entity: FeatureEntity) => entity['id'] === updatedEntity['id']
    );
    setMockData({
      data: updatedData,
      feature,
      key,
    });
  }

  return { entity: updatedEntity };
};
