#!/bin/bash

eval "$(ssh-agent -s)"
chmod 600 .github/secrets/id_rsa
ssh-add .github/secrets/id_rsa

# set up known hosts
mkdir -p ~/.ssh
ssh-keyscan -p $PORT $IP >> ~/.ssh/known_hosts

ssh apps@$IP -p $PORT <<EOF
  cd $DEPLOY_DIR
  git pull
  npm ci
  ng build --prod

  # Make backup of current production stuff
  TIMESTAMP=\$(date --rfc-3339=seconds)
  mkdir /home/apps/MyMICDS/production-backups/"\$TIMESTAMP"
  cp -R /var/www/mymicds/mymicds-angular/* /home/apps/MyMICDS/production-backups/"\$TIMESTAMP"

  BUILD_DIR=$DEPLOY_DIR/dist/mymicds-v2-angular
  # Check for a successful build
  if [ ! -d "\$BUILD_DIR" ]; then
    echo "Build failed, exiting"
    exit 1
  fi

  # Copy new compiled files into production
  rm -rf /var/www/mymicds/mymicds-angular/*
  cp -R \$BUILD_DIR/* /var/www/mymicds/mymicds-angular
EOF
