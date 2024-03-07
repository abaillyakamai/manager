import { getStorage, setStorage } from 'src/utilities/storage';

const MOCK_STORAGE_KEY = 'mockStoreData';

type MockStoreFeature = 'Placement Groups' | 'VPC'; // Add more features here as needed;

interface MockStore {
  feature: MockStoreFeature;
  data: any;
  endpoint: string;
}

export const setMockData = ({ feature, endpoint, data }: MockStore) => {
  const mockStore = getStorage(MOCK_STORAGE_KEY);

  setStorage(MOCK_STORAGE_KEY, {
    ...mockStore,
    [feature]: {
      [endpoint]:
        data
    },
  });
};

export const getMockData = (key: string) => {
  const storage = getStorage(MOCK_STORAGE_KEY);
  return storage[key];
}
