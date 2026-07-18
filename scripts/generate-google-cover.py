#!/usr/bin/env python3
"""Generate Google Business Profile cover image for PANTHRA."""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
LOGO_PATH = ROOT / "panthra_logo.png"
FONT_PATH = Path("/usr/share/fonts/truetype/macos/Inter-Bold.ttf")
OUT_DIR = ROOT / "assets"

BG = (5, 5, 7)  # #050507


def load_og_logo(size: int) -> Image.Image:
    """White panther with original eye shape filled black."""
    logo = Image.open(LOGO_PATH).convert("RGBA")
    arr = np.array(logo, dtype=np.uint8)
    rgb = arr[:, :, :3]
    alpha = arr[:, :, 3]

    visible = alpha > 20
    r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    eye = visible & (r > 80) & (b > 120) & (g < 80)

    white_logo = np.zeros_like(arr)
    body = visible & ~eye
    white_logo[body, 0] = 255
    white_logo[body, 1] = 255
    white_logo[body, 2] = 255
    white_logo[body, 3] = alpha[body]

    # Smooth resize for the white body only.
    processed = Image.fromarray(white_logo, "RGBA")
    processed.thumbnail((size, size), Image.Resampling.LANCZOS)

    # Same OG eye shape, filled solid black (not purple).
    eye_layer = np.zeros_like(arr)
    eye_layer[eye, 0] = 0
    eye_layer[eye, 1] = 0
    eye_layer[eye, 2] = 0
    eye_layer[eye, 3] = 255
    eye_img = Image.fromarray(eye_layer, "RGBA").resize(processed.size, Image.Resampling.NEAREST)

    result = Image.new("RGBA", processed.size, (0, 0, 0, 0))
    result.alpha_composite(processed)
    result.alpha_composite(eye_img)
    return result


def draw_brand_text(draw: ImageDraw.ImageDraw, x: int, y: int, font: ImageFont.FreeTypeFont) -> None:
    letter_spacing = int(font.size * 0.08)
    cursor_x = x

    for char in "PANTHRA":
        draw.text((cursor_x + 3, y + 3), char, font=font, fill=(0, 0, 0, 160))
        draw.text((cursor_x, y), char, font=font, fill=(255, 255, 255, 245))
        bbox = draw.textbbox((0, 0), char, font=font)
        cursor_x += (bbox[2] - bbox[0]) + letter_spacing


def build_cover(width: int, height: int) -> Image.Image:
    canvas = Image.new("RGB", (width, height), BG)
    overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))

    logo_size = int(height * 0.62)
    logo = load_og_logo(logo_size)

    font_size = int(height * 0.19)
    font = ImageFont.truetype(str(FONT_PATH), font_size)

    tmp = Image.new("RGBA", (1, 1))
    tmp_draw = ImageDraw.Draw(tmp)
    letter_spacing = int(font_size * 0.08)
    text_w = sum(
        tmp_draw.textbbox((0, 0), ch, font=font)[2] - tmp_draw.textbbox((0, 0), ch, font=font)[0]
        for ch in "PANTHRA"
    ) + letter_spacing * 6
    text_h = tmp_draw.textbbox((0, 0), "P", font=font)[3] - tmp_draw.textbbox((0, 0), "P", font=font)[1]

    gap = int(width * 0.025)
    group_w = logo_size + gap + text_w
    start_x = (width - group_w) // 2
    logo_x = start_x
    logo_y = (height - logo_size) // 2
    text_x = logo_x + logo_size + gap
    text_y = (height - text_h) // 2 - int(font_size * 0.08)

    overlay.alpha_composite(logo, (logo_x, logo_y))

    draw = ImageDraw.Draw(overlay)
    draw_brand_text(draw, text_x, text_y, font)

    return Image.alpha_composite(canvas.convert("RGBA"), overlay).convert("RGB")


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    sizes = {
        "google-business-cover-1920x1080.png": (1920, 1080),
        "google-business-cover-1024x576.png": (1024, 576),
    }

    for filename, (width, height) in sizes.items():
        cover = build_cover(width, height)
        cover.save(OUT_DIR / filename, "PNG")

    print("Created:")
    for filename in sizes:
        print(f"  {OUT_DIR / filename}")


if __name__ == "__main__":
    main()
