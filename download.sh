#!/bin/bash

curl https://hg.mozilla.org/mozilla-central/archive/tip.zip/devtools/client/ --output /tmp/client.zip
unzip -d vendor /tmp/client.zip
