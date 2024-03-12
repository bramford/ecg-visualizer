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
  sampleRate: number;
  sampleId: string;
  otherMachineData?: string;
  age: number;
  sex: string;
  diagnoses: string[];
}
