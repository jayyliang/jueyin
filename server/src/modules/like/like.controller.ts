import { Body, Controller, Post } from '@nestjs/common';
import { User } from '../../decorators/user.decorator';
import { LikeService } from './like.service';
import { ELike, ELikeType } from '../../utils/constant';
@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}
  private isTypeValid(type: number) {
    return [ELikeType.ARTICLE].includes(type);
  }
  @Post('toggleLike')
  async toggleLike(
    @User('id') userId: number,
    @Body('targetId') targetId: number,
    @Body('value') value: ELike,
    @Body('type') type: ELikeType,
  ) {
    if (
      !userId ||
      !targetId ||
      (value !== ELike.LIKE && value !== ELike.UNLINKE) ||
      !this.isTypeValid(type)
    ) {
      throw Error('参数异常');
    }
    return await this.likeService.toggleLike({
      userId,
      targetId,
      value,
      type,
    });
  }

  @Post('getLikes')
  async getLikes(
    @User('id') userId: number,
    @Body('targetIds') targetIds: number[],
    @Body('type') type: ELikeType,
  ) {
    if (
      !userId ||
      !targetIds ||
      targetIds.length === 0 ||
      !this.isTypeValid(type)
    ) {
      throw Error('参数异常');
    }
    const promises = targetIds.map((targetId) =>
      this.likeService.getLikes({
        userId,
        targetId,
        type,
      }),
    );
    const likesInfo = await Promise.all(promises);
    const res = {};
    targetIds.forEach((targetId, index) => {
      res[targetId] = likesInfo[index];
    });
    return res;
  }
}
