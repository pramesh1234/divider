import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { NumberValidationDto } from "./dto/NumberValidationDto";
import { VerifyOtpDto } from "./dto/VerifyOtpDto";
import { AuthService } from "./auth.service";
import { UserDto } from "./dto/UserDto";
import { AuthGuard } from "./auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post("/sendOtp")
  public async numberValidation(@Body() body: NumberValidationDto) {
    const num = body.phoneNumber;
    if (num.length >= 10) {
      const random = Math.floor(1000 + Math.random() * 9000);
      const otp = `${random}`;
      const countryCode = body?.countryCode;
      const phoneNumber = body?.phoneNumber;
      await this.authService.sendOtp(phoneNumber, countryCode, otp);
      return {
        message: "Otp Sent Successfully",
        data: { otp },
      };
    } else {
      throw new BadRequestException("Invalid data");
    }
  }

  @Post("/verifyOtp")
  public async verifyOtp(@Body() body: VerifyOtpDto) {
    const num = body?.otp;
    const phoneNum = body?.phoneNumber;
    const countryC = body?.countryCode;
    if (num.length != 6) {
      new UnauthorizedException("otp is not valid");
    }
    if (phoneNum.length != 10) {
      new UnauthorizedException("phoneNumber is not valid");
    }

    const userData = await this.authService.doesPhoneNumberExist(phoneNum);
    if (userData != null) {
      const userName = userData.userName;
      const countryCode = userData.countryCode;
      const phoneNumber = userData.phoneNumber;
      const isNewUser = userData.isNewUser;
      const accessToken = userData.accessToken;

      return {
        message: "User Verified Successfully",
        data: {
          userName,
          countryCode,
          phoneNumber,
          isNewUser,
          accessToken,
        },
      };
    } else {
      const createUser = await this.authService.createUser(
        num,
        phoneNum,
        countryC,
      );
      console.log(`create user ${createUser}`)
      const name = createUser.userName;
      const countryCode = createUser.countryCode;
      const phoneNumber = createUser.phoneNumber;
      const isNewUser = true;
      const accessToken = createUser.accessToken;
      return {
        message: "User Created Successfully",
        data: {
          name,
          countryCode,
          phoneNumber,
          isNewUser,
          accessToken,
        },
      };
    }
  }

  @UseGuards(AuthGuard)
  @Post("/userUpdate")
  async updateUser(@Body() body: UserDto, @Request() req) {
    const userName = body?.name;
    const longitude = body?.longitude;
    const latitude = body?.latitude;
    const phoneNumber = req?.user.phoneNumber;
    const updated = await this.authService.updateUserData(
      userName,
      longitude,
      latitude,
      phoneNumber,
    );
    if (!updated) {
      return {
        message: "User Updated Successfully",
      };
    } else {
      return {
        message: "Something went wrong",
      };
    }
  }
}
