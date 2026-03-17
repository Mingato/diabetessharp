from PIL import Image
from reportlab.pdfgen import canvas
import os

# List of generated slide images in order
slides = [
    "/home/ubuntu/echo_pitch_deck/s01_cover_generated.webp",
    "/home/ubuntu/echo_pitch_deck/s02_validation_generated.webp",
    "/home/ubuntu/echo_pitch_deck/s03_problem_generated.webp",
    "/home/ubuntu/echo_pitch_deck/s04_market_generated.webp",
    "/home/ubuntu/echo_pitch_deck/s05_insight_generated.webp",
    "/home/ubuntu/echo_pitch_deck/s06_how_it_works_generated.webp",
    "/home/ubuntu/echo_pitch_deck/s07_scene_conversation_generated.webp",
    "/home/ubuntu/echo_pitch_deck/s08_scene_person_generated.webp",
    "/home/ubuntu/echo_pitch_deck/s09_scene_meeting_generated.webp",
    "/home/ubuntu/echo_pitch_deck/s10_alzheimer_generated.webp",
    "/home/ubuntu/echo_pitch_deck/s11_privacy_generated.webp",
    "/home/ubuntu/echo_pitch_deck/s12_competitors_generated.webp",
    "/home/ubuntu/echo_pitch_deck/s13_business_model_generated.webp",
    "/home/ubuntu/echo_pitch_deck/s14_virality_generated.webp",
    "/home/ubuntu/echo_pitch_deck/s15_projections_generated.webp",
    "/home/ubuntu/echo_pitch_deck/s16_roadmap_generated.webp",
    "/home/ubuntu/echo_pitch_deck/s17_cta_generated.webp"
]

# Resize to 1920x1080 for smaller PDF
target_w, target_h = 1920, 1080
dpi = 96
page_w_pt = (target_w / dpi) * 72
page_h_pt = (target_h / dpi) * 72

c = canvas.Canvas('/home/ubuntu/Echo_PitchDeck_Investidores.pdf', pagesize=(page_w_pt, page_h_pt))
temp_files = []

for i, f in enumerate(slides):
    if os.path.exists(f):
        img = Image.open(f).convert('RGB').resize((target_w, target_h), Image.LANCZOS)
        tmp = f'/tmp/echo_slide_{i:02d}.jpg'
        img.save(tmp, 'JPEG', quality=85, optimize=True)
        temp_files.append(tmp)
        c.drawImage(tmp, 0, 0, width=page_w_pt, height=page_h_pt)
        c.showPage()
        print(f'Slide {i+1} done')
    else:
        print(f'Warning: Slide {i+1} not found: {f}')

c.save()
size_mb = os.path.getsize('/home/ubuntu/Echo_PitchDeck_Investidores.pdf') / 1024 / 1024
print(f'Done! Size: {size_mb:.1f} MB')
for t in temp_files:
    if os.path.exists(t):
        os.remove(t)
