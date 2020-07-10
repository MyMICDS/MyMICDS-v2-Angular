#!/bin/bash

openssl aes-256-cbc -K $encrypted_f339be35999a_key -iv $encrypted_f339be35999a_iv -in .travis/id_rsa.enc -out .travis/id_rsa -d
