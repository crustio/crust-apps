#!/bin/bash
# Copyright 2017-2021 @polkadot/apps authors & contributors
# SPDX-License-Identifier: Apache-2.0

# This script is used when the docker container starts and does the magic to
# bring the ENV variables to the generated static UI.

TARGET=./env-config.js

# Recreate config file
echo -n > $TARGET

declare -a vars=(
  "WS_URL"
  "SAMPLE"
  "CRU_CLAIM_USER"
  "CRU_CLAIM_PASSWD"
  "CSM_CLAIM_USER"
  "CSM_CLAIM_PASSWD"
)

echo "window.process_env = {" >> $TARGET
for VAR in ${vars[@]}; do
  echo "  $VAR: \"${!VAR}\"," >> $TARGET
done
echo "}" >> $TARGET
