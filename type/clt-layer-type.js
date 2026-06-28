class CLTLayerType {
    /**
     * @param {number} layerNumber 
     * @param {number} thickness 
     * @param {0 | 90} orientation 
     * @param {'MGP10' | 'MGP12'} grade 
     */
    constructor(layerNumber, thickness, orientation, grade) {
        if (![0, 90].includes(Number(orientation))) {
            throw new Error("Orientasi layer harus 0 atau 90 derajat.");
        }
        if (Number(thickness) <= 0) {
            throw new Error("Ketebalan layer harus lebih besar dari 0.");
        }

        this.layerNumber = Number(layerNumber);
        this.thickness = Number(thickness);
        this.orientation = Number(orientation);
        this.grade = grade;
    }
    
    // OOP Method untuk mendapatkan properti material layer ini
    getMaterialProperties() {
        return MaterialGrade.getProperties(this.grade);
    }
}