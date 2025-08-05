import os
import requests
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
import random

# Define the directory structure
base_dir = os.path.dirname(os.path.abspath(__file__))
assets_dir = os.path.join(base_dir, 'assets', 'images')
gallery_dir = os.path.join(assets_dir, 'gallery')
about_dir = assets_dir

# Create directories if they don't exist
for directory in [assets_dir, gallery_dir]:
    if not os.path.exists(directory):
        os.makedirs(directory)

# Function to generate a colored image with text
def generate_image(width, height, text, filename, directory, bg_color=None, text_color=(255, 255, 255)):
    # If no bg_color is provided, generate a random one
    if bg_color is None:
        # Generate a random dark color for background
        r = random.randint(30, 100)
        g = random.randint(30, 100)
        b = random.randint(30, 100)
        bg_color = (r, g, b)
    
    # Create a new image with the given background color
    img = Image.new('RGB', (width, height), color=bg_color)
    draw = ImageDraw.Draw(img)
    
    # Try to use a font, or fall back to default
    try:
        # Try to use Arial font if available
        font = ImageFont.truetype("arial.ttf", 36)
    except IOError:
        # Fall back to default font
        font = ImageFont.load_default()
    
    # Calculate text position to center it
    text_width, text_height = draw.textsize(text, font=font) if hasattr(draw, 'textsize') else (width//2, height//2)
    position = ((width - text_width) // 2, (height - text_height) // 2)
    
    # Draw text on the image
    draw.text(position, text, fill=text_color, font=font)
    
    # Save the image
    file_path = os.path.join(directory, filename)
    img.save(file_path)
    print(f"Created {file_path}")
    return file_path

# Generate gallery images
gallery_images = [
    # Immersion Program Images
    {"filename": "immersion1.jpg", "text": "Tech Immersion Program", "width": 800, "height": 600},
    {"filename": "immersion2.jpg", "text": "Engineering Immersion", "width": 800, "height": 600},
    {"filename": "immersion3.jpg", "text": "Medical Immersion Program", "width": 800, "height": 600},
    
    # Leadership Walk Images
    {"filename": "leadership1.jpg", "text": "Executive Leadership Program", "width": 800, "height": 600},
    {"filename": "leadership2.jpg", "text": "Women in Leadership", "width": 800, "height": 600},
    {"filename": "leadership3.jpg", "text": "Youth Leadership Summit", "width": 800, "height": 600},
    
    # Campus Tour Images
    {"filename": "campus1.jpg", "text": "IIT Delhi Campus Tour", "width": 800, "height": 600},
    {"filename": "campus2.jpg", "text": "Harvard University Visit", "width": 800, "height": 600},
    {"filename": "campus3.jpg", "text": "Oxford University Tour", "width": 800, "height": 600},
    
    # Corporate Visit Images
    {"filename": "corporate1.jpg", "text": "Google Headquarters Visit", "width": 800, "height": 600},
    {"filename": "corporate2.jpg", "text": "Microsoft Innovation Center", "width": 800, "height": 600},
    {"filename": "corporate3.jpg", "text": "Tesla Factory Tour", "width": 800, "height": 600},
    
    # Events Images
    {"filename": "event1.jpg", "text": "Annual Education Summit", "width": 800, "height": 600},
    {"filename": "event2.jpg", "text": "Career Fair 2023", "width": 800, "height": 600},
    {"filename": "event3.jpg", "text": "Graduation Ceremony", "width": 800, "height": 600},
]

# Generate About Us images
about_images = [
    {"filename": "about-story.jpg", "text": "Our Story", "width": 800, "height": 600},
    {"filename": "team1.jpg", "text": "CEO", "width": 400, "height": 400},
    {"filename": "team2.jpg", "text": "Educational Director", "width": 400, "height": 400},
    {"filename": "team3.jpg", "text": "Operations Manager", "width": 400, "height": 400},
    {"filename": "team4.jpg", "text": "International Relations", "width": 400, "height": 400},
    {"filename": "gallery-header.jpg", "text": "Gallery", "width": 1200, "height": 400},
    {"filename": "login-bg.jpg", "text": "Login", "width": 800, "height": 600},
]

# Generate all gallery images
for img_data in gallery_images:
    generate_image(
        img_data["width"], 
        img_data["height"], 
        img_data["text"], 
        img_data["filename"], 
        gallery_dir
    )

# Generate all about images
for img_data in about_images:
    generate_image(
        img_data["width"], 
        img_data["height"], 
        img_data["text"], 
        img_data["filename"], 
        about_dir
    )

print("All images have been created successfully!")