#!/bin/bash

openssl aes-256-cbc -K $FILE_DECRYPT_KEY -iv $FILE_DECRYPT_IV -in .github/secrets/id_rsa.enc -out .github/secrets/id_rsa -d
