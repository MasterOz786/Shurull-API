#!/bin/bash

# Start the SSH agent
eval $(ssh-agent -s)

# Add the SSH key
ssh-add ~/.ssh/github_actions

# Verify the SSH connection (optional, for debugging)
ssh -T git@github.com

# Run the Flask application with logging to stdout
export FLASK_APP=app.py
export FLASK_ENV=development  # Use production mode
flask run --host=0.0.0.0