import { getMockData, setMockData } from './utils';

import type { GetMockStore, PostMockStore } from './types';

export const handleGetMockStore = <Feature>({
  feature,
  initialData,
  key,
}: GetMockStore<Feature>) => {
  let storedData = getMockData({
    feature,
    key,
  });

  if (!storedData) {
    setMockData({
      data: initialData,
      feature,
      key,
    });
    storedData = initialData;
  }

  return { storedData };
};

export const handlePostMockStore = <Feature>({
  feature,
  key,
  newItem,
}: PostMockStore<Feature>) => {
  const storedData = getMockData({
    feature,
    key,
  });

  if (storedData) {
    setMockData({
      data: [...storedData, newItem],
      feature,
      key,
    });
  } else {
    setMockData({
      data: [newItem],
      feature,
      key,
    });
  }

  const storedDataLength = storedData?.length || 0;
  newItem['id'] = storedDataLength + 1;

  return { newItem };
};
