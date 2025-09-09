let markerList = [];
window.addEventListener('load', () => {
    const splash = document.getElementById('splash-screen');
    const splashSloganText = document.querySelector(".slogan-splash-text")
    const text = splashSloganText.textContent;
    splashSloganText.textContent = "";
    text.split('').forEach(char => {
        if (char === ' ') {
            splashSloganText.appendChild(document.createTextNode(' '));
            return;
        }
        else {
            const span = document.createElement('span');
            span.style.color = '#76c182';
            span.textContent = char;
            splashSloganText.appendChild(span);
        }
    });
    setTimeout(() => {
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.style.display = 'none';
            }, 1000);
        }
    }, 1000);
});

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
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    currPos = new google.maps.LatLng(pos.lat, pos.lng);

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
                },
            );
        } else {
            handleLocationError(false, infoWindow, map.getCenter());
        }
    });

    searchButton.addEventListener("click", () => {
        clearMarkers();
        clearResults();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    currPos = new google.maps.LatLng(pos.lat, pos.lng);

                    const radius = parseInt(getValue()) || 1000;

                    fetch(`/api/nearby-mosques?lat=${pos.lat}&lng=${pos.lng}&radius=${radius}`)
                        .then(res => res.json())
                        .then(data => {
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


                            let distanceDict = {};

                            let slideContainer = document.querySelector(".slide-container");
                            slideContainer.style.position = "relative"
                            slideContainer.style.marginBottom = "2rem"

                    
                            
                            let currentSlide = document.createElement("div");
                            currentSlide.className = "mySlides fade";
                            let count = 0;
                            const maxPerSlide = 6;

                            const filtered = data.results.map(place => {
                                const placePos = place.geometry.location;
                                const distance = google.maps.geometry.spherical.computeDistanceBetween(currPos, placePos);
                                return { place, distance };
                            })
                                .filter(item => item.distance <= radius)
                                .sort((a, b) => a.distance - b.distance);

                            let firstRow = document.createElement("div");
                            firstRow.className = "first-row";
                            firstRow.style.display = "flex";
                            firstRow.style.flexWrap = "wrap";
                            firstRow.style.gap = "20px";
                            firstRow.style.alignItems = "center";
                            firstRow.style.justifyContent = "center";
                            currentSlide.appendChild(firstRow)

                            for (let i = 0; i < filtered.length; i++) {
                                if (count >= maxPerSlide) {
                                    slideContainer.appendChild(currentSlide);
                                    currentSlide = document.createElement("div");
                                    currentSlide.className = "mySlides fade";

                                    firstRow = document.createElement("div");
                                    firstRow.className = "first-row";
                                    firstRow.style.display = "flex";
                                    firstRow.style.flexWrap = "wrap";
                                    firstRow.style.gap = "20px";
                                    firstRow.style.alignItems = "center";
                                    firstRow.style.justifyContent = "center";
                                    currentSlide.appendChild(firstRow)
                                    count = 0
                                }

                                const res = createMarker(filtered[i].place, currPos);

                                const contentDiv = document.createElement("div");
                                contentDiv.className = "content-div";
                                firstRow.appendChild(contentDiv);

                                const imgDiv = document.createElement("div");
                                imgDiv.className = "img-div";
                                imgDiv.style.alignSelf = "flex-start"
                                imgDiv.style.marginLeft = "30px";
                                imgDiv.style.marginTop = "1rem"
                                contentDiv.appendChild(imgDiv);

                                const img = document.createElement("i");
                                img.className = "fa-solid fa-mosque";
                                img.style.fontSize = "25px";
                                imgDiv.appendChild(img)

                                contentDiv.style.backgroundColor = "#fffffc";
                                contentDiv.style.width = "100%";
                                contentDiv.style.maxWidth = "300px";
                                contentDiv.style.height = "auto";
                                contentDiv.style.minHeight = "150px";
                                contentDiv.style.borderColor = "none";
                                contentDiv.style.borderRadius = "2rem";
                                contentDiv.style.boxShadow = "-20px 20px 40px hsl(0 0 0 / .25) ";
                                contentDiv.style.display = "flex";
                                contentDiv.style.flexDirection = "column";
                                contentDiv.classList.add("hover-effect");

                                const infoWindowPlace = res[2]
                                const marker = res[3];
                                markerList.push(marker);

                                contentDiv.addEventListener("click", () => {
                                    infoWindowPlace.setContent(`${res[0].name || ""} <br> Distance: ${(res[1] / 1000).toFixed(3)} km<br> <a href="${res[4]}" target="_blank">See on Maps</a>`);
                                    infoWindowPlace.open(map, marker);
                                    window.scrollTo({
                                        top: 100,
                                        behavior: "smooth"
                                    });
                                });

                                const headerDiv = document.createElement("div");
                                headerDiv.className = "header-div"
                                headerDiv.style.margin = "0"
                                headerDiv.style.padding = "0"
                                headerDiv.style.display = "inline-block"
                                const header = document.createElement("p");
                                const distance = document.createElement("p")
                                header.className = "header-text";
                                distance.className = "distance-text"
                                header.textContent = res[0].name;
                                distance.textContent = `${(res[1] / 1000).toFixed(3)} km`;
                                header.style.fontSize = "20px"
                                distance.style.fontSize = "20px"
                                header.style.fontFamily = "Josefin Sans";
                                header.style.overflowWrap = "break-word";
                                distance.style.fontFamily = "Josefin Sans";
                                distance.style.overflowWrap = "break-word";
                                headerDiv.style.width = "100%";
                                headerDiv.style.maxWidth = "300px";
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
                                count++;
                            }
                            if (count > 0) {
                                slideContainer.appendChild(currentSlide);
                            }
                        

                        if (document.querySelectorAll(".mySlides").length > 1) {
                            const controlsDiv = document.createElement("div");
                            controlsDiv.className = "controls";
                            controlsDiv.style.display = "flex";
                            controlsDiv.style.flexDirection = "row"
                            controlsDiv.style.alignItems = "space-between";
                            controlsDiv.style.alignItems = "space-between";
                            controlsDiv.style.gap = "1000px"

                            const prevBtn = document.createElement("a");
                            prevBtn.className = "prev";
                            prevBtn.style.color = "black";
                            prevBtn.innerHTML = "&#10094;";
                            prevBtn.addEventListener("click", () => plusSlides(-1));

                            const nextBtn = document.createElement("a");
                            nextBtn.className = "next";
                            nextBtn.style.color = "black";
                            nextBtn.innerHTML = "&#10095;";
                            nextBtn.addEventListener("click", () => plusSlides(1));

                            slideContainer.appendChild(prevBtn);
                            slideContainer.appendChild(nextBtn);
                        }

                        if (document.querySelectorAll(".mySlides").length > 0) {
                            currentSlideShow(1);
                        }

                        window.scrollTo({
                            top: slideContainer.offsetTop + (slideContainer.offsetWidth * 0.002),
                            behavior: "smooth"
                        });
                            
                        })
                }
            );
        };
    })
}

function clearMarkers() {
    markerList.forEach(marker => marker.setMap(null));
    markerList.length = 0;
}
function clearResults() {
    const slideContainer = document.querySelector(".slide-container");
    if (slideContainer) {
        slideContainer.innerHTML = "";
    }
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
    const mapsLink = `https://www.google.com/maps/search/?api=1&query=${placePos.lat()},${placePos.lng()}`;

    google.maps.event.addListener(marker, "click", () => {
        infoWindowPlace.setContent(`${place.name || ""} <br> Distance: ${(distanceBetween / 1000).toFixed(3)} km <br> <a href="${mapsLink}" target="_blank">See on Maps</a>`);
        infoWindowPlace.open(map, marker);
    });
    return [place, distanceBetween, infoWindowPlace, marker, mapsLink]
}

function getDistance(currPos, placePos) {
    const distanceInMeters = google.maps.geometry.spherical.computeDistanceBetween(
        currPos,
        placePos
    );
    return distanceInMeters;
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

function plusSlides(n) {
    showSlides(slideIndex += n);
}
function currentSlideShow(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    if (slides.length === 0) return;
    //turns first slide when go further from last slide
    if (n > slides.length) { slideIndex = 1 }
    // goes last slide when go previous page from 1st page
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    slides[slideIndex - 1].style.display = "block";
}
window.initMap = initMap;

