import math
import os
from PIL import Image, ImageDraw

def create_microbe_icon():
    # 2x supersampling for ultra-crisp antialiasing
    S = 1024
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    cx, cy = 512, 570
    base_r = 300

    # 1. Outer cilia / membrane bumps
    num_cilia = 16
    for i in range(num_cilia):
        angle = i * (2 * math.pi / num_cilia)
        dist = base_r + 25 + 15 * math.sin(i * 1.8)
        bx = cx + dist * math.cos(angle)
        by = cy + dist * math.sin(angle)
        br = 55 + 10 * math.cos(i)
        # Soft green-cyan bumps
        draw.ellipse([bx - br, by - br, bx + br, by + br], fill=(16, 185, 129, 230))

    # 2. Main microbe body shadow / rim
    draw.ellipse([cx - base_r - 12, cy - base_r - 12, cx + base_r + 12, cy + base_r + 12], fill=(4, 120, 87, 255))

    # 3. Main body fill with layered gradient circles
    for r in range(base_r, 0, -5):
        t = r / base_r
        # Gradient from dark emerald at edge to vibrant teal-green at center
        red = int(5 + (20 - 5) * (1 - t))
        green = int(150 + (195 - 150) * (1 - t))
        blue = int(105 + (160 - 105) * (1 - t))
        # Center offset towards top-left highlight
        ox = cx - int((1 - t) * 70)
        oy = cy - int((1 - t) * 70)
        draw.ellipse([ox - r, oy - r, ox + r, oy + r], fill=(red, green, blue, 255))

    # 4. Sprout stem and leaves (Growing at top of microbe)
    # Stem
    stem_points = [
        (cx, cy - base_r + 40),
        (cx + 10, cy - base_r - 40),
        (cx + 35, cy - base_r - 120),
        (cx + 80, cy - base_r - 180),
        (cx + 100, cy - base_r - 200),
    ]
    for i in range(len(stem_points) - 1):
        p1, p2 = stem_points[i], stem_points[i+1]
        draw.line([p1, p2], fill=(74, 222, 128, 255), width=28)
        draw.line([p1, p2], fill=(134, 239, 172, 255), width=16)

    # Left leaf
    left_leaf = [
        (cx + 40, cy - base_r - 100),
        (cx - 70, cy - base_r - 140),
        (cx - 160, cy - base_r - 130),
        (cx - 190, cy - base_r - 90),
        (cx - 120, cy - base_r - 60),
        (cx - 20, cy - base_r - 70),
    ]
    draw.polygon(left_leaf, fill=(34, 197, 94, 255))
    draw.polygon([
        (cx + 30, cy - base_r - 95),
        (cx - 60, cy - base_r - 130),
        (cx - 140, cy - base_r - 120),
        (cx - 110, cy - base_r - 70),
        (cx - 15, cy - base_r - 75)
    ], fill=(134, 239, 172, 255))

    # Right leaf
    right_leaf = [
        (cx + 90, cy - base_r - 170),
        (cx + 180, cy - base_r - 240),
        (cx + 250, cy - base_r - 230),
        (cx + 270, cy - base_r - 180),
        (cx + 210, cy - base_r - 140),
        (cx + 120, cy - base_r - 145),
    ]
    draw.polygon(right_leaf, fill=(34, 197, 94, 255))
    draw.polygon([
        (cx + 95, cy - base_r - 165),
        (cx + 170, cy - base_r - 225),
        (cx + 230, cy - base_r - 215),
        (cx + 195, cy - base_r - 150),
        (cx + 125, cy - base_r - 150)
    ], fill=(163, 230, 53, 255))

    # 5. Inner amber/gold organelle nucleus
    nx, ny, nr = cx + 80, cy + 90, 80
    for r in range(nr, 0, -3):
        t = r / nr
        red = int(245 + (254 - 245) * (1 - t))
        green = int(158 + (240 - 158) * (1 - t))
        blue = int(11 + (138 - 11) * (1 - t))
        draw.ellipse([nx - r, ny - r, nx + r, ny + r], fill=(red, green, blue, 240))

    # Second smaller organelle
    sx, sy, sr = cx - 140, cy + 110, 50
    draw.ellipse([sx - sr, sy - sr, sx + sr, sy + sr], fill=(56, 189, 248, 220))
    draw.ellipse([sx - sr//2, sy - sr//2, sx + sr//2, sy + sr//2], fill=(186, 230, 253, 240))

    # 6. Friendly, determined explorer warrior eyes
    # Left Eye
    lx, ly = cx - 90, cy - 30
    er_x, er_y = 52, 62
    draw.ellipse([lx - er_x, ly - er_y, lx + er_x, ly + er_y], fill=(255, 255, 255, 255))
    draw.ellipse([lx - er_x + 8, ly - er_y + 12, lx + er_x - 4, ly + er_y - 2], fill=(15, 23, 42, 255))
    # Specular eye catchlights
    draw.ellipse([lx - 15, ly - 28, lx + 12, ly - 2], fill=(255, 255, 255, 255))
    draw.ellipse([lx + 10, ly + 6, lx + 24, ly + 20], fill=(255, 255, 255, 255))

    # Right Eye
    rx, ry = cx + 90, cy - 30
    draw.ellipse([rx - er_x, ry - er_y, rx + er_x, ry + er_y], fill=(255, 255, 255, 255))
    draw.ellipse([rx - er_x + 8, ry - er_y + 12, rx + er_x - 4, ry + er_y - 2], fill=(15, 23, 42, 255))
    # Specular eye catchlights
    draw.ellipse([rx - 15, ry - 28, rx + 12, ry - 2], fill=(255, 255, 255, 255))
    draw.ellipse([rx + 10, ry + 6, rx + 24, ry + 20], fill=(255, 255, 255, 255))

    # Cute blush
    draw.ellipse([lx - 70, ly + 50, lx - 10, ly + 85], fill=(244, 114, 182, 140))
    draw.ellipse([rx + 10, ly + 50, rx + 70, ly + 85], fill=(244, 114, 182, 140))

    # Big happy determined smile
    draw.arc([cx - 55, cy + 30, cx + 55, cy + 100], start=15, end=165, fill=(15, 23, 42, 255), width=14)

    # 7. Specular claymorphic glossy highlight on top-left of body
    hl_x, hl_y = cx - 130, cy - 140
    draw.ellipse([hl_x - 90, hl_y - 45, hl_x + 90, hl_y + 45], fill=(255, 255, 255, 120))
    draw.ellipse([hl_x - 50, hl_y - 25, hl_x + 50, hl_y + 25], fill=(255, 255, 255, 200))

    # Resize to 512x512 master
    master = img.resize((512, 512), Image.Resampling.LANCZOS)
    return master

def main():
    print("Generating Microbe Wars Favicons...")
    master = create_microbe_icon()

    # Targets
    os.makedirs("public", exist_ok=True)
    os.makedirs("src/app", exist_ok=True)

    # 1. 512x512 Manifest icon
    master.save("public/web-app-manifest-512x512.png", "PNG")
    print("Saved public/web-app-manifest-512x512.png")

    # 2. 192x192 Manifest icon
    i192 = master.resize((192, 192), Image.Resampling.LANCZOS)
    i192.save("public/web-app-manifest-192x192.png", "PNG")
    print("Saved public/web-app-manifest-192x192.png")

    # 3. 180x180 Apple touch icon
    i180 = master.resize((180, 180), Image.Resampling.LANCZOS)
    i180.save("public/apple-touch-icon.png", "PNG")
    i180.save("src/app/apple-icon.png", "PNG")
    print("Saved public/apple-touch-icon.png and src/app/apple-icon.png")

    # 4. 96x96 Favicon
    i96 = master.resize((96, 96), Image.Resampling.LANCZOS)
    i96.save("public/favicon-96x96.png", "PNG")
    print("Saved public/favicon-96x96.png")

    # 5. 32x32 App icon
    i32 = master.resize((32, 32), Image.Resampling.LANCZOS)
    i32.save("src/app/icon.png", "PNG")
    print("Saved src/app/icon.png")

    # 6. Multi-resolution favicon.ico (16, 32, 48)
    i16 = master.resize((16, 16), Image.Resampling.LANCZOS)
    i48 = master.resize((48, 48), Image.Resampling.LANCZOS)
    master.save(
        "public/favicon.ico",
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
        append_images=[i16, i32, i48]
    )
    master.save(
        "src/app/favicon.ico",
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
        append_images=[i16, i32, i48]
    )
    print("Saved public/favicon.ico and src/app/favicon.ico (multi-resolution 16x16, 32x32, 48x48)")

if __name__ == "__main__":
    main()
