export type MockStoreFeature = 'Placement Groups' | 'VPC'; // Add more features here as needed;

type BaseMockStore = {
  feature: MockStoreFeature;
  key: string;
};
export interface MockStore<Feature> extends BaseMockStore {
  data: Feature[];
}

export interface GetMockStore<Feature> extends BaseMockStore {
  initialData: Feature[];
}

export interface PostMockStore<Feature> extends BaseMockStore {
  newItem: Feature;
}
