FROM python:3.12-slim
WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends ffmpeg \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY server/ server/
COPY client/ client/
COPY static/ static/

ENV PYTHONUNBUFFERED=1 \
    CONTOURFRAME_DB=/data/projects.db \
    CONTOURFRAME_VIDEOS_DIR=/data/videos \
    CONTOURFRAME_TILE_CACHE_DIR=/data/tiles

EXPOSE 8000
CMD ["python", "-m", "uvicorn", "main:app", "--app-dir", "server", "--host", "0.0.0.0", "--port", "8000"]
