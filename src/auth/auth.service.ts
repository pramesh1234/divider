import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";
import { PrismaService } from "src/prisma.service";
import { CachedData } from "./OtpCacheModel";
import { JwtService } from "@nestjs/jwt";
import { AuthModel } from "./model/auth.model";
import { uuid } from "uuidv4";
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
  ): Promise<any> {
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

    const userId = uuid()
    const prisma = this.prismaService.$extends({
      model: {
        user: {
          async create(data:{
            userName: string
            firstName: string
            lastName: string
            phoneNumber: string
            countryCode: string
            userId: string
            latitude: number
            longitude: number
          }){
    const poi: MyPointOfInterest = {
      userName: data.userName,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber:  data.phoneNumber,
      countryCode:  data.countryCode,
      userId: data.userId,
  
      location: {
        latitude: data.latitude,
        longitude:  data.longitude,
      },
    }
    const location = `POINT(${poi.location.longitude} ${poi.location.latitude})`
    // ST_GeomFromText(${point}, 4326)
    const pointString = `SRID=4326;POINT(${poi.location.longitude} ${poi.location.latitude})`;
   const datra = await prisma.$queryRaw`INSERT INTO "User" ( user_id, phone_number, user_name,first_name,last_name, country_code, location,created_at) VALUES (${poi.userId}, ${poi.phoneNumber}, ${poi.userName},${poi.firstName},${poi.lastName}, ${poi.countryCode},  ST_GeogFromText(${pointString}),Now())  RETURNING user_id, phone_number, user_name, country_code;` ;
  }}}})
  const payload = {
    userId: userId,
    userName: '',
    phoneNumber:phoneNumber,
    countryCode: countryCode,
  };

  const accessToken = await this.jwtService.signAsync(payload);
  const data ={
  userName: "",
  firstName: "",
  lastName: "",
  phoneNumber,
  countryCode,
  userId,
  latitude: 0.0,
  longitude: 0.0,
  accessToken:accessToken,
}
await prisma.user.create(data);
  return data

  }
  async doesPhoneNumberExist(phoneNumber: string): Promise<AuthModel> {
    const user = await this.prismaService.$queryRaw`SELECT user_id,user_name,phone_number,country_code FROM "User" Where "phone_number" = ${phoneNumber}`;

    if (user[0] != null) {
      const payload = {
        userId: user[0].user_id,
        userName: user[0].name,
        phoneNumber: user[0].phone_number,
      };

     const accessToken = await this.jwtService.signAsync(payload);
      const userResponse: AuthModel = {
        userId: user[0].user_id,
        userName: user[0].user_name,
        phoneNumber: user[0].phone_number,
        isNewUser: false,
        accessToken: accessToken,
        countryCode: user[0].country_code,
      };
     return userResponse;
    } else {
      return null;
    }
  }

  async updateUserData(
    uName: string,
    firstName: string,
    lastName: string,
    longitude: number,
    latitude: number,
    phoneNumber: string,
  ): Promise<boolean> {
  
    const pointString = `SRID=4326;POINT(${longitude?? 0.0} ${latitude?? 0.0})`;
    let user;

    if (uName !== null) {
      user = await this.prismaService.$executeRaw`
        UPDATE "User"
        SET "user_name" = ${uName}
        WHERE "phone_number" = ${phoneNumber}
        RETURNING *;
      `;
    } else if (lastName !== null && firstName !== null) {
      user = await this.prismaService.$executeRaw`
        UPDATE "User"
        SET "first_name" = ${firstName},
            "last_name" = ${lastName}
        WHERE "phone_number" = ${phoneNumber}
        RETURNING *;
      `;
    } else if (longitude !== null && latitude !== null) {
      user = await this.prismaService.$executeRaw`
        UPDATE "User"
        SET "location" = ST_GeogFromText(${pointString})
        WHERE "phone_number" = ${phoneNumber}
        RETURNING *;
      `;
    }
    
    // Handle the result if necessary
    // console.log(user);
        return !user;
  }

}
