# IA
from PIL import Image, ImageDraw
import os

def create_icon(size, output_path):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    bg_color = (102, 126, 234, 255)
    text_color = (255, 255, 255, 255)

    margin = size // 8
    draw.ellipse([margin, margin, size - margin, size - margin], fill=bg_color)

    doc_margin = size // 4
    doc_width = size - (doc_margin * 2)
    doc_height = int(doc_width * 1.2)
    doc_y = (size - doc_height) // 2

    draw.rectangle([doc_margin, doc_y, doc_margin + doc_width, doc_y + doc_height], fill=text_color)

    line_margin = doc_margin + size // 16
    line_width = doc_width - (size // 8)
    line_height = size // 32

    for i in range(3):
        line_y = doc_y + (size // 8) + (i * (size // 12))
        if line_y + line_height < doc_y + doc_height - (size // 16):
            draw.rectangle([line_margin, line_y, line_margin + line_width, line_y + line_height], fill=bg_color)

    img.save(output_path, 'PNG')

def main():
    icons_dir = '/home/ubuntu/chrome-text-editor-extension/public/icons'
    sizes = [16, 32, 48, 128]
    for size in sizes:
        output_path = os.path.join(icons_dir, f'icon{size}.png')
        create_icon(size, output_path)

if __name__ == '__main__':
    main()
