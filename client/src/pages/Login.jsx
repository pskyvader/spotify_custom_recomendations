export default function Login(props) {
	fetch("/login?return=true")
		.then((res) => res.json())
		.then((data) => {
			if (data.url) {
				window.location = data.url;
			}
		});
	return null;
}