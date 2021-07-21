package org.elastos.hive;

import org.elastos.hive.exception.HiveException;

/**
 * This class is used to fetch some possible information from remote hive node.
 * eg. version;
 *	 latest commit Id;
 *	 How many DID involved;
 *	 How many vault service running there;
 *	 How many backup service running there;
 *	 How much disk storage filled there;
 *	 etc.
 */
class Provider extends ServiceEndpoint {
	public Provider(AppContext context) throws HiveException {
		this(context, null);
	}

	public Provider(AppContext context, String providerAddress) throws HiveException {
		super(context, providerAddress);
	}
}
