FROM node:14.16.0-alpine

# Change working directory
WORKDIR /usr/app

# Bundle app source
COPY . .

RUN chmod +x ./healthcheck-pipeline.sh

RUN npm install && \
    npm run build

# Install tools
RUN apk add --no-cache curl bash

HEALTHCHECK --interval=30s --timeout=5s CMD curl --fail http://localhost:3000/health || exit 1

CMD ["npm", "start"]