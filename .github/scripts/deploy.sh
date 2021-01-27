#!/bin/bash

eval "$(ssh-agent -s)"
chmod 600 .github/secrets/id_rsa
ssh-add .github/secrets/id_rsa

# set up known hosts
mkdir -p ~/.ssh
ssh-keyscan -p $PORT $IP >> ~/.ssh/known_hosts

ssh apps@$IP -p $PORT <<EOF
  # Make backup of current production stuff
  TIMESTAMP=\$(date --rfc-3339=seconds)
  mkdir /home/apps/MyMICDS/production-backups/"\$TIMESTAMP"
  cp -R /var/www/mymicds/mymicds-angular/* /home/apps/MyMICDS/production-backups/"\$TIMESTAMP"

  # Remove old build
  rm -rf /var/www/mymicds/mymicds-angular/*
EOF

# copy over new build
scp -r -P $PORT build/* apps@$IP:/var/www/mymicds/mymicds-angular
