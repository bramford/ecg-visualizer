#!/run/current-system/sw/bin/python
import scipy.io
import json
import re
import os
#mat = scipy.io.loadmat('./MLII/1 NSR/100m (0).mat')

import numpy as np

def convert_sample_to_json(samplePath: str):
    sampleId = os.path.splitext(os.path.basename(samplePath))[0]
    parentDir = os.path.dirname(samplePath)

    jsondata = dict()
    jsondata["readings"] = dict()
    jsondata["leads"] = dict()

    with open(os.path.join(parentDir,sampleId) + ".hea", "r", encoding="UTF-8") as file:
        lines = [line.rstrip() for line in file]
        for i, line in enumerate(lines):
            if i == 0:
                machinematch = re.match(r'^(JS\d+)\s+(\d+)\s+(\d+)\s+(.*)', line)
                if machinematch:
                    jsondata["leadNumber"] = int(machinematch.group(2))
                    jsondata["sampleRate"] = machinematch.group(3)
                    jsondata["otherMachineData"] = machinematch.group(4)
                    continue

            if i > 0 and i <= jsondata["leadNumber"]:
                leadmatch = re.match(r'^(JS\d+\.mat)\s+(\d+\+\d+)\s+(\d+\/mV)\s+(\d+)\s+(\d+)\s+(\-*\d+)\s+(\-*\d+)\s+(\-*\d+)\s+(\w+|\W+|\d+)$', line)
                if leadmatch:
                    lead = dict()
                    lead["unknown1"] = leadmatch.group(2)
                    lead["mV"] = leadmatch.group(3)
                    lead["unknown3"] = leadmatch.group(4)
                    lead["unknown4"] = leadmatch.group(5)
                    lead["unknown5"] = leadmatch.group(5)
                    lead["unknown5"] = leadmatch.group(6)
                    lead["unknown6"] = leadmatch.group(7)
                    lead["unknown7"] = leadmatch.group(8)
                    leadId = leadmatch.group(9)
                    lead["id"] = leadId
                    jsondata["leads"][leadId] = lead;
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

    mat = scipy.io.loadmat(samplePath)

    index = 0
    for value in mat["val"]:
        readings = value.tolist();
        leadId = list(jsondata["leads"].keys())[index]
        jsondata["readings"][leadId] = readings
        index+=1

    with open("./" + sampleId + ".json", "w") as f:
        json.dump(jsondata, f)

for root, dirs, files in os.walk("./physionet.org/files/ecg-arrhythmia/1.0.0/WFDBRecords/01/010/"):
    for file in files:
        extension = os.path.splitext(file)[1]
        if extension and extension == ".mat":
            filePath = os.path.join(root, file)
            print("Found mat file to convert: " + filePath)
            convert_sample_to_json(os.path.join(root, file))
