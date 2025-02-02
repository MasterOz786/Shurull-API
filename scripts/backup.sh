#!/bin/bash

# Configuration
BACKUP_DIR="/backup/shurull-api"
RETENTION_DAYS=7
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="shurull_backup_${DATE}"

# Create backup directory
mkdir -p "${BACKUP_DIR}/${BACKUP_NAME}"

# Backup function with error handling
backup_component() {
    local component=$1
    local backup_cmd=$2
    echo "Backing up ${component}..."
    if eval "$backup_cmd"; then
        echo "${component} backup successful"
    else
        echo "${component} backup failed"
        exit 1
    fi
}

# Backup Elasticsearch indices
backup_component "Elasticsearch" "curl -X PUT 'localhost:9200/_snapshot/backup_repository/${BACKUP_NAME}'"

# Backup Grafana
backup_component "Grafana" "docker exec shurull_grafana tar czf /backup/grafana_${DATE}.tar.gz /var/lib/grafana"

# Backup deployed applications data
backup_component "Applications" "tar czf ${BACKUP_DIR}/${BACKUP_NAME}/applications.tar.gz /home/ubuntu/shurull-api/uploads /home/ubuntu/shurull-api/extracted"

# Backup configuration files
backup_component "Configurations" "tar czf ${BACKUP_DIR}/${BACKUP_NAME}/configs.tar.gz docker-compose.yml nginx.conf prometheus.yml filebeat.yml alert.rules.yml .env"

# Create final backup archive
tar czf "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" "${BACKUP_DIR}/${BACKUP_NAME}"

# Cleanup old backups
find "${BACKUP_DIR}" -type f -name "shurull_backup_*.tar.gz" -mtime +${RETENTION_DAYS} -delete

# Verify backup
if [ -f "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" ]; then
    echo "Backup completed successfully: ${BACKUP_NAME}"
else
    echo "Backup failed"
    exit 1
fi