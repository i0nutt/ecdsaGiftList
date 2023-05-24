const axios = require('axios');
const niceList = require('../utils/niceList.json');
const MerkleTree = require('../utils/MerkleTree');
const { assert } = require('chai');

const serverUrl = 'http://localhost:1225';

async function main() {
    /**
     * In order to prove we are in the list we send our name and the proof to the server
     *
     * To compute the proof we create a MerkleTree from the list of names
     *
     * Then I chose a random name from the list and retrieved the proof for it
     *
     * v2 , check for every name in the list :)
     */
    const tree = new MerkleTree(niceList);
    let gifts = 0;

    for ( let i = 0; i < niceList.length; i ++ ) {
        const {data: gift} = await axios.post(`${serverUrl}/gift`, {
            name : niceList[i],
            proof: tree.getProof(i),
        });
        if ( ! gift.includes('not') ) {
            gifts ++;
        }
    }

    /**
     * Generate random string to check, they shouldn't have a valid proof
     */
    for ( let i = 0; i < 100; i ++ ) {
        let r = (Math.random() + 1).toString(36).substring(7);
        const {data: gift} = await axios.post(`${serverUrl}/gift`, {
            name : r,
            proof: tree.getProof(i),
        });
        if ( ! gift.includes('not') ) {
            gifts ++;
        }
    }

    assert( gifts === niceList.length , "Expected other names not to receive a gift");
    console.log( "Everyone from the list received a gift :)");
}

main();
