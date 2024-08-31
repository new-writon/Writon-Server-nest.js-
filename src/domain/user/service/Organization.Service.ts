import { Injectable } from "@nestjs/common";
import { OrganizationHelper } from "../helper/Organization.Helper";
import { Position } from "../domain/entity/Position";
import { PositionNames } from "../dto/response/PositionNames";



@Injectable()
export class OrganizationService{

    constructor(
        private readonly organizationHelper: OrganizationHelper,
    ){}

    public async bringPositions(organizationId:number): Promise<PositionNames>{
        const positionDatas = await this.organizationHelper.givePositionsByOrganizationId(organizationId);
        const mappedPositionDatas = this.mappingPositionDatas(positionDatas);
        console.log(mappedPositionDatas)
        return PositionNames.of(mappedPositionDatas);
       
    }

    private mappingPositionDatas(positionDatas:Position[]){
        return positionDatas.map((data)=>data.getName())
    }


}