
import express from "express";
import { outcomes } from "./outcomes";
import cors from "cors";
import crypto from "crypto";
import { handlePlinko } from "./algorithm";

const app = express();
app.use(cors())

const TOTAL_DROPS = 16;

const MULTIPLIERS: {[ key: number ]: number} = {
    0: 16,
    1: 9,
    2: 2,
    3: 1.4,
    4: 1.4,
    5: 1.2,
    6: 1.1,
    7: 1,
    8: 0.5,
    9: 1,
    10: 1.1,
    11: 1.2,
    12: 1.4,
    13: 1.4,
    14: 2,
    15: 9,
    16: 16
}

const getServerSeed = () => {
    return crypto.randomBytes(32).toString("hex");
}

const getClientSeed = () => {
    return crypto.randomBytes(32).toString("hex");
}

// 1. First get seeds using Crypto module
app.get("/seed", (req, res) => {
    res.send({
        serverSeed: getServerSeed(), // server hex
        clientSeed: getClientSeed() // client hex
    });
});

// 2. Then post the seeds to get the result 
app.post("/plinko", async (req, res) => {
    const serverSeed = await getServerSeed() // server hex
    const clientSeed = await getClientSeed() // client hex
    const result = await handlePlinko(serverSeed, clientSeed, "1", 8, "Low");
    res.send(result);
});

app.post("/game", (req, res) => {
    let outcome = 0;
    const pattern = []
    for (let i = 0; i < TOTAL_DROPS; i++) {
        if (Math.random() > 0.5) {
            pattern.push("R")
            outcome++;
        } else {
            pattern.push("L")
        }
    }

    const multiplier = MULTIPLIERS[outcome];
    const possiblieOutcomes = outcomes[outcome];

    res.send({
        point: possiblieOutcomes[Math.floor(Math.random() * possiblieOutcomes.length || 0)],
        multiplier,
        pattern
    });
});

app.listen(3000)