import {Executable, ExecutableType} from "./executable";

/**
 * Convenient class to store and serialize a sequence of executables.
 */
export class AggregatedExecutable extends Executable {

	constructor(name: string, executables?: Executable[]) {
		super(name, ExecutableType.AGGREGATED, executables);
	}

	appendExecutable(executable: Executable): AggregatedExecutable {
		if (!executable || !executable.getBody())
			return this;

		if (!super.getBody()) {
			if (executable instanceof AggregatedExecutable)
				super.setBody(executable.getBody());
			else
				super.setBody([executable]);
		} else {
			if (executable instanceof AggregatedExecutable) {
                super.getBody().push(executable.getBody());
            } else {
				super.getBody().push(executable);
            }
		}
		return this;
	}
}
