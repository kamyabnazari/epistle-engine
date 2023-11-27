# Dockerfile for PocketBase

FROM alpine:latest

ARG PB_VERSION=0.16.5

RUN apk add --no-cache \
    unzip \
    ca-certificates \
    openssh

# download and unzip PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

# copy initialization script to container
COPY init-pocketbase.sh /pb/init-pocketbase.sh
RUN chmod +x /pb/init-pocketbase.sh

COPY pb_migrations /pb/pb_migrations

EXPOSE 8090

# start PocketBase with the initialization script
CMD ["/pb/init-pocketbase.sh"]
