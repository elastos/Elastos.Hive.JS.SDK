import {BasePath, BaseService, Header, POST, Response} from 'ts-retrofit';

@BasePath("/api/v2")
export class PromotionAPI extends BaseService {
    @POST("/backup/promotion")
    async promoteToVault(@Header("Authorization") auth: string): Promise<Response> { return null; }
}
