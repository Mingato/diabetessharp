from PIL import Image
import os
import sys

def build_pdf(image_dir, output_path, pattern):
    """Combina imagens WebP em um PDF de alta qualidade, na ordem correta."""
    # Coletar e ordenar os arquivos
    files = sorted([
        f for f in os.listdir(image_dir)
        if f.endswith('_generated.webp')
    ])

    if not files:
        print(f"Nenhuma imagem encontrada em {image_dir}")
        sys.exit(1)

    print(f"Encontradas {len(files)} imagens:")
    for f in files:
        print(f"  - {f}")

    images = []
    for fname in files:
        fpath = os.path.join(image_dir, fname)
        img = Image.open(fpath).convert('RGB')
        images.append(img)

    # Salvar como PDF
    first = images[0]
    rest = images[1:]
    first.save(
        output_path,
        save_all=True,
        append_images=rest,
        resolution=150,
        quality=95
    )
    print(f"\nPDF gerado com sucesso: {output_path}")
    print(f"Total de páginas: {len(images)}")

if __name__ == '__main__':
    # PDF em Português
    build_pdf(
        image_dir='/home/ubuntu/aura_health_pt_deck',
        output_path='/home/ubuntu/Aura_Health_PitchDeck_Portugues.pdf',
        pattern='s'
    )

    # PDF em Inglês
    build_pdf(
        image_dir='/home/ubuntu/aura_health_pitch_deck',
        output_path='/home/ubuntu/Aura_Health_PitchDeck_English.pdf',
        pattern='slide'
    )
