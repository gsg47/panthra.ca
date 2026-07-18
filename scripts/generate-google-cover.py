#!/usr/bin/env python3
"""Generate Google Business Profile cover from the OG panthra_logo.png."""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
LOGO_PATH = ROOT / "panthra_logo.png"
FONT_PATH = Path("/usr/share/fonts/truetype/macos/Inter-Bold.ttf")
OUT_DIR = ROOT / "assets"

BG = (0, 0, 0)


def load_og_white_logo(size: int) -> Image.Image:
    """OG mark: crisp white panther, solid black eye — no grey fringe."""
    logo = Image.open(LOGO_PATH).convert("RGBA")
    arr = np.array(logo, dtype=np.uint8)
    rgb = arr[:, :, :3]
    alpha = arr[:, :, 3]

    visible = alpha > 20
    r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    eye = visible & (r > 80) & (b > 120) & (g < 80)

    # Full-res: white body + solid black eye
    out = np.zeros_like(arr)
    body = visible & ~eye
    out[body] = (255, 255, 255, 255)
    out[eye] = (0, 0, 0, 255)

    processed = Image.fromarray(out, "RGBA")
    processed.thumbnail((size, size), Image.Resampling.LANCZOS)
    pa = np.array(processed, dtype=np.uint8)

    # Kill grey anti-alias: every opaque pixel becomes pure white or pure black.
    opaque = pa[:, :, 3] > 127
    bright = pa[:, :, 0] >= 128
    pa[opaque & bright] = (255, 255, 255, 255)
    pa[opaque & ~bright] = (0, 0, 0, 255)
    pa[~opaque] = (0, 0, 0, 0)

    # Re-stamp the original eye shape in solid black (nearest = no grey).
    eye_mask = Image.fromarray((eye.astype(np.uint8) * 255), mode="L")
    eye_mask = eye_mask.resize(processed.size, Image.Resampling.NEAREST)
    eye_pixels = np.array(eye_mask) > 127
    pa[eye_pixels] = (0, 0, 0, 255)

    return Image.fromarray(pa, "RGBA")


def draw_brand_text(draw: ImageDraw.ImageDraw, x: int, y: int, font: ImageFont.FreeTypeFont) -> None:
    letter_spacing = int(font.size * 0.08)
    cursor_x = x

    for char in "PANTHRA":
        draw.text((cursor_x, y), char, font=font, fill=(255, 255, 255, 255))
        bbox = draw.textbbox((0, 0), char, font=font)
        cursor_x += (bbox[2] - bbox[0]) + letter_spacing


def build_cover(width: int, height: int) -> Image.Image:
    canvas = Image.new("RGB", (width, height), BG)
    overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))

    logo_size = int(height * 0.72)
    logo = load_og_white_logo(logo_size)

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

    gap = int(width * 0.02)
    group_w = logo_size + gap + text_w
    start_x = (width - group_w) // 2
    logo_x = start_x
    logo_y = (height - logo_size) // 2
    text_x = logo_x + logo_size + gap
    text_y = (height - text_h) // 2 - int(font_size * 0.08)

    overlay.alpha_composite(logo, (logo_x, logo_y))
    draw = ImageDraw.Draw(overlay)
    draw_brand_text(draw, text_x, text_y, font)

    result = Image.alpha_composite(canvas.convert("RGBA"), overlay).convert("RGB")
    # Full hard B/W — no grey eye, no grey fringe (matches crisp OG look).
    ra = np.array(result, dtype=np.uint8)
    bright = ra.max(axis=2) >= 128
    ra[bright] = (255, 255, 255)
    ra[~bright] = (0, 0, 0)
    return Image.fromarray(ra, "RGB")


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    # Clean square logo mark (no Gemini watermark) for reuse
    square = Image.new("RGB", (1024, 1024), BG)
    mark = load_og_white_logo(900)
    sx = (1024 - mark.width) // 2
    sy = (1024 - mark.height) // 2
    square_rgba = Image.new("RGBA", (1024, 1024), (0, 0, 0, 255))
    square_rgba.alpha_composite(mark, (sx, sy))
    square_rgba.convert("RGB").save(OUT_DIR / "panthra-logo-white.png", "PNG")

    for filename, size in {
        "google-business-cover-1920x1080.png": (1920, 1080),
        "google-business-cover-1024x576.png": (1024, 576),
    }.items():
        build_cover(*size).save(OUT_DIR / filename, "PNG")

    print("Created:")
    print(f"  {OUT_DIR / 'panthra-logo-white.png'}")
    print(f"  {OUT_DIR / 'google-business-cover-1920x1080.png'}")
    print(f"  {OUT_DIR / 'google-business-cover-1024x576.png'}")


if __name__ == "__main__":
    main()
