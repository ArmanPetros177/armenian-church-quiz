import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, 'public', 'images', 'churches');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Uses Wikimedia API to get image URLs via imageinfo endpoint, then downloads
const churchFiles = [
  { id: 1,  file: "Etchmiadzin_cathedral.jpg" },
  { id: 2,  file: "Khor_Virap_monastery.jpg" },
  { id: 3,  file: "Geghard_monastery.jpg" },
  { id: 4,  file: "Tatev_Monastery.jpg" },
  { id: 5,  file: "Sevanavank.jpg" },
  { id: 6,  file: "Noravank.jpg" },
  { id: 7,  file: "Haghpat_monastery.jpg" },
  { id: 8,  file: "Sanahin_monastery.jpg" },
  { id: 9,  file: "Goshavank.jpg" },
  { id: 10, file: "Haghartsin.jpg" },
  { id: 11, file: "Saghmosavank.jpg" },
  { id: 12, file: "Hovhannavank.jpg" },
  { id: 13, file: "Zvartnots_cathedral.jpg" },
  { id: 14, file: "Saint_Hripsime_Church.jpg" },
  { id: 15, file: "Saint_Gayane_church.jpg" },
  { id: 16, file: "Shoghakat_church.jpg" },
  { id: 17, file: "Kecharis_monastery.jpg" },
  { id: 18, file: "Hayravank_monastery.jpg" },
  { id: 19, file: "Karmravor_church.jpg" },
  { id: 20, file: "Akhtala_monastery.jpg" },
  { id: 21, file: "Kobayr_monastery.jpg" },
  { id: 22, file: "Odzun_church.jpg" },
  { id: 23, file: "Gandzasar_monastery.jpg" },
  { id: 24, file: "Dadivank.jpg" },
  { id: 25, file: "Amaras_Monastery.jpg" },
  { id: 26, file: "Marmashen_monastery.jpg" },
  { id: 27, file: "Harichavank.jpg" },
  { id: 28, file: "Saint_Gregory_Illuminator_Cathedral_Yerevan.jpg" },
  { id: 29, file: "Vorotnavank.jpg" },
  { id: 30, file: "Vahanavanq.jpg" },
  { id: 31, file: "Tegher_monastery.jpg" },
  { id: 32, file: "Oshakan_Mashtots_church.jpg" },
  { id: 33, file: "Spitakavor_monastery.jpg" },
  { id: 34, file: "Gtichavank.jpg" },
  { id: 35, file: "Vahramashen_church_Amberd.jpg" },
  { id: 36, file: "Tsaghats_kar.jpg" },
  { id: 37, file: "Makaravank.jpg" },
  { id: 38, file: "Kirants_Monastery.jpg" },
  { id: 39, file: "Sisian_church.jpg" },
  { id: 40, file: "Aruch_cathedral.jpg" },
  { id: 41, file: "Mastara_church.jpg" },
  { id: 42, file: "Tsitsernavank.jpg" },
  { id: 43, file: "Surb_Sarkis_Yerevan.jpg" },
  { id: 44, file: "Zoravor_Surb_Astvatsatsin.jpg" },
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const options = {
      headers: {
        'User-Agent': 'ChurchQuizBot/1.0 (educational project; nodejs)',
        'Accept': 'application/json'
      }
    };
    protocol.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function downloadBinary(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith('https') ? https : http;
    const options = {
      headers: {
        'User-Agent': 'ChurchQuizBot/1.0 (educational project; nodejs)',
        'Accept': 'image/*'
      }
    };
    const req = protocol.get(url, options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        try { fs.unlinkSync(dest); } catch {}
        return downloadBinary(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        try { fs.unlinkSync(dest); } catch {}
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    });
    req.setTimeout(30000, () => { req.destroy(); file.close(); reject(new Error('Timeout')); });
    req.on('error', (err) => { try { fs.unlinkSync(dest); } catch {} reject(err); });
    file.on('error', (err) => { try { fs.unlinkSync(dest); } catch {} reject(err); });
  });
}

async function getImageUrl(filename) {
  const encoded = encodeURIComponent(filename.replace(/ /g, '_'));
  const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=File:${encoded}&prop=imageinfo&iiprop=url&format=json`;
  const data = await fetchJson(apiUrl);
  const pages = data?.query?.pages;
  if (!pages) throw new Error('No pages in API response');
  const page = Object.values(pages)[0];
  const imageUrl = page?.imageinfo?.[0]?.url;
  if (!imageUrl) throw new Error(`No imageinfo URL for ${filename}`);
  return imageUrl;
}

async function main() {
  console.log(`\nFetching image URLs via Wikipedia API and downloading...\n`);

  let ok = 0, fail = 0;
  const results = [];

  for (const church of churchFiles) {
    const dest = path.join(outputDir, `${church.id}.jpg`);

    // Skip already downloaded
    if (fs.existsSync(dest) && fs.statSync(dest).size > 10000) {
      const size = Math.round(fs.statSync(dest).size / 1024);
      console.log(`  ⏭ [${String(church.id).padStart(2, '0')}] Already exists (${size} KB)`);
      results.push({ id: church.id, ok: true });
      ok++;
      continue;
    }

    try {
      const imageUrl = await getImageUrl(church.file);
      await downloadBinary(imageUrl, dest);
      const size = Math.round(fs.statSync(dest).size / 1024);
      console.log(`  ✓ [${String(church.id).padStart(2, '0')}] ${size} KB  — ${church.file}`);
      results.push({ id: church.id, ok: true });
      ok++;
    } catch (err) {
      console.error(`  ✗ [${String(church.id).padStart(2, '0')}] FAILED — ${err.message} (${church.file})`);
      results.push({ id: church.id, ok: false });
      fail++;
    }

    // Polite delay to avoid rate limiting
    await sleep(800);
  }

  console.log(`\n────────────────────────`);
  console.log(`  OK: ${ok} / ${churchFiles.length}`);
  if (fail > 0) {
    const failedIds = results.filter(r => !r.ok).map(r => r.id);
    console.log(`  Failed IDs: ${failedIds.join(', ')}`);
  }
  console.log(`────────────────────────\n`);
}

main();
