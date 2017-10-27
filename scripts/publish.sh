#!/bin/bash

# this is the script to publish this TTAP app to Surge.sh

# First, we build the app
npm run build

# Then, run surge to publish
surge --domain https://ttap.surge.sh --project ./build