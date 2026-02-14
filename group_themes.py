import os
import re
import json
from collections import defaultdict

stitch_dir = r"c:\Users\Nero\nero-core-platform\stitch (1)\stitch"
theme_groups = defaultdict(list)

# Regex to find colors in code.html
color_pattern = re.compile(r'#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})')
# Regex to find font families
font_pattern = re.compile(r'fontFamily:\s*{([^}]+)}', re.DOTALL)

for root, dirs, files in os.walk(stitch_dir):
    if "code.html" in files:
        folder_name = os.path.basename(root)
        file_path = os.path.join(root, "code.html")
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
                colors = sorted(list(set(color_pattern.findall(content))))
                # Simple hash of colors to group
                color_key = ",".join(colors[:5]) # Use first 5 unique colors as a signature
                theme_groups[color_key].append(folder_name)
        except:
            pass

# Output the groups to a file
with open("theme_groups.json", "w") as f:
    json.dump(dict(theme_groups), f, indent=2)

print(f"Found {len(theme_groups)} unique color signatures.")
