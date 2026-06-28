/**
 * Class Panel Properties is used to calculate the properties of panel CLT Layup.
 * Panel properties can calculate
 *  - Shear Analogy Method
 *  - Gamma Method
 * 
 * How to use : 
 * calculate(CLTLayup) => PanelPropertiesType
 */

// Base class for panel properties
class PanelProperties {
    calculate(cltLayup) {
        throw new Error("Method calculate() harus diimplementasikan oleh subclass.");
    }
}

class ShearAnalogyMethod extends PanelProperties {
    calculate(cltLayup) {
        // Penjagaan untuk Shear Analogy
        cltLayup.validateShearAnalogy();
        
        const result = new PanelPropertiesType();
        result.info = "Validasi Shear Analogy Berhasil (Simetris & 3-9 Layer). Namun kalkulasi logika rumit Shear Analogy belum diimplementasikan sepenuhnya pada demo ini.";
        return result;
    }
}

class GammaMethod extends PanelProperties {
    constructor(spanLength) {
        super();
        this.spanLength = spanLength || 3000; // default 3000 mm (3 meter) jika tidak diset
    }

    calculate(cltLayup) {
        // Penjagaan untuk Gamma Method
        cltLayup.validateGammaMethod();
        
        const layers = cltLayup.getLayers();
        const n = layers.length;
        const b = 1000; // Analisis lebar standar 1m (1000mm)
        const L = this.spanLength;

        let totalHeight = 0;
        layers.forEach(layer => totalHeight += layer.thickness);

        const gammas = [];
        const EAs = [];
        const EIs = [];
        const distances = []; // jarak (z) titik tengah layer dari bawah
        
        let currentZ = 0;
        for (let i = 0; i < n; i++) {
            let layer = layers[i];
            let z = currentZ + (layer.thickness / 2);
            distances.push(z);
            currentZ += layer.thickness;

            let props = layer.getMaterialProperties();
            
            if (layer.orientation === 0) { // Longitudinal layer
                let Ei = props.E;
                let Ai = b * layer.thickness;
                let Ii = (b * Math.pow(layer.thickness, 3)) / 12;
                EAs.push(Ei * Ai);
                EIs.push(Ei * Ii);
            } else { // Cross layer
                EAs.push(0);
                EIs.push(0);
            }
        }

        // Kalkulasi Gamma
        if (n === 3) {
            let t_cross = layers[1].thickness;
            let GR = layers[1].getMaterialProperties().G_90;
            let K = (GR * b) / t_cross;
            
            let gamma1 = 1 / (1 + (Math.PI * Math.PI * EAs[0]) / (L * L * K));
            let gamma3 = 1 / (1 + (Math.PI * Math.PI * EAs[2]) / (L * L * K));
            
            gammas.push(gamma1, 1, gamma3);
        } else if (n === 5) {
            let t_cross1 = layers[1].thickness;
            let GR1 = layers[1].getMaterialProperties().G_90;
            let K1 = (GR1 * b) / t_cross1;

            let t_cross2 = layers[3].thickness;
            let GR2 = layers[3].getMaterialProperties().G_90;
            let K2 = (GR2 * b) / t_cross2;

            let gamma1 = 1 / (1 + (Math.PI * Math.PI * EAs[0]) / (L * L * K1));
            let gamma5 = 1 / (1 + (Math.PI * Math.PI * EAs[4]) / (L * L * K2));
            let gamma3 = 1; // layer tegak lurus (longitudinal tengah) pada 5 layer CLT sebagai referensi slip
            
            gammas.push(gamma1, 1, gamma3, 1, gamma5);
        }

        // Hitung sumbu netral (Neutral Axis)
        let numerator = 0;
        let denominator = 0;
        for (let i = 0; i < n; i++) {
            if (layers[i].orientation === 0) {
                numerator += gammas[i] * EAs[i] * distances[i];
                denominator += gammas[i] * EAs[i];
            }
        }
        let z_neutral = numerator / denominator;

        // Hitung EI_eff
        let EI_eff = 0;
        for (let i = 0; i < n; i++) {
            if (layers[i].orientation === 0) {
                let ai = distances[i] - z_neutral;
                EI_eff += (EIs[i] + gammas[i] * EAs[i] * Math.pow(ai, 2));
            }
        }

        const result = new PanelPropertiesType();
        result.EI_eff = EI_eff;
        result.totalHeight = totalHeight;
        result.info = `Perhitungan Gamma (Span ${L} mm) Selesai.`;
        return result;
    }
}
