// Sesuai data dari Excel baris 6-8
export const GRADE_PROPERTIES = {
  MGP10: { E: 1100, E_90: 110, G: 687.5, G_90: 62.5 },
  MGP12: { E: 1100, E_90: 110, G: 687.5, G_90: 62.5 } 
};

// Pengganti 'interface CLTLayerType' -> Pakai Class OOP
export class CLTLayer {
  /**
   * @param {number} layerNumber 
   * @param {number} thickness 
   * @param {0 | 90} orientation 
   * @param {'MGP10' | 'MGP12'} grade 
   */
  constructor(layerNumber, thickness, orientation, grade) {
    this.layerNumber = Number(layerNumber);
    this.thickness = Number(thickness);
    this.orientation = Number(orientation); // 0 atau 90
    this.grade = grade;
  }

  // Lu bahkan bisa pasang method OOP di sini biar makin canggih
  getMaterialProperties() {
    return GRADE_PROPERTIES[this.grade];
  }
}

// Pengganti 'type CLTLayupType' -> Pakai Class Collection
export class CLTLayup {
  constructor() {
    /** @type {CLTLayer[]} */
    this.layers = [];
  }

  addLayer(layer) {
    if (layer instanceof CLTLayer) {
      this.layers.push(layer);
    } else {
      throw new Error("Hanya bisa menambahkan instance dari CLTLayer");
    }
  }

  get length() {
    return this.layers.length;
  }
}