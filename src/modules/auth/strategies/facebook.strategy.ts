import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@modules/auth/services/auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const clientID = configService.get<string>('FACEBOOK_CLIENT_ID');
    const clientSecret = configService.get<string>('FACEBOOK_CLIENT_SECRET');
    const callbackURL = configService.get<string>('FACEBOOK_CALLBACK_URL');

    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error('Missing required Facebook OAuth configuration');
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
      profileFields: ['id', 'emails', 'name', 'photos'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
  ) {
    const { id, name, emails, photos } = profile;

    const user = await this.authService.handleOAuthLogin({
      provider: 'facebook',
      id,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      avatar: photos[0]?.value,
    });

    return user;
  }
}
