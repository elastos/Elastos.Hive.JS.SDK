import {InvalidParameterException} from "../../exceptions";
import {Executable, ExecutableType} from "./executable";

/**
 * Convenient class to store and serialize a sequence of executables.
 */
export class AggregatedExecutable extends Executable {
	public constructor(name: string, executables?: Executable[]) {
		super(name, ExecutableType.AGGREGATED, executables ? executables : []);
	}

	public appendExecutable(executable: Executable): AggregatedExecutable {
        if (!executable)
            throw new InvalidParameterException('Invalid executable');

        if (executable instanceof AggregatedExecutable) {
            if (executable.getBody())
                super.getBody().push(...executable.getBody());
        } else {
            super.getBody().push(executable);
        }

		return this;
	}
}
