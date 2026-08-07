from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routers import villages, auth, indicator_values, reports, simulation

# Buat semua tabel dari models.py (setelah models.py diisi nanti)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sistem Desa Ku API")

# CORS supaya Next.js (localhost:3000) bisa akses API ini
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(villages.router)
app.include_router(indicator_values.router)
app.include_router(reports.router)
app.include_router(simulation.router)

@app.get("/")
def root():
    return {"message": "Sistem Desa Ku API is running"}