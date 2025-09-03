// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
let map, infoWindowCurr, infoWindow;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 10,
    });
    infoWindow = new google.maps.InfoWindow();
    infoWindowCurr = new google.maps.InfoWindow();

    const locationButton = document.createElement("button");

    const searchIcon = document.createElement("i");
    searchIcon.classList.add("fa-solid", "fa-location-dot")
    searchIcon.style.color = "#ee1b1b";
    searchIcon.style.fontSize = "20px"
    locationButton.appendChild(searchIcon);

    locationButton.classList.add("custom-map-control-button");
    locationButton.style.height = "50px";
    locationButton.style.width = "50px";
    locationButton.style.marginTop = "20px";
    locationButton.style.textAlign = "center";
    locationButton.style.lineHeight = "50px";
    locationButton.style.borderRadius = "50%";
    locationButton.style.fontSize = "20px";

    searchButton = document.querySelector(".search-button");

    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
    locationButton.addEventListener("click", () => {
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    currPos = new google.maps.LatLng(pos.lat, pos.lng);

                    //infoWindowCurr.setPosition(pos)
                    infoWindowCurr.setContent("Current Location")
                    const curr_marker = new google.maps.Marker({
                        position: pos,
                        map: map,
                        title: "Current Location",
                        icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                    });

                    curr_marker.addListener("click", () => {
                        infoWindowCurr.open(map, curr_marker);
                    });

                    map.panTo(pos);
                    map.setZoom(15);

                    searchButton.addEventListener("click", () => {
                        var request = {
                            location: pos,
                            radius: parseInt(getValue()),
                            type: 'mosque',
                            keyword: 'cami',
                        };
                        var service = new google.maps.places.PlacesService(map);
                        let distanceDict = {};

                        let slideContainer = document.querySelector(".slide-container");
                        let currentSlide = document.createElement("div");
                        currentSlide.className = "mySlides fade";
                        let count = 0;
                        const maxPerSlide = 6;

                        const rightDiv = document.querySelector(".boxes");
                        const mySlides = document.querySelector(".mySlides")

                                            service.nearbySearch(request, (results, status) => {
                        if (status === google.maps.places.PlacesServiceStatus.OK && results) {

                            //const mySlides = document.querySelector(".mySlides")
                            const firstRow = document.createElement("div");
                            firstRow.className = "first-row";
                            firstRow.style.display = "flex";
                            firstRow.style.flexWrap = "wrap";
                            firstRow.style.gap = "20px";
                            firstRow.style.alignItems = "center";
                            firstRow.style.justifyContent = "center";



                            for (var i = 0; i < results.length; i++) {
                                const res = createMarker(results[i], currPos);

                                const contentDiv = document.createElement("div");
                                contentDiv.className = "content-div";
                                currentSlide.appendChild(firstRow);
                                firstRow.appendChild(contentDiv);

                                const imgDiv = document.createElement("div");
                                imgDiv.className = "img-div";
                                imgDiv.style.alignSelf = "flex-start"
                                imgDiv.style.marginLeft = "30px";
                                imgDiv.style.marginTop = "10px"
                                contentDiv.appendChild(imgDiv);
                                count++;



                                const img = document.createElement("i");
                                img.className = "fa-solid fa-mosque";
                                img.style.fontSize = "50px";
                                imgDiv.appendChild(img)

                                contentDiv.style.backgroundColor = "#fffffc";
                                contentDiv.style.width = "300px";
                                contentDiv.style.height = "150px"
                                contentDiv.style.borderColor = "none";
                                contentDiv.style.borderRadius = "2rem";
                                contentDiv.style.boxShadow = "-20px 20px 40px hsl(0 0 0 / .25) ";
                                contentDiv.style.display = "flex";
                                contentDiv.style.flexDirection = "column";
                                contentDiv.classList.add("hover-effect");
                                imgDiv.addEventListener("click", () => {
                                    window.open(link, "_blank");
                                })

                                const infoWindowPlace = res[2]
                                const marker = res[3];
                                contentDiv.addEventListener("click", () => {
                                    infoWindowPlace.setContent(`${res[0].name || ""} <br> Distance: ${(res[1] / 1000).toFixed(3)} km`);
                                    infoWindowPlace.open(map, marker);
                                });

                                const headerDiv = document.createElement("div");
                                const header = document.createElement("p");
                                const distance = document.createElement("p")
                                header.className = "header-text";
                                distance.className = "distance-text"
                                header.textContent = res[0].name;
                                distance.textContent = `${(res[1] / 1000).toFixed(3)} km`;
                                header.style.fontFamily = "Josefin Sans";
                                header.style.overflowWrap = "break-word";
                                distance.style.fontFamily = "Josefin Sans";
                                distance.style.overflowWrap = "break-word";
                                headerDiv.style.width = "300px";
                                headerDiv.style.display = "flex";
                                headerDiv.style.flexDirection = "column"

                                header.style.marginLeft = "20px";
                                header.style.fontWeight = "100px"
                                distance.style.marginLeft = "20px";
                                distance.style.fontWeight = "100px";

                                contentDiv.style.cursor = "pointer";

                                headerDiv.appendChild(header);
                                headerDiv.appendChild(distance);
                                contentDiv.appendChild(headerDiv);

                                distanceDict[res[0].name] = res[1];

                                if (count >= maxPerSlide) {
                                    slideContainer.appendChild(currentSlide);
                                    currentSlide = document.createElement("div");
                                    currentSlide.className = "mySlides fade";
                                    count = 0;
                                }


                            }
                            if (count > 0) {
                                slideContainer.appendChild(currentSlide);
                            }
                        }
                        

                    });

                    })




                },

            );


        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }

    });


}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
        browserHasGeolocation
            ? "Error: The Geolocation service failed."
            : "Error: Your browser doesn't support geolocation.",
    );
    infoWindow.open(map);
}

function createMarker(place, currPos) {
    if (!place.geometry || !place.geometry.location) return;

    const marker = new google.maps.Marker({
        map,
        position: place.geometry.location,
    });

    const infoWindowPlace = new google.maps.InfoWindow();
    const placePos = place.geometry.location
    const distanceBetween = getDistance(currPos, placePos)

    google.maps.event.addListener(marker, "click", () => {
        infoWindowPlace.setContent(`${place.name || ""} <br> Distance: ${(distanceBetween / 1000).toFixed(3)} km`);
        infoWindowPlace.open(map, marker);
    });
    return [place, distanceBetween, infoWindowPlace, marker]
}

function getDistance(currPos, placePos) {
    const distanceInMeters = google.maps.geometry.spherical.computeDistanceBetween(
        currPos,
        placePos
    );
    return distanceInMeters;
}
function getClosestPlace(distanceList) {
    return Math.min(...distanceList)
}
function searchDistanceFunc() {
    document.getElementById("dropdown-id").classList.toggle("show");
}
function getValue() {
    const val = document.getElementById("distances").value;
    return val;
}
let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    //turns first slide when go further from last slide
    if (n > slides.length) { slideIndex = 1 }
    // goes last slide when go previous page from 1st page
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    // current dot is seen
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
}
window.initMap = initMap;

