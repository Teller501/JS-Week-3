    let nextId = 200;

    let kommuner = [
    ];

    let regioner = [
        {
            kode: 1081,
            navn: "Region Nordjylland"
        },
        {
            kode: 1082,
            navn: "Region Midtjylland"
        },
        {
            kode: 1083,
            navn: "Region Syddanmark"
        },
        {
            kode: 1084,
            navn: "Region Hovedstaden"
        },
        {
            kode: 1085,
            navn: "Region Sjælland"
        }
    ]

    const URLkommuner = "http://localhost:3333/kommuner"; //For when we meet in the class - remember to set server.port = 3333
    const URLkommune  = "http://localhost:3333/kommuner"; //For when we meet in the class

    function setUpHandlers() {
        document.getElementById("region-table-body").onclick = handleTableClick
        document.getElementById("btn-save").onclick = saveKommune
        document.getElementById("btn-add-region").onclick = makeNewkommune
    }
    setUpHandlers()

    function handleTableClick(evt) {
        evt.preventDefault()
        evt.stopPropagation()
        const target = evt.target;
    
        if (target.dataset.idDelete) {
            //alert("Delete "+target.dataset.idDelete)
            const idToDelete = Number(target.dataset.idDelete)
    
            apiKommuneDelete(idToDelete)
    
            //region = regions.filter(u => (u.id == idToDelete) ? false : true)
            //kommuner = kommuner.filter(k => k.kode !== idToDelete)
    
            makeRows()
        }
    
        //if (target.dataset.dataEdit) {
            //alert(target.dataset.dataEdit)
            //alert(JSON.parse(target.dataset.dataEdit))
        //    const region = JSON.parse(target.dataset.dataEdit)
        //    showModal(region)
        if (target.dataset.idEdit){
            const idToEdit = Number(target.dataset.idEdit);
            const paddedIdToEdit = idToEdit.toString().padStart(4, '0');
            const kommune = kommuner.find(k => k.kode === paddedIdToEdit);
            showModal(kommune);

        }
        
        
    }
    

    function makeNewkommune() {
        const existingKommuneCodes = kommuner.map(k => k.kode);
    
        let newKommuneCode = "0001";
    
        if (existingKommuneCodes.length > 0) {
            const maxKommuneCode = Math.max(...existingKommuneCodes.map(code => parseInt(code, 10)));
            newKommuneCode = (maxKommuneCode + 1).toString().padStart(4, '0');
        }
    
        showModal({
            kode: newKommuneCode,
            navn: "",
            href: "www.example.com",
            region: {}
        });
    }
    
    

    function showModal(kommune) {
        const myModal = new bootstrap.Modal(document.getElementById('region-modal'))
        document.getElementById("modal-title").innerText = kommune.kode ? "Edit kommune" : "Add kommune"
        document.getElementById("region-id").innerText = kommune.kode
        document.getElementById("input-navn").value = kommune.navn
        document.getElementById("input-href").value = kommune.href
        let selectElement = document.getElementById("input-region");

        selectElement.innerHTML = "";

        regioner.map((r) => {
        let option = document.createElement("option");

        option.value = r.kode;
        option.text = r.navn;

        if (r === kommune.region.kode) {
            option.selected;
        }

        selectElement.appendChild(option);
        });

        myModal.show()
    }

    async function saveKommune() {
        let kommune = {};
        kommune.kode = document.getElementById("region-id").innerText;
        kommune.navn = document.getElementById("input-navn").value;
        kommune.href = document.getElementById("input-href").value;
        kommune.region = {};
        kommune.region.kode = document.getElementById("input-region").value;
    
        if (kommune.id) {
            apiKommunePut(kommune);
            kommuner = kommuner.map(r => (r.id === kommune.id) ? kommune : r);
        } else {
            kommune = await apiKommunePost(kommune);
            kommuner.push(kommune);
        }
    
        await makeRows();
    }
    

    async function fetchKommuner() {
        const response = await fetch(URLkommuner)
        const data = await handleHttpErrors(response)
        return data
    }

      async function makeRows() {
        // make rows from data
        kommuner = await fetchKommuner();

        const rows = kommuner.map(k => `
        <tr>
            <td>${k.kode}</td>
            <td>${k.navn}</td>
            <td>${k.href}</td>
            <td>${k.region.navn}</td>
            <td><a data-id-delete=${k.kode} href="#">Delete</a></td>
            <!-- <td><a data-data-edit='${JSON.stringify(k)}' href="#">Edit</a></td> -->
            <td><a data-id-edit='${k.kode}' href="#">Edit</a></td>
        </tr>
        `)
        document.getElementById("region-table-body").innerHTML = rows.join("");
    }
    
    
    

    // const data = {name: "lis Benson", bornDate: "2012-03-31", bornTime: "16:01"};
    // const options = makeOptions("POST",data);
    // fetch("https://somewhereoutthere/region",options);

    function makeOptions(method, body) {
        const opts = {
            method: method,
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json"
            }
        }
        if (body) { //Observe how we can add new fields to an object when needed
            opts.body = JSON.stringify(body);
        }
        return opts;
    }

    async function handleHttpErrors(res) {
        if (!res.ok) {
            const errorResponse = await res.json();
            const error = new Error(errorResponse.message)
            error.apiError = errorResponse
            throw error
        }
        return res.json()
    }

    async function main() {
        const kommuner = await fetchKommuner() 
        makeRows(kommuner)
    }

    function apiKommunePost(kommune) {
        const options = makeOptions("POST", kommune);
        return fetch(URLkommuner, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to create kommune: ${response.statusText}`);
                }
                return response.json();
            })
            .then(newKommune => {
                return newKommune;
            })
            .catch(error => {
                console.error("Error creating kommune:", error);
            });
    }
    

    function apiKommunePut(kommune) {
        const options = makeOptions("PUT", kommune);
        return fetch(URLkommuner, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to edit kommune: ${response.statusText}`);
                }
                return response.json();
            })
            .then(editedKommune => {
                return editedKommune;
            })
            .catch(error => {
                console.error("Error editing kommune:", error);
            });
    }
    

    function apiKommuneDelete(id){
        // API call to delete
        const options = makeOptions("DELETE", id);
        return fetch(URLkommuner, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to delete kommune: ${response.statusText}`);
                }
                return response.json();
            })
            .then(deletedKommune => {
                console.log("deleted: ", deletedKommune);
            })
            .catch(error => {
                console.error("Error deleting kommune:", error);
            });

    }
      
      main()