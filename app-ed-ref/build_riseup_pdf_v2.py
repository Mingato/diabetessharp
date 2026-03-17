import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import landscape, A4
from PIL import Image

# Configurações
PROJECT_DIR = "/home/ubuntu/riseup_pitch_deck"
OUTPUT_PDF = "/home/ubuntu/RiseUp_PitchDeck_Investidores.pdf"
SLIDE_WIDTH_PX = 1920
SLIDE_HEIGHT_PX = 1080

# Definir tamanho da página PDF (proporção 16:9 baseada em A4 landscape largura)
PDF_WIDTH = 842
PDF_HEIGHT = PDF_WIDTH * (SLIDE_HEIGHT_PX / SLIDE_WIDTH_PX)

def create_pdf():
    c = canvas.Canvas(OUTPUT_PDF, pagesize=(PDF_WIDTH, PDF_HEIGHT))
    
    # Listar arquivos de imagem gerados em ordem
    image_files = sorted([f for f in os.listdir(PROJECT_DIR) if f.endswith("_generated.webp")])
    
    if not image_files:
        print("Nenhuma imagem encontrada para gerar o PDF.")
        return

    print(f"Encontrados {len(image_files)} slides. Iniciando geração do PDF...")

    for img_file in image_files:
        img_path = os.path.join(PROJECT_DIR, img_file)
        
        # Converter WebP para PNG temporário
        try:
            with Image.open(img_path) as img:
                # Criar nome temporário único para o PNG
                png_path = os.path.join(PROJECT_DIR, img_file.replace(".webp", ".png"))
                img.save(png_path, "PNG")
                
                # Desenhar imagem no PDF ocupando 100% da página
                c.drawImage(png_path, 0, 0, width=PDF_WIDTH, height=PDF_HEIGHT)
                c.showPage()
                
                # Remover PNG temporário
                os.remove(png_path)
                print(f"Slide {img_file} adicionado com sucesso.")
        except Exception as e:
            print(f"Erro ao processar {img_file}: {e}")

    c.save()
    print(f"PDF gerado com sucesso em: {OUTPUT_PDF}")

if __name__ == "__main__":
    create_pdf()
