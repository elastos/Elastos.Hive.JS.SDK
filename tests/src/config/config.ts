import { ObjectMapper } from "@elastosfoundation/jackson-js";
import type { Class } from "../../../src/class";
import {
	IllegalArgumentException
} from "../../../src/exceptions";

export class Config {
	static getObjectMapper(): ObjectMapper {
		let mapper = new ObjectMapper();

		mapper.defaultStringifierContext.features.serialization.AUTO_DETECT_CREATORS = false;
		mapper.defaultStringifierContext.features.serialization.AUTO_DETECT_FIELDS = false;
		mapper.defaultStringifierContext.features.serialization.AUTO_DETECT_IS_GETTERS = false;
		mapper.defaultStringifierContext.features.serialization.AUTO_DETECT_SETTERS = false;
		mapper.defaultStringifierContext.features.serialization.AUTO_DETECT_GETTERS = false;		
		mapper.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES = false;

		return mapper;
	}

	public serialize(): string  {
		return Config.getObjectMapper().writeValueAsString(this);
	}

	static parse<T extends Config>(content: string, clazz: Class<T>): T {
		let mapper = Config.getObjectMapper();

        try {
            mapper.defaultParserContext.mainCreator = () => [clazz];
            let obj = mapper.parse<T>(content);
            return obj;
        } catch (e) {
			throw new IllegalArgumentException(e);
        }
	}
}
