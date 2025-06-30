import { Howl, Howler } from 'howler';

const sound = new Howl({
    src: ['src/defaultSounds/snd_txt1.mp3'],
    preload: true,
    volume: 0.8,
});

// Store timeout IDs per element to support multiple typewriters if needed
const typeWriterTimeouts: { [key: string]: number | undefined } = {};

export function typeWriter(
    elementId: string,
    text: string,
    speed: number,
    customSound?: boolean,
    soundFile?: string,
    format?: string[]
) {
    let i = 0;
    const targetElement = document.getElementById(elementId) as HTMLElement;
    targetElement.innerHTML = '';
    targetElement.style.whiteSpace = 'pre-wrap';

    console.log(soundFile)
    const uploadedSound = new Howl({
        src: [soundFile || ''],
        volume: 0.8,
        ...(format ? { format } : {})
    });

    // Clear any previous typing timeout for this element
    if (typeWriterTimeouts[elementId]) {
        clearTimeout(typeWriterTimeouts[elementId]);
    }

    function soundBox() {

        if (customSound) {
            if (soundFile) {
                uploadedSound.stop();
                uploadedSound.play();
            }

        } else {
            sound.stop();
            sound.play();
        }
    }

    function type() {
        if (i < text.length) {
            const char = text.charAt(i);
            targetElement.innerHTML += char;
            i++;

            if (!/\s/.test(char)) {
                soundBox();
            }
            // Store the timeout ID so it can be cleared if needed
            typeWriterTimeouts[elementId] = window.setTimeout(type, speed);
        } else {
            // Clean up after finishing
            typeWriterTimeouts[elementId] = undefined;
        }
    }
    type();
}
// Usage:
// <p id="myText"></p>
// typeWriter("myText", "Hello, World!", 100); // types "Hello, World!" at 100ms per character