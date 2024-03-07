import { getStorage, setStorage } from 'src/utilities/storage';

const MOCK_STORAGE_KEY = 'mockStoreData';

import type { MockStore } from './types';

export const setMockData = <Feature>({
  data,
  feature,
  key,
}: MockStore<Feature>) => {
  let mockStore = getStorage(MOCK_STORAGE_KEY);

  if (!mockStore) {
    mockStore = {};
  }

  const updatedMockStore = {
    ...mockStore,
    [feature]: {
      ...mockStore[feature],
      [key]: data,
    },
  };

  setStorage(MOCK_STORAGE_KEY, JSON.stringify(updatedMockStore));
};

export const getMockData = <Feature>({
  feature,
  key,
}: Omit<MockStore<Feature>, 'data'>) => {
  const mockStore = getStorage(MOCK_STORAGE_KEY);

  if (!mockStore) {
    return;
  }

  return mockStore[feature][key];
};
