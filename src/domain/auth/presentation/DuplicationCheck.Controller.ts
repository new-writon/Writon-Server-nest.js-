import { Controller, Get, HttpCode, Query } from "@nestjs/common";
import { SuccessResponseDto } from "../../../global/response/SuccessResponseDto.js";
import { DuplicationCheckService } from "../service/DuplicationCheck.Service.js";


@Controller("/api/auth/check")
export class DuplicationCheckController {
    
    constructor(private readonly duplicationCheckService: DuplicationCheckService) {}

    @Get("/identifier")
    @HttpCode(200)
    public async checkDuplicateIdentifier(
      @Query("identifier") identifier: string
    ): Promise<SuccessResponseDto<void>>  {

      await this.duplicationCheckService.checkDuplicateIdentifier(identifier);
      return SuccessResponseDto.of();
    }
  
  
  
    @Get("/email")
    @HttpCode(200)
    public async checkDuplicateEmail(
      @Query("email") email: string
    ): Promise<SuccessResponseDto<void>>  {
  
      await this.duplicationCheckService.checkDuplicateEmail(email);
      return SuccessResponseDto.of();
    }

}