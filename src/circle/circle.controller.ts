import { Controller, Get, UseGuards } from "@nestjs/common";
import { CircleService } from "./circle.service";
import { AuthGuard } from "src/auth/auth.guard";
import { GetCurrentUser } from "src/common/decorators/user.decorator";

@Controller("circle")
export class CircleController {
  constructor(private circleService: CircleService) {}
  @UseGuards(AuthGuard)
  @Get("/getBroadcastByUserId")
  async getBroadCastByUserId(@GetCurrentUser() user: any) {
    const data = await this.circleService.getBroadcastByUserId(user.userId);
    return {
      data: data,
      message: "Data fetched successfully",
    };
  }
}
