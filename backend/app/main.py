from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Look at the name after "as"
from app.routes.auth import router as auth_router
from app.routes import auth, projects, content, contact
app = FastAPI()

# Allow your React Admin Panel to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",      # Local React port
        "http://127.0.0.1:3000",    # Alternative local address
        "http://localhost:5173",    # Vite dev server
        "http://127.0.0.1:5173",
        "http://localhost:4173",    # Vite preview
        "http://127.0.0.1:4173",
    ],
    allow_credentials=True,
    allow_methods=["*"],              # Allows GET, POST, OPTIONS, etc.
    allow_headers=["*"],              # Allows Content-Type, Authorization, etc.
)

app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(projects.router, prefix="/projects", tags=["Projects"])
app.include_router(content.router, prefix="/content", tags=["Content"])
app.include_router(contact.router, prefix="/contact", tags=["Contact"])
@app.get("/")
def read_root():
    return {"message": "Portfolio API is running"}
