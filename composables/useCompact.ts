export default (num: number) => {
    return new Intl.NumberFormat('nl-NL', {notation: "compact" }).format(num);
}