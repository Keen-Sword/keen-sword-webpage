var fontDownloaded = false;
var furiganaMode = "kana";
const japaneseRegexBasic = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]+/g;
const japaneseRegexSplit = /([\u3040-\u309F\u30A0-\u30FF]+|[\u4E00-\u9FFF])/g;
const kanaPairRegex = /([\u3040-\u309F\u30A0-\u30FF][ゃゅょ]|[\u3040-\u309F\u30A0-\u30FF])/g;
const kanaRegex = /[\u3040-\u309F\u30A0-\u30FF]/g;

function addFurigana(text: string[], furigana: Record<string, string>): string {
    let result = "";
    text.forEach(match => {
        if (kanaRegex.test(match)) {
            if (furiganaMode === "romaji") {
                match.match(kanaPairRegex)!.forEach(subMatch => {
                    result += `<ruby>${subMatch}<rt>${furigana[subMatch] ?? "*"}</rt></ruby>`
                })
            }
            else {
                result += `${match}`;
            }
            return;
        }

        result += `<ruby>${match}<rt>${furigana[match] ?? "*"}</rt></ruby>`
    });
    return result;
}

function formatFurigana(data: Record<string, string>) {
    if (furiganaMode === "kana")
        return data;
    if (furiganaMode === "romaji")
        return convertToRomaji(data);
    if (furiganaMode === "none")
        return {};

    console.warn("Invalid furigana mode, falling back to kana!");
    localStorage.setItem("furigana", "kana");
    return data;
}
function convertToRomaji(oldFurigana: Record<string, string>): Record<string, string> {
    const kanaToRomaji: Record<string, string> = {
        // Basic Hiragana
        あ: 'a', い: 'i', う: 'u', え: 'e', お: 'o', ん: '', っ: '',
        か: 'ka', き: 'ki', く: 'ku', け: 'ke', こ: 'ko',
        さ: 'sa', し: 'shi', す: 'su', せ: 'se', そ: 'so',
        た: 'ta', ち: 'chi', つ: 'tsu', て: 'te', と: 'to',
        な: 'na', に: 'ni', ぬ: 'nu', ね: 'ne', の: 'no',
        は: 'ha', ひ: 'hi', ふ: 'fu', へ: 'he', ほ: 'ho',
        ま: 'ma', み: 'mi', む: 'mu', め: 'me', も: 'mo',
        や: 'ya', ゆ: 'yu', よ: 'yo',
        ら: 'ra', り: 'ri', る: 'ru', れ: 're', ろ: 'ro',
        わ: 'wa', を: 'wo',
        が: 'ga', ぎ: 'gi', ぐ: 'gu', げ: 'ge', ご: 'go',
        ざ: 'za', じ: 'ji', ず: 'zu', ぜ: 'ze', ぞ: 'zo',
        だ: 'da', ぢ: 'ji', づ: 'zu', で: 'de', ど: 'do',
        ば: 'ba', び: 'bi', ぶ: 'bu', べ: 'be', ぼ: 'bo',
        ぱ: 'pa', ぴ: 'pi', ぷ: 'pu', ぺ: 'pe', ぽ: 'po',

        // Combo sounds
        きゃ: 'kya', きゅ: 'kyu', きょ: 'kyo',
        しゃ: 'sha', しゅ: 'shu', しょ: 'sho',
        ちゃ: 'cha', ちゅ: 'chu', ちょ: 'cho',
        にゃ: 'nya', にゅ: 'nyu', にょ: 'nyo',
        ひゃ: 'hya', ひゅ: 'hyu', ひょ: 'hyo',
        みゃ: 'mya', みゅ: 'myu', みょ: 'myo',
        りゃ: 'rya', りゅ: 'ryu', りょ: 'ryo',
        ぎゃ: 'gya', ぎゅ: 'gyu', ぎょ: 'gyo',
        じゃ: 'ja', じゅ: 'ju', じょ: 'jo',
        びゃ: 'bya', びゅ: 'byu', びょ: 'byo',
        ぴゃ: 'pya', ぴゅ: 'pyu', ぴょ: 'pyo',
    };

    const longVowelMap: Record<string, string> = {
        'aa': 'ā',
        'ee': 'ē',
        'ii': 'ī',
        'oo': 'ō',
        'ou': 'ō',
        'uu': 'ū',
    };

    const newFurigana: Record<string, string> = {};

    for (const [kanji, kana] of Object.entries(oldFurigana)) {
        let romaji = '';
        let i = 0;

        while (i < kana.length) {
            if (kana[i] === 'っ') {
                const nextKana = kana.slice(i + 1, i + 3);
                const nextSingle = kana.slice(i + 1, i + 2);
                const nextRomaji = kanaToRomaji[nextKana] || kanaToRomaji[nextSingle];
                if (nextRomaji) {
                    romaji += nextRomaji[0] + nextRomaji;
                    i += nextKana in kanaToRomaji ? 2 : 1;
                    continue;
                } else {
                    i++;
                    continue;
                }
            } else if (kana[i] === 'ん') {
                const nextKana = kana.slice(i + 1, i + 3);
                const nextSingle = kana.slice(i + 1, i + 2);
                const nextRomaji = kanaToRomaji[nextKana] || kanaToRomaji[nextSingle] || '';
                if (/^[aiueoy]/.test(nextRomaji)) {
                    romaji += "n'";
                } else {
                    romaji += 'n';
                }
                i++;
                continue;
            }

            const twoChar = kana.slice(i, i + 2);
            if (kanaToRomaji[twoChar]) {
                romaji += kanaToRomaji[twoChar];
                i += 2;
                continue;
            }

            const oneChar = kana[i];
            romaji += kanaToRomaji[oneChar] || oneChar;
            i++;
        }

        for (const [pattern, macron] of Object.entries(longVowelMap)) {
            const regex = new RegExp(pattern, 'g');
            romaji = romaji.replace(regex, macron);
        }

        romaji = romaji.charAt(0) + romaji.slice(1);

        newFurigana[kanji] = romaji;
    }

    return {
        ...newFurigana,
        ...kanaToRomaji
    }
}
async function getFurigana(): Promise<Record<string, string>> {
    let fullCache = {} as Record<string, Record<string, string>>;

    const path = window.location.pathname;
    const cachedString = localStorage.getItem("furigana-cache");
    const cacheAge = Number.parseFloat(localStorage.getItem("furigana-age") ?? "0");
    const currentTime = new Date().getTime();
    const passedTime = currentTime - cacheAge;

    if (cachedString && passedTime < 1000 * 60 * 60 * 24) {
        fullCache = JSON.parse(cachedString);
        if (fullCache[path]) {
            console.debug("Loading furigana from cache..")
            return formatFurigana(fullCache[path]);
        }
    }

    console.debug("Loading furigana from server..")
    return await fetch("../data/furigana.json", { method: "GET" })
    .then(response => {
        return response.json();
    })
    .then(json => {
        fullCache = json;
        localStorage.setItem("furigana-age", `${currentTime}`);
        localStorage.setItem("furigana-cache", JSON.stringify(fullCache));
        return formatFurigana(fullCache[path] ?? {});
    });
}

export async function japaneseTextProcessing(): Promise<void> {
    furiganaMode = localStorage.getItem("furigana") ?? "kana";
    const startTime = performance.now();
    const furigana = await getFurigana();
    const potentialTexts = document.querySelector("main")?.querySelectorAll("p, li") ?? [];

    potentialTexts.forEach(paragraph => {
        const originalText = paragraph.textContent ?? "";
        let modified = false;

        const newHTML = originalText.replace(japaneseRegexBasic, match => {
            const subMatches = match.match(japaneseRegexSplit);
            let result = "";
            modified = true;

            if (!subMatches)
                return "";
            if (subMatches.length === 1 && furiganaMode !== "romaji")
                result = match;
            else
                result = furiganaMode !== "none" ? addFurigana(subMatches, furigana) : subMatches.join('');
            return `<span class="jp">${result}</span>`
        });

        if (modified) {
            paragraph.innerHTML = newHTML;

            if (!fontDownloaded) {
                const link = document.createElement("link");
                link.href = "https://fonts.googleapis.com/css?family=Noto+Sans+JP:400";
                link.rel = "stylesheet";
                document.head.appendChild(link);
                fontDownloaded = true;
            }
        }
    });

    const endTime = performance.now();
    console.log(`Took ${endTime - startTime}ms to create furigana.`)
}