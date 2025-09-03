export function getImageUrl(name) {
    return new URL(`../../public/images/${name}`, import.meta.url).href
}