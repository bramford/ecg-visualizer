import { Injectable } from '@nestjs/common';
import { GetEcgsQuery } from './dto/get-ecgs.dto';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

export interface EcgLead {
  unknown1: string;
  mV: number;
  unknown3: string;
  unknown4: string;
  unknown5: string;
  unknown6: string;
  unknown7: string;
  id: string;
}

export interface Ecg {
  readings: {
    [leadId: string]: number[];
  };
  leads: {
    [leadId: string]: EcgLead;
  };
  qrs: {
    [leadId: string]: number[];
  };
  qrsStartsAndEnds: {
    [leadId: string]: [number, number][];
  };
  leadNumber: number;
  sampleRate: number;
  sampleId: string;
  otherMachineData?: string;
  age: number;
  sex: string;
  diagnoses: string[];
  meanQrs: number[];
  meanQrsStartAndEnd: [number, number][];
}

export interface EcgMetadata {
  readingsCountPerLead: number;
  leadIds: string[];
  leadNumber: number;
  qrsCount: number;
  sampleRate: number;
  sampleId: string;
  otherMachineData?: string;
  age: number;
  sex: string;
  diagnoses: string[];
}

@Injectable()
export class EcgsService {
  private readonly ecgDataDirPath = process.env.DATA_PATH ?? './data';
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

  async findOne(id: string) {
    if (this.ecgDataFiles.length < 1) await this.LoadEcgFiles();
    const foundFile = this.ecgDataFiles.reduce<string | undefined>(
      (found, file) => {
        if (found != undefined) return found;
        const sampleId = path.basename(file, '.json');
        if (sampleId == id) return file;
      },
      undefined,
    );
    if (foundFile == undefined) return undefined;
    const jsonString = await fs.readFile(foundFile, { encoding: 'utf8' });
    const res = JSON.parse(jsonString) as Ecg;
    return res;
  }

  async findMany(query: GetEcgsQuery) {
    const offset = query.offset ?? 0;
    const count = query.count ?? 10;
    if (this.ecgDataFiles.length < 1) await this.LoadEcgFiles();
    return await Promise.all(
      this.ecgDataFiles.slice(offset, offset + count).map(async (file) => {
        const sampleId = path.basename(file, '.json');
        const jsonString = await fs.readFile(file, { encoding: 'utf8' });
        const ecg = JSON.parse(jsonString) as Ecg;
        const metadata: EcgMetadata = {
          readingsCountPerLead: Object.values(ecg.readings)[0].length,
          leadIds: Object.keys(ecg.leads),
          sampleId,
          age: ecg.age,
          sex: ecg.sex,
          leadNumber: ecg.leadNumber,
          qrsCount: ecg.meanQrs.length,
          diagnoses: ecg.diagnoses,
          sampleRate: ecg.sampleRate,
          otherMachineData: ecg.otherMachineData,
        };
        return metadata;
      }),
    );
  }
}
