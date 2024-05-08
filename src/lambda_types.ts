type Var = string;
type Vars = {[var_: Var]: StandaloneExpression}

export class LambdaError extends Error {}

export class Lambda {
	constructor(public readonly var_: Var, public readonly ret: Expression, public readonly vars: Vars = {}) {}

	withVars(vars: Vars): Lambda {
		return new Lambda(this.var_, this.ret, {...this.vars, ...vars});
	}

	toString(): string {
		return `(\\${this.var_}.${this.ret})`;
	}
}


function getVar(vars: Vars, var_: Var): StandaloneExpression {
	if (var_ in vars) {
		return vars[var_];
	} else {
		throw new LambdaError("Unassigned variable referenced");
	}
}

function withoutVar(vars: Vars, var_: Var): Vars {
	const newVars = {...vars};
	delete newVars[var_];
	return newVars;
}

export class Eval {
	constructor(public readonly lambda: Expression, public readonly arg: Expression, public readonly vars: Vars = {}) {}

	withVars(vars: Vars): Eval {
		return new Eval(this.lambda, this.arg, {...this.vars, ...vars})
	}

	evalStep(): StandaloneExpression {
		if (typeof this.lambda === "string") {
			return new Eval(getVar(this.vars, this.lambda), this.arg, withoutVar(this.vars, this.lambda));
		}
		if (typeof this.arg === "string") {
			return new Eval(this.lambda, getVar(this.vars, this.arg), withoutVar(this.vars, this.arg));
		}

		if (this.lambda instanceof Eval) {
			return new Eval(this.lambda.evalStep(), this.arg, this.vars);
		}

		const newVars = {...this.vars};
		newVars[this.lambda.var_] = this.arg;
		if (typeof this.lambda.ret === "string") {
			return getVar(newVars, this.lambda.ret).withVars(withoutVar(newVars, this.lambda.ret));
		} else {
			return this.lambda.ret.withVars(newVars);
		}
	}

	toString(): string {
		return `(${this.lambda} ${this.arg})`
	}
}

type Expression = Var | Lambda | Eval;
type StandaloneExpression = Lambda | Eval