function formatRp(price) {
    return `Rp.${price.toLocaleString("id-ID")}`
}

module.exports = formatRp