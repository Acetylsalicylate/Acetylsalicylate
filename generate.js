const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'card-data.json');

if (!fs.existsSync(dataPath)) {
    console.error('Error: card-data.json not found!');
    process.exit(1);
}

const data = require(dataPath);

let imageStyle = "url('')";
try {
    const imagePath = path.join(__dirname, data.imagePath || 'assets/cover.jpg');
    if (fs.existsSync(imagePath)) {
        const imageBuffer = fs.readFileSync(imagePath);
        const ext = path.extname(imagePath).replace('.', '').toLowerCase();
        const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
        const base64Data = imageBuffer.toString('base64');
        imageStyle = `url('data:${mimeType};base64,${base64Data}')`;
    } else {
        console.warn('Warning: Image file not found at', imagePath);
    }
} catch (e) {
    console.error('Error processing image:', e);
}

const Card = ({ title, artist, url }) => {
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
                            padding: 0 20px 0 18px;
                            flex-direction: column;
                            justify-content: center;
                            background-color: #ffffff;
                            flex: 1;
                            overflow: hidden;
                        }

                        .recently-played-title {
                            width: fit-content;
                            color: #0d1117;
                            padding: 5px 10px;
                            font-size: 0.8rem;
                            line-height: 1.1;
                            background-color: #00cf74;
                            margin: 0 0 10px 0;
                            border-radius: 4px;
                        }

                        .title-track {
                            max-width: 100%;
                            font-size: 1.55rem;
                            line-height: 1.15;
                            overflow: hidden;
                            font-weight: bolder;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            font-family: Arial Black, sans-serif;
                            margin: 0 0 6px 0;
                            color: #121212;
                        }

                        .artist-track {
                            max-width: 100%;
                            color: #666666;
                            font-size: 0.85rem;
                            line-height: 1.2;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            margin: 0;
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
