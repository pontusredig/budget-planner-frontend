FROM node:10.15.0 as ui-builder
RUN mkdir /usr/src/bp-vue
WORKDIR /usr/src/bp-vue
ENV PATH /usr/src/bp-vue/node_modules/.bin:$PATH
COPY package.json /usr/src/bp-vue/package.json
RUN npm install
RUN npm install -g @vue/cli
COPY . /usr/src/bp-vue
RUN npm run build
 
FROM nginx
COPY  --from=ui-builder /usr/src/bp-vue/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]