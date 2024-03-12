#!.venv/bin/python
from os.path import isfile
from numpy.lib import append
import scipy.io
import json
import re
import os
import sys
import statistics
import copy
#mat = scipy.io.loadmat('./MLII/1 NSR/100m (0).mat')

import numpy as np
import math

from scipy import signal
from ecgdetectors import Detectors
import matplotlib.pyplot as plt
import argparse
from stat import S_ISDIR,S_ISREG

import wavelet_transform
import savitzky_golay_filter
import denoise
import denoise_gpt

def NLM_1dDarbon(signal,Nvar,P,PatchHW):
    if isinstance(P,int): # scalar has been entered; expand into patch sample index vector
        P = P-1 #Python start index from 0
        Pvec = np.array(range(-P,P+1))
    else:
        Pvec = P # use the vector that has been input
    signal = np.array(signal)
    #debug = [];
    N = len(signal)

    denoisedSig = np.empty(len(signal)) #NaN * ones(size(signal));
    denoisedSig[:] = np.nan
    # to simpify, don't bother denoising edges
    iStart = PatchHW+1
    iEnd = N - PatchHW
    denoisedSig[iStart: iEnd] = 0

    #debug.iStart = iStart;
    #debug.iEnd = iEnd;

    # initialize weight normalization
    Z = np.zeros(len(signal))
    cnt = np.zeros(len(signal))

    # convert lambda value to  'h', denominator, as in original Buades papers
    Npatch = 2 * PatchHW + 1
    h = 2 * Npatch * Nvar**2

    for idx in Pvec: # loop over all possible differences: s - t
        # do summation over p - Eq.3 in Darbon
        k = np.array(range(N))
        kplus = k + idx
        igood = np.where((kplus >=0) & (kplus < N)) # ignore OOB data; we could also handle it
        SSD = np.zeros(len(k))
        SSD[igood] = (signal[k[igood]] - signal[kplus[igood]])**2
        Sdx = np.cumsum(SSD)

        for ii in range(iStart,iEnd): # loop over all points 's'
            distance = Sdx[ii + PatchHW] - Sdx[ii - PatchHW-1] #Eq 4;this is in place of point - by - point MSE
            # but note the - 1; we want to icnlude the point ii - iPatchHW

            w = math.exp(-distance/h) # Eq 2 in Darbon
            t = ii + idx # in the papers, this is not made explicit

            if t>0 and t<N:
                denoisedSig[ii] = denoisedSig[ii] + w * signal[t]
                Z[ii] = Z[ii] + w
                #cnt[ii] = cnt[ii] + 1
                #print('ii',ii)
                #print('t',t)
                #print('w',w)
                #print('denoisedSig[ii]', denoisedSig[ii])
                #print('Z[ii]',Z[ii])
     # loop over shifts

    # now apply normalization
    denoisedSig = denoisedSig/(Z + sys.float_info.epsilon)
    denoisedSig[0: PatchHW+1] =signal[0: PatchHW+1]
    denoisedSig[ - PatchHW: ] =signal[- PatchHW: ]
    #debug.Z = Z;

    return denoisedSig#,debug

#def find_mean_qrs(qrs: dict[str, list[int]]):
#    _qrs = copy.deepcopy(qrs)
#    algCount = len(qrs)
#    for algI, (algKey, algQs) in enumerate(qrs.items()):
#        for i, q in enumerate(algQs):
#algCount = len(qrs)
#    for algI, (algKey, algQs) in enumerate(qrs.items()):
#        for i, q in enumerate(algQs):

def qrs_starts_and_ends(qrs: list[int], max: int, size: int):
    starts_and_ends: list[tuple[int, int]] = []
    for i, v in enumerate(qrs):
        start = 0
        end = 0
        if i == 0:
            start = v - (v / size)
            if start <= 0: start = 0
        else:
            start = v - ((v - qrs[i-1]) / size)

        if i+1 < len(qrs):
            end = v + ((qrs[i+1] - v) / size)
        else:
            end = v + ((max - v) / size)
        starts_and_ends.append((int(start), int(end)))
    return starts_and_ends

def convert_sample_to_json(samplePath: str):
    sampleId = os.path.splitext(os.path.basename(samplePath))[0]
    parentDir = os.path.dirname(samplePath)

    jsondata = dict()
    jsondata["readings"] = dict()
    jsondata["leads"] = dict()
    jsondata["qrs"] = dict()
    jsondata_qrs : dict[str, list[int]] = dict()
    jsondata_qrsStartsAndEnds: dict[str, list[tuple[int,int]]] = dict()

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
                leadmatch = re.match(r'^(JS\d+\.mat)\s+(\d+\+\d+)\s+(\d+)\/mV\s+(\d+)\s+(\d+)\s+(\-*\d+)\s+(\-*\d+)\s+(\-*\d+)\s+(\w+|\W+|\d+)$', line)
                if leadmatch:
                    lead = dict()
                    lead["unknown1"] = leadmatch.group(2)
                    lead["mV"] = int(leadmatch.group(3))
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
        sampleRate = int(jsondata["sampleRate"])

        readings_denoised = denoise.wavelet_denoising(readings).tolist()
        #readings_denoised = denoise_gpt.denoise_ecg(readings).tolist()
        detectors = Detectors(sampleRate)
        #print("Running QRS detectors")
        #hamilton = detectors.hamilton_detector(readings_denoised);
        #print("Got " + str(len(hamilton)) + " hamilton qrs's")
        #print(hamilton)
        #christov = detectors.christov_detector(readings_denoised);
        #print("Got " + str(len(christov)) + " christov qrs's")
        #print(christov)
        two_average_np = detectors.two_average_detector(readings_denoised);
        two_average = list(map(lambda n: int(n), two_average_np))
        starts_and_ends = qrs_starts_and_ends(two_average, (len(readings_denoised) - 1), 5)
        #print("Got " + str(len(two_average)) + " two_average qrs's")
        #print(two_average)
        #print("Got " + str(len(starts_and_ends)) + "starts and ends")
        #print(starts_and_ends)
        leadId = list(jsondata["leads"].keys())[index]
        jsondata["readings"][leadId] = readings_denoised
        jsondata_qrs[leadId] = two_average
        jsondata_qrsStartsAndEnds[leadId] = starts_and_ends
        index+=1

    jsondata["qrs"] = jsondata_qrs

    # Find meanQrs
    byIndex : list[list[int]] = []
    for qrses in jsondata_qrs.values():
        difference = len(qrses) - len(byIndex)
        if difference > 0:
            for i in range(difference):
                byIndex.append([])
        for qrsI, qrs in enumerate(qrses):
            if byIndex[qrsI] is None: byIndex.append([])
            byIndex[qrsI].append(qrs)
    print(byIndex)
    meanQrs = []
    for i, qrses in enumerate(byIndex):
        meanQrs.insert(i, int(statistics.mean(qrses)))
    jsondata["meanQrs"] = meanQrs

    # Find meanQrsStartAndEnd
    startAndEndByIndex : list[list[tuple[int,int]]] = []
    for qrses in jsondata_qrsStartsAndEnds.values():
        difference = len(qrses) - len(startAndEndByIndex)
        if difference > 0:
            for i in range(difference):
                startAndEndByIndex.append([])
        for qrsI, qrs in enumerate(qrses):
            if startAndEndByIndex[qrsI] is None: startAndEndByIndex.append([])
            startAndEndByIndex[qrsI].append(qrs)
    print(startAndEndByIndex)
    meanQrsStartAndEnd = []
    for i, qrses in enumerate(startAndEndByIndex):
        meanStart = int(statistics.mean(list(map(lambda x: x[0], qrses))))
        meanEnd = int(statistics.mean(list(map(lambda x: x[1], qrses))))
        meanQrsStartAndEnd.insert(i, (meanStart, meanEnd))
    jsondata["meanQrsStartAndEnd"] = meanQrsStartAndEnd

    with open("./" + sampleId + ".json", "w") as f:
        json.dump(jsondata, f)

#print("Starting")
parser = argparse.ArgumentParser(
                    prog='ECG transformer',
                    description='Transform ECGs for visualization',
                    epilog='')
parser.add_argument('filename')
args = parser.parse_args()

def process_file(root, file: str):
    extension = os.path.splitext(file)[1]
    if extension and extension == ".mat":
        filePath = os.path.join(root, file)
        print("Found mat file to convert: " + filePath)
        convert_sample_to_json(os.path.join(root, file))

stat = os.lstat(args.filename)
if S_ISREG(stat.st_mode):
    print(args.filename + "Is a regular file")
    process_file("/", args.filename)
elif S_ISDIR(stat.st_mode):
    for root, dirs, files in os.walk(args.filename):
        for file in files:
            process_file(root, file)
