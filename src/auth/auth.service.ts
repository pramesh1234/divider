import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Cache } from "cache-manager";
import { PrismaService } from "src/prisma.service";
import { CachedData } from "./OtpCacheModel";
import { JwtService } from "@nestjs/jwt";
import { AuthModel } from "./model/auth.model";

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private jwtService: JwtService,
  ) {}
  otpSend() {
    return {};
  }
  async sendOtp(
    phoneNumber: string,
    countryCode: string,
    otp: string,
  ): Promise<any> {
    try {
      return this.cacheManager.set(
        "cached_item",
        JSON.stringify({
          phoneNumber,
          countryCode,
          otp,
        }),
        1000 * 60 * 15,
      );
    } catch (e: any) {
      console.log(":ERR ", e);
      throw new BadRequestException();
    }
  }
  async createUser(
    enteredOtp: string,
    phoneNumber: string,
    countryCode: string,
  ): Promise<AuthModel> {
    const cacheData = (await this.cacheManager.get("cached_item")) as string;
    if (cacheData == undefined) throw new BadRequestException("Time execeded");
    const userJson: CachedData = JSON.parse(cacheData);
    const otp = userJson?.otp;
    if (
      phoneNumber == undefined ||
      countryCode == undefined ||
      otp == undefined
    ) {
      throw new BadRequestException("Time execeded");
    }
    if (otp != enteredOtp) {
      throw new BadRequestException("Incorrect Otp Entered");
    }

    const userData: Prisma.UserCreateInput = {
      phoneNumber,
      countryCode,
    };
    const user = await this.prismaService.user.create({
      data: userData,
    });
    const payload = {
      userId: user.userId,
      userName: user.name,
      phoneNumber: user.phoneNumber,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    console.log("data====>>>> dat");
    const userResponse: AuthModel = {
      userId: user.userId,
      userName: user.name,
      phoneNumber: user.phoneNumber,
      isNewUser: false,
      accessToken: accessToken,
      countryCode: user.countryCode,
    };
    return userResponse;
  }
  async doesPhoneNumberExist(phoneNumber: string): Promise<AuthModel> {
    const user = await this.prismaService.user.findFirst({
      where: {
        phoneNumber: phoneNumber,
      },
    });

    if (user != null) {
      const payload = {
        userId: user.userId,
        userName: user.name,
        phoneNumber: user.phoneNumber,
      };

      const accessToken = await this.jwtService.signAsync(payload);
      const userResponse: AuthModel = {
        userId: user.userId,
        userName: user.name,
        phoneNumber: user.phoneNumber,
        isNewUser: false,
        accessToken: accessToken,
        countryCode: user.countryCode,
      };
      return userResponse;
    } else {
      return null;
    }
  }

  async updateUserData(
    name: string,
    longitude: string,
    latitude: string,
    phoneNumber: string,
  ): Promise<boolean> {
    const userData: Prisma.UserCreateInput = {
      phoneNumber,
      name,
      longitude,
      latitude,
    };
    const user = await this.prismaService.user.update({
      data: userData,
      where: {
        phoneNumber: phoneNumber,
      },
    });
    return !user;
  }
}
