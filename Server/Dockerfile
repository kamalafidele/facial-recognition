# start by pulling the python image
FROM python:3.12.3-alpine

# Set the environment variables
ENV GRPC_PYTHON_BUILD_SYSTEM_OPENSSL=1
ENV GRPC_PYTHON_BUILD_SYSTEM_ZLIB=1


# copy the requirements file into the image
COPY ./requirements.txt /app/requirements.txt

# switch working directory
WORKDIR /app

# Upgrading pip
RUN pip3 install --upgrade pip

# Installing Setup tools
RUN python3 -m pip install  --upgrade setuptools

# install the dependencies and packages in the requirements file
RUN pip3 install -r requirements.txt

# copy every content from the local file to the image
COPY . /app

# configure the container to run in an executed manner
ENTRYPOINT [ "python3" ]

CMD ["face-recognition.py" ]