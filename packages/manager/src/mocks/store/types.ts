export type MockStoreFeature = 'Placement Groups' | 'VPC'; // Add more features here as needed;

type BaseMockStore = {
  featureKey: MockStoreFeature;
  queryKey: string;
};
export interface MockStore<Feature> extends BaseMockStore {
  data: Feature[];
}

export interface GetMockStoreEntities<Feature> extends BaseMockStore {
  initialEntities: Feature[];
}

export interface GetMockStoreEntity<Feature> extends BaseMockStore {
  entityId: number;
}

export interface CreateMockStoreEntity<Feature> extends BaseMockStore {
  payload: Feature;
}

export interface PutMockStoreEntity<Feature> extends BaseMockStore {
  deepMerge?: boolean;
  entityId: number;
  payload: Feature;
}

export interface DeleteMockStoreEntity extends BaseMockStore {
  entityId: number;
}
