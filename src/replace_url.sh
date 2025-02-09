#!/bin/bash

# Define variables
OLD_URL="http://15.235.184.251:5000/deploy"
NEW_URL="http://localhost:5000/deploy"
TARGET_DIR="."

# Check if the target directory exists
if [ ! -d "$TARGET_DIR" ]; then
  echo "Error: Target directory '$TARGET_DIR' does not exist."
  exit 1
fi

# Find and replace in all files.
find "$TARGET_DIR" -type f -not -name "replace_url.sh" -print0 | while IFS= read -r -d $'\0' file; do
  sed -i "s|$OLD_URL|$NEW_URL|g" "$file"
  if [[ $? -ne 0 ]]; then
    echo "Warning: No replacements made in file '$file'"
  fi
done

echo "Replacement complete!"
exit 0
