import * as ohm from "ohm-js";
import {Lambda, Eval} from "./lambda_types.ts";

export const grammar = ohm.grammar(String.raw`
Lamb {
	Lambda = "(" Lambda ")" -- bracketed
		| "\\" var "." Expression -- unbracketed
	var = "a".."z"+
	Eval = Expression Expression
	Expression = BracketableExpression | var
	BracketableExpression = "(" BracketableExpression ")" -- bracketed
		| Lambda | Eval
}
`)

export const semantics = grammar.createSemantics();

/* eslint-disable @typescript-eslint/no-unused-vars */
semantics.addOperation("eval", {
	Lambda_bracketed: (_, l, __) => l.eval(),
	Lambda_unbracketed: (_, v, __, e) => new Lambda(v.eval(), e.eval()),
	var: (v) => v.sourceString,
	Eval: (l, a) => new Eval(l.eval(), a.eval()),
	BracketableExpression_bracketed: (_, e, __) => e.eval(),
})