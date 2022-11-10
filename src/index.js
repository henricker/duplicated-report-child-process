import { fork } from 'child_process'
import { createReadStream } from 'fs';
import { pipeline } from 'stream/promises';
import csvtojson from 'csvtojson';
import { Writable } from 'stream';

const databaseFile = './data/pokemon.csv'

const process_running = new Map();

const NUMBER_OF_PROCESSES = 5

const replications = []
for(let i = 0; i < NUMBER_OF_PROCESSES; i++) {
    const child = fork('./src/child-process.js', [databaseFile])
      
    child.on('exit', () => {
        console.log(`Process ${child.pid} exited`)
        process_running.delete(child.pid)
    })
    child.on('error', (err) => {
        console.log(`Process ${child.pid} errored: ${err}`)
        process.exit(1);
    })
    child.on('message', (msg) => {
        if(replications.includes(msg)) return;
        console.log(`${msg} is replicated!`)
        replications.push(msg)
    })

    process_running.set(child.pid, child)
}

function roundRobin(array, index = 0) {
    return () => {
        if(index >= array.length) index = 0;
        return array[index++]
    }
}

const getProcess = roundRobin([...process_running.values()])
console.log(`Starting with ${process_running.size} processes`)

await pipeline(
    createReadStream(databaseFile),
    csvtojson(),
    new Writable({
        write(chunk, encoding, callback) {
            const chosenProcess = getProcess()
            chosenProcess.send(JSON.parse(chunk))
            callback()
        }
    })
)