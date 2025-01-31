FROM python

WORKDIR /app

COPY requirements.txt requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

COPY ./src ./src
COPY ./database ./database

CMD ["fastapi", "dev", "./src/main.py", "--port", "5000", "--host", "0.0.0.0"]