import os
import requests
import time

# Define the base directory for saving images
base_dir = os.path.join(os.getcwd(), 'assets', 'images')

# Ensure the directory exists
os.makedirs(base_dir, exist_ok=True)

# Define the SVG content for each image
svg_images = {
    'logo.svg': '''
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 50" width="200" height="50">
        <text x="10" y="35" font-family="Arial" font-weight="bold" font-size="24" fill="#6C63FF">Elevate<tspan fill="#F64C72">Xperia</tspan></text>
    </svg>
    ''',
    
    'favicon.svg': '''
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <circle cx="50" cy="50" r="45" fill="#2A2A72" />
        <text x="20" y="65" font-family="Arial" font-weight="bold" font-size="40" fill="#6C63FF">EX</text>
    </svg>
    ''',
    
    'hero-bg.svg': '''
    <svg xmlns="http://www.w3.org/2000/svg" width="1440" height="800" viewBox="0 0 1440 800">
        <defs>
            <pattern id="pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="#6C63FF" opacity="0.3" />
            </pattern>
        </defs>
        <rect width="1440" height="800" fill="url(#pattern)" />
        <path d="M0,800 L1440,800 L1440,600 C1200,700 900,650 600,750 C300,850 100,750 0,700 Z" fill="#6C63FF" opacity="0.1" />
        <path d="M0,800 L1440,800 L1440,650 C1200,750 900,700 600,800 C300,900 100,800 0,750 Z" fill="#F64C72" opacity="0.1" />
    </svg>
    ''',
    
    'feature-icon1.svg': '''
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="35" fill="#6C63FF" opacity="0.1" />
        <path d="M25,30 L55,30 L55,55 L25,55 Z" stroke="#6C63FF" stroke-width="2" fill="none" />
        <path d="M35,20 L35,30" stroke="#6C63FF" stroke-width="2" />
        <path d="M45,20 L45,30" stroke="#6C63FF" stroke-width="2" />
        <path d="M30,40 L50,40" stroke="#6C63FF" stroke-width="2" />
        <path d="M30,45 L40,45" stroke="#6C63FF" stroke-width="2" />
    </svg>
    ''',
    
    'feature-icon2.svg': '''
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="35" fill="#6C63FF" opacity="0.1" />
        <circle cx="40" cy="35" r="10" stroke="#6C63FF" stroke-width="2" fill="none" />
        <path d="M25,60 C25,50 35,45 40,45 C45,45 55,50 55,60" stroke="#6C63FF" stroke-width="2" fill="none" />
    </svg>
    ''',
    
    'feature-icon3.svg': '''
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="35" fill="#6C63FF" opacity="0.1" />
        <path d="M30,30 L50,30 L50,50 L30,50 Z" stroke="#6C63FF" stroke-width="2" fill="none" />
        <path d="M50,30 L60,20 L60,40 L50,50" stroke="#6C63FF" stroke-width="2" fill="none" />
        <path d="M30,50 L20,60 L20,40 L30,30" stroke="#6C63FF" stroke-width="2" fill="none" />
    </svg>
    ''',
    
    'feature-icon4.svg': '''
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="35" fill="#6C63FF" opacity="0.1" />
        <path d="M40,20 L55,35 L40,50 L25,35 Z" stroke="#6C63FF" stroke-width="2" fill="none" />
        <path d="M40,50 L40,60" stroke="#6C63FF" stroke-width="2" />
        <path d="M30,60 L50,60" stroke="#6C63FF" stroke-width="2" />
    </svg>
    ''',
    
    'tour1.svg': '''
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#2A2A72" opacity="0.1" />
        <path d="M150,100 L250,100 L300,200 L100,200 Z" fill="#6C63FF" opacity="0.5" />
        <circle cx="200" cy="80" r="30" fill="#F64C72" opacity="0.5" />
    </svg>
    ''',
    
    'tour2.svg': '''
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#2A2A72" opacity="0.1" />
        <rect x="100" y="100" width="200" height="100" fill="#6C63FF" opacity="0.5" />
        <circle cx="150" cy="150" r="30" fill="#F64C72" opacity="0.5" />
        <circle cx="250" cy="150" r="30" fill="#F64C72" opacity="0.5" />
    </svg>
    ''',
    
    'tour3.svg': '''
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#2A2A72" opacity="0.1" />
        <path d="M100,200 L300,200 L200,100 Z" fill="#6C63FF" opacity="0.5" />
        <circle cx="200" cy="150" r="30" fill="#F64C72" opacity="0.5" />
    </svg>
    ''',
    
    'testimonial1.svg': '''
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="#6C63FF" opacity="0.1" />
        <circle cx="50" cy="40" r="15" stroke="#6C63FF" stroke-width="2" fill="none" />
        <path d="M30,80 C30,65 40,60 50,60 C60,60 70,65 70,80" stroke="#6C63FF" stroke-width="2" fill="none" />
    </svg>
    ''',
    
    'testimonial2.svg': '''
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="#F64C72" opacity="0.1" />
        <circle cx="50" cy="40" r="15" stroke="#F64C72" stroke-width="2" fill="none" />
        <path d="M30,80 C30,65 40,60 50,60 C60,60 70,65 70,80" stroke="#F64C72" stroke-width="2" fill="none" />
    </svg>
    ''',
    
    'testimonial3.svg': '''
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="#2A2A72" opacity="0.1" />
        <circle cx="50" cy="40" r="15" stroke="#2A2A72" stroke-width="2" fill="none" />
        <path d="M30,80 C30,65 40,60 50,60 C60,60 70,65 70,80" stroke="#2A2A72" stroke-width="2" fill="none" />
    </svg>
    ''',
    
    'location-icon.svg': '''
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M12,2 C8.13,2 5,5.13 5,9 C5,14.25 12,22 12,22 C12,22 19,14.25 19,9 C19,5.13 15.87,2 12,2 Z M12,11.5 C10.62,11.5 9.5,10.38 9.5,9 C9.5,7.62 10.62,6.5 12,6.5 C13.38,6.5 14.5,7.62 14.5,9 C14.5,10.38 13.38,11.5 12,11.5 Z" fill="#6C63FF" />
    </svg>
    ''',
    
    'phone-icon.svg': '''
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M20,15.5 C18.8,15.5 17.5,15.3 16.4,14.9 C16.3,14.9 16.2,14.9 16.1,14.9 C15.8,14.9 15.6,15 15.4,15.2 L13.2,17.4 C10.4,15.9 8,13.6 6.6,10.8 L8.8,8.6 C9.1,8.3 9.2,7.9 9,7.6 C8.7,6.5 8.5,5.2 8.5,4 C8.5,3.5 8,3 7.5,3 L4,3 C3.5,3 3,3.5 3,4 C3,13.4 10.6,21 20,21 C20.5,21 21,20.5 21,20 L21,16.5 C21,16 20.5,15.5 20,15.5 Z" fill="#6C63FF" />
    </svg>
    ''',
    
    'email-icon.svg': '''
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M20,4 L4,4 C2.9,4 2,4.9 2,6 L2,18 C2,19.1 2.9,20 4,20 L20,20 C21.1,20 22,19.1 22,18 L22,6 C22,4.9 21.1,4 20,4 Z M20,8 L12,13 L4,8 L4,6 L12,11 L20,6 L20,8 Z" fill="#6C63FF" />
    </svg>
    ''',
    
    'contact-icon.svg': '''
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="35" fill="#6C63FF" opacity="0.1" />
        <path d="M30,30 L50,30 L50,50 L30,50 Z" stroke="#6C63FF" stroke-width="2" fill="none" />
        <path d="M30,30 L40,40 L50,30" stroke="#6C63FF" stroke-width="2" fill="none" />
    </svg>
    ''',
    
    'subscription-bg.svg': '''
    <svg xmlns="http://www.w3.org/2000/svg" width="1440" height="400" viewBox="0 0 1440 400">
        <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#6C63FF;stop-opacity:0.8" />
                <stop offset="100%" style="stop-color:#2A2A72;stop-opacity:0.9" />
            </linearGradient>
            <pattern id="pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="#F64C72" opacity="0.3" />
            </pattern>
        </defs>
        <rect width="1440" height="400" fill="url(#grad)" />
        <rect width="1440" height="400" fill="url(#pattern)" />
        <path d="M0,400 L1440,400 L1440,300 C1200,350 900,320 600,380 C300,440 100,380 0,350 Z" fill="#F64C72" opacity="0.1" />
    </svg>
    '''
}

# Save each SVG file
for filename, svg_content in svg_images.items():
    file_path = os.path.join(base_dir, filename)
    
    # Check if file already exists
    if os.path.exists(file_path):
        print(f"File {filename} already exists. Overwriting...")
    
    # Write the SVG content to the file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(svg_content.strip())
    
    print(f"Created {filename}")
    time.sleep(0.1)  # Small delay to avoid overwhelming the system

print("\nAll SVG images have been created successfully!")