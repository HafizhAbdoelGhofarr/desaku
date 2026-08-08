from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routers import villages, auth, indicator_values, reports, simulation

# Buat semua tabel dari models.py
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sistem Desa Ku API", version="1.0.0")

# CORS supaya Next.js (localhost:3000) bisa akses API ini
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API v1 Router
api_v1 = APIRouter(prefix="/api/v1")
api_v1.include_router(auth.router)
api_v1.include_router(villages.router)
api_v1.include_router(indicator_values.router)
api_v1.include_router(reports.router)
api_v1.include_router(simulation.router)

app.include_router(api_v1)

# Root fallback routers
app.include_router(auth.router)
app.include_router(villages.router)
app.include_router(indicator_values.router)
app.include_router(reports.router)
app.include_router(simulation.router)

@app.get("/")
def root():
    return {"message": "Sistem Desa Ku API is running", "version": "1.0.0", "docs": "/docs"}