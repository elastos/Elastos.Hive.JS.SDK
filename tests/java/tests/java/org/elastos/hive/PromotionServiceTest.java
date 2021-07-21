package org.elastos.hive;

import org.elastos.hive.config.TestData;
import org.elastos.hive.service.PromotionService;
import org.junit.jupiter.api.*;

@Disabled
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class PromotionServiceTest {

	private static PromotionService promotionService;

	@BeforeAll public static void setup() {
		Assertions.assertDoesNotThrow(()->promotionService = TestData.getInstance().newBackup().getPromotionService());
	}

	@Test void testPromote() {
		Assertions.assertDoesNotThrow(()->promotionService.promote().get());
	}

}
