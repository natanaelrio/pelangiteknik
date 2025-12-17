"use client";

import { useEffect, useRef, useState } from "react";

export default function MapWithSearch({ onChange, error, touched, value, loading }) {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markerInstance = useRef(null);
    const searchBoxRef = useRef(null);
    const autocompleteRef = useRef(null);

    const [alamat, setAlamat] = useState("");
    const [koordinat, setKoordinat] = useState(value || { lat: -6.2, lng: 106.816666 }); // Default: Jakarta

    // --- Load Google Maps Script ---
    useEffect(() => {
        if (window.google && window.google.maps) {
            initMap();
            return;
        }

        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initMap;
        document.body.appendChild(script);
    }, []);

    // --- Inisialisasi Map ---
    function initMap() {
        if (!mapRef.current) return;
        const center = koordinat;

        mapInstance.current = new window.google.maps.Map(mapRef.current, {
            center,
            zoom: 13,
        });

        markerInstance.current = new window.google.maps.Marker({
            position: center,
            map: mapInstance.current,
            draggable: true,
        });

        ambilAlamat(center.lat, center.lng);

        // Saat marker digeser
        markerInstance.current.addListener("dragend", (e) => {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            setKoordinat({ lat, lng });
            ambilAlamat(lat, lng);
        });

        // Klik di map
        mapInstance.current.addListener("click", (e) => {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            markerInstance.current.setPosition({ lat, lng });
            setKoordinat({ lat, lng });
            ambilAlamat(lat, lng);
        });

        // --- Autocomplete (Search) ---
        autocompleteRef.current = new window.google.maps.places.Autocomplete(searchBoxRef.current);
        autocompleteRef.current.addListener("place_changed", () => {
            const place = autocompleteRef.current.getPlace();
            if (!place.geometry) return alert("Alamat tidak ditemukan");

            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            setKoordinat({ lat, lng });
            setAlamat(place.formatted_address || place.name);

            mapInstance.current.setCenter({ lat, lng });
            markerInstance.current.setPosition({ lat, lng });

            onChange({ lat, lng, alamat: place.formatted_address || place.name });
        });
    }

    // --- Reverse Geocode ke alamat ---
    async function ambilAlamat(lat, lng) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results[0]) {
                const formatted = results[0].formatted_address;
                setAlamat(formatted);
                onChange({ lat, lng, alamat: formatted });
            } else {
                setAlamat("Alamat tidak ditemukan");
            }
        });
    }

    return (
        <div style={{ paddingBottom: "10px" }}>
            <label>
                Pilih atau Cari Lokasi{" "}
                {error && touched && (
                    <div style={{ color: "red", fontSize: "12px" }}> &nbsp;{error}</div>
                )}
            </label>

            <div
                style={{
                    marginBottom: "10px",
                    display: "flex",
                    gap: "10px",
                    alignItems: "baseline",
                }}
            >
                <input
                    ref={searchBoxRef}
                    disabled={loading}
                    type="text"
                    placeholder="Cari alamat atau tempat (contoh: Monas, Jakarta)"
                    style={{
                        flex: 1,
                        padding: "18px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                    }}
                />
            </div>

            <div
                ref={mapRef}
                style={{
                    width: "100%",
                    height: "400px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                }}
            ></div>

            <div
                style={{
                    marginTop: "15px",
                    background: "#f8f9fa",
                    padding: "12px",
                    borderRadius: "8px",
                }}
            >
                <p><b>Latitude:</b> {koordinat?.lat}</p>
                <p><b>Longitude:</b> {koordinat?.lng}</p>
                <p><b>Alamat:</b> {alamat || "Memuat..."}</p>
            </div>
        </div>
    );
}
