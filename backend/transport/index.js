import fetch from 'node-fetch';
import GtfsRealtimeBindings from 'gtfs-realtime-bindings';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, 'data');

const API_KEY = 'FRcILa1xjFoKWLNIieYf1BdFbtKjau5c';
const API_URL = 'https://otd.delhi.gov.in/api/realtime/VehiclePositions.pb';

await mkdir(DATA_DIR, { recursive: true });

async function getVehiclePositions() {
    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            headers: {
                'Accept': 'application/x-protobuf',
                'User-Agent': 'Delhi-Transit-Tracker/1.0'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // raw buffer data
        const buffer = await response.arrayBuffer();
        
        // buffer size
        console.log('Received buffer size:', buffer.byteLength);
        if (buffer.byteLength === 0) {
            throw new Error('Received empty response');
        }

        try {
            const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
                new Uint8Array(buffer)
            );

            // feed structure
            if (!feed.entity || !Array.isArray(feed.entity)) {
                throw new Error('Invalid feed structure');
            }

            console.log('Number of vehicles:', feed.entity.length);
            
            const vehicleData = [];
            feed.entity.forEach(entity => {
                if (entity.vehicle && entity.vehicle.position) {
                    const vehicle = entity.vehicle;
                    vehicleData.push({
                        vehicleId: vehicle.vehicle?.id || 'unknown',
                        position: {
                            latitude: vehicle.position?.latitude,
                            longitude: vehicle.position?.longitude
                        },
                        timestamp: vehicle.timestamp ? new Date(vehicle.timestamp * 1000).toISOString() : 'unknown',
                        speed: vehicle.position?.speed || null,
                        bearing: vehicle.position?.bearing || null
                    });
                }
            });

            // save to json file
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `vehicles_${timestamp}.json`;
            const filepath = join(DATA_DIR, filename);
            
            await writeFile(filepath, JSON.stringify(vehicleData, null, 2));
            console.log(`Saved ${vehicleData.length} vehicle positions to ${filename}`);

        } catch (decodeError) {
            console.error('Protobuf decode error:', decodeError);
            console.error('First 100 bytes of buffer:', 
                Array.from(new Uint8Array(buffer.slice(0, 100)))
                    .map(b => b.toString(16).padStart(2, '0'))
                    .join(' ')
            );
            throw decodeError;
        }

    } catch (error) {
        console.error('Error fetching vehicle positions:', error);
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
}

// every 30 seconds
const intervalId = setInterval(getVehiclePositions, 30000);

// process termination
process.on('SIGINT', () => {
    clearInterval(intervalId);
    console.log('Shutting down...');
    process.exit(0);
});

getVehiclePositions();
