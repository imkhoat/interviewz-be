import { IsNotEmpty, IsString } from "class-validator";

export class SignupResponseDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}
