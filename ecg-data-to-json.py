#!/run/current-system/sw/bin/python
import scipy.io
import json
import re
#mat = scipy.io.loadmat('./MLII/1 NSR/100m (0).mat')

import numpy as np

class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NpEncoder, self).default(obj)


mat = scipy.io.loadmat('./physionet.org/files/ecg-arrhythmia/1.0.0/WFDBRecords/01/010/JS00001.mat')
readings = []

for value in mat["val"]:
    for v in value:
        readings.append(v)

jsondata = dict()
jsondata["readings"] = readings
jsondata["leads"] = []

with open("./physionet.org/files/ecg-arrhythmia/1.0.0/WFDBRecords/01/010/JS00001.hea", "r", encoding="UTF-8") as file:
    lines = [line.rstrip() for line in file]
    for i, line in enumerate(lines):
        if i == 0:
            machinematch = re.match(r'^(JS\d+)\s+(\d+)\s+(\d+)\s+(.*)', line)
            if machinematch:
                jsondata["leadNumber"] = machinematch.group(2)
                jsondata["sampleRate"] = machinematch.group(3)
                jsondata["otherMachineData"] = machinematch.group(4)
                continue

        if i > 0 and i < 13:
            leadmatch = re.match(r'^(JS\d+\.mat)\s+(.*)', line)
            if leadmatch:
                jsondata["leads"].append(leadmatch.group(2))
                continue

        agematch = re.match(r'^\#Age\:\s+(\d+)', line)
        if agematch:
            jsondata["age"] = agematch.group(1)
            continue

        sexmatch = re.match(r'^\#Sex\:\s+(\d+)', line)
        if sexmatch:
            jsondata["sex"] = sexmatch.group(1)
            continue

        dxmatch = re.match(r'^\#Dx\:\s+(\d+.*)', line)
        if dxmatch:
            jsondata["diagnoses"] = dxmatch.group(1).split(",")
            continue

with open("./JS00001.json", "w") as f:
    json.dump(jsondata, f, cls=NpEncoder)
