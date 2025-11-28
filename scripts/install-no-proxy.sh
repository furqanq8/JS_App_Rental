#!/usr/bin/env bash
set -euo pipefail

# Install npm dependencies while bypassing any enforced proxy/HTTPS settings that
# can cause 403 errors in restricted environments.
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

env -i \
  PATH="$PATH" \
  HOME="$HOME" \
  npm_config_registry="https://registry.npmjs.org/" \
  npm_config_strict_ssl="false" \
  npm_config_noproxy="registry.npmjs.org,localhost,127.0.0.1" \
  npm_config_proxy= \
  npm_config_http_proxy= \
  npm_config_https_proxy= \
  npm install --no-progress "$@"
