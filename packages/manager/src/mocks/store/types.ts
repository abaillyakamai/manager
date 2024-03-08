export type MockStoreFeature = 'Placement Groups' | 'VPC'; // Add more features here as needed;

type BaseMockStore = {
  feature: MockStoreFeature;
  key: string;
};
export interface MockStore<FeatureEntity> extends BaseMockStore {
  data: FeatureEntity[];
}

export interface GetMockStoreEntities<FeatureEntity> extends BaseMockStore {
  initialEntities: FeatureEntity[];
}

export interface GetMockStoreEntity<FeatureEntity> extends BaseMockStore {
  entityId: FeatureEntity;
}

export interface PostMockStore<FeatureEntity> extends BaseMockStore {
  newEntity: FeatureEntity;
}

export interface PutMockStore<FeatureEntity> extends BaseMockStore {
  updatedEntity: FeatureEntity;
}
