import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-linkedin-oauth2';
import { ConfigService } from '@nestjs/config';
import { OAuthProfile } from '@modules/auth/interfaces/oauth-profile.interface';

@Injectable()
export class LinkedinStrategy extends PassportStrategy(Strategy, 'linkedin') {
  constructor(private configService: ConfigService) {
    const clientID = configService.get<string>('LINKEDIN_CLIENT_ID');
    const clientSecret = configService.get<string>('LINKEDIN_CLIENT_SECRET');
    const callbackURL = configService.get<string>('LINKEDIN_CALLBACK_URL');

    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error('Missing LinkedIn OAuth configuration');
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['r_emailaddress', 'r_liteprofile'],
    } as any); // Using type assertion as a temporary solution
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;
    const user: OAuthProfile = {
      id,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      avatar: photos?.[0]?.value,
      provider: 'linkedin',
    };

    done(null, user);
  }
}
