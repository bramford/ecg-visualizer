#!/run/current-system/sw/bin/python
import scipy.io
import json
import re
import os
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


def convert_sample_to_json(samplePath: str):
    sampleId = os.path.splitext(os.path.basename(samplePath))[0]
    parentDir = os.path.dirname(samplePath)
    mat = scipy.io.loadmat(samplePath)
    readings = []

    for value in mat["val"]:
        for v in value:
            readings.append(v)

    jsondata = dict()
    jsondata["readings"] = readings
    jsondata["leads"] = []

    with open(os.path.join(parentDir,sampleId) + ".hea", "r", encoding="UTF-8") as file:
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

            sexmatch = re.match(r'^\#Sex\:\s+(\w+)', line)
            if sexmatch:
                jsondata["sex"] = sexmatch.group(1)
                continue

            dxmatch = re.match(r'^\#Dx\:\s+(\d+.*)', line)
            if dxmatch:
                jsondata["diagnoses"] = dxmatch.group(1).split(",")
                continue

    with open("./" + sampleId + ".json", "w") as f:
        json.dump(jsondata, f, cls=NpEncoder)

for root, dirs, files in os.walk("./physionet.org/files/ecg-arrhythmia/1.0.0/WFDBRecords/01/010/"):
    for file in files:
        extension = os.path.splitext(file)[1]
        if extension and extension == ".mat":
            filePath = os.path.join(root, file)
            print("Found mat file to convert: " + filePath)
            convert_sample_to_json(os.path.join(root, file))
