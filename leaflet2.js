var mymap = L.map('mapid').setView([-1.2585, 116.87], 15);
// format setview kebalikan dari geoJSON. aneh y
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic3VtYW5zdW1hbiIsImEiOiJjanF4bjM2bGwwN29kM3hwZzVsYW4yaXJ5In0.t0VCu3qBpF2jDItKK992bA', {
		maxZoom: 25,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox.streets'
    }).addTo(mymap);


const styleWaterPipe = {
        "color": "#ff0000",
        "weight": 5,
        "opacity": 0.8
};

const markerLabelPipa = {
        radius: 4,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
}

const markerPelangganLokasi = {
        radius: 4,
        fillColor: "#00ff00",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
}

const markerPelangganLabel = {
        radius: 4,
        fillColor: "#0000ff",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
}

let layerWaterPipe = new L.geoJSON(waterPipeGeo, {style: styleWaterPipe}).addTo(mymap);

let layerLabelPipe = new L.geoJSON(labelpipa, {
        pointToLayer: function(feature, latlng){
                return L.circleMarker(latlng, markerLabelPipa)
        }
}).addTo(mymap);

let layerPelangganLokasi = new L.geoJSON(pelangganlokasi, {
        pointToLayer: function(feature, latlng){
                return L.circleMarker(latlng, markerPelangganLokasi)
        }
}).addTo(mymap);

let layerPelangganLabel = new L.geoJSON(pelangganlabel, {
        pointToLayer: function(feature, latlng){
                return L.circleMarker(latlng, markerPelangganLabel)
        }
}).addTo(mymap);



document.addEventListener('DOMContentLoaded', () =>{
    console.log("yes");
    document.querySelector("form").addEventListener("submit", function(e) {
        e.preventDefault();
        console.log('submited');
        
        // ajax
        const nomer_pel = document.querySelector("#nomer").value;
        const nama_pel = document.querySelector("#nama").value;
        const jalan_pel = document.querySelector("#jalan").value;
        console.log("pelanggan " + nama_pel)
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/search');
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300){
                    // console.log(xhr.responseText)
                    let mydata = JSON.parse(xhr.responseText);
					console.log(mydata)
					const p = document.querySelector('p')
					p.innerHTML = "hasil pencarian : " + mydata.length + " data";
					// clear hasil sebelumnya
					clearButtonHasil();
                    // tampilkan hasil dalam button
                    mydata.forEach((e) => {
                            addHasil(e.nomer, e.nama, e.alamat, e.coordinates)
					});
					
					var markerHasil;
					document.querySelectorAll(".hasil").forEach(button => {
						button.onclick = () => {
							if (markerHasil) {
								mymap.removeLayer(markerHasil)
							}
							markerHasil = L.marker([button.dataset.lat,button.dataset.lng]).addTo(mymap);
							markerHasil.bindPopup('<b>' + button.dataset.nomer + '</b><br><i>' + button.dataset.nama + '</i>').openPopup();
							mymap.flyTo([button.dataset.lat,button.dataset.lng],18);
						}
					})

            } else {
                    console.log("failed")
            }
            console.log("always run")
        }

        // Add start and end points to request data.
        const data = new FormData();
        data.append('nomer_pel', nomer_pel);
        data.append('nama_pel', nama_pel);
        data.append('jalan_pel', jalan_pel);
        
        console.log("data" + data);
        xhr.send(data);
        return false;
    });

	
    
})

// clear hasil sebelumnya
function clearButtonHasil(){
	let button = document.querySelectorAll('button.hasil');
	if (button) {
		for (let i=0; i < button.length; i++) {
			button[i].parentNode.removeChild(button[i])
		}
	}
}

// add hasil
function addHasil(nomer, nama, alamat, koordinat) {
        let button = document.createElement('button');
        // li.classList.add("chat-msg");
		button.textContent = toTitleCase(nama) + ': ' + toTitleCase(alamat);
		button.classList.add('hasil');
		button.setAttribute('data-lng', koordinat[0]);
		button.setAttribute('data-lat', koordinat[1]);
		button.setAttribute('data-nomer', nomer);
		button.setAttribute('data-nama', nama);
        document.querySelector('.sidebar').append(button)
      }

// https://gist.github.com/SonyaMoisset/aa79f51d78b39639430661c03d9b1058#file-title-case-a-sentence-for-loop-wc-js
function toTitleCase(str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
    	str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
};

