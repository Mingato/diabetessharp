from fpdf import FPDF
import os
from PIL import Image

def make_pdf(pdf_path, image_files):
    pdf = FPDF(orientation='L', unit='mm', format=(338.67, 190.5)) # 16:9 aspect ratio (1920x1080 scaled)
    
    temp_files = []
    
    for image_file in image_files:
        if os.path.exists(image_file):
            # Convert WebP to PNG
            img = Image.open(image_file)
            png_path = image_file.replace('.webp', '.png')
            img.save(png_path, 'PNG')
            temp_files.append(png_path)
            
            pdf.add_page()
            pdf.image(png_path, x=0, y=0, w=338.67, h=190.5)
        else:
            print(f"Warning: Image file not found: {image_file}")
            
    pdf.output(pdf_path)
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
    "/home/ubuntu/synapse_pitch_deck/s18_technology_generated.webp", # New Tech Slide
    "/home/ubuntu/synapse_pitch_deck/s19_alzheimer_generated.webp", # New Alzheimer Slide
    "/home/ubuntu/synapse_pitch_deck/s20_viral_content_generated.webp", # New Viral Slide
    "/home/ubuntu/synapse_pitch_deck/s21_moat_generated.webp", # New Moat Slide
    "/home/ubuntu/synapse_pitch_deck/s17_cta_generated.webp" # CTA moved to end
]

make_pdf("/home/ubuntu/Synapse_PitchDeck_Investidores_Completo.pdf", slides)
