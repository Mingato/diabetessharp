from PIL import Image
import os

# Use img2pdf for perfect quality PDF generation
# Fallback to reportlab if img2pdf not available

def make_pdf_reportlab(pdf_path, image_files):
    from reportlab.lib.pagesizes import landscape
    from reportlab.platypus import SimpleDocTemplate, Image as RLImage
    from reportlab.lib.units import mm
    
    # Get actual image dimensions
    sample = Image.open(image_files[0])
    img_w, img_h = sample.size
    
    # Convert pixels to points (72 DPI standard)
    # Use 96 DPI for better quality
    dpi = 96
    page_w = img_w / dpi * 72  # points
    page_h = img_h / dpi * 72  # points
    
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=(page_w, page_h),
        leftMargin=0, rightMargin=0,
        topMargin=0, bottomMargin=0
    )
    
    story = []
    temp_files = []
    
    for image_file in image_files:
        if os.path.exists(image_file):
            # Convert WebP to PNG
            img = Image.open(image_file)
            png_path = image_file.replace('.webp', '_temp.png')
            img.save(png_path, 'PNG')
            temp_files.append(png_path)
            
            rl_img = RLImage(png_path, width=page_w, height=page_h)
            story.append(rl_img)
        else:
            print(f"Warning: Image file not found: {image_file}")
    
    doc.build(story)
    print(f"PDF generated successfully: {pdf_path}")
    
    # Clean up temp files
    for temp_file in temp_files:
        if os.path.exists(temp_file):
            os.remove(temp_file)


def make_pdf_img2pdf(pdf_path, image_files):
    import img2pdf
    
    temp_files = []
    png_paths = []
    
    for image_file in image_files:
        if os.path.exists(image_file):
            img = Image.open(image_file)
            png_path = image_file.replace('.webp', '_temp.png')
            img.save(png_path, 'PNG')
            temp_files.append(png_path)
            png_paths.append(png_path)
        else:
            print(f"Warning: Image file not found: {image_file}")
    
    with open(pdf_path, 'wb') as f:
        f.write(img2pdf.convert(png_paths))
    
    print(f"PDF generated successfully: {pdf_path}")
    
    # Clean up temp files
    for temp_file in temp_files:
        if os.path.exists(temp_file):
            os.remove(temp_file)


# List of generated slide images in order (including new slides)
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

output_path = "/home/ubuntu/Synapse_PitchDeck_FINAL.pdf"

# Try img2pdf first (best quality), fallback to reportlab
try:
    import img2pdf
    print("Using img2pdf for best quality...")
    make_pdf_img2pdf(output_path, slides)
except ImportError:
    print("img2pdf not found, installing...")
    os.system("sudo pip3 install img2pdf -q")
    try:
        import img2pdf
        make_pdf_img2pdf(output_path, slides)
    except Exception as e:
        print(f"img2pdf failed: {e}, falling back to reportlab...")
        make_pdf_reportlab(output_path, slides)
