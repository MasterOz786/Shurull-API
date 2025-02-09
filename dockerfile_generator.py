import os
import json

class DockerfileGenerator:
    def detect_project_type(self, project_path):
        if os.path.exists(os.path.join(project_path, 'package.json')):
            return 'node'
        elif os.path.exists(os.path.join(project_path, 'requirements.txt')):
            return 'python'
        else:
            raise ValueError("Unsupported project type")

    def generate(self, project_path):
        project_type = self.detect_project_type(project_path)
        dockerfile_content = self.get_dockerfile_template(project_type)
        
        with open(os.path.join(project_path, 'Dockerfile'), 'w') as f:
            f.write(dockerfile_content)

    def get_dockerfile_template(self, project_type):
        templates = {
            'node': '''FROM node:16-alpine
            WORKDIR /app
            COPY package*.json ./
            RUN npm install
            COPY . .
            ENV PORT=3000
            EXPOSE ${PORT}
            CMD ["sh", "-c", "npm start -- --port ${PORT}"]''',
                        'python': '''FROM python:3.9-slim
            WORKDIR /app
            COPY requirements.txt .
            RUN pip install -r requirements.txt
            COPY . .
            ENV PORT=3000
            EXPOSE ${PORT}
            CMD ["sh", "-c", "python app.py --port ${PORT}"]'''
        }
        return templates[project_type]