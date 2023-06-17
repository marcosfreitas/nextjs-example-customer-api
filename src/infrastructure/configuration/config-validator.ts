import { validateSync } from 'class-validator';
import { configLoader } from './config-loader';

/**
 * Apply validation of parsed configuration values.
 * @param rawConfig
 * @returns GlobalConfig
 */
export const configValidator = (rawConfig: Record<string, unknown>) => {
  const config = configLoader(rawConfig);
  const errors = validateSync(config, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return config;
};
