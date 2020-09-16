import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Repair } from './interfaces/repair.interface';
import { CreateRepairtDTO } from './dtos/create-repair.dto';
import { CarService } from '../car/car.service';
import { Car } from 'src/car/interfaces/car.interface';
import { Client } from 'src/client/interfaces/client.interface';

@Injectable()
export class RepairService {
  constructor(
    @InjectModel('Repair') private readonly repairModel: Model<Repair>,
    @InjectModel('Car') private readonly carModel: Model<Car>,
    @InjectModel('Client') private readonly clientModel: Model<Client>,
    private readonly carService: CarService,
  ) {}
  async getRepairs(): Promise<Repair[]> {
    const repairs = await this.repairModel.find().populate({
      path: 'car',
      model: this.carModel,
      populate: { path: 'client', model: this.clientModel}
    }).exec();
    return repairs;
  }
  async getRepair(repairId: string): Promise<Repair> {
    const repair = await this.repairModel.findById(repairId);
    if (!repair) throw new Error('Repair not found');

    return repair;
  }
  async getRepairsbyCarId(carId: string): Promise<Repair[]> {
    const repairs = await this.repairModel.find({ car: carId }).populate({
      path: 'car',
      model: this.carModel,
      populate: { path: 'client', model: this.clientModel}
    }).exec();
    return repairs;
  }
  async createNewRepair(createRepairtDTO: CreateRepairtDTO): Promise<Repair> {
    if (createRepairtDTO.car) {
      const car = this.carService.getCar(createRepairtDTO.car);
      if (car) {
        const repair = new this.repairModel({
          ...createRepairtDTO,
        });
        await repair.save();
        return repair;
      } else {
        throw new HttpException(
          'REGISTRATION.CAR_NO_REGISTERED',
          HttpStatus.FORBIDDEN,
        );
      }
    } else {
      throw new HttpException(
        'REGISTRATION.MISSING_MANDATORY_PARAMETERS',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
