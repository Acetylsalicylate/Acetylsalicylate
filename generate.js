const fs = require('fs');
const path = require('path');
const data = require('./card-data.json');

const Card = ({ title, artist, image, url }) => {
    return `
        <svg fill="none" width="500" height="150" viewBox="0 0 500 150" xmlns="http://www.w3.org/2000/svg">
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
                            width: 500px;
                            height: 150px;
                            text-decoration: none;
                        }

                        .album-image {
                            height: 100%;
                            aspect-ratio: 1/1;
                            background-size: cover;
                            background-position: center;
                            background-image: ${image};
                        }

                        .card-body {
                            display: flex;
                            color: white;
                            padding: 0 24px;
                            flex-direction: column;
                            justify-content: center;
                            background-color: #121212;
                            width: calc(500px - 150px);
                        }

                        .recently-played-title {
                            width: fit-content;
                            color: #0d1117;
                            padding: 4px 8px;
                            font-size: 0.7rem;
                            background-color: #00cf74;
                            margin: 0 0 8px 0;
                        }

                        .title-track {
                            max-width: 300px;
                            font-size: 1.3rem;
                            overflow: hidden;
                            font-weight: bolder;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            font-family: Arial Black, sans-serif;
                            margin: 0 0 4px 0;
                        }

                        .artist-track {
                            max-width: 300px;
                            opacity: 0.7;
                            font-size: 0.7rem;
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

// Записываем результат в card.svg
const svgContent = Card(data);
fs.writeFileSync(path.join(__dirname, 'card.svg'), svgContent.trim());
console.log('card.svg generated successfully!');
