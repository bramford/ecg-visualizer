import { Injectable } from '@nestjs/common';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';
import { Home } from './entities/home.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class HomesService {
  private readonly homes: {
    [id: string]: Home;
  } = {};

  private readonly homesByAddress: {
    [address: string]: string;
  } = {};

  create(createHomeDto: CreateHomeDto) {
    const uuid = randomUUID();
    const home: Home = {
      id: uuid,
      address: createHomeDto.address,
      landSizeSqm: createHomeDto.landSizeSqm,
      houseSizeSqm: createHomeDto.houseSizeSqm,
    };

    this.homes[uuid] = home;
    this.homesByAddress[createHomeDto.address] = uuid;
    return this.homes[uuid];
  }

  findAll() {
    return this.homes;
  }

  findAllByAddress() {
    return Object.entries(this.homesByAddress).map((address, id) => {
      return {
        address,
        home: { ...this.homes[id], id },
      };
    });
  }

  findOne(id: string) {
    return this.homes[id];
  }

  findOneByAddress(address: string) {
    return this.homes[this.homesByAddress[address]];
  }

  update(id: string, updateHomeDto: UpdateHomeDto) {
    this.homes[id] = {
      id: id,
      address: updateHomeDto.address,
      landSizeSqm: updateHomeDto.landSizeSqm,
      houseSizeSqm: updateHomeDto.houseSizeSqm,
    };
  }

  remove(id: string) {
    delete this.homes[id];
  }
}
