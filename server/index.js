const express = require('express');
const verifyProof = require('../utils/verifyProof');
const MerkleTree = require('../utils/MerkleTree');
const niceList = require('../utils/niceList.json');
const port = 1225;

const app = express();
app.use(express.json());

/**
 * Computed root using MerkleTree, notice I didn't store the MerkleTree
 */
const MERKLE_ROOT = ( new MerkleTree( niceList ) ).getRoot();

app.post('/gift', (req, res) => {
    const proof = req.body.proof;
    const name = req.body.name;
    const isInTheList = verifyProof(proof, name, MERKLE_ROOT);

    if (isInTheList) {
        res.send("You got a toy robot!");
    } else {
        res.send("You are not on the list :(");
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});
