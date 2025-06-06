from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
from deep_translator import GoogleTranslator

app = FastAPI()
modelo = pipeline("text-classification", model="bhadresh-savani/bert-base-go-emotion", top_k=3)

class Entrada(BaseModel):
    mensaje: str

class Emocion(BaseModel):
    label: str
    score: float

def traducir(texto: str) -> str:
    return GoogleTranslator(source='auto', target='en').translate(texto)

@app.post("/analizar-emocion")
def analizar(data: Entrada):
    texto_en = traducir(data.mensaje)
    resultado = modelo(texto_en)
    return {"emociones": resultado}
