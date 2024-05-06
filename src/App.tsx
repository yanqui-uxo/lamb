import {FormEvent, useState} from "react";
import {grammar, semantics} from "./grammar.ts";

export default function App() {
	const [text, setText] = useState("");

	return <>
		<form onSubmit={e => {
			e.preventDefault();
			const code = new FormData(e.currentTarget).get("code")! as string;

			const match = grammar.match(code);
			if (match.succeeded()) {
				let out = semantics(grammar.match(code)).eval();
				console.log(out);
				setText(out.toString());
			} else {
				setText("Parse failed");
			}
		}}>
			<textarea name="code"></textarea>
			<br />
			<input type="submit" value="parse"></input>
		</form>
		<p>{text}</p>
	</>
}