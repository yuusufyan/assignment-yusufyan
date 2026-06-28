const GRADE_PROPERTIES = {
    'MGP10': { E: 1100, E_90: 110, G: 687.5, G_90: 62.5 },
    'MGP12': { E: 1100, E_90: 110, G: 687.5, G_90: 62.5 }
};

class MaterialGrade {
    static getProperties(grade) {
        if (!GRADE_PROPERTIES[grade]) {
            throw new Error(`Grade material ${grade} tidak ditemukan.`);
        }
        return GRADE_PROPERTIES[grade];
    }
}