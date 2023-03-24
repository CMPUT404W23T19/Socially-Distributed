#---- Base python ----
FROM python:3.8-slim as base

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED 1

# Create app directory
WORKDIR /src

COPY requirements.txt /src

RUN pip3 install -r requirements.txt

COPY . /src

CMD ["python", "manage.py", "runserver"]

EXPOSE 80