import {BasePath, BaseService, Header, POST, Response} from 'ts-retrofit';
import {NotImplementedException} from "../../exceptions";

@BasePath("/api/v2")
export class PromotionAPI extends BaseService {
    @POST("/backup/promotion")
    async promoteToVault(@Header("Authorization") auth: string): Promise<Response> {
        throw new NotImplementedException();
    }
}
