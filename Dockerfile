FROM node:18-slim

# System level dependencies
RUN apt-get update
RUN apt install curl -y

# Prepare Work Directory
RUN mkdir -p /home/direviu/app
WORKDIR /home/direviu/app
COPY --chown=direviu:direviu . .

# Preparation Submission Folder
RUN mkdir -p /home/direviu/app/student-submission

RUN npm config set package-lock false
RUN yarn install --production=true

ENTRYPOINT ["/bin/bash", "entrypoint.sh"]
