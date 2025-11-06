document.addEventListener("DOMContentLoaded", () => {
    const tablaBoletas = document.getElementById("tabla-boletas");
    const isAdmin = tablaBoletas !== null;

    // ------------------------------
    // 🔹 ADMINISTRADOR (admin.html)
    // ------------------------------
    if (isAdmin) {
        const formulario = document.getElementById("formulario-edicion");
        const inputNombre = document.getElementById("input-nombre");
        const inputCelular = document.getElementById("input-celular");
        const inputEstado = document.getElementById("input-estado");
        const guardarBtn = document.getElementById("guardar-boleta");
        const boletaEditando = document.getElementById("boleta-editando");

        const boletas = {};

        // Cargar datos desde localStorage
        const datosGuardados = localStorage.getItem("boletasData");
        if (datosGuardados) {
            Object.assign(boletas, JSON.parse(datosGuardados));
        }

        // Generar 100 filas
        for (let i = 0; i < 100; i++) {
            const numero = i.toString().padStart(2, "0");
            if (!boletas[numero]) {
                boletas[numero] = { nombre: "", celular: "", estado: "" };
            }

            const fila = document.createElement("tr");
            fila.dataset.numero = numero;

            const tdNumero = document.createElement("td");
            tdNumero.textContent = numero;

            const tdNombre = document.createElement("td");
            const tdCelular = document.createElement("td");
            const tdAcciones = document.createElement("td");

            const btnEditar = document.createElement("a");
            btnEditar.className = "editar-btn material-icons";
            btnEditar.href = "#top"; // ← esto enlaza al ancla con id="form"
            btnEditar.innerHTML = `<span class="material-icons">edit</span>`;
            btnEditar.addEventListener("click", () => {
                const datos = boletas[numero];
                inputNombre.value = datos.nombre;
                inputCelular.value = datos.celular;
                inputEstado.value = datos.estado;
                boletaEditando.textContent = numero;
                formulario.classList.remove("display-none");
            });

            tdAcciones.appendChild(btnEditar);

            fila.appendChild(tdNumero);
            fila.appendChild(tdNombre);
            fila.appendChild(tdCelular);
            fila.appendChild(tdAcciones);

            tablaBoletas.querySelector("tbody").appendChild(fila);

            // Aplicar datos si existen
            const pNombre = document.createElement("p");
            pNombre.textContent = boletas[numero].nombre;
            tdNombre.appendChild(pNombre);

            tdCelular.textContent = boletas[numero].celular;

            fila.classList.remove("payment-row", "must-row");
            if (boletas[numero].estado === "payment") {
                fila.classList.add("payment-row");
            } else if (boletas[numero].estado === "must") {
                fila.classList.add("must-row");
            }
        }

        // Guardar cambios
        guardarBtn.addEventListener("click", () => {
            const numero = boletaEditando.textContent;
            const fila = tablaBoletas.querySelector(`tr[data-numero="${numero}"]`);
            const nombre = inputNombre.value.trim();
            const celular = inputCelular.value.trim();
            const estado = inputEstado.value;

            boletas[numero] = { nombre, celular, estado };
            localStorage.setItem("boletasData", JSON.stringify(boletas));

            const tdNombre = fila.children[1];
            tdNombre.innerHTML = ""; // Limpia el contenido anterior
            const pNombre = document.createElement("p");
            pNombre.textContent = nombre;
            tdNombre.appendChild(pNombre);

            fila.children[2].textContent = celular;

            fila.classList.remove("payment-row", "must-row");
            if (estado === "payment") {
                fila.classList.add("payment-row");
            } else if (estado === "must") {
                fila.classList.add("must-row");
            }

            formulario.classList.add("display-none");
        });

        const resetBtn = document.getElementById("reset-boletas");
        resetBtn.addEventListener("click", () => {
            const confirmar = confirm("¿Quieres borrar todos los datos de las boletas?");
            if (!confirmar) return;

            // Vaciar el objeto boletas
            for (let i = 0; i < 100; i++) {
                const numero = i.toString().padStart(2, "0");
                boletas[numero] = { nombre: "", celular: "", estado: "" };

                const fila = tablaBoletas.querySelector(`tr[data-numero="${numero}"]`);
                fila.children[1].innerHTML = "<p></p>"; // nombre vacío
                fila.children[2].textContent = ""; // celular vacío
                fila.classList.remove("payment-row", "must-row"); // quitar color
            }

            // Guardar en localStorage
            localStorage.setItem("boletasData", JSON.stringify(boletas));
        });

        return; // No ejecutar la lógica de index.html
    }

    // ------------------------------
    // 🔸 INTERFAZ PRINCIPAL (index.html)
    // ------------------------------
    const grupos = {
        "00": ["000", "798", "465", "612", "542", "175", "764", "178", "104", "116"],
        "01": ["001", "801", "536", "135", "672", "552", "424", "864", "471", "964"],
        "02": ["002", "921", "491", "958", "485", "328", "789", "406", "765", "827"],
        "03": ["003", "985", "916", "549", "396", "502", "871", "825", "464", "895"],
        "04": ["004", "391", "936", "956", "698", "448", "767", "470", "757", "562"],
        "05": ["005", "635", "359", "558", "950", "553", "590", "861", "394", "868"],
        "06": ["006", "867", "490", "368", "273", "813", "738", "489", "677", "231"],
        "07": ["007", "713", "235", "911", "342", "703", "240", "857", "573", "810"],
        "08": ["008", "771", "335", "129", "686", "121", "197", "676", "191", "831"],
        "09": ["009", "739", "634", "983", "639", "880", "917", "226", "382", "329"],
        "10": ["010", "507", "706", "781", "322", "908", "963", "567", "860", "608"],
        "11": ["011", "545", "905", "247", "599", "159", "451", "446", "693", "775"],
        "12": ["012", "586", "654", "409", "155", "968", "733", "670", "245", "760"],
        "13": ["013", "902", "372", "206", "496", "804", "623", "333", "709", "882"],
        "14": ["014", "727", "820", "346", "977", "469", "689", "841", "340", "649"],
        "15": ["015", "516", "565", "948", "442", "358", "348", "818", "748", "445"],
        "16": ["016", "707", "944", "302", "705", "503", "343", "285", "276", "919"],
        "17": ["017", "499", "295", "378", "756", "249", "711", "657", "700", "229"],
        "18": ["018", "144", "189", "784", "332", "156", "704", "674", "126", "883"],
        "19": ["019", "551", "456", "619", "257", "461", "101", "628", "199", "444"],
        "20": ["020", "154", "535", "575", "594", "941", "937", "894", "271", "304"],
        "21": ["021", "441", "538", "353", "593", "659", "847", "929", "541", "157"],
        "22": ["022", "900", "610", "133", "717", "166", "589", "886", "761", "214"],
        "23": ["023", "374", "403", "790", "989", "205", "314", "583", "352", "982"],
        "24": ["024", "904", "362", "119", "875", "992", "987", "745", "143", "664"],
        "25": ["025", "901", "834", "695", "821", "848", "811", "436", "377", "194"],
        "26": ["026", "615", "912", "434", "279", "646", "350", "877", "339", "518"],
        "27": ["027", "734", "823", "242", "139", "369", "297", "671", "805", "638"],
        "28": ["028", "326", "532", "620", "385", "296", "642", "186", "755", "572"],
        "29": ["029", "980", "720", "627", "307", "269", "402", "973", "914", "613"],
        "30": ["030", "690", "466", "483", "918", "891", "383", "714", "845", "153"],
        "31": ["031", "510", "389", "601", "842", "500", "188", "981", "315", "317"],
        "32": ["032", "293", "493", "118", "776", "718", "122", "219", "903", "140"],
        "33": ["033", "697", "892", "631", "938", "237", "200", "777", "172", "947"],
        "34": ["034", "356", "763", "248", "187", "969", "230", "220", "988", "539"],
        "35": ["035", "769", "401", "520", "547", "997", "521", "486", "747", "258"],
        "36": ["036", "942", "780", "598", "774", "661", "614", "400", "233", "272"],
        "37": ["037", "148", "100", "595", "870", "749", "846", "164", "656", "885"],
        "38": ["038", "123", "373", "195", "176", "149", "974", "930", "505", "404"],
        "39": ["039", "965", "351", "274", "360", "415", "215", "641", "309", "218"],
        "40": ["040", "835", "952", "105", "454", "331", "618", "840", "380", "723"],
        "41": ["041", "715", "833", "976", "410", "170", "824", "540", "951", "277"],
        "42": ["042", "899", "563", "487", "940", "701", "281", "120", "574", "517"],
        "43": ["043", "753", "421", "986", "788", "182", "990", "173", "809", "955"],
        "44": ["044", "838", "896", "107", "587", "962", "906", "933", "849", "417"],
        "45": ["045", "577", "887", "478", "897", "428", "452", "647", "621", "920"],
        "46": ["046", "300", "600", "721", "261", "439", "236", "161", "475", "898"],
        "47": ["047", "460", "960", "316", "865", "819", "655", "459", "732", "658"],
        "48": ["048", "137", "375", "244", "357", "243", "873", "667", "660", "514"],
        "49": ["049", "806", "584", "728", "430", "564", "852", "397", "730", "301"],
        "50": ["050", "802", "207", "585", "878", "361", "256", "418", "412", "528"],
        "51": ["051", "165", "209", "863", "168", "729", "588", "398", "388", "786"],
        "52": ["052", "108", "758", "386", "570", "578", "204", "816", "665", "147"],
        "53": ["053", "217", "680", "387", "579", "791", "287", "303", "795", "793"],
        "54": ["054", "254", "719", "830", "203", "423", "455", "966", "560", "345"],
        "55": ["055", "792", "512", "112", "241", "468", "474", "364", "766", "752"],
        "56": ["056", "190", "508", "682", "425", "696", "392", "234", "494", "323"],
        "57": ["057", "275", "984", "737", "411", "783", "633", "435", "762", "576"],
        "58": ["058", "531", "184", "605", "509", "344", "888", "822", "770", "211"],
        "59": ["059", "708", "561", "355", "513", "557", "479", "609", "330", "384"],
        "60": ["060", "318", "341", "772", "712", "225", "171", "174", "814", "735"],
        "61": ["061", "566", "263", "319", "754", "284", "582", "978", "492", "858"],
        "62": ["062", "928", "327", "325", "533", "799", "580", "923", "869", "673"],
        "63": ["063", "637", "994", "416", "152", "134", "979", "844", "221", "597"],
        "64": ["064", "212", "158", "678", "488", "803", "993", "498", "420", "688"],
        "65": ["065", "146", "548", "581", "426", "117", "653", "462", "751", "128"],
        "66": ["066", "800", "125", "550", "996", "568", "859", "876", "644", "915"],
        "67": ["067", "255", "970", "115", "931", "519", "967", "662", "312", "640"],
        "68": ["068", "196", "972", "138", "390", "262", "467", "645", "683", "365"],
        "69": ["069", "311", "692", "252", "596", "202", "347", "746", "427", "501"],
        "70": ["070", "959", "132", "626", "216", "856", "884", "305", "534", "440"],
        "71": ["071", "925", "413", "246", "183", "264", "961", "529", "927", "782"],
        "72": ["072", "909", "731", "177", "893", "422", "407", "313", "457", "379"],
        "73": ["073", "837", "602", "506", "292", "716", "213", "131", "185", "740"],
        "74": ["074", "102", "239", "453", "324", "130", "556", "371", "151", "591"],
        "75": ["075", "604", "419", "843", "725", "559", "414", "511", "991", "554"],
        "76": ["076", "381", "136", "750", "480", "259", "817", "744", "210", "687"],
        "77": ["077", "648", "629", "472", "145", "537", "366", "160", "787", "953"],
        "78": ["078", "651", "228", "399", "681", "832", "932", "971", "238", "872"],
        "79": ["079", "684", "881", "743", "299", "839", "759", "169", "223", "432"],
        "80": ["080", "527", "808", "625", "523", "354", "913", "796", "685", "995"],
        "81": ["081", "282", "504", "280", "438", "481", "954", "288", "349", "935"],
        "82": ["082", "999", "571", "167", "515", "617", "370", "198", "722", "289"],
        "83": ["083", "607", "773", "851", "250", "949", "812", "632", "192", "650"],
        "84": ["084", "866", "395", "266", "946", "308", "336", "443", "910", "606"],
        "85": ["085", "181", "907", "669", "924", "815", "778", "473", "306", "663"],
        "86": ["086", "530", "724", "433", "603", "741", "114", "163", "736", "592"],
        "87": ["087", "224", "879", "624", "794", "320", "476", "829", "890", "111"],
        "88": ["088", "943", "497", "180", "555", "828", "162", "150", "113", "431"],
        "89": ["089", "495", "260", "450", "652", "458", "334", "253", "109", "408"],
        "90": ["090", "268", "142", "232", "630", "544", "702", "363", "290", "785"],
        "91": ["091", "668", "874", "934", "321", "611", "222", "337", "141", "926"],
        "92": ["092", "437", "826", "710", "636", "338", "484", "854", "286", "691"],
        "93": ["093", "797", "208", "524", "768", "201", "393", "283", "694", "889"],
        "94": ["094", "267", "779", "106", "103", "525", "862", "807", "622", "127"],
        "95": ["095", "447", "569", "124", "429", "449", "957", "294", "179", "836"],
        "96": ["096", "310", "251", "270", "616", "699", "522", "853", "643", "193"],
        "97": ["097", "998", "855", "463", "291", "666", "726", "278", "742", "675"],
        "98": ["098", "367", "543", "227", "482", "265", "546", "679", "376", "298"],
        "99": ["099", "477", "975", "405", "922", "945", "939", "110", "850", "526"],
    };

    const activadores = document.querySelectorAll(".numero-btn");
    const card = document.getElementById("card");
    const grupoContainer = document.getElementById("grupo-numeros");
    const cerrarBtn = document.getElementById("cerrar-card");
    const cardInfo = document.getElementById("card-info");
    const descriptiveInfo = document.getElementById("descriptive-information");
    const cardInfoState = document.getElementById("card-info-state");
    const groupNumber = document.getElementById("group-number");

    let numeroPapaActual = null;

    activadores.forEach(el => {
        el.addEventListener("click", () => {
            numeroPapaActual = parseInt(el.dataset.numero);
            mostrarCard(numeroPapaActual, el);
        });
    });

    // Leer datos de boletas desde localStorage
    const datosBoletas = localStorage.getItem("boletasData");
    if (datosBoletas) {
        const boletas = JSON.parse(datosBoletas);

        activadores.forEach(el => {
            const numero = el.dataset.numero.padStart(2, "0");
            const datos = boletas[numero];

            if (datos && datos.estado) {
                el.classList.remove("payment", "must");

                if (datos.estado === "payment") {
                    el.classList.add("payment");
                } else if (datos.estado === "must") {
                    el.classList.add("must");
                }
            }
        });
    }

    window.addEventListener("storage", event => {
        if (event.key === "boletasData") {
            const boletas = JSON.parse(event.newValue);

            activadores.forEach(el => {
                const numero = el.dataset.numero.padStart(2, "0");
                const datos = boletas[numero];

                if (datos && datos.estado) {
                    el.classList.remove("payment", "must");

                    if (datos.estado === "payment") {
                        el.classList.add("payment");
                    } else if (datos.estado === "must") {
                        el.classList.add("must");
                    }
                }
            });

            console.log("Boletas sincronizadas desde otra pestaña");
        }
    });

    cerrarBtn.addEventListener("click", () => {
        card.classList.remove("display-flex");
        card.classList.add("display-none");
        grupoContainer.innerHTML = "";
        numeroPapaActual = null;
    });

    function mostrarCard(numeroPapa, origenElemento) {
        const claveGrupo = numeroPapa.toString().padStart(2, "0");
        const hijos = grupos[claveGrupo];

        if (!hijos) {
            console.warn("Grupo no encontrado:", claveGrupo);
            return;
        }

        groupNumber.textContent = claveGrupo;
        groupNumber.classList.remove("yellow-bg", "green-bg", "red-bg", "green-txt", "beige-txt");

        if (origenElemento && origenElemento.classList.contains("payment")) {
            groupNumber.classList.add("green-bg", "beige-txt");
        } else if (origenElemento && origenElemento.classList.contains("must")) {
            groupNumber.classList.add("red-bg", "beige-txt");
        } else {
            groupNumber.classList.add("yellow-bg", "green-txt");
        }

        const estadoTexto = cardInfoState ? cardInfoState.querySelector("p") : null;

        if (
            origenElemento &&
            (origenElemento.classList.contains("payment") || origenElemento.classList.contains("must"))
        ) {
            cardInfo.classList.add("display-none");
            cardInfo.classList.remove("display-flex");

            descriptiveInfo.classList.remove("display-none");
            descriptiveInfo.classList.add("display-flex");

            if (estadoTexto) {
                estadoTexto.textContent = origenElemento.classList.contains("payment")
                    ? "CANCELADA"
                    : "SIN CANCELAR";
            }
        } else {
            descriptiveInfo.classList.add("display-none");
            descriptiveInfo.classList.remove("display-flex");

            cardInfo.classList.remove("display-none");
            cardInfo.classList.add("display-flex");

            if (estadoTexto) {
                estadoTexto.textContent = "";
            }
        }

        card.classList.remove("display-none");
        card.classList.add("display-flex");

        grupoContainer.innerHTML = "";
        hijos.forEach(num => {
            const div = document.createElement("div");
            div.className = "numero-hijo";
            div.textContent = num;
            grupoContainer.appendChild(div);
        });

        console.log("Grupo mostrado:", claveGrupo);
    }

    document.querySelectorAll('a[href^="#"]').forEach(ancla => {
        ancla.addEventListener("click", function (e) {
            e.preventDefault();
            const destino = document.querySelector(this.getAttribute("href"));
            if (destino) {
                destino.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

});
