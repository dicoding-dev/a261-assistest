FROM node:24-slim

# System level dependencies
RUN apt-get update
RUN apt install curl -y

# Prepare Work Directory
RUN mkdir -p /home/direviu/app
WORKDIR /home/direviu/app
COPY --chown=direviu:direviu . .

# Preparation Submission Folder
RUN mkdir -p /home/direviu/student-submission

RUN npm config set package-lock false
RUN npm install --omit=dev

ENTRYPOINT ["/bin/bash", "entrypoint.sh"]
