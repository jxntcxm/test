FROM nginx:1.17-alpine


ENV TZ="Asia/Shanghai"

RUN apk update && apk add tzdata curl \
    && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo 'Asia/Shanghai' >/etc/timezone \
	&& mkdir -p /app/ucweb

COPY ./dist /app/ucweb
COPY ./mysed /app/mysed
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./entrypoint.sh /app/entrypoint.sh

ENTRYPOINT /app/entrypoint.sh