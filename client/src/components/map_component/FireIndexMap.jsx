import { useEffect, useState } from "react";
import { Box, Button, Grid, Select, Stack, MenuItem, FormControl, InputLabel } from "@mui/material";
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const FireIndexMap = () => {

    const [ selectedIndexType, setSelectedIndexType ] = useState('');
    const [ selectedYear, setSelectedYear ] = useState('');
    const [ selectedWeek, setSelectedWeek ] = useState('');

    const [ map, setMap ] = useState(null);
    const [geojsonData, setGeojsonData] = useState(null);
    const center = [11.6978352, 122.6217542];
    const zoom = 6;


    // Initial load of GeoJSON data
    const fetchGeoJSONData = () => {
        fetch(`/geojson/basemap_phil.json`)
            .then(response => response.json())
            .then(data => {
                setGeojsonData(data);
            })
            .catch(error => {
                console.error('Error fetching GeoJSON data:', error);
            });
    };

    useEffect(() => {
        fetchGeoJSONData();
    }, []);


    // updating values
    const fetchIndexData = () => {

        // Reset GeoJSON data
        const resetGeojsonData = { ...geojsonData };
        resetGeojsonData.features.forEach(feature => {
            feature.properties.IndexType = null;
            feature.properties.IndexValue = null;
        });

        fetch(`/api/fire_index?indexType=${selectedIndexType}&year=${selectedYear}&week=${selectedWeek}`)
            .then(response => response.json())
            .then(data => {
                // Create a map for faster lookup
                const indexDataMap = data.reduce((map, item) => {
                    map[item.municId] = item;
                    return map;
                }, {});

                // Update GeoJSON data
                const newGeojsonData = { ...resetGeojsonData };
                newGeojsonData.features.forEach(feature => {
                    const indexData = indexDataMap[feature.properties.MunicID];
                    if (indexData) {
                        feature.properties.IndexType = indexData.indexType;
                        feature.properties.IndexValue = indexData.indexValue;
                    }
                });

                // Update state
                setGeojsonData(newGeojsonData);
            })
            .catch(error => {
                console.error('Error fetching index data:', error);
            });
    };

    function onEachFeature(feature, layer) {
        layer.on('click', function (e) {
            
            let popupContent = 
                "<b>Region: </b>" + feature.properties.Region + "<br />" +
                "<b>Province: </b>" + feature.properties.Province + "<br />" +
                "<b>Municipality: </b>" + feature.properties.MunicName;
                
            
            if ( feature.properties.IndexType != null ) {
                popupContent += "<br/><b>" +feature.properties.IndexType + ": </b>" + feature.properties.IndexValue;
            }

            L.popup()
                .setLatLng(e.latlng)
                .setContent(popupContent)
                .openOn(map);
        });
    }


    function style(feature) {
        const indexType = feature.properties.IndexType;
        const indexValue = feature.properties.IndexValue;

        let fillColor = "#A8D08D"; // green

        if (indexType == "FWI") {
            if ( indexValue <= 5) {
                fillColor = "#A8D08D";
            } else if ( indexValue <= 8) {
                fillColor = "#E2EFD9";  // light blue
            } else if ( indexValue <= 16 ) {
                fillColor = "#FFF2CC"; // flesh
            } else if ( indexValue <= 29 ) {
                fillColor = "#FFC000"; // orange
            } else {
                fillColor = "#FF5050"; //red
            }
        }

        if (indexType == "BU") {
            if ( indexValue <= 20) {
                fillColor = "#A8D08D";
            } else if ( indexValue <= 39) {
                fillColor = "#E2EFD9";  // light blue
            } else if ( indexValue <= 59 ) {
                fillColor = "#FFF2CC"; // flesh
            } else if ( indexValue <= 79 ) {
                fillColor = "#FFC000"; // orange
            } else {
                fillColor = "#FF5050"; //red
            }
        } 
        
        if (indexType == "DC") {
            if ( indexValue <= 30) {
                fillColor = "#A8D08D";
            } else if ( indexValue <= 99) {
                fillColor = "#E2EFD9";  // light blue
            } else if ( indexValue <= 199 ) {
                fillColor = "#FFF2CC"; // flesh
            } else if ( indexValue <= 299 ) {
                fillColor = "#FFC000"; // orange
            } else {
                fillColor = "#FF5050"; //red
            }
        }

        if (indexType == "DMC") {
            if ( indexValue <= 30) {
                fillColor = "#A8D08D";
            } else if ( indexValue <= 50) {
                fillColor = "#E2EFD9";  // light blue
            } else if ( indexValue <= 70 ) {
                fillColor = "#FFF2CC"; // flesh
            } else if ( indexValue <= 90 ) {
                fillColor = "#FFC000"; // orange
            } else {
                fillColor = "#FF5050"; //red
            }
        }

        if (indexType == "FFMC") {
            if ( indexValue <= 50) {
                fillColor = "#A8D08D";
            } else if ( indexValue <= 65) {
                fillColor = "#E2EFD9";  // light blue
            } else if ( indexValue <= 80 ) {
                fillColor = "#FFF2CC"; // flesh
            } else if ( indexValue <= 90 ) {
                fillColor = "#FFC000"; // orange
            } else {
                fillColor = "#FF5050"; //red
            }
        }

        if (indexType == "ISI") {
            if ( indexValue <= 2) {
                fillColor = "#A8D08D";
            } else if ( indexValue <= 5) {
                fillColor = "#E2EFD9";  // light blue
            } else if ( indexValue <= 9 ) {
                fillColor = "#FFF2CC"; // flesh
            } else if ( indexValue <= 15 ) {
                fillColor = "#FFC000"; // orange
            } else {
                fillColor = "#FF5050"; //red
            }
        }

        return { fillColor, weight: 0.5, opacity:0.5, fillOpacity: 0.7};
    }


    return (
        <Box>

        <Grid container style={{ paddingTop: '20px' }}>
            
            <Grid item style={{ width: 200}}>
                <Stack spacing={3}>
                    <FormControl variant="standard">
                        <InputLabel>Index Type</InputLabel>
                        <Select label="Index Type" style={{ fontSize: '14px' }} value={selectedIndexType} onChange={(e) => setSelectedIndexType(e.target.value)} >
                            <MenuItem value="FWI" style={{ fontSize: '12px' }}> Fire Weather Index </MenuItem>
                            <MenuItem value="BU" style={{ fontSize: '12px' }}> Build-up Index </MenuItem>
                            <MenuItem value="DC" style={{ fontSize: '12px' }}> Drought Code </MenuItem>
                            <MenuItem value="DMC" style={{ fontSize: '12px' }}> Duff Moisture Code </MenuItem>
                            <MenuItem value="FFMC" style={{ fontSize: '12px' }}> Fine Fuel Moisture Code</MenuItem>
                            <MenuItem value="ISI" style={{ fontSize: '12px' }}> Initial Spread Index</MenuItem>
                            
                        </Select>
                    </FormControl>
                    <FormControl variant="standard">
                        <InputLabel>Year</InputLabel>
                        <Select label="Year" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} >
                            <MenuItem value="2020">2020</MenuItem>
                            <MenuItem value="2021">2021</MenuItem>
                            <MenuItem value="2022">2022</MenuItem>
                            <MenuItem value="2023">2023</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant="standard">
                        <InputLabel>Week</InputLabel>
                        <Select 
                            label="Week" 
                            value={selectedWeek} 
                            onChange={(e) => setSelectedWeek(e.target.value)}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 48 * 4.5, // where 48 is the item height and 4.5 is the number of items visible
                                        width: '20ch', // this can be adjusted
                                    },
                                },
                            }}    
                        >
                            {Array.from({ length: 53 }, (_, i) => i + 1).map((week) => (
                                <MenuItem key={week} value={week}>
                                    {week}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button variant="contained" onClick={fetchIndexData}>Update Map</Button>
                </Stack>
            </Grid>

            <Grid item style={{ flex: 1, padding: '5px' }} >

                <MapContainer ref={setMap} center={center} zoom={zoom} style={{ height: '85vh', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />

                    { geojsonData && <GeoJSON key={JSON.stringify(geojsonData)} data={geojsonData} onEachFeature={onEachFeature} style={style} />}
                </MapContainer>

            </Grid>
        </Grid>
        </Box>
    )
}

export default FireIndexMap;