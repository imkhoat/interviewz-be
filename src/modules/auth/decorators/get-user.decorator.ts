import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (data) {
      if (!user[data]) {
        throw new UnauthorizedException(`User property ${data} not found`);
      }
      return user[data];
    }

    return user;
  },
);
