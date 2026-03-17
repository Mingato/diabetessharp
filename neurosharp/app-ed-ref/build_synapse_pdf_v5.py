from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
import os

def make_pdf(pdf_path, image_files):
    # Get actual image dimensions from first image
    sample = Image.open(image_files[0])
    img_w, img_h = sample.size  # 2752 x 1536
    
    # Scale to fit at 150 DPI
    dpi = 150
    page_w_pt = (img_w / dpi) * 72  # points
    page_h_pt = (img_h / dpi) * 72  # points
    
    print(f"Image size: {img_w}x{img_h}px")
    print(f"Page size: {page_w_pt:.1f}x{page_h_pt:.1f}pt")
    
    c = canvas.Canvas(pdf_path, pagesize=(page_w_pt, page_h_pt))
    
    temp_files = []
    
    for i, image_file in enumerate(image_files):
        if os.path.exists(image_file):
            # Convert WebP to PNG
            img = Image.open(image_file)
            if img.size != (img_w, img_h):
                img = img.resize((img_w, img_h), Image.LANCZOS)
            png_path = image_file.replace('.webp', '_temp.png')
            img.save(png_path, 'PNG')
            temp_files.append(png_path)
            
            # Draw image filling entire page (x=0, y=0, full width and height)
            c.drawImage(png_path, 0, 0, width=page_w_pt, height=page_h_pt)
            c.showPage()
            print(f"  Slide {i+1}: {os.path.basename(image_file)}")
        else:
            print(f"  WARNING: Not found: {image_file}")
    
    c.save()
    size_mb = os.path.getsize(pdf_path) / 1024 / 1024
    print(f"\nPDF saved: {pdf_path} ({size_mb:.1f} MB)")
    
    # Clean up temp files
    for temp_file in temp_files:
        if os.path.exists(temp_file):
            os.remove(temp_file)


# List of generated slide images in order
slides = [
    "/home/ubuntu/synapse_pitch_deck/s01_cover_generated.webp",
    "/home/ubuntu/synapse_pitch_deck/s02_hook_generated.webp",
    "/home/ubuntu/synapse_pitch_deck/s03_problem_generated.webp",
    "/home/ubuntu/synapse_pitch_deck/s04_market_generated.webp",
    "/home/ubuntu/synapse_pitch_deck/s05_solution_generated.webp",
    "/home/ubuntu/synapse_pitch_deck/s06_feature_tasks_generated.webp",
    "/home/ubuntu/synapse_pitch_deck/s07_feature_location_generated.webp",
    "/home/ubuntu/synapse_pitch_deck/s08_feature_people_generated.webp",
    "/home/ubuntu/synapse_pitch_deck/s09_feature_meds_generated.webp",
    "/home/ubuntu/synapse_pitch_deck/s10_feature_visual_generated.webp",
    "/home/ubuntu/synapse_pitch_deck/s11_feature_family_generated.webp",
    "/home/ubuntu/synapse_pitch_deck/s12_virality_generated.webp",
    "/home/ubuntu/synapse_pitch_deck/s13_competitors_generated.webp",
    "/home/ubuntu/synapse_pitch_deck/s14_business_model_generated.webp",
    "/home/ubuntu/synapse_pitch_deck/s15_projections_generated.webp",
    "/home/ubuntu/synapse_pitch_deck/s16_roadmap_generated.webp",
    "/home/ubuntu/synapse_pitch_deck/s18_technology_generated.webp",
    "/home/ubuntu/synapse_pitch_deck/s19_alzheimer_generated.webp",
    "/home/ubuntu/synapse_pitch_deck/s20_viral_content_generated.webp",
    "/home/ubuntu/synapse_pitch_deck/s21_moat_generated.webp",
    "/home/ubuntu/synapse_pitch_deck/s17_cta_generated.webp"
]

make_pdf("/home/ubuntu/Synapse_PitchDeck_FINAL.pdf", slides)
