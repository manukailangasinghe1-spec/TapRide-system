from fastapi import FastAPI

app = FastAPI(
    title="TapRide API",
    description="Digital Wallet and Bus Management System API",
    version="1.0.0",
)


@app.get("/")
def root():
    return {
        "message": "TapRide API is running",
        "status": "success"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }