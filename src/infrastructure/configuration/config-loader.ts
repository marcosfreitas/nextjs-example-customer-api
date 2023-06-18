import { GlobalConfig } from './contracts/global.config';
import { Environment } from './contracts/env.config';
import { plainToInstance } from 'class-transformer';

/**
 * Loads the configuration from the environment variables
 * @returns GlobalConfig
 */
export const configLoader = (
  externalConfig?: Record<string, any>,
): GlobalConfig => {
  let env = externalConfig;

  if (!externalConfig) {
    env = process.env;
  }

  const configurations: GlobalConfig = {
    application: {
      environment: env.NODE_ENV as Environment,
      version: env.APP_VERSION,
      name: env.APP_NAME,
      listenPort: parseInt(env.APP_PORT, 10) || 22200,
    },
    database: {
      driver: env.DB_DRIVER,
      host: env.DB_HOST,
      port: env.DB_PORT,
      name: env.APP_NAME,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
    },
    sso: {
      authURL: env.SSO_AUTH_URL,
      clientId: env.SSO_CLIENT_ID,
      clientSecret: env.SSO_CLIENT_SECRET,
      username: env.SSO_USERNAME,
      password: env.SSO_PASSWORD,
      grantType: env.SSO_GRANT_TYPE,
      scope: env.SSO_SCOPE,
    },
  };

  return plainToInstance(GlobalConfig, configurations);
};
