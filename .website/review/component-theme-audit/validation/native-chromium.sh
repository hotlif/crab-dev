#!/bin/bash
arguments=()
for argument in "$@"; do
  case "$argument" in
    --disable-gpu) ;;
    *) arguments+=("$argument") ;;
  esac
done
exec '/ms-playwright/chromium-1248/chrome-linux64/chrome' --enable-unsafe-swiftshader "${arguments[@]}"
