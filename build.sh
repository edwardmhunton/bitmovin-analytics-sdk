#!/bin/bash

echo "Building image eu.gcr.io/bitmovin-api/bitmovin-analytics-sdk:`git describe`"
docker build -t eu.gcr.io/bitmovin-api/bitmovin-analytics-sdk:`git describe` .
echo "Pushing to Dockerhub: bitmovin-analytics-sdk:$(git describe)"
gcloud docker -- push "eu.gcr.io/bitmovin-api/bitmovin-analytics-sdk:$(git describe)"
