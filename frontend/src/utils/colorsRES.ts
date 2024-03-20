export const defaultResColors = [
    '#D0940C', // Duller orange
    '#538181', // RES sage
    '#88AA22', // Green
    '#FDB813', // Yello
    'lightgrey', // Gridlines
    '#CD3023', // Red
    '#7686C2', // RES blue
    '#E87511', // RES orange
    'darkgrey', // Dark grey
    '#489C54', // Duller green
    '#805C0C', // Brown
];

export function getRandomResColor() {
    return defaultResColors[
        Math.floor(Math.random() * defaultResColors.length)
    ];
}
