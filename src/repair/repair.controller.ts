import { Controller, Get, HttpStatus, Res, Param, Post, Body } from '@nestjs/common';
import { RepairService } from './repair.service';
import { CreateRepairtDTO } from './dtos/create-repair.dto';
import { carResponseTranformer } from 'src/helpers/transformer';

@Controller('repair')
export class RepairController {
    constructor(private repairService: RepairService) {}

    @Post('/')
    async createRepair(@Res() res, @Body() createRepairtDTO: CreateRepairtDTO) {
      try {
        const repair = await this.repairService.createNewRepair(createRepairtDTO);
        return res.status(HttpStatus.OK).json({
          success: true,
          code: 201,
          message: ' creado satisfactoriamente ',
          data: repair,
        });
      } catch (error) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          code: 400,
          message: error.message,
        });
      }
    }
  
    @Get('/list')
    async getRepairs(@Res() res) {
      const repair = await this.repairService.getRepairs();
      return res.status(HttpStatus.OK).json({
        success: true,
        message: ' Lista recuperada satisfactoriamente ',
        code: 200,
        data:  carResponseTranformer(repair),
      });
    }
    @Get('/car/:carId')
    async getRepairsByCar(@Res() res, @Param('carId') carId) {
      const repair = await this.repairService.getRepairsbyCarId(carId);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: ' Lista recuperada satisfactoriamente ',
        code: 200,
        data:  carResponseTranformer(repair),
      });
    }
}
