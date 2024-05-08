import {useState} from "react";
import {grammar, semantics} from "./grammar.ts";
import {Eval, LambdaError} from "./lambda_types.ts";

export default function App() {
	const [text, setText] = useState("");

	return <>
		<form onSubmit={e => {
			e.preventDefault();
			const code = new FormData(e.currentTarget).get("code") as string;

			const match = grammar.match(code);
			console.log(grammar.trace(code).toString());
			if (match.succeeded()) {
				let out = semantics(grammar.match(code)).eval();
				const steps = [out];
				while (out instanceof Eval) {
					try {
						out = out.evalStep();
					} catch (e) {
						if (e instanceof LambdaError) {
							setText(e.message);
							return;
						}
						throw e
					}
					steps.push(out);
				}
				console.log(out);
				setText(steps.map(x => x.toString()).join(" -> "));
			} else {
				setText(match.message!);
				console.log(match.message!);
			}
		}}>
			<textarea name="code"></textarea>
			<br />
			<input type="submit" value="parse"></input>
		</form>
		<p>{text}</p>
	</>
}