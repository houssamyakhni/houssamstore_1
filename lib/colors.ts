
export const getColorHex = (colorName: string): string => {
    if (!colorName) return "#CCCCCC";

    const lower = colorName.toLowerCase().trim();

    // Check for hex code without hash (3 or 6 characters)
    const hexPattern = /^([0-9A-F]{3}){1,2}$/i;
    if (hexPattern.test(lower)) {
        return `#${lower}`;
    }

    const colors: Record<string, string> = {
        "black": "#000000",
        "white": "#FFFFFF",
        "red": "#FF0000",
        "blue": "#0000FF",
        "green": "#008000",
        "grey": "#808080",
        "gray": "#808080",
        "silver": "#C0C0C0",
        "gold": "#FFD700",
        "orange": "#FFA500",
        "purple": "#800080",
        "pink": "#FFC0CB",
        "yellow": "#FFFF00",
        "brown": "#A52A2A",
        "beige": "#F5F5DC",

        // Common Arabic Color Names (Transliterated and Script)
        "ahmar": "#FF0000", "أحمر": "#FF0000",
        "aswad": "#000000", "أسود": "#000000",
        "abyad": "#FFFFFF", "أبيض": "#FFFFFF",
        "azraq": "#0000FF", "أزرق": "#0000FF",
        "akhdar": "#008000", "أخضر": "#008000",
        "asfar": "#FFFF00", "أصفر": "#FFFF00",
        "burtuqali": "#FFA500", "برتقالي": "#FFA500",
        "zahri": "#FFC0CB", "زهري": "#FFC0CB",
        "banafsaji": "#800080", "بنفسجي": "#800080",
        "ramadi": "#808080", "رمادي": "#808080",
        "bunni": "#A52A2A", "بني": "#A52A2A",
        "khamri": "#800000", "خمري": "#800000",
        "kahli": "#000080", "كحلي": "#000080",
        "fiddi": "#C0C0C0", "فضي": "#C0C0C0",
        "thahabi": "#FFD700", "ذهبي": "#FFD700",

        // Specific Variants from Seeding
        "midnight black": "#000000",
        "navy blue": "#000080",
        "pearl white": "#F3F1E7",
        "charcoal black": "#36454F",
        "crimson red": "#DC143C",
        "midnight blue": "#191970",
        "dark grey": "#A9A9A9",
        "retro beige": "#D6C68B",
        "white mint": "#E0FFF4",
        "bright orange": "#FF5F1F",
        "electric blue": "#003399",
        "neon green": "#39FF14",
        "icy white": "#F0F8FF",
        "lavender": "#E6E6FA",
        "phantom black": "#191919",
        "matte black": "#28282B",
        "teal blue": "#367588",
        "graphite grey": "#4B4B4B",
        "rose gold": "#B76E79",
        "sky blue": "#87CEEB",
        "space grey": "#717378",

        // Fallbacks for Arabic phonetic names if present (though seeded English)
        "cream wajh": "#FFFDD0", // Cream
        "hmra": "#990000", // Dark Red
        "perfium": "#FFD700", // Gold
        "shampo": "#FFFFFF",
        "standard": "#CCCCCC",

        // Other Common
        "navy": "#000080",
        "lime": "#00FF00",
        "cyan": "#00FFFF",
        "magenta": "#FF00FF",
        "maroon": "#800000",
        "olive": "#808000",
        "teal": "#008080",
        "violet": "#EE82EE",
    };

    if (colors[lower]) {
        return colors[lower];
    }

    // Fallback: Try stripping spaces to support "Dark Red" -> "darkred" which is valid CSS
    const noSpace = lower.replace(/\s+/g, '');
    // Regex to check if it's potentially a valid simple color name (letters only)
    if (/^[a-z]+$/.test(noSpace)) {
        return noSpace;
    }

    return colorName;
};
