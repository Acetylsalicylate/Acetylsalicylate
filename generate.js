const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'card-data.json');

if (!fs.existsSync(dataPath)) {
    console.error('Error: card-data.json not found!');
    process.exit(1);
}

const data = require(dataPath);

const MIME_TYPES = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
};

const PREFERRED_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

function findImageByBaseName(rawImagePath) {
    const target = rawImagePath || path.join('assets', 'cover');
    const resolvedTarget = path.isAbsolute(target)
        ? target
        : path.join(__dirname, target);

    const dir = path.dirname(resolvedTarget);
    const baseName = path.basename(resolvedTarget, path.extname(resolvedTarget)).toLowerCase();

    if (!fs.existsSync(dir)) {
        return null;
    }

    const files = fs.readdirSync(dir, { withFileTypes: true })
        .filter((entry) => entry.isFile())
        .map((entry) => entry.name);

    // Сначала ищем по приоритетным расширениям
    for (const ext of PREFERRED_EXTS) {
        const match = files.find(
            (file) =>
                path.basename(file, path.extname(file)).toLowerCase() === baseName &&
                path.extname(file).toLowerCase() === ext
        );
        if (match) {
            return path.join(dir, match);
        }
    }

    // Затем по любому другому расширению с тем же именем
    const anyMatch = files.find(
        (file) => path.basename(file, path.extname(file)).toLowerCase() === baseName
    );
    return anyMatch ? path.join(dir, anyMatch) : null;
}

// Ищем картинку по названию независимо от расширения и конвертируем в Base64
let imageStyle = "url('')";
try {
    const imagePath = findImageByBaseName(data.imagePath);
    if (imagePath && fs.existsSync(imagePath)) {
        const imageBuffer = fs.readFileSync(imagePath);
        const ext = path.extname(imagePath).toLowerCase();
        const mimeType = MIME_TYPES[ext] || 'image/jpeg';
        const base64Data = imageBuffer.toString('base64');
        imageStyle = `url('data:${mimeType};base64,${base64Data}')`;
    } else {
        console.warn('Warning: Image file not found for', data.imagePath || 'assets/cover');
    }
} catch (e) {
    console.error('Error processing image:', e);
}

// Подбираем размер шрифта в px, чтобы текст помещался без обрезки
function fitFontSize(text = '', { maxPx, minPx, comfortableChars, shrinkFactor = 0.85 }) {
    const cleanText = String(text).trim();
    if (cleanText.length <= comfortableChars) {
        return maxPx;
    }
    const ratio = comfortableChars / cleanText.length;
    const calculated = Math.round(maxPx * Math.pow(ratio, shrinkFactor));
    return Math.max(minPx, Math.min(maxPx, calculated));
}

const Card = ({ title = '', artist = '', url = '#' }) => {
    const titleFontSize = fitFontSize(title, {
        maxPx: 24,
        minPx: 12,
        comfortableChars: 11,
        shrinkFactor: 0.75
    });

    const artistFontSize = fitFontSize(artist, {
        maxPx: 14,
        minPx: 9,
        comfortableChars: 18,
        shrinkFactor: 0.7
    });

    return `
        <svg fill="none" width="362" height="165" viewBox="0 0 362 165" xmlns="http://www.w3.org/2000/svg">
            <foreignObject width="100%" height="100%">
                <div xmlns="http://www.w3.org/1999/xhtml">
                    <style>
                        * {
                            box-sizing: border-box;
                            text-transform: uppercase;
                            font-family: Helvetica, sans-serif;
                        }

                        .card {
                            display: flex;
                            align-items: center;
                            width: 362px;
                            height: 165px;
                            text-decoration: none;
                            background-color: #ffffff;
                            border-radius: 6px;
                            overflow: hidden;
                        }

                        .album-image {
                            width: 149px;
                            height: 149px;
                            margin-left: 8px;
                            border-radius: 6px;
                            background-size: cover;
                            background-position: center;
                            background-image: ${imageStyle};
                            flex-shrink: 0;
                        }

                        .card-body {
                            display: flex;
                            color: #121212;
                            padding: 0 16px 0 16px;
                            flex-direction: column;
                            justify-content: center;
                            background-color: #ffffff;
                            flex: 1;
                            min-width: 0;
                            overflow: hidden;
                        }

                        .recently-played-title {
                            width: fit-content;
                            color: #0d1117;
                            padding: 5px 10px;
                            font-size: 12px;
                            line-height: 1.1;
                            background-color: #00cf74;
                            margin: 0 0 10px 0;
                            border-radius: 4px;
                        }

                        .title-track {
                            max-width: 100%;
                            font-size: ${titleFontSize}px;
                            line-height: 1.15;
                            font-weight: bolder;
                            font-family: Arial Black, sans-serif;
                            margin: 0 0 6px 0;
                            color: #121212;
                            overflow-wrap: anywhere;
                        }

                        .artist-track {
                            max-width: 100%;
                            color: #666666;
                            font-size: ${artistFontSize}px;
                            line-height: 1.2;
                            margin: 0;
                            overflow-wrap: anywhere;
                        }
                    </style>

                    <a class="card" href="${url}" target="_blank">
                        <div class="album-image"></div>
                        <div class="card-body">
                            <h1 class="recently-played-title">
                                Recently Played
                            </h1>
                            <span class="title-track">
                                <![CDATA[${title}]]>
                            </span>
                            <span class="artist-track">
                                <![CDATA[${artist}]]>
                            </span>
                        </div>
                    </a>
                </div>
            </foreignObject>
        </svg>
    `;
};

const svgContent = Card(data);
fs.writeFileSync(path.join(__dirname, 'card.svg'), svgContent.trim());
console.log('card.svg generated successfully!');
