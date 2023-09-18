    let nextId = 200;

    const URLregions = "http://localhost:3333/regioner"; //For when we meet in the class - remember to set server.port = 3333
    const URLregion  = "http://localhost:3333/regioner"; //For when we meet in the class

    function setUpHandlers() {
        document.getElementById("region-table-body").onclick = handleTableClick
        document.getElementById("btn-save").onclick = saveregion
        document.getElementById("btn-add-region").onclick = makeNewregion
    }
    setUpHandlers()

    function handleTableClick(evt) {
        evt.preventDefault()
        evt.stopPropagation()
        const target = evt.target;

        if (target.dataset.idDelete) {
            //alert("Delete "+target.dataset.idDelete)
            const idToDelete = Number(target.dataset.idDelete)

            //apiregionDelete(idToDelete)

            //region = regions.filter(u => (u.id == idToDelete) ? false : true)
            regions = regions.filter(s => s.id !== idToDelete)

            makeRows()
        }

        //if (target.dataset.dataEdit) {
            //alert(target.dataset.dataEdit)
            //alert(JSON.parse(target.dataset.dataEdit))
        //    const region = JSON.parse(target.dataset.dataEdit)
        //    showModal(region)
        if (target.dataset.idEdit){
            const idToEdit = Number(target.dataset.idEdit)
            const region = regions.find(s => s.id === idToEdit)
            showModal(region)
        }
    }

    function makeNewregion() {
        showModal({
            kode: null,
            navn: "",
            href: "www.example.com",
        })
    }

    function showModal(region) {
        const myModal = new bootstrap.Modal(document.getElementById('region-modal'))
        document.getElementById("modal-title").innerText = region.kode ? "Edit region" : "Add region"
        document.getElementById("region-id").innerText = region.kode
        document.getElementById("input-navn").value = region.navn
        document.getElementById("input-href").value = region.href
        myModal.show()
    }

    async function saveregion() {
        let region = {}
        region.kode = Number(document.getElementById("region-id").innerText)
        region.navn = document.getElementById("input-navn").value
        region.href = document.getElementById("input-href").value

        //TODO Save region on server  --> We will do this in the class
        // const data = {name: "lis Benson", bornDate: "2012-03-31", bornTime: "16:01"};
        // const options = makeOptions("POST",data);
        // fetch("https://somewhereoutthere/region",options);


        //Figure out how to update local data
        if (region.kode){ //Edit
            //apiregionPut(region)

            /*regions = regions.map(u =>
                if(u.id===region.id){
                    return region
                } else {
                    return u
                }
            )*/
            regions = regions.map(r => (r.id === region.id) ? region : r)
        } else {
            //apiregionPost(region)

            region.kode = nextId++ //remove when calling api as db decided id
            regions.push(region)
        }

        makeRows()
    }

    async function fetchRegions() {
        const response = await fetch(URLregions)
        const data = await handleHttpErrors(response)
        return data
      }

    function makeRows(regions) {
        //make rows from data
        const rows = regions.map(r => `
        <tr>
            <td>${r.kode}</td>
            <td>${r.navn}</td>
            <td>${r.href}</td>
            <td><a data-id-delete=${r.kode} href="#">Delete</a></td>
            <!-- <td><a data-data-edit='${JSON.stringify(r)}' href="#">Edit</a></td> -->
            <td><a data-id-edit='${r.kode}' href="#">Edit</a></td>
        </tr>
        `)
        document.getElementById("region-table-body").innerHTML = rows.join("")
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
        const regions = await fetchRegions() 
        makeRows(regions)
    }
      
      main()