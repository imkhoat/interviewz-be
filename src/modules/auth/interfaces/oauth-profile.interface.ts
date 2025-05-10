export interface OAuthProfile {
  provider: string;
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}
