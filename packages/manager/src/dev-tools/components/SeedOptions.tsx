import * as React from 'react';

import { getStateSeederGroups } from 'src/mocks/mockState';
import { dbSeeders } from 'src/mocks/seeds';

interface SeedOptionsProps {
  disabled: boolean;
  onCountChange: (e: React.ChangeEvent, populatorId: string) => void;
  onToggleSeeder: (e: React.ChangeEvent, populatorId: string) => void;
  seeders: string[];
  seedsCountMap: { [key: string]: number };
}

/**
 * Renders a list of seeders and their counts.
 */
export const SeedOptions = ({
  disabled,
  onCountChange,
  onToggleSeeder,
  seeders,
  seedsCountMap,
}: SeedOptionsProps) => {
  const [localValues, setLocalValues] = React.useState<{
    [key: string]: string;
  }>(
    Object.entries(seedsCountMap).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: String(value),
      }),
      {}
    )
  );

  return (
    <ul>
      {getStateSeederGroups(dbSeeders).map((group) => (
        <div key={group}>
          {dbSeeders
            .filter((dbSeeder) => dbSeeder.group.id === group)
            .map((dbSeeder) => (
              <li key={dbSeeder.id}>
                <input
                  checked={seeders.includes(dbSeeder.id)}
                  disabled={disabled}
                  onChange={(e) => onToggleSeeder(e, dbSeeder.id)}
                  style={{ marginRight: 12 }}
                  type="checkbox"
                />
                <span title={dbSeeder.desc || dbSeeder.label}>
                  {dbSeeder.label}
                </span>
                {dbSeeder.canUpdateCount && (
                  <input
                    onBlur={(e) => {
                      const value =
                        e.target.value === '' ? '0' : e.target.value;
                      setLocalValues((prev) => ({
                        ...prev,
                        [dbSeeder.id]: value,
                      }));
                      onCountChange(
                        {
                          target: { value },
                        } as React.ChangeEvent<HTMLInputElement>,
                        dbSeeder.id
                      );
                    }}
                    onChange={(e) => {
                      setLocalValues((prev) => ({
                        ...prev,
                        [dbSeeder.id]: e.target.value,
                      }));
                    }}
                    onFocus={(e) => {
                      if (e.target.value === '0') {
                        e.target.value = '';
                      }
                    }}
                    aria-label={`Value for ${dbSeeder.label}`}
                    disabled={disabled || !seeders.includes(dbSeeder.id)}
                    min={0}
                    style={{ marginLeft: 8, width: 60 }}
                    type="number"
                    value={localValues[dbSeeder.id] || '0'}
                  />
                )}
              </li>
            ))}
        </div>
      ))}
    </ul>
  );
};
