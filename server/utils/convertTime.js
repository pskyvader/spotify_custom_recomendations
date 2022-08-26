const padTo2Digits = (num) => num.toString().padStart(2, "0");

const convertTime = (ms) => {
	const hours = padTo2Digits(Math.floor(ms / (1000 * 60 * 60)));
	const minutes = padTo2Digits(Math.floor(ms / (1000 * 60)) % 60);
	const seconds = padTo2Digits(Math.floor(ms / 1000) % 60);
	const milliseconds = padTo2Digits(Math.floor(ms % 1000));
	return `${hours}:${minutes}:${seconds}:${milliseconds}`;
};
