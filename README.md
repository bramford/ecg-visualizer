# ECG Visualizer

Hosted at [ecg.derp.tech](https://ecg.derp.tech)

This is an example fullstack web application that provides an API & frontend to store, query & view electrocardiograms

## Data

All data is from physio.net, specifically the arrhythmia study here: https://www.physionet.org/content/ecg-arrhythmia/1.0.0/

Data is then converted using `./ecg-data-to-json.py` and stored in `./rest-api/data/`


## Frontend

See [./frontend/README.md](./frontend/README.md) for more info

## Backend (REST API)

See [./rest-api/README.md](./rest-api/README.md) for more info

2024 Copyright Bramford Horton

## Todo List

* [] Map CTs and display on ECG cards
* [] Use openapi swagger to generate types for frontend
* [] Suspense loading
* [] De-noise the data https://github.com/zheng120/ECGDenoisingTool/blob/master/NLMDenoising20191120.py
