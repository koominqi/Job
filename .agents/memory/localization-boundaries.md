---
name: Localization boundaries
description: Why source titles stay original and language changes must not change career recommendations.
---

Translate FuturePath's own guidance and explanations, but preserve official provider names, course titles, URLs and externally supplied job-posting titles in their original language.

**Why:** The workforce brief requires traceable, verifiable recommendations. Inventing translated official titles could make resources hard to find or imply the external material is available in that language.

**How to apply:** Localize navigation, skill and curated role names, SDG labels, warnings and learning outcomes. Clearly distinguish localized guidance from external material. A new language must not change saved skill identifiers, sector values, scores or learning progress.

Every new UI literal (in `t()`, both ternary branches, or JSX title/sub/kicker/msg/body/desc/label props) and every catalog string needs a `[BM, ZH]` entry, or the i18n test fails. Chinese uses the polite 您 throughout.

**Why:** The i18n test scans the source for untranslated literals. Mixed 你 and 您 read as inconsistent.

**How to apply:** Run the test from the futurepath artifact folder with `./node_modules/.bin/tsx --test tests/i18n.test.ts`. `node --import tsx` fails there with ERR_MODULE_NOT_FOUND.
