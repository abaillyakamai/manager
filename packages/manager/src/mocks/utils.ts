/**
 * Generate a unique id for use in MSW Models
 *
 * No numerical ID generated from Date ot Math.random can be guaranteed to be unique,
 * but this function will generate a random number that is VERY likely to be unique enough for use in MSW models.
 *
 * Not using uuid/v4 because it contains alphanumeric characters and we want to keep the IDs numeric.
 */
export const mswUUID = (): number => {
  return Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));
};
