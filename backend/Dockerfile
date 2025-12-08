# Use Bookworm (Debian 12) to avoid the broken texlive/perl bug in Bullseye
FROM python:3.10-bookworm

# Fix "TERM is not set" warnings
ARG DEBIAN_FRONTEND=noninteractive

# Set environment variable
ENV XDG_RUNTIME_DIR=/tmp/runtime-root

# 1. Install dependencies and texlive (Works correctly on Bookworm)
# We also install 'wget' and font packages needed for wkhtmltopdf
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libcairo2-dev \
    pkg-config \
    texlive-base \
    texlive-latex-recommended \
    wget \
    xfonts-75dpi \
    xfonts-base \
    fontconfig \
    libjpeg62-turbo \
    libx11-6 \
    libxcb1 \
    libxext6 \
    libxrender1 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 2. Manually install wkhtmltopdf for ARM64 (Debian 12 doesn't have it in apt)
# We download the Bullseye package, which is compatible with Bookworm
RUN wget https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6.1-2/wkhtmltox_0.12.6.1-2.bullseye_arm64.deb \
    && dpkg -i wkhtmltox_0.12.6.1-2.bullseye_arm64.deb \
    || apt-get install -f -y \
    && rm wkhtmltox_0.12.6.1-2.bullseye_arm64.deb

# Set the working directory inside the container
WORKDIR /app

# Copy the local src files to the container
ADD . /app

# Install python dependencies
RUN pip install -r requirements.txt --no-cache-dir

# Expose port for the application
EXPOSE 5003

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5003", "--timeout-keep-alive", "360"]