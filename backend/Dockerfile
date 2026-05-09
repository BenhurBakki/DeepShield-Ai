FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir --retries 5 --no-progress-bar -r requirements.txt

COPY app.py .

# Use port 80 for Elastic Beanstalk
EXPOSE 80
CMD ["gunicorn", "--bind", "0.0.0.0:80", "--workers", "2", "--timeout", "120", "app:app"]
