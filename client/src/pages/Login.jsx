import { useEffect } from "react";
export default function Login(props) {
	useEffect(() => {
		fetch("/login?return=true")
			.then((res) => res.json())
			.then((data) => {
				if (data.url) {
					window.location = data.url;
				}
			});
	}, []);
	return "uwu";
}
