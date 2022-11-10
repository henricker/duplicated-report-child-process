import { createReadStream } from 'fs'
import { pipeline } from 'stream/promises'
import csvtojson from 'csvtojson';
import { Transform, Writable } from 'stream';

const database = process.argv[2]

async function onMessage(msg) {
    const firstTimeRan = []

    await pipeline(
        createReadStream(database),
        csvtojson(),
        new Transform({
            transform(chunk, encoding, callback) {
                const data = JSON.parse(chunk)
                if(data.Name !== msg.Name) return callback();

                if(firstTimeRan.includes(data.Name)) return callback(null, msg.Name);

                firstTimeRan.push(data.Name)
                callback()
            }
        }),
        new Writable({
            write(chunk, encoding, callback) {
                if(!chunk) return callback();
                process.send(chunk.toString());
                callback();
            }
        })
    )

    process.channel.unref()
}

process.on('message', onMessage)
