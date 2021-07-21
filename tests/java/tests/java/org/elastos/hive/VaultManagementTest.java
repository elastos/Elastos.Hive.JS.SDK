package org.elastos.hive;

import org.elastos.hive.config.TestData;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

@Disabled
class VaultManagementTest {
	private static Vault vault;

	@BeforeAll public static void setUp() {
		Assertions.assertDoesNotThrow(()->vault = TestData.getInstance().newVault());
	}

	@Test void testGetFiles() {
	}

	@Test void testGetMongoDb() {
	}

	@Test void testGetProviderAddress() {
	}

	@Test void testGetOwnerDid() {
	}

	@Test void testGetVersion() {
		Assertions.assertDoesNotThrow(()->Assertions.assertNotNull(vault.getNodeVersion().get()));
	}

	@Test void testGetCommitHash() {
		Assertions.assertDoesNotThrow(()->Assertions.assertNotNull(vault.getLatestCommitId().get()));
	}
}
