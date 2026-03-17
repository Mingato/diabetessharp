from PIL import Image
import os

# Ordem correta dos slides
slide_files = [
    "s01_cover_generated.webp",
    "s02_hook_generated.webp",
    "s03_problem_generated.webp",
    "s04_market_generated.webp",
    "s05_insight_generated.webp",
    "s06_solution_generated.webp",
    "s07_how_it_works_generated.webp",
    "s08_sos_mode_generated.webp",
    "s09_feature_glow_generated.webp",
    "s10_feature_skin_generated.webp",
    "s11_feature_vault_generated.webp",
    "s12_feature_squad_generated.webp",
    "s13_virality_generated.webp",
    "s14_competitors_generated.webp",
    "s15_business_model_generated.webp",
    "s16_projections_generated.webp",
    "s17_roadmap_generated.webp",
    "s18_validation_generated.webp",
    "s19_cta_generated.webp",
]

base_dir = "/home/ubuntu/nourish_pitch_deck"
output_path = "/home/ubuntu/Nourish_PitchDeck_Investidores.pdf"

images = []
for fname in slide_files:
    fpath = os.path.join(base_dir, fname)
    if os.path.exists(fpath):
        img = Image.open(fpath).convert("RGB")
        # Garantir proporção 16:9 em alta resolução
        img = img.resize((1920, 1080), Image.LANCZOS)
        images.append(img)
        print(f"✅ Carregado: {fname} -> {img.size}")
    else:
        print(f"❌ Não encontrado: {fname}")

if images:
    first = images[0]
    rest = images[1:]
    first.save(
        output_path,
        save_all=True,
        append_images=rest,
        resolution=150,
        quality=95,
    )
    size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f"\n✅ PDF gerado com sucesso!")
    print(f"   Arquivo: {output_path}")
    print(f"   Slides: {len(images)}")
    print(f"   Tamanho: {size_mb:.1f} MB")
else:
    print("❌ Nenhuma imagem encontrada.")
