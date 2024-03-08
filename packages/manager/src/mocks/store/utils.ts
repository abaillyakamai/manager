import { getStorage, setStorage } from 'src/utilities/storage';

const MOCK_STORAGE_KEY = 'mockStoreData';

import type { MockStore } from './types';

export const getMockData = <FeatureEntity>({
  featureKey,
  queryKey,
}: Omit<MockStore<FeatureEntity>, 'data'>) => {
  const mockStore = getStorage(MOCK_STORAGE_KEY);

  if (!mockStore) {
    return;
  }

  return mockStore[featureKey][queryKey];
};

export const setMockData = <FeatureEntity>({
  data,
  featureKey,
  queryKey,
}: MockStore<FeatureEntity>) => {
  let mockStore = getStorage(MOCK_STORAGE_KEY);

  if (!mockStore) {
    mockStore = {};
  }

  const updatedMockStore = {
    ...mockStore,
    [featureKey]: {
      ...mockStore[featureKey],
      [queryKey]: data,
    },
  };

  setStorage(MOCK_STORAGE_KEY, JSON.stringify(updatedMockStore));
};
