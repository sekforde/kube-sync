FROM node:12-alpine

RUN apk update && \
	apk add curl && \
	curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/arm/kubectl && \
	chmod +x ./kubectl && \
	mv ./kubectl /usr/local/bin/kubectl

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

CMD ["node", "./index.js"]
