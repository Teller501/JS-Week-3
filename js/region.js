    let nextId = 200;

    let kommuner = [
    ];

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
            const idToEdit = Number(target.dataset.idEdit)
            const kommune = kommuner.find(s => s.id === idToEdit)
            showModal(kommune)
        }
    }

    function makeNewkommune() {
        showModal({
            kode: null,
            navn: "",
            href: "www.example.com",
            region: {}
        })
    }

    function showModal(kommune) {
        const myModal = new bootstrap.Modal(document.getElementById('region-modal'))
        document.getElementById("modal-title").innerText = kommune.kode ? "Edit region" : "Add region"
        document.getElementById("region-id").innerText = kommune.kode
        document.getElementById("input-navn").value = kommune.navn
        document.getElementById("input-href").value = kommune.href
        myModal.show()
    }

    async function saveKommune() {
        let kommune = {}
        kommune.kode = Number(document.getElementById("region-id").innerText)
        kommune.navn = document.getElementById("input-navn").value
        kommune.href = document.getElementById("input-href").value

        //TODO Save region on server  --> We will do this in the class
        // const data = {name: "lis Benson", bornDate: "2012-03-31", bornTime: "16:01"};
        // const options = makeOptions("POST",data);
        // fetch("https://somewhereoutthere/region",options);


        //Figure out how to update local data
        if (kommune.kode){ //Edit
            apiKommunePut(kommune)

            /*regions = regions.map(u =>
                if(u.id===region.id){
                    return region
                } else {
                    return u
                }
            )*/
            kommuner = kommuner.map(r => (r.id === kommune.id) ? kommune : r)
        } else {
            apiKommunePost(kommune)

            //kommune.kode = nextId++ //remove when calling api as db decided id
            kommuner.push(kommune)
        }

        makeRows()
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
            <td>${k.region.navn}</td> <!-- Access nested property k.region.navn -->
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
        fetch(URLkommuner, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to create kommune: ${response.statusText}`);
                }
                return response.json();
            })
            .then(newKommune => {
                // Handle the response from the server if needed
                console.log("New kommune created:", newKommune);
            })
            .catch(error => {
                console.error("Error creating kommune:", error);
            });
    }
    

    function apiKommunePut(){
        // API call to put

    }

    function apiKommuneDelete(){
        // API call to delete

    }
      
      main()