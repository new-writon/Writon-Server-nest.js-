import { Inject } from "@nestjs/common";
import { UserRepository } from "../domain/repository/User.Repository";


export class UserHelper {
    constructor(
        @Inject('userImpl')
        private readonly userRepository: UserRepository,
    ){}


    public async giveUserDataBySocialNumberOrIdentifier(idenfitier: string){

        return this.userRepository.selectUserDataBySocialNumberOrIdentifier(idenfitier);
    }

    public async executeLocalSignUp(identifier: string, password: string, email: string){
        return this.userRepository.localSignUp(identifier, password, email);
    }

    public async giveUserByEmail(email: string){
        return this.userRepository.findUserByEmail(email);
    }

    public async executeUpdatePassword(idenfitier: string, email:string, password:string){
        return  this.userRepository.updatePassword(idenfitier, email, password);

    }

    public async giveUserById(userId: number){
        return this.userRepository.selectUserById(userId);
    }

    public async executeUpdatePasswordByUserId(userId: number, password: string){
        return this. userRepository.updatePasswordByUserId(userId, password);
    }

    public async executeKakaoSignUp(email: string, kakaoId: string, profileImage: string){
        return this.userRepository.kakaoSignUp(email, kakaoId, profileImage);
    }


}