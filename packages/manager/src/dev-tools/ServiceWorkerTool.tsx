import * as React from 'react';

import { Tooltip } from 'src/components/Tooltip';
import { getMockPresetGroups } from 'src/mocks/mockPreset';
import { getStateSeederGroups } from 'src/mocks/mockState';
import {
  baselineMockPresets,
  defaultBaselineMockPreset,
  extraMockPresets,
} from 'src/mocks/presets';
import { allStateSeeders } from 'src/mocks/seeds';
import { removeSeeds } from 'src/mocks/utilities/removeSeeds';

import { DevToolSelect } from './components/DevToolSelect';

import type { MockSeederIds, MockState } from 'src/mocks/types';

const LOCAL_STORAGE_KEY = 'msw';
const LOCAL_STORAGE_POPULATORS_KEY = 'msw-populators';
const LOCAL_STORAGE_PRESET_KEY = 'msw-preset';
const LOCAL_STORAGE_PRESET_EXTRAS_KEY = 'msw-preset-extras';
export const LOCAL_STORAGE_COUNT_MAP_KEY = 'msw-count-map';

/**
 * Whether MSW is enabled via local storage setting.
 *
 * `true` if MSW is enabled, `false` otherwise.
 */
export const isMSWEnabled =
  localStorage.getItem(LOCAL_STORAGE_KEY) === 'enabled';

/**
 * Saves MSW enabled or disabled state to local storage.
 *
 * @param enabled - Whether or not to enable MSW.
 */
export const saveMSWEnabled = (enabled: boolean) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, enabled ? 'enabled' : 'disabled');
  // window.location.reload();
};

/**
 * Returns the ID of the selected MSW preset that is stored in local storage.
 *
 * @returns ID of selected MSW preset, or `null` if no preset is saved.
 */
export const getMSWPreset = () => {
  return (
    localStorage.getItem(LOCAL_STORAGE_PRESET_KEY) ??
    defaultBaselineMockPreset.id
  );
};

/**
 * Saves ID of selected MSW preset in local storage.
 */
export const saveMSWPreset = (presetId: string) => {
  localStorage.setItem(LOCAL_STORAGE_PRESET_KEY, presetId);
};

/**
 * Retrieves the seeding count map from local storage.
 */
export const getMSWCountMap = (): { [key: string]: number } => {
  const encodedCountMap = localStorage.getItem(LOCAL_STORAGE_COUNT_MAP_KEY);

  return encodedCountMap ? JSON.parse(encodedCountMap) : {};
};

/**
 * Saves the seeding count map to local storage.
 */
export const saveMSWCountMap = (countMap: { [key: string]: number }) => {
  localStorage.setItem(LOCAL_STORAGE_COUNT_MAP_KEY, JSON.stringify(countMap));
};

/**
 * Returns an array of enabled extra MSW presets that are stored in local storage.
 *
 * An empty array is returned when the expected data does not exist in local
 * storage.
 */
export const getMSWExtraPresets = (): string[] => {
  const encodedPresets = localStorage.getItem(LOCAL_STORAGE_PRESET_EXTRAS_KEY);
  if (!encodedPresets) {
    return [];
  }
  const storedPresets = encodedPresets.split(',');

  // Filter out any stored presets that no longer exist in the code base.
  return storedPresets.filter((storedPreset) =>
    extraMockPresets.find(
      (extraMockPreset) => extraMockPreset.id === storedPreset
    )
  );
};

export const saveMSWExtraPresets = (presets: string[]) => {
  localStorage.setItem(LOCAL_STORAGE_PRESET_EXTRAS_KEY, presets.join(','));
};

export const getMSWContextSeeders = (): string[] => {
  const encodedPopulators = localStorage.getItem(LOCAL_STORAGE_POPULATORS_KEY);
  if (!encodedPopulators) {
    // always have a default region
    if (
      !encodedPopulators?.includes(
        'prod-regions' || 'legacy-test-regions' || 'edge-regions'
      )
    ) {
      return ['prod-regions'];
    }

    return [];
  }
  const storedPopulators = encodedPopulators.split(',');

  // Filter out any stored populators that no longer exist in the code base.
  return storedPopulators.filter((storedPopulator) =>
    allStateSeeders.find((stateSeeder) => stateSeeder.id === storedPopulator)
  );
};

export const saveMSWContextPopulators = (populators: string[]) => {
  localStorage.setItem(LOCAL_STORAGE_POPULATORS_KEY, populators.join(','));
};

const renderBaselinePresetOptions = () =>
  getMockPresetGroups(baselineMockPresets).map((group) => {
    return (
      <optgroup key={group} label={group}>
        {baselineMockPresets
          .filter((mockPreset) => mockPreset.group === group)
          .map((mockPreset) => {
            return (
              <option key={mockPreset.id} value={mockPreset.id}>
                {mockPreset.label}
              </option>
            );
          })}
      </optgroup>
    );
  });

const renderContentPopulatorOptions = (
  seeders: string[],
  onChange: (e: React.ChangeEvent, populatorId: string) => void,
  onCountChange: (e: React.ChangeEvent, populatorId: string) => void,
  countMap: { [key: string]: number },
  disabled: boolean
) => {
  return (
    <ul>
      {getStateSeederGroups(allStateSeeders).map((group) => (
        <div key={group}>
          <li className="dev-tools__list-box__separator">{group}</li>
          {allStateSeeders
            .filter((stateSeeder) => stateSeeder.group === group)
            .map((stateSeeder) => (
              <li key={stateSeeder.id}>
                <input
                  checked={seeders.includes(stateSeeder.id)}
                  disabled={disabled}
                  onChange={(e) => onChange(e, stateSeeder.id)}
                  style={{ marginRight: 12 }}
                  type="checkbox"
                />
                <span title={stateSeeder.desc || stateSeeder.label}>
                  {stateSeeder.label}
                </span>
                {stateSeeder.canUpdateCount && (
                  <input
                    aria-label="Count"
                    min={0}
                    onChange={(e) => onCountChange(e, stateSeeder.id)}
                    style={{ marginLeft: 8, width: 60 }}
                    type="number"
                    value={countMap[stateSeeder.id] || 0}
                  />
                )}
              </li>
            ))}
        </div>
      ))}
    </ul>
  );
};

const renderExtraPresetOptions = (
  handlers: string[],
  onChange: (e: React.ChangeEvent, presetId: string) => void,
  disabled: boolean
) => {
  return (
    <ul>
      {getMockPresetGroups(extraMockPresets).map((group) => (
        <div key={group}>
          <li className="dev-tools__list-box__separator">{group}</li>
          {extraMockPresets
            .filter((extraMockPreset) => extraMockPreset.group === group)
            .map((extraMockPreset) => (
              <li key={extraMockPreset.id}>
                <input
                  checked={handlers.includes(extraMockPreset.id)}
                  disabled={disabled}
                  onChange={(e) => onChange(e, extraMockPreset.id)}
                  style={{ marginRight: 12 }}
                  type="checkbox"
                />
                <span title={extraMockPreset.desc || extraMockPreset.label}>
                  {extraMockPreset.label}
                </span>
              </li>
            ))}
        </div>
      ))}
    </ul>
  );
};

interface ServiceWorkerSaveState {
  hasSaved: boolean;
  hasUnsavedChanges: boolean;
}

export const ServiceWorkerTool = () => {
  const loadedBasePreset = getMSWPreset();
  const loadedPresets = getMSWExtraPresets();
  const loadedSeeders = getMSWContextSeeders();
  const loadedCountMap = getMSWCountMap();

  const [MSWBasePreset, setMSWBasePreset] = React.useState<string>(
    loadedBasePreset
  );
  const [MSWHandlers, setMSWHandlers] = React.useState<string[]>(loadedPresets);
  const [MSWSeeders, setMSWSeeders] = React.useState<string[]>(loadedSeeders);
  const [countMap, setCountMap] = React.useState<{ [key: string]: number }>(
    loadedCountMap
  );

  const [saveState, setSaveState] = React.useState<ServiceWorkerSaveState>({
    hasSaved: false,
    hasUnsavedChanges: false,
  });

  const handleChangeBasePreset = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMSWBasePreset(e.target.value);
    setSaveState({
      hasSaved: false,
      hasUnsavedChanges: true,
    });
  };

  const handleToggleMSW = (e: React.ChangeEvent<HTMLInputElement>) => {
    saveMSWEnabled(e.target.checked);
    window.location.reload();
  };

  const handleChangePopulator = async (
    e: React.ChangeEvent<HTMLInputElement>,
    seederId: MockSeederIds
  ) => {
    const willEnable = e.target.checked;
    if (willEnable && !MSWSeeders.includes(seederId)) {
      setMSWSeeders([...MSWSeeders, seederId]);
      setSaveState({
        hasSaved: false,
        hasUnsavedChanges: true,
      });
    } else if (!willEnable && MSWSeeders.includes(seederId)) {
      setMSWSeeders(
        MSWSeeders.filter((seeder) => {
          return seeder !== seederId;
        })
      );
      setSaveState({
        hasSaved: false,
        hasUnsavedChanges: true,
      });
      await removeSeeds(seederId);
    }
  };

  const handleChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    handlerPresetId: string
  ) => {
    const willEnable = e.target.checked;
    if (willEnable && !MSWHandlers.includes(handlerPresetId)) {
      setMSWHandlers([...MSWHandlers, handlerPresetId]);
      setSaveState({
        hasSaved: false,
        hasUnsavedChanges: true,
      });
    } else if (!willEnable && MSWHandlers.includes(handlerPresetId)) {
      setMSWHandlers(
        MSWHandlers.filter((handler) => {
          return handler !== handlerPresetId;
        })
      );
      setSaveState({
        hasSaved: false,
        hasUnsavedChanges: true,
      });
    }
  };

  const handleCountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    populatorId: string
  ) => {
    const updatedCountMap = {
      ...countMap,
      [populatorId]: parseInt(e.target.value, 10),
    };

    setCountMap(updatedCountMap);
    setSaveState({
      hasSaved: false,
      hasUnsavedChanges: true,
    });
  };

  const handleApplyChanges = () => {
    // Save base preset, extra presets, and content populators to local storage.
    saveMSWPreset(MSWBasePreset);
    saveMSWExtraPresets(MSWHandlers);
    saveMSWContextPopulators(MSWSeeders);
    saveMSWCountMap(countMap);

    const promises = MSWSeeders.map((seederId) => {
      const populator = allStateSeeders.find(
        (seeder) => seeder.id === seederId
      );

      return populator?.seeder({} as MockState);
    });

    Promise.all(promises).then(() => {
      setSaveState((prevSaveState) => ({
        ...prevSaveState,
        hasSaved: true,
        hasUnsavedChanges: false,
      }));
    });

    // We only have to reload the window if MSW is already enabled. Otherwise,
    // the changes will automatically be picked up next time MSW is enabled.
    if (isMSWEnabled) {
      window.location.reload();
    }
  };

  const discardChanges = () => {
    setMSWBasePreset(getMSWPreset());
    setMSWHandlers(getMSWExtraPresets());
    setMSWSeeders(getMSWContextSeeders());
    setSaveState({
      hasSaved: false,
      hasUnsavedChanges: false,
    });
  };

  return (
    <div className="dev-tools__tool">
      <div className="dev-tools__tool__header">
        <span title="Configure API mocking rules">API Mocks</span>
      </div>
      <div className="dev-tools__tool__body dev-tools__msw">
        <div className="dev-tools__msw__presets">
          <div>
            <input
              checked={isMSWEnabled}
              onChange={(e) => handleToggleMSW(e)}
              style={{ margin: 0 }}
              type="checkbox"
            />
            <span style={{ marginLeft: 8 }}>
              <span>Enable MSW</span>
            </span>
          </div>
          <div>
            <Tooltip
              placement="top"
              title={!isMSWEnabled ? 'Enable MSW to select a preset' : ''}
            >
              <div>
                <span
                  style={{ marginRight: 8, opacity: !isMSWEnabled ? 0.5 : 1 }}
                >
                  Base Preset
                </span>
                <DevToolSelect
                  disabled={!isMSWEnabled}
                  onChange={(e) => handleChangeBasePreset(e)}
                  value={MSWBasePreset}
                >
                  {renderBaselinePresetOptions()}
                </DevToolSelect>
              </div>
            </Tooltip>
          </div>
        </div>
        <Tooltip
          placement="top"
          title={!isMSWEnabled ? 'Enable MSW to select a preset' : ''}
        >
          <div
            className={`dev-tools__msw__extras ${
              !isMSWEnabled ? 'disabled' : ''
            }`}
          >
            <div className="dev-tools__msw__column">
              <div className="dev-tools__msw__column__heading">Content</div>
              <div className="dev-tools__msw__column__body">
                <div className="dev-tools__list-box">
                  {renderContentPopulatorOptions(
                    MSWSeeders,
                    handleChangePopulator,
                    handleCountChange,
                    countMap,
                    !isMSWEnabled
                  )}
                </div>
              </div>
            </div>
            <div className="dev-tools__msw__column">
              <div className="dev-tools__msw__column__heading">Presets</div>
              <div className="dev-tools__msw__column__body">
                <div className="dev-tools__list-box">
                  {renderExtraPresetOptions(
                    MSWHandlers,
                    handleChangeHandler,
                    !isMSWEnabled
                  )}
                </div>
              </div>
            </div>
          </div>
        </Tooltip>
      </div>
      <div className="dev-tools__tool__footer">
        <div className="dev-tools__button-list">
          <button
            disabled={saveState.hasUnsavedChanges ? false : true}
            onClick={discardChanges}
          >
            Discard Changes
          </button>
          <button
            disabled={saveState.hasUnsavedChanges ? false : true}
            onClick={handleApplyChanges}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
