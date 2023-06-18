export class SSOAuthorizationResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: 'Bearer';
  'not-before-policy': number;
  scope: string;
  id_token: string;
}
