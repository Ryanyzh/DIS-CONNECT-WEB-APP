from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="dis-connect API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "dis-connect backend is running"}

@app.get("/tickets")
def get_tickets():
    return [
        {
            "id": "REB-2024-0012",
            "category": "Reimbursement",
            "status": "In Review",
            "priority": "Medium",
        },
        {
            "id": "EXCH-2024-0051",
            "category": "Exchange",
            "status": "Waiting",
            "priority": "High",
        },
    ]