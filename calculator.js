document.addEventListener("DOMContentLoaded", () => {
    const layerBody = document.getElementById("layerBody");
    const btnAddLayer = document.getElementById("btnAddLayer");
    const methodSelect = document.getElementById("methodSelect");
    const spanInputContainer = document.getElementById("spanInputContainer");
    const calculatorForm = document.getElementById("calculatorForm");
    
    const errorAlert = document.getElementById("errorAlert");
    const resultContainer = document.getElementById("resultContainer");
    const noResultState = document.getElementById("noResultState");
    const resultInfo = document.getElementById("resultInfo");
    const resultHeight = document.getElementById("resultHeight");
    const resultEI = document.getElementById("resultEI");

    let layerCount = 0;

    // Fungsi untuk menambah baris tabel layer
    function addLayerRow(grade = "MGP10", thickness = 35, orientation = 0) {
        layerCount++;
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${layerCount}</strong></td>
            <td>
                <select class="form-select grade-select">
                    <option value="MGP10" ${grade === 'MGP10' ? 'selected' : ''}>MGP 10</option>
                    <option value="MGP12" ${grade === 'MGP12' ? 'selected' : ''}>MGP 12</option>
                </select>
            </td>
            <td>
                <input type="number" class="form-control thickness-input" value="${thickness}" min="1">
            </td>
            <td>
                <select class="form-select orientation-select">
                    <option value="0" ${orientation === 0 ? 'selected' : ''}>0&deg; (Longitudinal)</option>
                    <option value="90" ${orientation === 90 ? 'selected' : ''}>90&deg; (Cross)</option>
                </select>
            </td>
            <td>
                <button type="button" class="btn btn-danger btn-sm btn-remove-layer">Hapus</button>
            </td>
        `;
        layerBody.appendChild(tr);
        updateLayerNumbers();
    }

    // Fungsi untuk mengupdate nomor layer agar selalu urut
    function updateLayerNumbers() {
        const rows = layerBody.querySelectorAll("tr");
        layerCount = 0;
        rows.forEach(row => {
            layerCount++;
            row.querySelector("td:first-child strong").innerText = layerCount;
        });
    }

    // Event saat tombol Add Layer ditekan
    btnAddLayer.addEventListener("click", () => {
        // Otomatis berselang-seling orientasi (jika layer ganjil 0, jika genap 90)
        let defaultOrientation = (layerCount % 2 === 0) ? 0 : 90;
        addLayerRow("MGP10", 35, defaultOrientation);
    });

    // Event Delegasi untuk menghapus layer
    layerBody.addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-remove-layer")) {
            e.target.closest("tr").remove();
            updateLayerNumbers();
        }
    });

    // Event saat dropdown method berubah (Hide/Show Span)
    methodSelect.addEventListener("change", (e) => {
        if (e.target.value === "gamma") {
            spanInputContainer.classList.remove("d-none");
        } else {
            spanInputContainer.classList.add("d-none");
        }
    });

    // Inisialisasi awal (3 layer default)
    addLayerRow("MGP10", 35, 0);
    addLayerRow("MGP10", 35, 90);
    addLayerRow("MGP10", 35, 0);

    // Event Form Submit (Kalkulasi)
    calculatorForm.addEventListener("submit", (e) => {
        e.preventDefault();
        errorAlert.classList.add("d-none");
        resultContainer.classList.add("d-none");
        noResultState.classList.remove("d-none");

        try {
            // 1. Kumpulkan Data dari UI dan buat OOP Object
            const layup = new CLTLayupType();
            const rows = layerBody.querySelectorAll("tr");
            
            rows.forEach((row, index) => {
                const grade = row.querySelector(".grade-select").value;
                const thickness = parseFloat(row.querySelector(".thickness-input").value);
                const orientation = parseInt(row.querySelector(".orientation-select").value);
                
                // Buat layer berdasarkan kelas CLTLayerType
                const layer = new CLTLayerType(index + 1, thickness, orientation, grade);
                layup.addLayer(layer);
            });

            // 2. Tentukan metode kalkulasi
            const methodType = methodSelect.value;
            let propertiesCalculator;
            
            if (methodType === "gamma") {
                const spanLength = parseFloat(document.getElementById("spanLength").value);
                propertiesCalculator = new GammaMethod(spanLength);
            } else {
                propertiesCalculator = new ShearAnalogyMethod();
            }

            // 3. Eksekusi OOP (Ini akan memicu 'penjagaan' / exception jika salah)
            const result = propertiesCalculator.calculate(layup);

            // 4. Render Hasil
            resultInfo.innerText = result.info;
            resultHeight.innerText = result.totalHeight + " mm";
            resultEI.innerHTML = (result.EI_eff > 0 ? result.EI_eff.toExponential(4) : "0") + " <small class='fs-6 text-muted'>N·mm&sup2;</small>";
            
            noResultState.classList.add("d-none");
            resultContainer.classList.remove("d-none");

        } catch (error) {
            // Tangkap penjagaan dan tampilkan ke UI
            errorAlert.innerText = error.message;
            errorAlert.classList.remove("d-none");
        }
    });
});