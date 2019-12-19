#!/bin/bash

eval "$(ssh-agent -s)"
chmod 600 .travis/id_rsa
ssh-add .travis/id_rsa

ssh apps@$IP -p $PORT <<EOF
  cd $DEPLOY_DIR
  git pull
  npm install
  ng build --prod

  # Make backup of current production stuff
  TIMESTAMP=\$(date --rfc-3339=seconds)
  mkdir /home/apps/MyMICDS/production-backups/"\$TIMESTAMP"
  cp -R /var/www/mymicds/mymicds-angular/* /home/apps/MyMICDS/production-backups/"\$TIMESTAMP"

  # Copy new compiled files into production
  rm -rf /var/www/mymicds/mymicds-angular/*
  cp -R $DEPLOY_DIR/dist/mymicds-v2-angular/* /var/www/mymicds/mymicds-angular
EOF
