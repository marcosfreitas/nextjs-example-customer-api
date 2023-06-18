export class SSOUserInfoSuccessResponse {
  sub: string;
  email_verified: boolean;
  preferred_username: string;
}

export class SSOUserInfoFailedResponse {
  error: string;
  error_description: string;
}
