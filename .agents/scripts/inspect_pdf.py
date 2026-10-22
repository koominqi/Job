from pathlib import Path
import fitz

doc = fitz.open("attached_assets/Domain_1_1792653753478.pdf")
print(f"Pages: {len(doc)}")
for i in range(min(4, len(doc))):
    print(f"\n--- PAGE {i + 1} ---\n{doc[i].get_text()[:9000]}")
out = Path("/tmp/domain-pdf")
out.mkdir(exist_ok=True)
doc[0].get_pixmap(matrix=fitz.Matrix(1, 1)).save(str(out / "page-1.png"))
