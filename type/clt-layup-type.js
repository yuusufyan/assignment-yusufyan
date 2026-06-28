class CLTLayupType {
    constructor() {
        this.name = 'CLT Layup';
        /**
         * @type {CLTLayerType[]}
         */
        this.layers = [];
    }

    addLayer(layer) {
        this.layers.push(layer);
    }

    getLayers() {
        return this.layers;
    }

    // Penjagaan (Safeguard) untuk Metode Gamma
    validateGammaMethod() {
        const count = this.layers.length;
        if (count !== 3 && count !== 5) {
            throw new Error("Metode Gamma pada kalkulator ini hanya mendukung 3 atau 5 layer.");
        }
        // Validasi lapisan ganjil adalah longitudinal (0), lapisan genap adalah cross (90)
        this.layers.forEach((layer, index) => {
            const expectedOrientation = (index % 2 === 0) ? 0 : 90;
            if (layer.orientation !== expectedOrientation) {
                throw new Error(`Layer ${index + 1} harus memiliki orientasi ${expectedOrientation} derajat.`);
            }
        });
    }

    // Penjagaan (Safeguard) untuk Metode Shear Analogy
    validateShearAnalogy() {
        const count = this.layers.length;
        if (count < 3 || count > 9) {
            throw new Error("Shear Analogy hanya mendukung 3 sampai 9 layer.");
        }
        
        // Pengecekan Simetri dari atas ke bawah
        for (let i = 0; i < Math.floor(count / 2); i++) {
            const topLayer = this.layers[i];
            const bottomLayer = this.layers[count - 1 - i];
            
            if (topLayer.thickness !== bottomLayer.thickness || 
                topLayer.orientation !== bottomLayer.orientation || 
                topLayer.grade !== bottomLayer.grade) {
                throw new Error("Konfigurasi layer untuk Shear Analogy harus simetris (ketebalan, orientasi, dan grade yang sama dari luar ke dalam).");
            }
        }
    }
}