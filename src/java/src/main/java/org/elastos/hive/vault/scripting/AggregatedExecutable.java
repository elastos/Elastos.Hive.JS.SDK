package org.elastos.hive.vault.scripting;

import java.util.Collections;
import java.util.List;

/**
 * Convenient class to store and serialize a sequence of executables.
 */
public class AggregatedExecutable extends Executable {
	public AggregatedExecutable(String name) {
		this(name, null);
	}

	public AggregatedExecutable(String name, List<Executable> executables) {
		super(name, Type.AGGREGATED, executables);
	}

	public AggregatedExecutable appendExecutable(Executable executable) {
		if (executable == null || executable.getBody() == null)
			return this;

		if (super.getBody() == null) {
			if (executable instanceof AggregatedExecutable)
				super.setBody(executable.getBody());
			else
				super.setBody(Collections.singletonList(executable));
		} else {
			List<Executable> es = (List<Executable>)super.getBody();
			if (executable instanceof AggregatedExecutable)
				es.addAll((List<Executable>)executable.getBody());
			else
				es.add(executable);
		}
		return this;
	}
}