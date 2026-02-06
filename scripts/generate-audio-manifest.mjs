/**
 * Pre-build script that scans public/audio/ and generates a manifest JSON file.
 * This avoids runtime fs.existsSync() checks that fail on Vercel (where public/
 * is served by the CDN and not available on the filesystem).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const audioDir = path.join(projectRoot, "public", "audio");
const outputPath = path.join(projectRoot, "src", "lib", "audio-manifest.json");

function generateManifest() {
  const manifest = {};

  if (!fs.existsSync(audioDir)) {
    // On Vercel, public/audio is excluded via .vercelignore, so we should
    // preserve the committed audio-manifest.json instead of overwriting it.
    console.log("[audio-manifest] No public/audio/ directory found, using existing manifest.");
    return;
  }

  const files = fs.readdirSync(audioDir).filter((f) => f.endsWith(".mp3"));

  // Also preserve existing manifest if directory exists but is empty (Vercel edge case)
  if (files.length === 0) {
    console.log("[audio-manifest] No audio files found in public/audio/, using existing manifest.");
    return;
  }

  for (const file of files) {
    const id = file.replace(/\.mp3$/, "");
    const filePath = path.join(audioDir, file);
    const stats = fs.statSync(filePath);

    manifest[id] = {
      file,
      size: stats.size,
    };
  }

  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
  console.log(`[audio-manifest] Generated manifest with ${files.length} audio files.`);
}

generateManifest();
