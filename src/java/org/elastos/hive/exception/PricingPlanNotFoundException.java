package org.elastos.hive.exception;

import org.elastos.hive.connection.NodeRPCException;

public class PricingPlanNotFoundException extends NotFoundException {
	private static final long serialVersionUID = -5537222473332097613L;

	public PricingPlanNotFoundException() {
		super();
	}

	public PricingPlanNotFoundException(String message) {
		super(message);
	}

	public PricingPlanNotFoundException(NodeRPCException e) {
		super(e.getMessage());
	}
}
