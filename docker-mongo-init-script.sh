#!/bin/bash
set -e

echo "[INIT MONGODB] - run sript: docker-mongo-init-script.sh"
echo "-------------------------------------------------------"

mongo <<EOFDB
use admin
db.auth("${DB_DOCKER_ROOT}", "${DB_DOCKER_ROOT_PASS}");
use ramka2
db.createUser({
  user:  "${DB_DOCKER_USER}",
  pwd:   "${DB_DOCKER_USER_PASS}",
  roles: [{
    role: 'readWrite',
    db: 'ramka2'
  }]
})
use ramka2-test
db.createUser({
  user:  "${DB_DOCKER_USER}",
  pwd:   "${DB_DOCKER_USER_PASS}",
  roles: [{
    role: 'readWrite',
    db:   "ramka2-test"
  }]
})
EOFDB
