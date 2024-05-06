type Var = string;
type Vars = {[var_: Var]: Lambda | Eval}

export class LambdaError extends Error {}

export class Lambda {
	constructor(public readonly var_: Var, public readonly ret: Expression, public readonly vars: Vars = {}) {}

	with_vars(vars: Vars): Lambda {
		return new Lambda(this.var_, this.ret, {...this.vars, ...vars});
	}

	toString(): string {
		return `(\\${this.var_}.${this.ret})`;
	}
}

export class Eval {
	constructor(public readonly lambda: Lambda, public readonly arg: Expression, public readonly vars: Vars = {}) {}

	with_vars(vars: Vars): Eval {
		return new Eval(this.lambda, this.arg, {...this.vars, ...vars})
	}

	eval_step(): Lambda | Eval {
		if (typeof this.lambda.ret === "string") {
			if (this.lambda.ret in this.vars) {
				const new_vars = structuredClone(this.vars);
				delete new_vars[this.lambda.ret];
				return this.vars[this.lambda.ret].with_vars(new_vars);
			} else {
				throw new LambdaError("Unassigned variable referenced");
			}
		} else {
			const new_var: Vars = {};
			new_var[this.lambda.var_] = this.lambda.ret;
			return this.lambda.ret.with_vars({...this.vars, ...new_var});
		}
	}

	toString(): string {
		return `(${this.lambda} ${this.arg})`
	}
}

type Expression = Var | Lambda | Eval;