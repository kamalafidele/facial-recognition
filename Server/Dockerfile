FROM python:3.12.3-alpine

# Set up environment variables for Python
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apk update && apk add mesa-gl
RUN apk add build-base
RUN apk add autoconf automake libtool
# Create and set the working directory
WORKDIR /app

# Copy only the requirements file first to leverage Docker caching
COPY requirements.txt .

RUN python -m ensurepip --upgrade
RUN python -m pip install --upgrade setuptools

# Install dependencies
RUN pip install -r requirements.txt

# Copy the entire application code
COPY . .

# Expose the port your application will run on
EXPOSE 8080

# Specify the command to run on container start
CMD ["python", "app.py"]