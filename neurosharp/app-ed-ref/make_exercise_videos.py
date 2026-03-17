#!/usr/bin/env python3
"""
Generate all 9 Vigronex exercise videos with English text.
Dark navy background, gold accent color, animated elements.
"""

import os
import math
import subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont

# Colors (dark navy theme matching the app)
BG_COLOR = (10, 15, 35)          # Dark navy
ACCENT = (212, 160, 60)          # Gold
ACCENT2 = (255, 200, 80)         # Bright gold
WHITE = (255, 255, 255)
GRAY = (160, 160, 180)
DARK_GRAY = (40, 50, 80)

# Video settings
W, H = 640, 640
FPS = 30
FONT_BOLD = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
FONT_REG = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"

OUTPUT_DIR = "/tmp/exercise_videos"
os.makedirs(OUTPUT_DIR, exist_ok=True)


def get_font(size, bold=True):
    try:
        return ImageFont.truetype(FONT_BOLD if bold else FONT_REG, size)
    except:
        return ImageFont.load_default()


def draw_centered_text(draw, text, y, font, color=WHITE, shadow=True):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    x = (W - tw) // 2
    if shadow:
        draw.text((x + 2, y + 2), text, font=font, fill=(0, 0, 0, 180))
    draw.text((x, y), text, font=font, fill=color)


def draw_rounded_rect(draw, x1, y1, x2, y2, radius, fill, outline=None, outline_width=2):
    draw.rounded_rectangle([x1, y1, x2, y2], radius=radius, fill=fill, outline=outline, width=outline_width)


def lerp(a, b, t):
    return a + (b - a) * t


def ease_in_out(t):
    return t * t * (3 - 2 * t)


def pulse_scale(frame, period=60, min_s=0.95, max_s=1.05):
    t = (math.sin(2 * math.pi * frame / period) + 1) / 2
    return lerp(min_s, max_s, t)


def draw_circle_ring(draw, cx, cy, radius, width, color, alpha_factor=1.0):
    """Draw a circle ring"""
    r, g, b = color
    a = int(255 * alpha_factor)
    for i in range(width):
        r_i = radius - i
        if r_i > 0:
            draw.ellipse([cx - r_i, cy - r_i, cx + r_i, cy + r_i], outline=(r, g, b, a), width=1)


def make_frame_base(title, subtitle, category_label):
    """Create base frame with title area"""
    img = Image.new("RGBA", (W, H), BG_COLOR + (255,))
    draw = ImageDraw.Draw(img)

    # Top category badge
    cat_font = get_font(18)
    badge_text = category_label.upper()
    bbox = draw.textbbox((0, 0), badge_text, font=cat_font)
    bw = bbox[2] - bbox[0] + 32
    bx = (W - bw) // 2
    draw_rounded_rect(draw, bx, 24, bx + bw, 52, 14, DARK_GRAY, ACCENT, 2)
    draw_centered_text(draw, badge_text, 30, cat_font, ACCENT, shadow=False)

    # Title
    title_font = get_font(38)
    # Wrap title if too long
    words = title.split()
    lines = []
    current = ""
    for w in words:
        test = (current + " " + w).strip()
        bbox = draw.textbbox((0, 0), test, font=title_font)
        if bbox[2] - bbox[0] > W - 60:
            if current:
                lines.append(current)
            current = w
        else:
            current = test
    if current:
        lines.append(current)

    title_y = 70
    for line in lines:
        draw_centered_text(draw, line, title_y, title_font, WHITE)
        title_y += 48

    return img, draw, title_y


# ─────────────────────────────────────────────────────────────
# VIDEO 1: Basic Kegel Hold
# ─────────────────────────────────────────────────────────────
def make_kegel_hold():
    """Animated pelvic floor contraction timer"""
    TOTAL_FRAMES = FPS * 20  # 20 seconds
    HOLD_FRAMES = FPS * 5    # 5s hold
    REST_FRAMES = FPS * 5    # 5s rest
    CYCLE = HOLD_FRAMES + REST_FRAMES

    frames = []
    for f in range(TOTAL_FRAMES):
        img = Image.new("RGBA", (W, H), BG_COLOR + (255,))
        draw = ImageDraw.Draw(img)

        # Background gradient circles
        for i in range(5):
            r = 280 - i * 40
            alpha = 0.05 + i * 0.02
            draw.ellipse([W//2 - r, H//2 - r, W//2 + r, H//2 + r],
                        outline=ACCENT + (int(255 * alpha),), width=1)

        # Category badge
        cat_font = get_font(18)
        badge_text = "KEGEL TRAINING"
        bbox = draw.textbbox((0, 0), badge_text, font=cat_font)
        bw = bbox[2] - bbox[0] + 32
        bx = (W - bw) // 2
        draw_rounded_rect(draw, bx, 24, bx + bw, 52, 14, DARK_GRAY, ACCENT, 2)
        draw_centered_text(draw, badge_text, 30, cat_font, ACCENT, shadow=False)

        # Title
        title_font = get_font(36)
        draw_centered_text(draw, "Basic Kegel Hold", 70, title_font, WHITE)

        # Phase detection
        cycle_pos = f % CYCLE
        in_hold = cycle_pos < HOLD_FRAMES
        phase_progress = cycle_pos / HOLD_FRAMES if in_hold else (cycle_pos - HOLD_FRAMES) / REST_FRAMES

        # Central pelvic floor icon (animated circle)
        cx, cy = W // 2, H // 2 + 20
        base_r = 90
        if in_hold:
            # Contracting - shrink and glow
            t = ease_in_out(min(phase_progress * 2, 1.0))
            r = int(base_r * (1 - 0.15 * t))
            glow = int(80 * t)
            # Glow rings
            for gi in range(4):
                gr = r + gi * 15
                ga = max(0, glow - gi * 20)
                draw.ellipse([cx - gr, cy - gr, cx + gr, cy + gr],
                            outline=ACCENT + (ga,), width=2)
            # Main circle - gold when contracting
            draw.ellipse([cx - r, cy - r, cx + r, cy + r],
                        fill=ACCENT + (200,), outline=ACCENT2, width=3)
            # Inner symbol
            inner_r = r - 20
            draw.ellipse([cx - inner_r, cy - inner_r, cx + inner_r, cy + inner_r],
                        fill=BG_COLOR + (255,))
            # Pelvic floor symbol (simplified)
            sym_font = get_font(32)
            draw_centered_text(draw, "⚡", cy - 18, sym_font, ACCENT2, shadow=False)
        else:
            # Relaxing - expand
            t = ease_in_out(phase_progress)
            r = int(base_r * (0.85 + 0.15 * t))
            draw.ellipse([cx - r, cy - r, cx + r, cy + r],
                        fill=DARK_GRAY + (200,), outline=GRAY, width=2)
            inner_r = r - 20
            draw.ellipse([cx - inner_r, cy - inner_r, cx + inner_r, cy + inner_r],
                        fill=BG_COLOR + (255,))
            sym_font = get_font(32)
            draw_centered_text(draw, "○", cy - 18, sym_font, GRAY, shadow=False)

        # Phase label
        phase_font = get_font(44)
        phase_text = "HOLD" if in_hold else "RELAX"
        phase_color = ACCENT2 if in_hold else GRAY
        draw_centered_text(draw, phase_text, cy + r + 20, phase_font, phase_color)

        # Countdown timer
        if in_hold:
            secs_left = max(0, int((HOLD_FRAMES - cycle_pos) / FPS) + 1)
            timer_text = f"{secs_left}s"
        else:
            secs_left = max(0, int((REST_FRAMES - (cycle_pos - HOLD_FRAMES)) / FPS) + 1)
            timer_text = f"{secs_left}s"

        timer_font = get_font(28)
        draw_centered_text(draw, timer_text, cy + r + 75, timer_font, WHITE)

        # Bottom instructions
        inst_font = get_font(20, bold=False)
        instructions = [
            "Squeeze pelvic floor muscles",
            "Hold 5s • Rest 5s • Repeat 10x"
        ]
        for i, inst in enumerate(instructions):
            draw_centered_text(draw, inst, H - 80 + i * 28, inst_font, GRAY)

        frames.append(np.array(img.convert("RGB")))

    return frames


# ─────────────────────────────────────────────────────────────
# VIDEO 2: Kegel Pulse Training
# ─────────────────────────────────────────────────────────────
def make_kegel_pulse():
    """Fast pulse animation"""
    TOTAL_FRAMES = FPS * 20
    PULSE_FRAMES = FPS * 1  # 1s on, 1s off

    frames = []
    for f in range(TOTAL_FRAMES):
        img = Image.new("RGBA", (W, H), BG_COLOR + (255,))
        draw = ImageDraw.Draw(img)

        # Background rings
        for i in range(6):
            r = 300 - i * 40
            alpha = 0.04 + i * 0.01
            draw.ellipse([W//2 - r, H//2 - r, W//2 + r, H//2 + r],
                        outline=ACCENT + (int(255 * alpha),), width=1)

        # Category badge
        cat_font = get_font(18)
        draw_rounded_rect(draw, 200, 24, 440, 52, 14, DARK_GRAY, ACCENT, 2)
        draw_centered_text(draw, "KEGEL TRAINING", 30, cat_font, ACCENT, shadow=False)

        # Title
        title_font = get_font(34)
        draw_centered_text(draw, "Kegel Pulse Training", 70, title_font, WHITE)

        # Pulse cycle (1s on, 1s off)
        cycle_pos = f % PULSE_FRAMES
        in_pulse = (f // PULSE_FRAMES) % 2 == 0
        t = cycle_pos / PULSE_FRAMES

        cx, cy = W // 2, H // 2 + 10

        if in_pulse:
            # PULSE ON - fast contraction
            scale = 1.0 - 0.2 * ease_in_out(t)
            r = int(85 * scale)
            # Ripple waves
            for ri in range(3):
                wave_t = (t + ri * 0.33) % 1.0
                wave_r = int(85 + wave_t * 80)
                wave_a = int(200 * (1 - wave_t))
                draw.ellipse([cx - wave_r, cy - wave_r, cx + wave_r, cy + wave_r],
                            outline=ACCENT + (wave_a,), width=2)
            draw.ellipse([cx - r, cy - r, cx + r, cy + r],
                        fill=ACCENT + (230,), outline=ACCENT2, width=3)
            inner_r = r - 18
            draw.ellipse([cx - inner_r, cy - inner_r, cx + inner_r, cy + inner_r],
                        fill=BG_COLOR + (255,))

            phase_font = get_font(48)
            draw_centered_text(draw, "PULSE", cy + 95, phase_font, ACCENT2)
        else:
            # PULSE OFF
            r = 85
            draw.ellipse([cx - r, cy - r, cx + r, cy + r],
                        fill=DARK_GRAY + (180,), outline=GRAY, width=2)
            inner_r = r - 18
            draw.ellipse([cx - inner_r, cy - inner_r, cx + inner_r, cy + inner_r],
                        fill=BG_COLOR + (255,))

            phase_font = get_font(48)
            draw_centered_text(draw, "RELEASE", cy + 95, phase_font, GRAY)

        # Timing label
        timing_font = get_font(22, bold=False)
        draw_centered_text(draw, "1s ON  •  1s OFF  •  Fast Rhythm", cy + 155, timing_font, GRAY)

        # Bottom
        inst_font = get_font(20, bold=False)
        draw_centered_text(draw, "Quick contractions build fast-twitch fibers", H - 60, inst_font, GRAY)
        draw_centered_text(draw, "3 sets × 20 pulses", H - 32, inst_font, ACCENT)

        frames.append(np.array(img.convert("RGB")))

    return frames


# ─────────────────────────────────────────────────────────────
# VIDEO 3: 4-7-8 Breathing
# ─────────────────────────────────────────────────────────────
def make_breathing_478():
    """Breathing circle animation: inhale 4, hold 7, exhale 8"""
    TOTAL_FRAMES = FPS * 20
    CYCLE = FPS * 19  # 4+7+8 = 19s per cycle
    INHALE = FPS * 4
    HOLD = FPS * 7
    EXHALE = FPS * 8

    frames = []
    for f in range(TOTAL_FRAMES):
        img = Image.new("RGBA", (W, H), BG_COLOR + (255,))
        draw = ImageDraw.Draw(img)

        # Category badge
        cat_font = get_font(18)
        draw_rounded_rect(draw, 185, 24, 455, 52, 14, DARK_GRAY, ACCENT, 2)
        draw_centered_text(draw, "BREATHWORK", 30, cat_font, ACCENT, shadow=False)

        # Title
        title_font = get_font(34)
        draw_centered_text(draw, "4-7-8 Breathing", 70, title_font, WHITE)

        # Phase
        cycle_pos = f % CYCLE
        cx, cy = W // 2, H // 2 + 10

        if cycle_pos < INHALE:
            phase = "INHALE"
            t = cycle_pos / INHALE
            r = int(60 + 80 * ease_in_out(t))
            color = (100, 180, 255)
            count = int(t * 4) + 1
            count_label = f"{count}"
            total = "4"
        elif cycle_pos < INHALE + HOLD:
            phase = "HOLD"
            t = (cycle_pos - INHALE) / HOLD
            r = 140
            color = ACCENT
            count = int(t * 7) + 1
            count_label = f"{count}"
            total = "7"
        else:
            phase = "EXHALE"
            t = (cycle_pos - INHALE - HOLD) / EXHALE
            r = int(140 - 80 * ease_in_out(t))
            color = (100, 220, 150)
            count = int(t * 8) + 1
            count_label = f"{count}"
            total = "8"

        # Breathing circle
        # Outer glow
        for gi in range(4):
            gr = r + gi * 12
            ga = max(0, 60 - gi * 15)
            draw.ellipse([cx - gr, cy - gr, cx + gr, cy + gr],
                        outline=color + (ga,), width=2)

        draw.ellipse([cx - r, cy - r, cx + r, cy + r],
                    fill=color + (40,), outline=color, width=3)

        # Count display
        count_font = get_font(56)
        draw_centered_text(draw, count_label, cy - 35, count_font, WHITE)
        total_font = get_font(20, bold=False)
        draw_centered_text(draw, f"of {total}", cy + 28, total_font, GRAY)

        # Phase label
        phase_font = get_font(40)
        draw_centered_text(draw, phase, cy + r + 25, phase_font, color)

        # Sequence reminder
        seq_font = get_font(22, bold=False)
        draw_centered_text(draw, "Inhale 4  •  Hold 7  •  Exhale 8", cy + r + 75, seq_font, GRAY)

        # Bottom
        inst_font = get_font(18, bold=False)
        draw_centered_text(draw, "Breathe through nose • Exhale through mouth", H - 40, inst_font, GRAY)

        frames.append(np.array(img.convert("RGB")))

    return frames


# ─────────────────────────────────────────────────────────────
# VIDEO 4: Box Breathing
# ─────────────────────────────────────────────────────────────
def make_box_breathing():
    """Box breathing: 4-4-4-4 with animated square"""
    TOTAL_FRAMES = FPS * 20
    CYCLE = FPS * 16  # 4+4+4+4
    PHASE_LEN = FPS * 4

    frames = []
    for f in range(TOTAL_FRAMES):
        img = Image.new("RGBA", (W, H), BG_COLOR + (255,))
        draw = ImageDraw.Draw(img)

        # Category badge
        cat_font = get_font(18)
        draw_rounded_rect(draw, 185, 24, 455, 52, 14, DARK_GRAY, ACCENT, 2)
        draw_centered_text(draw, "BREATHWORK", 30, cat_font, ACCENT, shadow=False)

        # Title
        title_font = get_font(34)
        draw_centered_text(draw, "Box Breathing", 70, title_font, WHITE)

        # Box drawing
        cx, cy = W // 2, H // 2 + 10
        box_size = 140
        bx1, by1 = cx - box_size, cy - box_size
        bx2, by2 = cx + box_size, cy + box_size

        # Draw box outline (dim)
        draw.rectangle([bx1, by1, bx2, by2], outline=DARK_GRAY, width=2)

        # Phase
        cycle_pos = f % CYCLE
        phase_idx = cycle_pos // PHASE_LEN
        phase_t = (cycle_pos % PHASE_LEN) / PHASE_LEN
        phases = ["INHALE", "HOLD", "EXHALE", "HOLD"]
        colors = [(100, 180, 255), ACCENT, (100, 220, 150), (200, 150, 255)]
        phase = phases[phase_idx]
        color = colors[phase_idx]

        # Animated dot moving around the box
        # Side 0 (top): left to right
        # Side 1 (right): top to bottom
        # Side 2 (bottom): right to left
        # Side 3 (left): bottom to top
        if phase_idx == 0:  # top: left to right
            dot_x = int(bx1 + (bx2 - bx1) * phase_t)
            dot_y = by1
        elif phase_idx == 1:  # right: top to bottom
            dot_x = bx2
            dot_y = int(by1 + (by2 - by1) * phase_t)
        elif phase_idx == 2:  # bottom: right to left
            dot_x = int(bx2 - (bx2 - bx1) * phase_t)
            dot_y = by2
        else:  # left: bottom to top
            dot_x = bx1
            dot_y = int(by2 - (by2 - by1) * phase_t)

        # Glow trail
        for ti in range(8):
            trail_t = max(0, phase_t - ti * 0.05)
            if phase_idx == 0:
                tx = int(bx1 + (bx2 - bx1) * trail_t)
                ty = by1
            elif phase_idx == 1:
                tx = bx2
                ty = int(by1 + (by2 - by1) * trail_t)
            elif phase_idx == 2:
                tx = int(bx2 - (bx2 - bx1) * trail_t)
                ty = by2
            else:
                tx = bx1
                ty = int(by2 - (by2 - by1) * trail_t)
            trail_r = 8 - ti
            trail_a = max(0, 150 - ti * 20)
            if trail_r > 0:
                draw.ellipse([tx - trail_r, ty - trail_r, tx + trail_r, ty + trail_r],
                            fill=color + (trail_a,))

        # Main dot
        draw.ellipse([dot_x - 12, dot_y - 12, dot_x + 12, dot_y + 12],
                    fill=color + (255,))

        # Box labels
        label_font = get_font(18, bold=False)
        draw_centered_text(draw, "4", by1 - 22, label_font, GRAY if phase_idx != 0 else color)
        draw_centered_text(draw, "4", by2 + 8, label_font, GRAY if phase_idx != 2 else color)
        draw.text((bx2 + 10, cy - 10), "4", font=label_font, fill=GRAY if phase_idx != 1 else color)
        draw.text((bx1 - 22, cy - 10), "4", font=label_font, fill=GRAY if phase_idx != 3 else color)

        # Count
        count = int(phase_t * 4) + 1
        count_font = get_font(52)
        draw_centered_text(draw, str(count), cy - 32, count_font, WHITE)

        # Phase label
        phase_font = get_font(38)
        draw_centered_text(draw, phase, cy + box_size + 30, phase_font, color)

        # Bottom
        inst_font = get_font(18, bold=False)
        draw_centered_text(draw, "Used by Navy SEALs for stress control", H - 40, inst_font, GRAY)

        frames.append(np.array(img.convert("RGB")))

    return frames


# ─────────────────────────────────────────────────────────────
# VIDEO 5: Cold Shower Protocol
# ─────────────────────────────────────────────────────────────
def make_cold_shower():
    """Cold shower timer with temperature animation"""
    TOTAL_FRAMES = FPS * 20

    frames = []
    for f in range(TOTAL_FRAMES):
        img = Image.new("RGBA", (W, H), BG_COLOR + (255,))
        draw = ImageDraw.Draw(img)

        # Animated water drops (falling)
        for drop_i in range(20):
            seed = drop_i * 137
            drop_x = (seed * 31 + 50) % (W - 100) + 50
            drop_speed = 3 + (seed % 3)
            drop_y = (f * drop_speed + seed * 47) % (H + 40) - 20
            drop_size = 3 + drop_i % 3
            alpha = 60 + drop_i % 60
            drop_color = (100, 180, 255, alpha)
            draw.ellipse([drop_x - drop_size, drop_y,
                         drop_x + drop_size, drop_y + drop_size * 3],
                        fill=drop_color)

        # Category badge
        cat_font = get_font(18)
        draw_rounded_rect(draw, 175, 24, 465, 52, 14, DARK_GRAY, (100, 180, 255), 2)
        draw_centered_text(draw, "COLD THERAPY", 30, cat_font, (100, 180, 255), shadow=False)

        # Title
        title_font = get_font(34)
        draw_centered_text(draw, "Cold Shower Protocol", 70, title_font, WHITE)

        cx, cy = W // 2, H // 2 + 10

        # Temperature gauge
        total_time = 180  # 3 minutes
        elapsed = (f / FPS) % total_time
        progress = elapsed / total_time

        # Thermometer body
        therm_x, therm_y = cx, cy - 30
        therm_h = 120
        therm_w = 24
        # Outer
        draw.rounded_rectangle([therm_x - therm_w//2, therm_y - therm_h,
                                therm_x + therm_w//2, therm_y + 20],
                               radius=therm_w//2, outline=(100, 180, 255), width=2, fill=DARK_GRAY)
        # Fill level (goes down as it gets colder)
        fill_h = int(therm_h * (1 - progress * 0.7))
        fill_color_r = int(255 * (1 - progress))
        fill_color_b = int(100 + 155 * progress)
        fill_color = (fill_color_r, 50, fill_color_b)
        draw.rounded_rectangle([therm_x - therm_w//2 + 4, therm_y - fill_h,
                                therm_x + therm_w//2 - 4, therm_y + 16],
                               radius=8, fill=fill_color)
        # Bulb
        draw.ellipse([therm_x - 20, therm_y + 4, therm_x + 20, therm_y + 44],
                    fill=fill_color, outline=(100, 180, 255), width=2)

        # Temperature text
        temp_start = 104  # 40°C in F
        temp_end = 59    # 15°C in F
        temp = int(temp_start - (temp_start - temp_end) * progress)
        temp_font = get_font(48)
        draw_centered_text(draw, f"{temp}°F", therm_y + 65, temp_font, (100, 180, 255))

        # Timer
        mins = int(elapsed // 60)
        secs = int(elapsed % 60)
        timer_font = get_font(28)
        draw_centered_text(draw, f"{mins}:{secs:02d} / 3:00", therm_y + 120, timer_font, WHITE)

        # Benefits
        benefits = ["+15% Testosterone", "+250% Dopamine", "Improved Circulation"]
        ben_font = get_font(18, bold=False)
        for i, ben in enumerate(benefits):
            alpha_factor = min(1.0, (f / FPS - i * 2) / 1.0) if f / FPS > i * 2 else 0
            if alpha_factor > 0:
                draw_centered_text(draw, "✓ " + ben, H - 100 + i * 26, ben_font,
                                  (int(100 * alpha_factor), int(220 * alpha_factor), int(150 * alpha_factor)))

        frames.append(np.array(img.convert("RGB")))

    return frames


# ─────────────────────────────────────────────────────────────
# VIDEO 6: 30-Minute Zone 2 Cardio
# ─────────────────────────────────────────────────────────────
def make_zone2_cardio():
    """Heart rate zone animation"""
    TOTAL_FRAMES = FPS * 20

    frames = []
    for f in range(TOTAL_FRAMES):
        img = Image.new("RGBA", (W, H), BG_COLOR + (255,))
        draw = ImageDraw.Draw(img)

        # Category badge
        cat_font = get_font(18)
        draw_rounded_rect(draw, 220, 24, 420, 52, 14, DARK_GRAY, (100, 220, 150), 2)
        draw_centered_text(draw, "CARDIO", 30, cat_font, (100, 220, 150), shadow=False)

        # Title
        title_font = get_font(32)
        draw_centered_text(draw, "30-Min Zone 2 Cardio", 70, title_font, WHITE)

        cx, cy = W // 2, H // 2 + 10

        # Animated ECG / heartbeat line
        ecg_y = cy - 40
        ecg_points = []
        for x in range(W):
            t = (x + f * 3) / W * 4 * math.pi
            # Zone 2 steady rhythm
            bpm = 130  # target bpm
            beat_t = (x + f * 2) % (W // 3)
            beat_norm = beat_t / (W // 3)
            if beat_norm < 0.1:
                y = ecg_y - int(60 * math.sin(beat_norm / 0.1 * math.pi))
            elif beat_norm < 0.15:
                y = ecg_y + int(20 * math.sin((beat_norm - 0.1) / 0.05 * math.pi))
            else:
                y = ecg_y + int(5 * math.sin(t * 0.5))
            ecg_points.append((x, y))

        if len(ecg_points) > 1:
            draw.line(ecg_points, fill=(100, 220, 150), width=2)

        # Heart rate display
        bpm_val = 125 + int(10 * math.sin(f / 30))
        bpm_font = get_font(64)
        draw_centered_text(draw, str(bpm_val), cy + 20, bpm_font, (100, 220, 150))
        bpm_label = get_font(22, bold=False)
        draw_centered_text(draw, "BPM  •  Zone 2", cy + 90, bpm_label, GRAY)

        # Zone indicator
        zone_font = get_font(20, bold=False)
        draw_centered_text(draw, "Target: 60-70% Max Heart Rate", cy + 120, zone_font, GRAY)
        draw_centered_text(draw, "You should be able to hold a conversation", cy + 148, zone_font, GRAY)

        # Progress bar (30 min)
        elapsed_min = (f / FPS / 20) * 30  # simulate 30 min in 20 sec
        bar_w = W - 120
        bar_x = 60
        bar_y = H - 90
        draw.rounded_rectangle([bar_x, bar_y, bar_x + bar_w, bar_y + 16],
                               radius=8, fill=DARK_GRAY)
        fill_w = int(bar_w * elapsed_min / 30)
        if fill_w > 0:
            draw.rounded_rectangle([bar_x, bar_y, bar_x + fill_w, bar_y + 16],
                                   radius=8, fill=(100, 220, 150))
        time_font = get_font(20, bold=False)
        draw_centered_text(draw, f"{int(elapsed_min)}:00 / 30:00", bar_y + 24, time_font, WHITE)

        frames.append(np.array(img.convert("RGB")))

    return frames


# ─────────────────────────────────────────────────────────────
# VIDEO 7: HIIT Sprint Intervals
# ─────────────────────────────────────────────────────────────
def make_hiit():
    """HIIT sprint/rest intervals"""
    TOTAL_FRAMES = FPS * 20
    SPRINT_FRAMES = FPS * 4   # 30s → 4s
    REST_FRAMES = FPS * 6     # 90s → 6s
    CYCLE = SPRINT_FRAMES + REST_FRAMES

    frames = []
    for f in range(TOTAL_FRAMES):
        img = Image.new("RGBA", (W, H), BG_COLOR + (255,))
        draw = ImageDraw.Draw(img)

        # Category badge
        cat_font = get_font(18)
        draw_rounded_rect(draw, 220, 24, 420, 52, 14, DARK_GRAY, (255, 100, 80), 2)
        draw_centered_text(draw, "CARDIO", 30, cat_font, (255, 100, 80), shadow=False)

        # Title
        title_font = get_font(34)
        draw_centered_text(draw, "HIIT Sprint Intervals", 70, title_font, WHITE)

        cx, cy = W // 2, H // 2 + 10

        cycle_pos = f % CYCLE
        in_sprint = cycle_pos < SPRINT_FRAMES
        phase_t = cycle_pos / SPRINT_FRAMES if in_sprint else (cycle_pos - SPRINT_FRAMES) / REST_FRAMES

        if in_sprint:
            # Sprint - intense animation
            # Shaking effect
            shake = int(4 * math.sin(f * 0.8))
            # Speed lines
            for li in range(12):
                angle = li * 30 * math.pi / 180
                x1 = cx + int(60 * math.cos(angle))
                y1 = cy + int(60 * math.sin(angle))
                length = 40 + (f * 7 + li * 20) % 60
                x2 = cx + int((60 + length) * math.cos(angle))
                y2 = cy + int((60 + length) * math.sin(angle))
                alpha = 150 + (f * 3 + li * 15) % 100
                draw.line([(x1, y1), (x2, y2)], fill=(255, 100, 80, alpha), width=2)

            # Central icon
            r = 70 + shake
            draw.ellipse([cx - r, cy - r, cx + r, cy + r],
                        fill=(255, 100, 80, 200), outline=(255, 150, 130), width=3)
            icon_font = get_font(40)
            draw_centered_text(draw, "SPRINT", cy - 22, icon_font, WHITE)

            # Intensity bar
            intensity = 0.9 + 0.1 * math.sin(f * 0.5)
            bar_font = get_font(22, bold=False)
            draw_centered_text(draw, f"Effort: {int(intensity * 100)}%", cy + 85, bar_font, (255, 100, 80))

            secs_left = max(0, int((SPRINT_FRAMES - cycle_pos) / FPS) + 1)
            timer_font = get_font(36)
            draw_centered_text(draw, f":{secs_left:02d}", cy + 115, timer_font, WHITE)
        else:
            # Rest - calm
            r = 70
            draw.ellipse([cx - r, cy - r, cx + r, cy + r],
                        fill=DARK_GRAY + (180,), outline=GRAY, width=2)
            icon_font = get_font(40)
            draw_centered_text(draw, "REST", cy - 22, icon_font, GRAY)

            secs_left = max(0, int((REST_FRAMES - (cycle_pos - SPRINT_FRAMES)) / FPS) + 1)
            timer_font = get_font(36)
            draw_centered_text(draw, f":{secs_left:02d}", cy + 85, timer_font, WHITE)

            bar_font = get_font(22, bold=False)
            draw_centered_text(draw, "Recover • Walk or slow jog", cy + 120, bar_font, GRAY)

        # Round counter
        round_num = (f // CYCLE) + 1
        round_font = get_font(20, bold=False)
        draw_centered_text(draw, f"Round {round_num} of 8-10", H - 60, round_font, GRAY)
        draw_centered_text(draw, "Sprint 30s • Rest 90s • Repeat", H - 32, round_font, ACCENT)

        frames.append(np.array(img.convert("RGB")))

    return frames


# ─────────────────────────────────────────────────────────────
# VIDEO 8: Hip Bridge
# ─────────────────────────────────────────────────────────────
def make_hip_bridge():
    """Hip bridge rep counter with animated figure"""
    TOTAL_FRAMES = FPS * 20
    REP_FRAMES = FPS * 3  # 3s per rep

    frames = []
    for f in range(TOTAL_FRAMES):
        img = Image.new("RGBA", (W, H), BG_COLOR + (255,))
        draw = ImageDraw.Draw(img)

        # Category badge
        cat_font = get_font(18)
        draw_rounded_rect(draw, 210, 24, 430, 52, 14, DARK_GRAY, (180, 100, 255), 2)
        draw_centered_text(draw, "STRENGTH", 30, cat_font, (180, 100, 255), shadow=False)

        # Title
        title_font = get_font(36)
        draw_centered_text(draw, "Hip Bridge", 70, title_font, WHITE)

        cx, cy = W // 2, H // 2 + 10

        # Rep animation
        rep_pos = f % REP_FRAMES
        rep_t = rep_pos / REP_FRAMES
        # Up for first half, down for second half
        if rep_t < 0.4:
            bridge_t = ease_in_out(rep_t / 0.4)
        elif rep_t < 0.6:
            bridge_t = 1.0
        else:
            bridge_t = ease_in_out(1.0 - (rep_t - 0.6) / 0.4)

        # Draw simplified stick figure doing hip bridge
        # Floor line
        floor_y = cy + 80
        draw.line([(80, floor_y), (W - 80, floor_y)], fill=DARK_GRAY, width=3)

        # Figure
        fig_cx = cx
        # Feet on floor
        foot_l = fig_cx - 60
        foot_r = fig_cx + 60
        knee_h = 50  # height of knees above floor
        knee_l = (foot_l + 20, floor_y - knee_h)
        knee_r = (foot_r - 20, floor_y - knee_h)

        # Hip rises with bridge_t
        hip_rise = int(70 * bridge_t)
        hip = (fig_cx, floor_y - hip_rise)

        # Shoulders stay on floor (or rise slightly)
        shoulder_rise = int(10 * bridge_t)
        shoulder = (fig_cx - 20, floor_y - shoulder_rise)
        shoulder_r = (fig_cx + 20, floor_y - shoulder_rise)

        # Draw body
        # Legs
        draw.line([( foot_l, floor_y), knee_l], fill=(180, 100, 255), width=4)
        draw.line([knee_l, hip], fill=(180, 100, 255), width=4)
        draw.line([(foot_r, floor_y), knee_r], fill=(180, 100, 255), width=4)
        draw.line([knee_r, hip], fill=(180, 100, 255), width=4)
        # Torso
        draw.line([hip, shoulder], fill=WHITE, width=4)
        draw.line([hip, shoulder_r], fill=WHITE, width=4)
        # Arms on floor
        draw.line([shoulder, (shoulder[0] - 40, floor_y)], fill=GRAY, width=3)
        draw.line([shoulder_r, (shoulder_r[0] + 40, floor_y)], fill=GRAY, width=3)
        # Head
        head_y = floor_y - shoulder_rise - 20
        draw.ellipse([fig_cx - 55, head_y - 18, fig_cx - 19, head_y + 18],
                    fill=GRAY, outline=WHITE, width=2)

        # Hip height indicator
        if bridge_t > 0.1:
            arrow_x = fig_cx + 100
            draw.line([(arrow_x, floor_y), (arrow_x, hip[1])],
                     fill=(180, 100, 255), width=2)
            draw.polygon([(arrow_x - 6, hip[1] + 10), (arrow_x + 6, hip[1] + 10), (arrow_x, hip[1] - 2)],
                        fill=(180, 100, 255))
            h_font = get_font(18, bold=False)
            draw.text((arrow_x + 10, (floor_y + hip[1]) // 2 - 10), f"{hip_rise}px",
                     font=h_font, fill=(180, 100, 255))

        # Rep counter
        rep_num = (f // REP_FRAMES) + 1
        rep_font = get_font(28)
        draw_centered_text(draw, f"Rep {rep_num} / 15", cy + 120, rep_font, WHITE)

        # Phase
        if bridge_t > 0.5:
            phase_text = "HOLD 2s"
            phase_color = (180, 100, 255)
        elif rep_t < 0.5:
            phase_text = "LIFT"
            phase_color = ACCENT
        else:
            phase_text = "LOWER"
            phase_color = GRAY

        phase_font = get_font(32)
        draw_centered_text(draw, phase_text, cy + 155, phase_font, phase_color)

        # Bottom
        inst_font = get_font(18, bold=False)
        draw_centered_text(draw, "Squeeze glutes at top • 3 sets × 15 reps", H - 35, inst_font, GRAY)

        frames.append(np.array(img.convert("RGB")))

    return frames


# ─────────────────────────────────────────────────────────────
# VIDEO 9: Body Scan Meditation
# ─────────────────────────────────────────────────────────────
def make_meditation():
    """Body scan meditation with animated scan line"""
    TOTAL_FRAMES = FPS * 20
    SCAN_CYCLE = FPS * 10  # 10s per full scan

    body_parts = ["HEAD", "NECK", "SHOULDERS", "CHEST", "ABDOMEN", "HIPS", "LEGS", "FEET"]

    frames = []
    for f in range(TOTAL_FRAMES):
        img = Image.new("RGBA", (W, H), BG_COLOR + (255,))
        draw = ImageDraw.Draw(img)

        # Soft radial glow
        for ri in range(8):
            r = 300 - ri * 30
            alpha = int(15 - ri)
            if alpha > 0:
                draw.ellipse([W//2 - r, H//2 - r, W//2 + r, H//2 + r],
                            outline=(100, 150, 255, alpha), width=1)

        # Category badge
        cat_font = get_font(18)
        draw_rounded_rect(draw, 195, 24, 445, 52, 14, DARK_GRAY, (150, 120, 255), 2)
        draw_centered_text(draw, "MINDFULNESS", 30, cat_font, (150, 120, 255), shadow=False)

        # Title
        title_font = get_font(34)
        draw_centered_text(draw, "Body Scan Meditation", 70, title_font, WHITE)

        cx, cy = W // 2, H // 2 + 10

        # Scan progress
        scan_t = (f % SCAN_CYCLE) / SCAN_CYCLE
        part_idx = int(scan_t * len(body_parts))
        part_idx = min(part_idx, len(body_parts) - 1)
        current_part = body_parts[part_idx]

        # Simplified body outline
        body_top = cy - 100
        body_bot = cy + 100
        body_h = body_bot - body_top

        # Head
        draw.ellipse([cx - 25, body_top - 35, cx + 25, body_top + 5],
                    outline=GRAY, width=2)
        # Torso
        draw.rounded_rectangle([cx - 30, body_top + 5, cx + 30, body_top + 90],
                               radius=8, outline=GRAY, width=2)
        # Arms
        draw.line([(cx - 30, body_top + 15), (cx - 65, body_top + 70)], fill=GRAY, width=2)
        draw.line([(cx + 30, body_top + 15), (cx + 65, body_top + 70)], fill=GRAY, width=2)
        # Legs
        draw.line([(cx - 15, body_top + 90), (cx - 20, body_bot + 60)], fill=GRAY, width=2)
        draw.line([(cx + 15, body_top + 90), (cx + 20, body_bot + 60)], fill=GRAY, width=2)

        # Scan line
        scan_y = int(body_top - 35 + (body_bot + 60 - (body_top - 35)) * scan_t)
        # Glow
        for gi in range(5):
            ga = max(0, 80 - gi * 15)
            draw.line([(cx - 80, scan_y + gi), (cx + 80, scan_y + gi)],
                     fill=(150, 120, 255, ga), width=1)
            draw.line([(cx - 80, scan_y - gi), (cx + 80, scan_y - gi)],
                     fill=(150, 120, 255, ga), width=1)
        draw.line([(cx - 80, scan_y), (cx + 80, scan_y)],
                 fill=(150, 120, 255), width=2)

        # Current body part label
        part_font = get_font(40)
        draw_centered_text(draw, current_part, cy + 130, part_font, (150, 120, 255))

        # Instruction
        inst_text = "Notice sensations • Release tension • Breathe"
        inst_font = get_font(18, bold=False)
        draw_centered_text(draw, inst_text, cy + 175, inst_font, GRAY)

        # Timer
        elapsed = f / FPS
        mins = int(elapsed // 60)
        secs = int(elapsed % 60)
        timer_font = get_font(22, bold=False)
        draw_centered_text(draw, f"Session: {mins}:{secs:02d}", H - 35, timer_font, GRAY)

        frames.append(np.array(img.convert("RGB")))

    return frames


# ─────────────────────────────────────────────────────────────
# RENDER FUNCTION
# ─────────────────────────────────────────────────────────────
def render_video(frames, output_path, fps=FPS):
    """Save frames as MP4 using ffmpeg"""
    import tempfile
    tmp_dir = tempfile.mkdtemp()
    print(f"  Saving {len(frames)} frames...")

    for i, frame in enumerate(frames):
        img = Image.fromarray(frame)
        img.save(f"{tmp_dir}/frame_{i:05d}.png")

    cmd = [
        "ffmpeg", "-y",
        "-framerate", str(fps),
        "-i", f"{tmp_dir}/frame_%05d.png",
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-crf", "23",
        "-preset", "fast",
        output_path
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"  ERROR: {result.stderr[-500:]}")
    else:
        size = os.path.getsize(output_path) / 1024 / 1024
        print(f"  ✓ Saved: {output_path} ({size:.1f} MB)")

    # Cleanup
    import shutil
    shutil.rmtree(tmp_dir, ignore_errors=True)


# ─────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────
VIDEOS = [
    ("ex_kegel_hold", make_kegel_hold, 1),
    ("ex_kegel_pulse", make_kegel_pulse, 2),
    ("ex_breathing_478", make_breathing_478, 3),
    ("ex_box_breathing", make_box_breathing, 4),
    ("ex_cold_shower", make_cold_shower, 5),
    ("ex_zone2_cardio", make_zone2_cardio, 6),
    ("ex_hiit", make_hiit, 7),
    ("ex_hip_bridge", make_hip_bridge, 8),
    ("ex_meditation", make_meditation, 9),
]

if __name__ == "__main__":
    import sys
    target = sys.argv[1] if len(sys.argv) > 1 else "all"

    for name, func, db_id in VIDEOS:
        if target != "all" and target != name and target != str(db_id):
            continue
        output = f"{OUTPUT_DIR}/{name}.mp4"
        print(f"\n[{db_id}/9] Generating: {name}...")
        frames = func()
        render_video(frames, output)

    print("\n✅ All videos generated!")
