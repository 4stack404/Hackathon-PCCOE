#!/bin/bash
# Script to start the FastAPI application
export PORT=${PORT:-8000}
uvicorn api:app --host 0.0.0.0 --port $PORT
