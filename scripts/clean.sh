#!/bin/sh
set -e

rm -rf dist_web &
find src -type f \( -name '*.js' -o -name '*.js.map' \) \
  -not -name 'configure.template.js' \
  -exec rm {} \+ &

wait
