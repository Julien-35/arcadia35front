const SeeDates = document.getElementById("voirDate");

    if (document.readyState !== "loading") {
    voirHoraire();
    }


    function getToken() {
        return localStorage.getItem('apiToken');
      }

      

async function voirHoraire() {

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
    };

    await fetch("https://arcadia35380-f680d3a74682.herokuapp.com/api/horaire/get", requestOptions)
    .then((response) => {
        if  (response.ok === true){
            return response.json()
        } else {
            console.log("Impossible de récupérer les informations horaire");
        }
    })
    .then((result)=> {
        let content = '';
        result.forEach(item => {
        content += 
        `
            <h3 class="fw-bold fs-4">${item.titre}</h3>
            <p class="fw-normal fs-4">${item.message}</p>
            <p class="fw-normal fs-4" >${item.jour} </p>
            <p class="fw-normal fs-4" >${item.heure_debut} - ${item.heure_fin}</p>
        `
        })

    SeeDates.innerHTML = content;
    })
    .catch((error) =>  
        console.log(error)
    );
}
      