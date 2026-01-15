require("dotenv").config();
const nockBack = require("nock").back;
const path = require("path");
const { getRecommendedSongs } = require("../spotifyapi/song");
const { getTestUser } = require("./testHelpers");

nockBack.fixtures = path.join(__dirname, "nockfixtures");
nockBack.setMode("record");

const url = "https://api.spotify.com/v1/search?q=year%3A1990%20genre%3Apop&type=track&market=US&limit=40";

test("Get a list with random songs", async () => {
    // Mock Math.random to be deterministic
    jest.spyOn(global.Math, 'random').mockReturnValue(0.5); 
    // Mock getFullYear
    const mockDate = new Date(2020, 0, 1);
    const originalDate = global.Date;
    const spy = jest.spyOn(global, 'Date').mockImplementation((...args) => {
        if (args.length) return new originalDate(...args);
        return mockDate;
    });
    global.Date.now = originalDate.now;

	const { nockDone } = await nockBack("randomSongs.json");
	const user = await getTestUser();
	const response = await getRecommendedSongs(
		user.access_token,
		[],
		0,
		user.country
	);
	console.log("RANDOM SONGS", response.length);
	expect(response).toBeDefined();
	expect(response).not.toHaveProperty("error");
	expect(response).not.toHaveLength(0);

    jest.spyOn(global.Math, 'random').mockRestore();
    jest.spyOn(global, 'Date').mockRestore();

	nockDone();
	// return response;
});
