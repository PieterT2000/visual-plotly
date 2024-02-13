FROM --platform=linux/amd64 node:18

LABEL maintainer="2580876V@student.gla.ac.uk"

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
RUN unzip awscliv2.zip
RUN ./aws/install
RUN aws --version


CMD ["node"]