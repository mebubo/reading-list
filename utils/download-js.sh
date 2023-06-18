#!/bin/bash

mkdir -p vendor

curl -L 'https://esm.run/preact@10.15.1' > vendor/preact.js
curl -L 'https://esm.run/preact@10.15.1/hooks' > vendor/preact-hooks.js
curl -L 'https://esm.run/htm@3.1.1' > vendor/htm.js
curl -L 'https://esm.run/pocketbase@0.15.2' > vendor/pocketbase.js

sed -i 's#/npm/preact@10.15.1/+esm#./preact.js#' vendor/preact-hooks.js
