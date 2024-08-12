import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { BroadCastDto } from "./dto/broadcast.dto";
import { AuthGuard } from "src/auth/auth.guard";
import { BroadcastService } from "./broadcast.service";
import { GetCurrentUser } from "src/common/decorators/user.decorator";

@Controller("broadcast")
export class BroadcastController {
  constructor(private broadcastService: BroadcastService) {}
  @UseGuards(AuthGuard)
  @Post("/send")
  async sendBroadcast(@Body() body: BroadCastDto, @GetCurrentUser() user: any) {
    const text = body.broadcast;
    const distance = body.distance;
    const senderUid = user.userId;

    const broadcastedData = await this.broadcastService.sendBroadcast(
      senderUid,
      text,
      distance,
    );
    if (broadcastedData != null) {
      return {
        data: broadcastedData,
        message: "Broadcast sent successfully",
      };
    } else {
      return {
        message: "Something went wrong",
      };
    }
  }
}
