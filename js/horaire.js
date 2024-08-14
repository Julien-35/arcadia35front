const SeeDates = document.getElementById("date");

    if (document.readyState !== "loading") {
    VoirDate();
    }

async function VoirDate() {

    const myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", "38f1c426526d1aeebb80d777b8733f1ef09fc484");
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
    };

    await fetch("https://127.0.0.1:8000/api/horaire/get", requestOptions)
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
      