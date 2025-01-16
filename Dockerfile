FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y \
    gcc \
    libffi-dev \
    git \
    openssh-client \
    && rm -rf /var/lib/apt/lists/*

# Add GitHub's SSH key to known_hosts
RUN mkdir -p /root/.ssh && \
    ssh-keyscan github.com >> /root/.ssh/known_hosts

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Create necessary directories
RUN mkdir -p uploads extracted

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["python", "app.py"]