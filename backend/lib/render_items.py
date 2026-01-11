import json
import re
from pathlib import Path

import markdown
import yaml


def render_items(folder):
    """
    Render markdown files with YAML frontmatter to JSON.

    Args:
        folder: Either 'blog' or 'projects'

    Reads from: backend/data/{folder}/*.md
    Writes to: frontend/src/data/{folder}Data.json
    """
    base = Path(__file__).resolve().parent.parent.parent
    input_dir = base / 'backend' / 'data' / folder
    output_path = base / 'frontend' / 'src' / 'data' / f"{folder}Data.json"

    markdown_files = list(input_dir.glob("*.md"))

    items = []
    for md_file in markdown_files:
        content = md_file.read_text(encoding='utf-8')

        # Extract front matter (between --- ---)
        match = re.match(r"---\n(.*?)\n---\n(.*)", content, re.DOTALL)
        if not match:
            print(f"Warning: No front matter found in {md_file.name}, skipping.")
            continue

        front_matter, body = match.groups()
        metadata = yaml.safe_load(front_matter)
        metadata["body_html"] = markdown.markdown(
            body,
            extensions=["fenced_code", "codehilite", "tables"]
        )
        items.append(metadata)

    # Sort by date/year if available (newest first)
    if folder == 'blog':
        # Sort blog posts by publishedDate if available
        items.sort(key=lambda x: x.get('publishedDate', ''), reverse=True)
    elif folder == 'projects':
        # Sort projects by year, then by featured status
        items.sort(key=lambda x: (x.get('featured', False), x.get('year', '')), reverse=True)

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(items, f, ensure_ascii=False, indent=2)

    print(f"Rendered {len(items)} {folder} items to {output_path}")
