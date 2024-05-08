import * as ohm from "ohm-js";
import {Lambda, Eval} from "./lambda_types.ts";

export const grammar = ohm.grammar(String.raw`
Lamb {
	Expression = Eval | NonEval
	Lambda = "\\" var "." Expression
	Eval = Expression NonEval -- unbracketed
		| Parenthesize<Eval>
	NonEval = Lambda | var | Parenthesize<NonEval>
	var = "a".."z"+
	Parenthesize<x> = "(" x ")"
}
`)

export const semantics = grammar.createSemantics();

/* eslint-disable @typescript-eslint/no-unused-vars */
semantics.addOperation("eval", {
	Lambda: (_, v, __, e) => new Lambda(v.eval(), e.eval()),
	var: (v) => v.sourceString,
	Eval_unbracketed: (l, a) => new Eval(l.eval(), a.eval()),
	Parenthesize: (_, x, __) => x.eval()
})