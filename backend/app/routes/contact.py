import os
import ssl
import smtplib
from email.message import EmailMessage

import anyio
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from app.database.mongodb import database

router = APIRouter()
contact_collection = database.get_collection("contact_messages")

class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    msg: str

def _send_email(message: ContactMessage) -> None:
    gmail_user = os.getenv("GMAIL_USER")
    gmail_pass = os.getenv("GMAIL_APP_PASSWORD")
    to_email = os.getenv("CONTACT_TO_EMAIL") or gmail_user

    if not gmail_user or not gmail_pass or not to_email:
        raise ValueError("Missing email configuration")

    email = EmailMessage()
    email["Subject"] = f"Portfolio Contact: {message.name}"
    email["From"] = gmail_user
    email["To"] = to_email
    email["Reply-To"] = message.email
    email.set_content(
        "New contact form submission:\\n\\n"
        f"Name: {message.name}\\n"
        f"Email: {message.email}\\n\\n"
        f"Message:\\n{message.msg}\\n"
    )

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login(gmail_user, gmail_pass)
        server.send_message(email)

@router.post("")
async def submit_contact(message: ContactMessage):
    doc = message.dict()
    result = await contact_collection.insert_one(doc)
    try:
        await anyio.to_thread.run_sync(_send_email, message)
    except Exception:
        raise HTTPException(status_code=500, detail="Unable to send email right now.")

    return {"id": str(result.inserted_id), "emailSent": True}
