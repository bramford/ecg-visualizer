import { Injectable } from '@nestjs/common';
// import { CreateEcgDto } from './dto/create-ecg.dto';
// import { UpdateEcgDto } from './dto/update-ecg.dto';
import { GetEcgsQuery } from './dto/get-ecgs.dto';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

export interface Ecg {
  readings: number[];
  leads: string[];
  leadNumber: number;
  sampleRate: number;
  sampleId: string;
  otherMachineData?: string;
  age: number;
  sex: string;
  diagnoses: string[];
}

@Injectable()
export class EcgsService {
  private readonly ecgDataDirPath = 'data';
  private readonly ecgDataFiles: string[] = [];

  private async LoadEcgFiles() {
    console.error(
      `Loading ECG files from: ${path.join(process.cwd(), this.ecgDataDirPath)}`,
    );
    return Promise.all(
      (await fs.readdir(path.join(process.cwd(), this.ecgDataDirPath))).map(
        (f) => {
          const filePath = path.join(process.cwd(), this.ecgDataDirPath, f);
          this.ecgDataFiles.includes(filePath) ||
            this.ecgDataFiles.push(filePath);
          console.debug(`Loaded ecg data from: ${filePath}`);
          return filePath;
        },
      ),
    );
  }

  async findMany(query: GetEcgsQuery) {
    const offset = query.offset ?? 0;
    const count = query.count ?? 5;
    const readingsOffset = query.readingsOffset ?? 0;
    const readingsCount = query.readingsCount ?? 500;
    if (this.ecgDataFiles.length < 1) await this.LoadEcgFiles();
    return await Promise.all(
      this.ecgDataFiles.slice(offset, offset + count).map(async (file) => {
        const sampleId = path.basename(file, '.json');
        const jsonString = await fs.readFile(file, { encoding: 'utf8' });
        const res = JSON.parse(jsonString) as Ecg;
        const readings = res.readings.slice(
          readingsOffset,
          readingsOffset + readingsCount,
        );
        return {
          ...res,
          readings,
          sampleId,
        };
      }),
    );
  }
}
