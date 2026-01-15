require('dotenv').config();
const { User } = require('../database');
const { validateUserLogin } = require('../api/user');

const getTestUser = async () => {
    try {
        const user = await User.findOne();
        if (user) {
            try {
                const validated = await validateUserLogin({
                    hash: user.hash,
                    access_token: user.access_token,
                    expiration: user.expiration,
                });
                // If validateUserLogin returns an error object, fallback to mock
                if (validated && validated.error) {
                    console.warn('validateUserLogin returned error; using fallback test user');
                    return { access_token: 'FAKE_TEST_TOKEN' };
                }
                return validated;
            } catch (e) {
                console.warn('validateUserLogin threw; using fallback test user', e.message);
                return { access_token: 'FAKE_TEST_TOKEN' };
            }
        }
    } catch (err) {
        console.warn('User.findOne failed; using fallback test user', err.message);
    }
    // Default fallback when no DB or no user present
    return {
        access_token: 'FAKE_TEST_TOKEN',
        country: 'US',
        getPlaylists: async () => [
            {
                getPlaylistSongs: async () => [],
                getUser: async () => null,
            },
        ],
        getUserSongHistories: async () => [],
        getPlaylistsOptions: async () => [],
    };
};

module.exports = {
    getTestUser,
};
